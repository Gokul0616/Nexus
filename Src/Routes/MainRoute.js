import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import * as React from 'react';
import LandingScreen from '../Screens/Auth/LandingScreen';
import SignInScreen from '../Screens/Auth/SignInScreen';
import SignUpScreen from '../Screens/Auth/SignUpScreen';
import BottomStack from './BottomStack';
import TopStack from './TopStack';
import {NavigationProvider} from '../Services/Hooks/NavigationProvider';

const Stack = createNativeStackNavigator();

export const MainStack = () => {
  return (
    <NavigationProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Landing"
          screenOptions={{
            gestureEnabled: false,
            headerShown: false,
            animation: 'slide_from_right',
          }}>
          <Stack.Screen name="Landing" component={LandingScreen} />
          <Stack.Screen name="Signin" component={SignInScreen} />
          <Stack.Screen name="Signup" component={SignUpScreen} />
          <Stack.Screen name="TopTabs" component={TopStack} />
        </Stack.Navigator>
      </NavigationContainer>
    </NavigationProvider>
  );
};
