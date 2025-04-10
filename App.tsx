import React from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {PaperProvider} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import {MainStack} from './Src/Routes/MainRoute';
import {NavigationProvider} from './Src/Services/Hooks/NavigationProvider';
import {ChatInputProvider} from './Src/Services/Hooks/useChatInput';
const App = () => {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      {/* Uncomment below when using MainStack */}

      <NavigationProvider>
        <PaperProvider>
          <ChatInputProvider>
            <SafeAreaView style={{flex: 1}}>
              <MainStack />
            </SafeAreaView>
          </ChatInputProvider>
        </PaperProvider>
      </NavigationProvider>

      {/* For testing ZoomableVideo */}
      {/* <ZoomableVideo /> */}
      {/* Or testing WebSocket */}
      {/* <WebSocketExample /> */}
    </GestureHandlerRootView>
  );
};

export default App;
