import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React, {useContext, useEffect} from 'react';
import {StatusBar, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AddPost from '../Screens/Home/AddPost';
import ClipVideo from '../Screens/Home/ClipVideo';
import Explore from '../Screens/Explore/Explore';
import HomeScreen from '../Screens/Home/HomeScreen';
import Profile from '../Screens/Home/Profile';
import {NavigationContext} from '../Services/Hooks/NavigationProvider';
import {PrimaryColor, storage} from '../Components/CommonData';
import NotificationScreen from '../Screens/Home/NotificationScreen';
import {ExploreLayout} from '../Screens/Explore/ExploreLayout';
import {useRoute} from '@react-navigation/native';
import apiClient from '../Services/api/apiInterceptor';
import UploadProgressBar from '../Components/UploadProgressModal';
import AlertBox from '../Components/AlertMessage';

const Tab = createBottomTabNavigator();
const CustomAddPostButton = ({onPress}) => (
  <TouchableOpacity
    style={{
      top: -20,
      justifyContent: 'center',
      alignItems: 'center',
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: PrimaryColor,
    }}
    onPress={onPress}>
    <Icon name="add" size={35} color="#fff" />
  </TouchableOpacity>
);

export default function BottomStack() {
  const {
    progressmodalVisible,
    setProgressmodalVisible,
    uploadProgress,
    setUploadProgress,
    isMessage,
    setIsMessage,
  } = useContext(NavigationContext);
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await apiClient.get('user/profile');
        storage.set('profile', JSON.stringify(response.data));
      } catch (error) {
        console.log(error);
      }
    };
    fetchProfile();
  });
  const {setCurrentIndex, currentIndex} = useContext(NavigationContext);
  const closeAlert = () => {
    setIsMessage(prev => ({...prev, showAlert: false}));
  };
  return (
    <>
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={({route, focused}) => ({
          tabBarIcon: ({focused, color, size}) => {
            let iconName;
            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Explore') {
              iconName = focused ? 'search' : 'search-outline';
            } else if (route.name === 'Clips') {
              iconName = focused ? 'film' : 'film-outline';
            } else if (route.name === 'Notification') {
              iconName = focused ? 'notifications' : 'notifications-outline';
            } else if (route.name === 'Profile') {
              iconName = focused ? 'person' : 'person-outline';
            }
            return (
              <Icon
                name={iconName}
                size={size}
                color={focused ? PrimaryColor : color}
              />
            );
          },
          headerShown: false,
          tabBarActiveTintColor: PrimaryColor,
          tabBarInactiveTintColor: 'gray',
          tabBarStyle: {
            height: 60,
            paddingBottom: 5,
            backgroundColor: currentIndex === 0 ? '#151515' : '#fff',
          },
        })}>
        <Tab.Screen
          name="Home"
          component={ClipVideo}
          listeners={{
            focus: () => setCurrentIndex(0),
          }}
        />
        <Tab.Screen
          name="Explore"
          component={ExploreLayout}
          listeners={{
            focus: () => setCurrentIndex(1),
          }}
        />
        <Tab.Screen
          name="AddPost"
          component={AddPost}
          options={({navigation}) => ({
            tabBarIcon: () => null,

            tabBarLabel: () => null,
            tabBarButton: props => (
              <View style={{alignItems: 'center', justifyContent: 'center'}}>
                <CustomAddPostButton
                  onPress={() => {
                    navigation.navigate('AddPosts');
                    setCurrentIndex(2);
                  }}
                />
              </View>
            ),
          })}
          listeners={{
            focus: () => setCurrentIndex(2),
          }}
        />
        <Tab.Screen
          name="Notification"
          component={NotificationScreen}
          listeners={{
            focus: () => setCurrentIndex(3),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={Profile}
          listeners={{
            focus: () => setCurrentIndex(4),
          }}
        />
      </Tab.Navigator>
      <UploadProgressBar
        visible={progressmodalVisible}
        setModalVisible={setProgressmodalVisible}
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
      />
    </>
  );
}
