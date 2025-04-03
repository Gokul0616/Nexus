import React, {createContext, useEffect, useState} from 'react';
import NetInfo from '@react-native-community/netinfo';
import Toast from 'react-native-simple-toast';
export const NavigationContext = createContext();

export const NavigationProvider = ({children}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeEnabled, setSwipeEnabled] = useState(true);
  const [topStackIndex, setTopStackIndex] = useState(true);
  const [isConnected, setIsConnected] = useState(true);
  const [mediaKey, setMediaKey] = useState(0);
  const [progressmodalVisible, setProgressmodalVisible] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
      setMediaKey(prev => prev + 1);
    });
    return () => unsubscribe();
  }, []);
  useEffect(() => {
    if (!isConnected) {
      Toast.show('No Internet Connection');
    } else {
      Toast.show('Internet Recovered');
    }
  }, [isConnected]);
  return (
    <NavigationContext.Provider
      value={{
        currentIndex,
        setCurrentIndex,
        swipeEnabled,
        setSwipeEnabled,
        topStackIndex,
        setTopStackIndex,
        isConnected,
        mediaKey,
        progressmodalVisible,
        setProgressmodalVisible,
        uploadProgress,
        setUploadProgress,
      }}>
      {children}
    </NavigationContext.Provider>
  );
};
