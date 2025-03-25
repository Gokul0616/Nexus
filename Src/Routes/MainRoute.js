import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import * as React from 'react';
import EditProfile from '../Components/EditProfile';
import FullscreenVideoplayer from '../Components/FullscreenVideoplayer';
import OtherProfileScreen from '../Components/OtherProfile';
import ProfileMenu from '../Components/ProfileMenu';
import UploadScreen from '../Components/UploadScreen';
import {WebScreen} from '../Components/WebView';
import AddStories from '../Screens/AddStories/AddStories';
import ForgotPassword from '../Screens/Auth/ForgetPassword/ForgotPassword';
import LandingHome from '../Screens/Auth/LandingHome';
import LandingScreen from '../Screens/Auth/LandingScreen';
import SignInScreen from '../Screens/Auth/SignInScreen';
import SignUpScreen from '../Screens/Auth/SignUpScreen';
import AddPost from '../Screens/Home/AddPost';
import NotificationScreen from '../Screens/Home/NotificationScreen';
import MessageChatScreen from '../Screens/Messages/MessageChatScreen';
import MessagesOutside from '../Screens/Messages/MessagesOutside';
import BottomStack from './BottomStack';
import {Linking} from 'react-native';
const Stack = createStackNavigator();

export const MainStack = () => {
  const [initialRoute, setInitialRoute] = React.useState('');

  React.useEffect(() => {
    const checkInitialURL = async () => {
      try {
        const url = await Linking.getInitialURL();
        console.log('Initial URL:', url);
        if (url) {
          // Parse the URL to determine which route to use.
          // Using the global URL object which is available in modern React Native versions.
          const parsedUrl = new URL(url);
          if (parsedUrl.pathname.includes('reset-password')) {
            setInitialRoute('ResetPassword');
          } else {
            setInitialRoute('Home');
          }
        } else {
          setInitialRoute('Home');
        }
      } catch (error) {
        console.error('Error fetching initial URL:', error);
        setInitialRoute('Home');
      } finally {
      }
    };

    checkInitialURL();
  }, []);

  console.log(initialRoute);
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="LandingHome"
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
        <Stack.Screen name="LandingHome" component={LandingHome} />
        <Stack.Screen name="Landing" component={LandingScreen} />
        <Stack.Screen name="Signin" component={SignInScreen} />
        <Stack.Screen name="Signup" component={SignUpScreen} />
        <Stack.Screen name="BottomTabs" component={BottomStack} />
        <Stack.Screen name="Message" component={MessagesOutside} />
        <Stack.Screen name="AddStories" component={AddStories} />
        <Stack.Screen name="MyTabs" component={BottomStack} />
        <Stack.Screen name="EditProfile" component={EditProfile} />
        <Stack.Screen name="ProfileMenu" component={ProfileMenu} />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
        <Stack.Screen
          name="OtherProfileScreen"
          component={OtherProfileScreen}
        />
        <Stack.Screen name="ChatScreen" component={MessageChatScreen} />
        <Stack.Screen name="WebScreen" component={WebScreen} />
        <Stack.Screen name="AddPosts" component={AddPost} />
        <Stack.Screen name="UploadScreen" component={UploadScreen} />
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
