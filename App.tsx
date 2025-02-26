// App.js
import React from 'react';
import {MainStack} from './Src/Routes/MainRoute';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NavigationContainer} from '@react-navigation/native';
import TopStack from './Src/Routes/TopStack';

const App = () => {
  return (
    <SafeAreaView style={{flex: 1}}>
      <MainStack />
    </SafeAreaView>
  );
};

export default App;
