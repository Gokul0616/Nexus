// App.js
import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {MainStack} from './Src/Routes/MainRoute';
import {NavigationProvider} from './Src/Services/Hooks/NavigationProvider';
import {PaperProvider} from 'react-native-paper';
const App = () => {
  return (
    <NavigationProvider>
      <PaperProvider>
        <SafeAreaView style={{flex: 1}}>
          <MainStack />
        </SafeAreaView>
      </PaperProvider>
    </NavigationProvider>
  );
};

export default App;
