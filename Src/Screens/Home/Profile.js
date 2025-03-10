import NetInfo from '@react-native-community/netinfo';
import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  Animated,
  FlatList,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {createThumbnail} from 'react-native-create-thumbnail';
import {TouchableRipple} from 'react-native-paper';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {formatNumber, PrimaryColor} from '../../Components/CommonData';
import CustomHeader from '../../Components/CustomHeader';
import {profileDummyData} from '../../Components/DummyData';
import DynamicImage from '../../Components/DynamicImage';
import {ProfileScreenstyles as styles} from '../../Components/Styles/Styles';

const ReelItem = ({item}) => {
  const [thumbnail, setThumbnail] = useState(null);

  useEffect(() => {
    if (item.sources && item.sources.length > 0) {
      createThumbnail({
        url: item.sources[0],
        time: 1000,
      })
        .then(response => {
          setThumbnail(response.path);
        })
        .catch(err => {
          console.error('Error generating thumbnail:', err);
        });
    }
  }, [item.sources]);

  return (
    <TouchableOpacity style={styles.gridItem}>
      {thumbnail ? (
        <Image source={{uri: thumbnail}} style={styles.gridImage} />
      ) : (
        <View style={[styles.gridImage, {backgroundColor: 'grey'}]} />
      )}
      <View style={styles.playButton}>
        <FontAwesome name="play" size={24} color="white" />
      </View>
    </TouchableOpacity>
  );
};

const Profile = () => {
  const [selectedTab, setSelectedTab] = useState('reels');
  const profile = profileDummyData[0];
  const [isConnected, setIsConnected] = useState(true);
  const spinAnim = useState(new Animated.Value(0))[0];
  const [mediaKey, setMediaKey] = useState(0);
  const navigation = useNavigation();

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
      return profile.reels;
    }

    return [];
  };

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
      <CustomHeader
        isLeftIcon={true}
        leftIcon={<FontAwesome5 name="user-edit" size={20} color="black" />}
        leftIconFunction={() => {
          navigation.navigate('EditProfile');
        }}
        rightIcon={<Ionicons name="menu" size={25} color="black" />}
        rightIconFunction={() => {
          navigation.navigate('ProfileMenu');
        }}
        headerTitle={profile.username}
        style={{borderBottomWidth: 1, borderBottomColor: '#ddd', height: 50}}
      />
      <ScrollView
        style={styles.container}
        stickyHeaderIndices={[2]}
        showsVerticalScrollIndicator={false}>
        <View>
          <View style={styles.header}>
            <View style={styles.avatarContainer}>
              <DynamicImage
                uri={profile.avatar}
                isConnected={isConnected}
                style={styles.avatar}
              />
              <Animated.View
                style={[styles.streakBorder, {transform: [{rotate: spin}]}]}
              />
            </View>
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>
                  {formatNumber(profile.postsCount)}
                </Text>
                <Text style={styles.statLabel}>Posts</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>
                  {formatNumber(profile.followersCount)}
                </Text>
                <Text style={styles.statLabel}>Followers</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>
                  {formatNumber(profile.followingCount)}
                </Text>
                <Text style={styles.statLabel}>Following</Text>
              </View>
              <View style={styles.statItem}>
                <View style={styles.streakCircle}>
                  <Text style={styles.streakPercentage}>
                    {profile.streakPercentsge}%
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
            <Text style={styles.name}>{profile.name}</Text>
            <Text style={styles.username}>@{profile.username}</Text>
            <Text style={styles.bio}>{profile.bio}</Text>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('WebScreen', {url: profile.website})
              }>
              <Text style={styles.website}>{profile.website}</Text>
            </TouchableOpacity>
            <View style={styles.locationContainer}>
              <MaterialIcons name="location-on" size={16} color="gray" />
              <Text style={styles.location}>{profile.location}</Text>
            </View>
          </View>
        </View>
        <View
          style={{
            height: 50,
            alignItems: 'center',
            flexDirection: 'row',
            gap: 5,
            justifyContent: 'center',
            marginBottom: 8,
          }}>
          <TouchableRipple
            rippleColor={'#ddd'}
            style={{
              height: 40,
              width: 150,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'white',
              borderRadius: 5,
              borderWidth: 1,
              borderColor: '#ddd',
            }}
            borderless={true}
            onPress={() => {}}>
            <Text>Follow</Text>
          </TouchableRipple>
          <TouchableRipple
            rippleColor={'#ddd'}
            style={{
              height: 40,
              width: 150,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: PrimaryColor,
              borderRadius: 5,
              borderWidth: 1,
              borderColor: '#ddd',
            }}
            borderless={true}
            onPress={() => {}}>
            <Text style={{color: '#fff'}}>Message</Text>
          </TouchableRipple>
        </View>
        <View style={styles.tabsContainer}>
          {['reels'].map(tab => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, selectedTab === tab && styles.activeTab]}
              onPress={() => setSelectedTab(tab)}>
              <FontAwesome
                name="film"
                size={24}
                color={selectedTab === tab ? 'black' : 'gray'}
              />
            </TouchableOpacity>
          ))}
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

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: 'white',
//   },
//   header: {
//     flexDirection: 'row',
//     padding: 15,
//     alignItems: 'center',
//   },
//   avatarContainer: {
//     position: 'relative',
//     marginRight: 20,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   avatar: {
//     width: 80,
//     height: 80,
//     borderRadius: 40,
//   },
//   streakBorder: {
//     position: 'absolute',
//     width: 88,
//     height: 88,
//     borderRadius: 44,
//     borderWidth: 2,
//     borderColor: '#ff2478',
//     borderStyle: 'dashed',
//   },
//   statsContainer: {
//     flexDirection: 'row',
//     flex: 1,
//     justifyContent: 'space-between',
//   },
//   statItem: {
//     alignItems: 'center',
//   },
//   statNumber: {
//     fontWeight: 'bold',
//     fontSize: 18,
//   },
//   statLabel: {
//     color: 'gray',
//     fontSize: 12,
//   },
//   streakCircle: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     backgroundColor: '#ffeef4',
//     justifyContent: 'center',
//     alignItems: 'center',
//     position: 'relative',
//   },
//   streakPercentage: {
//     fontWeight: 'bold',
//     color: '#ff2478',
//   },
//   streakProgress: {
//     position: 'absolute',
//     width: 54,
//     height: 54,
//     borderRadius: 27,
//     borderWidth: 2,
//     borderColor: '#ff2478',
//     borderLeftColor: 'transparent',
//   },
//   infoContainer: {
//     paddingHorizontal: 15,
//     marginBottom: 7,
//   },
//   name: {
//     fontWeight: 'bold',
//     fontSize: 18,
//   },
//   username: {
//     color: 'gray',
//     marginBottom: 5,
//   },
//   bio: {
//     marginBottom: 5,
//   },
//   website: {
//     color: '#0095f6',
//     marginBottom: 5,
//   },
//   locationContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   location: {
//     color: 'gray',
//     marginLeft: 5,
//   },
//   tabsContainer: {
//     flexDirection: 'row',
//     borderTopWidth: 1,
//     borderTopColor: '#eee',
//     borderBottomWidth: 1,
//     borderBottomColor: '#eee',
//     backgroundColor: 'white',
//   },
//   tab: {
//     flex: 1,
//     alignItems: 'center',
//     padding: 15,
//     borderBottomWidth: 1,
//     borderBottomColor: 'transparent',
//   },
//   activeTab: {},
//   gridItem: {
//     width: width / 3,
//     height: width / 3,
//     borderWidth: 0.5,
//     borderColor: 'white',
//   },
//   gridImage: {
//     flex: 1,
//     resizeMode: 'cover',
//   },
//   playButton: {
//     position: 'absolute',
//     top: '50%',
//     left: '50%',
//     transform: [{translateX: -12}, {translateY: -12}],
//   },
// });

export default Profile;
