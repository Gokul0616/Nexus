// App.js
import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {MainStack} from './Src/Routes/MainRoute';
import {NavigationProvider} from './Src/Services/Hooks/NavigationProvider';
import {PaperProvider} from 'react-native-paper';
import {ChatInputProvider} from './Src/Services/Hooks/useChatInput';
const App = () => {
  return (
    <NavigationProvider>
      <PaperProvider>
        <ChatInputProvider>
          <SafeAreaView style={{flex: 1}}>
            <MainStack />
          </SafeAreaView>
        </ChatInputProvider>
      </PaperProvider>
    </NavigationProvider>
  );
};

export default App;
