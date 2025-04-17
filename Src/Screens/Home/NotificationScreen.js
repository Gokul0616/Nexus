import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  Text,
  View
} from 'react-native';
import { TouchableRipple } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import { SecondaryColor } from '../../Components/CommonData';
import CustomHeader from '../../Components/CustomHeader';
import { notificationsData } from '../../Components/DummyData';
import RenderStories from '../../Components/Stories';
import StoryViewer from '../../Components/StoryViewer';
import { NotificationScreenStyles as styles } from '../../Components/Styles/Styles';
import apiClient from '../../Services/api/apiInterceptor';
import CustomToast from '../../Services/Hooks/Customtoast/CustomToast';
import { NavigationContext } from '../../Services/Hooks/NavigationProvider';
import useStoryWebSocket from '../../Services/Websocket/StoryWebsocket';
const NotificationScreen = () => {
  const [loadingPosts, setLoadingPosts] = useState({});
  const { isConnected } = useContext(NavigationContext);
  const navigation = useNavigation();
  const [gestureCaptured, setGestureCaptured] = useState(false);
  const [selectedStory, setSelectedStory] = useState(null);
  const [mediaKey, setMediaKey] = useState(0);
  const [hasNotification, setHasNotification] = useState(false);

  useStoryWebSocket((story) => handleNewStory(story));
  const renderMessageIcon = () => {
    return (
      <View>
        {hasNotification && <View style={styles.dotNotification} />}
        <Icon name="paper-plane-outline" size={28} color="#000" />
      </View>
    );
  };

  const [storyList, setStoryList] = useState([]);
  useEffect(() => {
    fetchStory()
  }, [mediaKey])
  useFocusEffect(useCallback(() => {
    fetchStory()
  }, []));

  const fetchStory = async () => {
    try {
      const response = await apiClient.get('stories');
      if (response && response.data) {
        setStoryList(response.data);
      }
    } catch (error) {
      CustomToast.show('Error fetching Stories', true);
    }
  }
  const handleNewStory = (newStory) => {
    setMediaKey(prev => prev + 1);
  };

  const formatTimestamp = timestamp => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  const renderNotificationItem = ({ item }) => {
    let rightComponent = null;
    switch (item.type) {
      case 'like':
        rightComponent = (
          <View style={styles.rightIconContainer}>
            {item.videoThumbnail ? (
              <Image
                source={{ uri: item.videoThumbnail }}
                style={styles.videoThumbnail}
              />
            ) : (
              <Icon name="heart" size={20} color="red" />
            )}
          </View>
        );
        break;
      case 'follow':
        rightComponent = (
          <TouchableRipple
            rippleColor={'rgba(0, 0, 0, .15)'}
            borderless={true}
            style={styles.followButton}
            onPress={() => { }}>
            <Text style={styles.followButtonText}>Follow</Text>
          </TouchableRipple>
        );
        break;
      case 'comment':
        rightComponent = (
          <View style={styles.rightIconContainer}>
            <Icon name="chatbubble" size={20} color={SecondaryColor} />
          </View>
        );
        break;
      case 'mention':
        rightComponent = (
          <View style={styles.rightIconContainer}>
            <Icon name="at" size={20} color={SecondaryColor} />
          </View>
        );
        break;
      case 'share':
        rightComponent = (
          <View style={styles.rightIconContainer}>
            <Icon name="share-social" size={20} color={SecondaryColor} />
          </View>
        );
        break;
      default:
        rightComponent = null;
    }

    return (
      <TouchableRipple
        rippleColor={'rgba(0, 0, 0, .15)'}
        style={styles.notificationItem}
        borderless={true}
        onPress={() => { }}>
        <>
          <Image
            source={{ uri: item.profilePic }}
            style={styles.notificationImage}
          />
          <View style={styles.notificationTextContainer}>
            <Text style={styles.notificationMessage}>
              <Text style={styles.usernameText}>{item.username}</Text>{' '}
              {item.activity}
            </Text>
            <Text style={styles.notificationTimestamp}>
              {formatTimestamp(item.timestamp)}
            </Text>
          </View>
          {rightComponent}
        </>
      </TouchableRipple>
    );
  };

  return (
    <View style={styles.container}>

      <CustomHeader
        isLeftIcon={false}
        headerTitle={'Notifications'}
        rightIcon={renderMessageIcon()}
        rightIconFunction={() => {
          navigation.navigate('Test');
          // navigation.navigate('Message');
        }}
      />
      <FlatList
        data={notificationsData}
        keyExtractor={item => item.id.toString()}
        renderItem={renderNotificationItem}
        contentContainerStyle={styles.notificationList}
        ListHeaderComponent={
          <>
            <RenderStories
              stories={storyList}
              isConnected={isConnected}
              setLoadingPosts={setLoadingPosts}
              navigation={navigation}
              gestureCaptured={gestureCaptured}
              setGestureCaptured={setGestureCaptured}
              onPress={(item) => {
                // setSelectedStory(storyList)
                setSelectedStory(storyList.find(story => story.id === item.id));
              }}
            />
            <View style={styles.activityHeaderContainer}>
              <Text style={styles.activityHeaderText}>NEW ACTIVITY</Text>
            </View>
          </>
        }
      />
      <StoryViewer
        visible={!!selectedStory}
        story={selectedStory}
        onClose={() => setSelectedStory(null)}
      />
    </View>
  );
};

export default NotificationScreen;
