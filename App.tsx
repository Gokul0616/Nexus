import React, {useContext, useEffect} from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {PaperProvider} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import {MainStack} from './Src/Routes/MainRoute';
import {setToastRef} from './Src/Services/Hooks/Customtoast/CustomToast';
import {
  ToastContext,
  ToastProvider,
} from './Src/Services/Hooks/Customtoast/CustomToastContext';
import {NavigationProvider} from './Src/Services/Hooks/NavigationProvider';
import {ChatInputProvider} from './Src/Services/Hooks/useChatInput';

const ToastInitializer = () => {
  const toast = useContext(ToastContext);

  useEffect(() => {
    setToastRef(toast);
  }, [toast]);

  return null;
};
const App = () => {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      {/* Uncomment below when using MainStack */}

      <NavigationProvider>
        <PaperProvider>
          <ToastProvider>
            <ToastInitializer />
            <ChatInputProvider>
              <SafeAreaView style={{flex: 1}}>
                <MainStack />
              </SafeAreaView>
            </ChatInputProvider>
          </ToastProvider>
        </PaperProvider>
      </NavigationProvider>

      {/* Or testing WebSocket */}
      {/* <WebSocketExample /> */}
    </GestureHandlerRootView>
  );
};

export default App;
