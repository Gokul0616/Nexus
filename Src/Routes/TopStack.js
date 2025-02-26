import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import React, {useContext} from 'react';
import AddStories from '../Screens/AddStories/AddStories';
import MessagesOutside from '../Screens/Messages/MessagesOutside';
import {NavigationContext} from '../Services/Hooks/NavigationProvider';
import BottomStack from './BottomStack';

const Tab = createMaterialTopTabNavigator();

export default function TopStack() {
  const {currentIndex} = useContext(NavigationContext);

  return (
    <Tab.Navigator initialRouteName="BottomTabs" tabBar={() => null}>
      <Tab.Screen name="AddPost_TopStack" component={AddStories} />
      <Tab.Screen name="BottomTabs" component={BottomStack} />
      {currentIndex === 0 && (
        <Tab.Screen
          name="Message"
          component={MessagesOutside}
          options={({route}) => ({
            swipeEnabled: route?.params?.swipeEnabled ?? true,
          })}
        />
      )}
    </Tab.Navigator>
  );
}
