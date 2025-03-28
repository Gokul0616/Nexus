import React from 'react';
import {PaperProvider} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import {MainStack} from './Src/Routes/MainRoute';
import {NavigationProvider} from './Src/Services/Hooks/NavigationProvider';
import {ChatInputProvider} from './Src/Services/Hooks/useChatInput';
import {backendUrl} from './Src/Services/api/EndPoint';
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
