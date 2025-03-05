import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';
import React, {useContext, useState} from 'react';
import RenderStories from '../../Components/Stories';
import {NavigationContext} from '../../Services/Hooks/NavigationProvider';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import {notificationsData, stories} from '../../Components/DummyData';
import CustomHeader from '../../Components/CustomHeader';
import {TouchableRipple} from 'react-native-paper';

const NotificationScreen = () => {
  const [loadingPosts, setLoadingPosts] = useState({});
  const {isConnected} = useContext(NavigationContext);
  const navigation = useNavigation();
  const [gestureCaptured, setGestureCaptured] = useState(false);
  const [hasNotification, setHasNotification] = useState(false);

  const renderMessageIcon = () => {
    return (
      <View>
        {hasNotification && <View style={styles.dotNotification} />}
        <Icon name="paper-plane-outline" size={28} color="#000" />
      </View>
    );
  };

  const formatTimestamp = timestamp => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
  };
  const renderNotificationItem = ({item}) => {
    let rightComponent = null;
    switch (item.type) {
      case 'like':
        rightComponent = (
          <View style={styles.rightIconContainer}>
            {item.videoThumbnail ? (
              <Image
                source={{uri: item.videoThumbnail}}
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
          <TouchableOpacity style={styles.followButton}>
            <Text style={styles.followButtonText}>Follow</Text>
          </TouchableOpacity>
        );
        break;
      case 'comment':
        rightComponent = (
          <View style={styles.rightIconContainer}>
            <Icon name="chatbubble" size={20} color="#34C759" />
          </View>
        );
        break;
      case 'mention':
        rightComponent = (
          <View style={styles.rightIconContainer}>
            <Icon name="at" size={20} color="#5856D6" />
          </View>
        );
        break;
      case 'share':
        rightComponent = (
          <View style={styles.rightIconContainer}>
            <Icon name="share-social" size={20} color="#FF9500" />
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
        onPress={() => {}}>
        <>
          <Image
            source={{uri: item.profilePic}}
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
          navigation.navigate('Message');
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
              stories={stories}
              isConnected={isConnected}
              setLoadingPosts={setLoadingPosts}
              navigation={navigation}
              gestureCaptured={gestureCaptured}
              setGestureCaptured={setGestureCaptured}
            />
            <View style={styles.activityHeaderContainer}>
              <Text style={styles.activityHeaderText}>NEW ACTIVITY</Text>
            </View>
          </>
        }
      />
    </View>
  );
};

export default NotificationScreen;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff'},
  dotNotification: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ff0000',
    alignSelf: 'flex-end',
  },
  notificationList: {
    paddingVertical: 10,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  notificationImage: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
  },
  notificationTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  notificationMessage: {
    fontSize: 15,
    color: '#000',
  },
  notificationTimestamp: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  rightIconContainer: {
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  followButton: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#1DA1F2',
  },
  followButtonText: {
    color: '#1DA1F2',
    fontSize: 14,
  },
  videoThumbnail: {
    width: 45,
    height: 45,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  usernameText: {
    fontWeight: 'bold',
  },
  activityHeaderContainer: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    // borderBottomWidth: StyleSheet.hairlineWidth,
    // borderBottomColor: '#ccc',
    marginTop: 10,
  },
  activityHeaderText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    letterSpacing: 1,
  },
});
