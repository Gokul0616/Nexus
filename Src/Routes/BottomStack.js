import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React, {useCallback, useContext} from 'react';
import {BackHandler, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AddPost from '../Screens/Home/AddPost';
import Community from '../Screens/Home/Community';
import Explore from '../Screens/Home/Explore';
import HomeScreen from '../Screens/Home/HomeScreen';
import Profile from '../Screens/Home/Profile';
import {NavigationContext} from '../Services/Hooks/NavigationProvider';
import {useFocusEffect, useNavigation} from '@react-navigation/native';

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
      backgroundColor: '#FF6B6B',
    }}
    onPress={onPress}>
    <Icon name="add" size={35} color="#fff" />
  </TouchableOpacity>
);

export default function BottomStack() {
  const {setCurrentIndex} = useContext(NavigationContext);

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Explore') {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'Community') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'Notification') {
            iconName = focused ? 'notifications' : 'notifications-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }
          return <Icon name={iconName} size={size} color={color} />;
        },
        headerShown: false,
        tabBarActiveTintColor: '#000',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          height: 60,
          paddingBottom: 5,
        },
      })}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
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
        name="Community"
        component={Community}
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
