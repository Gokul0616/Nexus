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
import {NotificationScreenStyles as styles} from '../../Components/Styles/Styles';
import {PrimaryColor} from '../../Components/CommonData';
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
          <TouchableRipple
            rippleColor={'rgba(0, 0, 0, .15)'}
            borderless={true}
            style={styles.followButton}
            onPress={() => {}}>
            <Text style={styles.followButtonText}>Follow</Text>
          </TouchableRipple>
        );
        break;
      case 'comment':
        rightComponent = (
          <View style={styles.rightIconContainer}>
            <Icon name="chatbubble" size={20} color={PrimaryColor} />
          </View>
        );
        break;
      case 'mention':
        rightComponent = (
          <View style={styles.rightIconContainer}>
            <Icon name="at" size={20} color={PrimaryColor} />
          </View>
        );
        break;
      case 'share':
        rightComponent = (
          <View style={styles.rightIconContainer}>
            <Icon name="share-social" size={20} color={PrimaryColor} />
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
