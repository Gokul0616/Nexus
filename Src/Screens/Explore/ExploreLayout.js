import {createStackNavigator} from '@react-navigation/stack';
import * as React from 'react';
import Explore from './Explore';
import SingleExplore from './SingleExplore';
const Stack = createStackNavigator();

export const ExploreLayout = () => {
  return (
    <Stack.Navigator
      initialRouteName="ExploreScreen"
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
      <Stack.Screen name="ExploreScreen" component={Explore} />
      <Stack.Screen name="Catagory" component={SingleExplore} />
    </Stack.Navigator>
  );
};
