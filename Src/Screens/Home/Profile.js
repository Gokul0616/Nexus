import NetInfo from '@react-native-community/netinfo';
import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  Animated,
  FlatList,
  Image,
  Linking,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {createThumbnail} from 'react-native-create-thumbnail';
import {RefreshControl} from 'react-native-gesture-handler';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AlertBox from '../../Components/AlertMessage';
import {formatNumber} from '../../Components/CommonData';
import CustomHeader from '../../Components/CustomHeader';
import CustomLoadingIndicator from '../../Components/CustomLoadingIndicator';
import {ProfileScreenstyles as styles} from '../../Components/Styles/Styles';
import apiClient from '../../Services/api/apiInterceptor';

const ReelItem = ({item}) => {
  const [thumbnail, setThumbnail] = useState(null);
  useEffect(() => {
    if (item?.videoUrl) {
      createThumbnail({
        url: item.videoUrl,
        time: 1000,
      })
        .then(response => {
          setThumbnail(response.path);
        })
        .catch(err => {
          // console.error('Error generating thumbnail:', err);
        });
    }
  }, [item]);
  return (
    <TouchableOpacity style={styles.gridItem}>
      {item.thumbnail && (
        <Image source={{uri: item.thumbnail}} style={styles.gridImage} />
      )}
      {item.thumbnail === null &&
        (thumbnail ? (
          <Image source={{uri: thumbnail}} style={styles.gridImage} />
        ) : (
          <View style={[styles.gridImage, {backgroundColor: 'grey'}]} />
        ))}
      <View style={styles.playButton}>
        <FontAwesome name="play" size={24} color="white" />
      </View>
    </TouchableOpacity>
  );
};

const Profile = () => {
  const [selectedTab, setSelectedTab] = useState('reels');
  const [profile, setProfileData] = useState(null);
  const [isConnected, setIsConnected] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const spinAnim = useState(new Animated.Value(0))[0];
  const [mediaKey, setMediaKey] = useState(0);
  const navigation = useNavigation();
  const [isMessage, setIsMessage] = useState({
    message: '',
    heading: '',
    isRight: false,
    rightButtonText: 'OK',
    triggerFunction: () => {},
    setShowAlert: () => {},
    showAlert: false,
  });
  const closeAlert = () => {
    setIsMessage(prev => ({...prev, showAlert: false}));
  };
  useEffect(() => {
    Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      }),
    ).start();
  }, [spinAnim]);

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  const renderContent = () => {
    if (selectedTab === 'reels') {
      return profile?.videos
        ? [...profile.videos].sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
          )
        : [];
    } else if (selectedTab === 'likes') {
      return profile?.likedVideos
        ? [...profile.likedVideos].sort(
            (a, b) =>
              new Date(b.likes?.[0]?.likedAt) - new Date(a.likes?.[0]?.likedAt),
          )
        : [];
    }
    return [];
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await apiClient.get('user/profile');
        if (response.status === 200) {
          setProfileData(response.data);
        }
      } catch (err) {
        setIsMessage({
          message: err?.message || 'Unable to fetch profile data',
          heading: 'Error',
          isRight: false,
          rightButtonText: 'OK',
          triggerFunction: () => {},
          setShowAlert: () => {
            isMessage.setShowAlert(false);
          },
          showAlert: true,
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [mediaKey]);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
      setMediaKey(prev => prev + 1);
    });
    return () => unsubscribe();
  }, []);

  const renderItem = ({item}) => {
    return <ReelItem item={item} />;
  };
  return (
    <>
      {isLoading && (
        <View style={styles.loadingIndicator}>
          <CustomLoadingIndicator />
        </View>
      )}
      <AlertBox
        heading={isMessage.heading}
        message={isMessage.message}
        setShowAlert={closeAlert}
        showAlert={isMessage.showAlert}
        triggerFunction={isMessage.triggerFunction}
        isRight={isMessage.isRight}
        rightButtonText={isMessage.rightButtonText}
      />
      <CustomHeader
        isLeftIcon={true}
        leftIcon={<FontAwesome5 name="user-edit" size={20} color="black" />}
        leftIconFunction={() => {
          navigation.navigate('EditProfile', {profileData: profile});
        }}
        rightIcon={<Ionicons name="menu" size={25} color="black" />}
        rightIconFunction={() => {
          navigation.navigate('ProfileMenu');
        }}
        headerTitle={profile?.username}
        style={{borderBottomWidth: 1, borderBottomColor: '#ddd', height: 50}}
      />
      <ScrollView
        style={styles.container}
        stickyHeaderIndices={[1]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={() => {
              setMediaKey(prev => prev + 1);
            }}
          />
        }>
        <View>
          <View style={styles.header}>
            <View style={styles.avatarContainer}>
              {profile?.profilePic ? (
                <Image
                  source={{uri: profile?.profilePic}}
                  style={styles.avatar}
                />
              ) : (
                <Image
                  source={require('../../../assets/images/emptyAvatar.png')}
                  style={[styles.avatar, {backgroundColor: '#ddd'}]}
                />
              )}
              <Animated.View
                style={[styles.streakBorder, {transform: [{rotate: spin}]}]}
              />
            </View>
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>
                  {formatNumber(profile?.postCount ? profile?.postCount : 0)}
                </Text>
                <Text style={styles.statLabel}>Posts</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>
                  {formatNumber(
                    profile?.followerCount ? profile?.followerCount : 0,
                  )}
                </Text>
                <Text style={styles.statLabel}>Followers</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>
                  {formatNumber(
                    profile?.followingCount ? profile?.followingCount : 0,
                  )}
                </Text>
                <Text style={styles.statLabel}>Following</Text>
              </View>
              <View style={styles.statItem}>
                <View style={styles.streakCircle}>
                  <Text style={styles.streakPercentage}>
                    {profile?.streakPercentage}%
                  </Text>
                  <Animated.View
                    style={[
                      styles.streakProgress,
                      {transform: [{rotate: spin}]},
                    ]}
                  />
                </View>
                <Text style={styles.statLabel}>Streak</Text>
              </View>
            </View>
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.name}>{profile?.fullName}</Text>
            <Text style={styles.username}>@{profile?.username}</Text>

            <Text
              onPress={() => {
                if (profile?.bio === null) {
                  navigation.navigate('EditProfile', {profileData: profile});
                }
              }}
              style={styles.bio}>
              {profile?.bio ? profile.bio : 'Add Bio'}
            </Text>
            {/* <TouchableOpacity
              onPress={() =>
                navigation.navigate('WebScreen', {url: profile.website})
              }>
              <Text style={styles.website}>{profile.website}</Text>
            </TouchableOpacity> */}
            <View style={styles.locationContainer}>
              <MaterialIcons name="location-on" size={16} color="gray" />
              <Text
                style={styles.location}
                onPress={() => {
                  if (profile?.location === null) {
                    navigation.navigate('EditProfile', {profileData: profile});
                  } else {
                    // Encode the bio text to safely include it in a URL
                    const query = encodeURIComponent(profile.bio);
                    let url = '';
                    // Use appropriate URL scheme for iOS and Android
                    if (Platform.OS === 'ios') {
                      url = `http://maps.apple.com/?q=${profile?.location}`;
                    } else {
                      url = `geo:0,0?q=${profile.location}`;
                    }
                    Linking.openURL(url).catch(err => {
                      // console.error('An error occurred', err);
                      setIsMessage({
                        message: err?.message || 'Unexpected error occurred',
                        heading: 'Error',
                        isRight: false,
                        rightButtonText: 'OK',
                        triggerFunction: () => {},
                        setShowAlert: () => {
                          isMessage.setShowAlert(false);
                        },
                        showAlert: true,
                      });
                    });
                  }
                }}
                ellipsizeMode="tail"
                numberOfLines={1}>
                {profile?.location ? profile?.location : 'Add Location'}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.tabsContainer}>
          <View style={{flexDirection: 'row'}}>
            {['reels', 'likes'].map(tab => (
              <TouchableOpacity
                key={tab}
                style={[styles.tab, selectedTab === tab && styles.activeTab]}
                onPress={() => setSelectedTab(tab)}>
                {tab === 'reels' ? (
                  <FontAwesome
                    name="film"
                    size={24}
                    color={selectedTab === tab ? 'black' : 'gray'}
                  />
                ) : (
                  <FontAwesome
                    name="heart"
                    size={24}
                    color={selectedTab === tab ? 'black' : 'gray'}
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <FlatList
          data={renderContent()}
          keyExtractor={item => item.id}
          numColumns={3}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          extraData={mediaKey}
          scrollEnabled={false}
          contentContainerStyle={{paddingBottom: 50}}
        />
      </ScrollView>
    </>
  );
};
export default Profile;
