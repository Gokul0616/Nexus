import {
  CommonActions,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';
import React, {useCallback, useState} from 'react';
import {
  BackHandler,
  FlatList,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {ProfileScreenstyles as styles} from '../../Components/Styles/Styles';
import {profileDummyData} from '../../Components/DummyData';
import CustomHeader from '../../Components/CustomHeader';
const Profile = () => {
  const profile = profileDummyData[0];
  const [selectedTab, setSelectedTab] = useState('images');
  const navigation = useNavigation();
  const clearStackAndNavigate = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: 'TopTabs',
          },
        ],
      }),
    );
  };

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        clearStackAndNavigate(0);
        return true;
      };

      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );
      return () => subscription.remove();
    }, []),
  );

  const renderImageItem = ({item}) => (
    <View style={styles.gridItem}>
      <Image source={{uri: item.content}} style={styles.gridImage} />
      <Text style={styles.gridCaption} numberOfLines={1}>
        {item.caption}
      </Text>
    </View>
  );

  const renderVideoItem = ({item}) => (
    <View style={styles.gridItem}>
      {/* Replace the placeholder image with your video thumbnail logic */}
      <Image
        source={{uri: 'https://via.placeholder.com/110x110.png?text=Video'}}
        style={styles.gridImage}
      />
      <Text style={styles.gridCaption} numberOfLines={1}>
        {item.caption}
      </Text>
    </View>
  );

  const renderReelItem = ({item}) => (
    <View style={styles.gridItem}>
      {/* Replace with reel thumbnail logic if available */}
      <Image
        source={{uri: 'https://via.placeholder.com/110x110.png?text=Reel'}}
        style={styles.gridImage}
      />
      <Text style={styles.gridCaption} numberOfLines={1}>
        {item.caption}
      </Text>
    </View>
  );
  return (
    <>
      <CustomHeader
        headerTitle={profile.name}
        isLeftIcon={false}
        style={{
          borderBottomWidth: 1,
          borderBottomColor: '#ddd',
        }}
      />
      <ScrollView style={styles.container}>
        {/* Profile Header */}
        <View style={styles.header}>
          <Image source={{uri: profile.avatar}} style={styles.avatar} />
          <Text style={styles.name}>{profile.name}</Text>
          <Text style={styles.username}>@{profile.username}</Text>
          <Text style={styles.bio}>{profile.bio}</Text>
          <View style={styles.statsContainer}>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>{profile.postsCount}</Text>
              <Text style={styles.statLabel}>Posts</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>{profile.followersCount}</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>{profile.followingCount}</Text>
              <Text style={styles.statLabel}>Following</Text>
            </View>
          </View>
        </View>

        {/* Tab Bar */}
        <View style={styles.tabBar}>
          <TouchableOpacity
            style={[
              styles.tabButton,
              selectedTab === 'images' && styles.activeTab,
            ]}
            onPress={() => setSelectedTab('images')}>
            <Text style={styles.tabText}>Images</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tabButton,
              selectedTab === 'videos' && styles.activeTab,
            ]}
            onPress={() => setSelectedTab('videos')}>
            <Text style={styles.tabText}>Videos</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tabButton,
              selectedTab === 'reels' && styles.activeTab,
            ]}
            onPress={() => setSelectedTab('reels')}>
            <Text style={styles.tabText}>Reels</Text>
          </TouchableOpacity>
        </View>

        {/* Content Section */}
        <View style={styles.contentSection}>
          {selectedTab === 'images' && (
            <>
              <Text style={styles.sectionHeader}>Post Images</Text>
              <FlatList
                data={profile.images.postImages}
                keyExtractor={item => item.id}
                numColumns={3}
                renderItem={renderImageItem}
                contentContainerStyle={styles.grid}
              />
              <Text style={[styles.sectionHeader, {marginTop: 20}]}>
                Streaks
              </Text>
              <FlatList
                data={profile.images.streaks}
                keyExtractor={item => item.id}
                horizontal
                renderItem={renderImageItem}
                contentContainerStyle={styles.horizontalList}
                showsHorizontalScrollIndicator={false}
              />
            </>
          )}
          {selectedTab === 'videos' && (
            <FlatList
              data={profile.videos}
              keyExtractor={item => item.id}
              numColumns={2}
              renderItem={renderVideoItem}
              contentContainerStyle={styles.grid}
            />
          )}
          {selectedTab === 'reels' && (
            <FlatList
              data={profile.reels}
              keyExtractor={item => item.id}
              numColumns={2}
              renderItem={renderReelItem}
              contentContainerStyle={styles.grid}
            />
          )}
        </View>
      </ScrollView>
    </>
  );
};

export default Profile;
