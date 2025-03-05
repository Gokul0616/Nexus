import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React, {useContext} from 'react';
import {TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AddPost from '../Screens/Home/AddPost';
import ClipVideo from '../Screens/Home/ClipVideo';
import Explore from '../Screens/Home/Explore';
import HomeScreen from '../Screens/Home/HomeScreen';
import Profile from '../Screens/Home/Profile';
import {NavigationContext} from '../Services/Hooks/NavigationProvider';
import {PrimaryColor} from '../Components/CommonData';
import NotificationScreen from '../Screens/Home/NotificationScreen';

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
  const {setCurrentIndex, currentIndex} = useContext(NavigationContext);

  return (
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
        component={Explore}
        listeners={{
          focus: () => setCurrentIndex(1),
        }}
      />
      <Tab.Screen
        name="AddPost"
        component={AddPost}
        options={({navigation}) => ({
          tabBarIcon: () => null,
          tabBarButton: props => (
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
              <CustomAddPostButton
                onPress={() => navigation.navigate('AddPost')}
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
  );
}
