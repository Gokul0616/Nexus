import React from 'react';
import {PaperProvider} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import {MainStack} from './Src/Routes/MainRoute';
import {NavigationProvider} from './Src/Services/Hooks/NavigationProvider';
import {ChatInputProvider} from './Src/Services/Hooks/useChatInput';
const App = () => {
  // useEffect(() => {
  //   const stompClient = initializeStomp();

  //   // Optionally, return a cleanup function if you want to deactivate the client on unmount:
  //   return () => {
  //     stompClient.deactivate();
  //   };
  // }, []);

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
