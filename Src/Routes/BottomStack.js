import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Image, View } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import Icon from 'react-native-vector-icons/Ionicons';
import Octicons from 'react-native-vector-icons/Octicons';

import AlertBox from '../Components/AlertMessage';
import { PrimaryColor, saveFCMToken, storage } from '../Components/CommonData';
import CustomAddPostButton from '../Components/CustomAddPostButton';
import UploadProgressBar from '../Components/UploadProgressModal';

import { ExploreLayout } from '../Screens/Explore/ExploreLayout';
import ClipVideo from '../Screens/Home/ClipVideo';
import NotificationScreen from '../Screens/Home/NotificationScreen';
import Profile from '../Screens/Home/Profile';

import AddPostCamera from '../Screens/Home/AddPostCamera';
import apiClient from '../Services/api/apiInterceptor';
import messaging from '@react-native-firebase/messaging';
import { NavigationContext } from '../Services/Hooks/NavigationProvider';
import CustomToast from '../Services/Hooks/Customtoast/CustomToast';
import UploadProgressNotification from '../Components/UploadProgressModal';
const Tab = createBottomTabNavigator();

export default function BottomStack() {
  const {
    progressmodalVisible,
    setProgressmodalVisible,
    uploadProgress,
    setUploadProgress,
    isMessage,
    setIsMessage,
    currentIndex, mediaKey,
    setCurrentIndex,
  } = useContext(NavigationContext);

  const [profilePicture, setProfilePicture] = useState(null);
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await apiClient.get('user/profile');
        setProfilePicture(response.data.profilePic);
        storage.set('profile', JSON.stringify(response.data));
      } catch (error) {
        console.log(error);
      }
    };
    fetchProfile();
  }, [mediaKey]);

  const closeAlert = () => {
    setIsMessage(prev => ({ ...prev, showAlert: false }));
  };

  React.useEffect(() => {
    const requestPermission = async () => {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        const token = await messaging().getToken();
        if (token) {
          saveFCMToken(token);
        } else {
          CustomToast.show('Failed to get FCM token');
        }
      }

      messaging().setBackgroundMessageHandler(async remoteMessage => {
        console.log('Message handled in the background!', remoteMessage);
      });
    };

    requestPermission();

    const unsubscribe = messaging().onMessage(async remoteMessage => {
      // CustomToast.show(
      //   `${remoteMessage?.notification?.title} : ${remoteMessage?.notification?.body}`,
      //   true,
      // );
      console.log('remoteMessage', remoteMessage);
      setIsMessage({
        message:
          remoteMessage?.notification?.body || 'You have new Notifications',
        heading: remoteMessage?.notification?.title || 'New Notification',
        isRight: false,
        rightButtonText: 'OK',
        triggerFunction: () => { },
        setShowAlert: () => {
          isMessage.setShowAlert(false);
        },
        showAlert: true, type: 'notification',
      });
    });

    return unsubscribe;
  }, []);

  const renderIcon = useCallback(
    (routeName, focused, color, size) => {
      const iconColor = focused ? PrimaryColor : color;

      switch (routeName) {
        case 'Home':
          return <AntDesign name="home" size={22} color={iconColor} />;
        case 'Explore':
          return (
            <Icon
              name={focused ? 'compass' : 'compass-outline'}
              size={size}
              color={iconColor}
            />
          );
        case 'Clips':
          return (
            <Icon
              name={focused ? 'film' : 'film-outline'}
              size={size}
              color={iconColor}
            />
          );
        case 'Notification':
          return (
            <View>
              {false && <View
                style={{
                  height: 8,
                  width: 8,
                  borderRadius: '50%',
                  backgroundColor: '#ff004f',
                  position: 'absolute',
                  right: 0,
                  top: 0,
                  zIndex: 999,
                }}
              />}
              <Entypo name="notification" size={22} color={iconColor} />
            </View>
          );
        case 'Profile':
          return profilePicture ? (
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <Image
                source={{ uri: profilePicture }}
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 22,
                  borderWidth: 2,
                  borderColor: focused ? PrimaryColor : '#FF004F',
                }}
              />
            </View>
          ) : (
            <Octicons name="feed-person" size={22} color={iconColor} />
          );
        default:
          return null;
      }
    },
    [profilePicture],
  );

  const screenOptions = useCallback(
    ({ route }) => ({
      tabBarIcon: ({ focused, color, size }) =>
        renderIcon(route.name, focused, color, size),
      headerShown: false,
      tabBarActiveTintColor: PrimaryColor,
      tabBarInactiveTintColor: 'gray',
      tabBarStyle: {
        height: 55,
        paddingBottom: 5,
        backgroundColor: currentIndex === 0 ? '#151515' : '#fff',
      },
    }),
    [currentIndex, renderIcon],
  );

  return (
    <>
      <Tab.Navigator
        initialRouteName="Home"
        lazy={false}
        screenOptions={screenOptions}>
        <Tab.Screen
          name="Home"
          component={ClipVideo}
          listeners={{ focus: () => setCurrentIndex(0) }}
        />
        <Tab.Screen
          name="Explore"
          component={ExploreLayout}
          listeners={{ focus: () => setCurrentIndex(1) }}
        />
        <Tab.Screen
          name="AddPost"
          component={AddPostCamera}
          options={({ navigation }) => ({
            tabBarIcon: () => null,
            tabBarLabel: () => null,
            tabBarButton: () => (
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                }}>
                <CustomAddPostButton
                  colorChange={currentIndex !== 0 ? '#f2f2f2' : null}
                  onPress={() => {
                    navigation.navigate('AddPosts');
                    setCurrentIndex(2);
                  }}
                />
              </View>
            ),
          })}
          listeners={{ focus: () => setCurrentIndex(2) }}
        />
        <Tab.Screen
          name="Notification"
          component={NotificationScreen}
          listeners={{ focus: () => setCurrentIndex(3) }}
        />
        <Tab.Screen
          name="Profile"
          component={Profile}
          listeners={{ focus: () => setCurrentIndex(4) }}
        />
      </Tab.Navigator>

      <UploadProgressNotification
        visible={progressmodalVisible}
        progress={uploadProgress}
        setProgress={setUploadProgress}
      />

      <AlertBox
        heading={isMessage.heading}
        message={isMessage.message}
        setShowAlert={closeAlert}
        showAlert={isMessage.showAlert}
        triggerFunction={isMessage.triggerFunction}
        isRight={isMessage.isRight}
        rightButtonText={isMessage.rightButtonText}
        type={isMessage.type}
      />
    </>
  );
}
