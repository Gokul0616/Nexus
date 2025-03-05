import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import * as React from 'react';
import EditProfile from '../Components/EditProfile';
import FullscreenVideoplayer from '../Components/FullscreenVideoplayer';
import ProfileMenu from '../Components/ProfileMenu';
import {WebScreen} from '../Components/WebView';
import AddStories from '../Screens/AddStories/AddStories';
import LandingScreen from '../Screens/Auth/LandingScreen';
import SignInScreen from '../Screens/Auth/SignInScreen';
import SignUpScreen from '../Screens/Auth/SignUpScreen';
import NotificationScreen from '../Screens/Home/NotificationScreen';
import MessageChatScreen from '../Screens/Messages/MessageChatScreen';
import MessagesOutside from '../Screens/Messages/MessagesOutside';
import BottomStack from './BottomStack';
const Stack = createStackNavigator();

export const MainStack = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Landing"
        screenOptions={{
          gestureEnabled: false,
          headerShown: false,
          cardStyleInterpolator: ({current, next, inverted, layouts}) => {
            return {
              cardStyle: {
                transform: [
                  {
                    translateX: current.progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [layouts.screen.width, 0],
                    }),
                  },
                ],
              },
            };
          },
        }}>
        <Stack.Screen name="Landing" component={LandingScreen} />
        <Stack.Screen name="Signin" component={SignInScreen} />
        <Stack.Screen name="Signup" component={SignUpScreen} />
        <Stack.Screen name="BottomTabs" component={BottomStack} />
        <Stack.Screen name="Message" component={MessagesOutside} />
        <Stack.Screen name="AddStories" component={AddStories} />
        <Stack.Screen name="MyTabs" component={BottomStack} />
        <Stack.Screen name="EditProfile" component={EditProfile} />
        <Stack.Screen name="ProfileMenu" component={ProfileMenu} />
        <Stack.Screen name="ChatScreen" component={MessageChatScreen} />
        <Stack.Screen name="WebScreen" component={WebScreen} />
        <Stack.Screen
          name="NotificationScreen"
          component={NotificationScreen}
        />
        <Stack.Screen
          name="FullScreenVideoPlayer"
          component={FullscreenVideoplayer}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
