import NetInfo from '@react-native-community/netinfo';
import React, { createContext, useEffect, useState } from 'react';
import CustomToast from './Customtoast/CustomToast';

export const NavigationContext = createContext();

export const NavigationProvider = ({ children }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeEnabled, setSwipeEnabled] = useState(true);
  const [topStackIndex, setTopStackIndex] = useState(true);
  const [isConnected, setIsConnected] = useState(true);
  const [mediaKey, setMediaKey] = useState(0);
  const [progressmodalVisible, setProgressmodalVisible] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isMessage, setIsMessage] = useState({
    message: '',
    heading: '',
    isRight: false,
    rightButtonText: 'OK',
    triggerFunction: () => { },
    setShowAlert: () => { },
    showAlert: false,
  });
  const [hasLoaded, setHasLoaded] = useState(false);  // Track if app has been loaded

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
      setMediaKey(prev => prev + 1);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Skip showing the "Internet Recovered" toast on initial load
    if (!hasLoaded) {
      setHasLoaded(true);
      return;
    }

    // Only show the "Internet Recovered" toast when the app is online after being offline
    if (isConnected) {
      CustomToast.show('Internet Recovered', true);
    } else {
      CustomToast.show('No Internet Connection', true);
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
        setMediaKey,
        progressmodalVisible,
        setProgressmodalVisible,
        uploadProgress,
        setUploadProgress,
        isMessage,
        setIsMessage,
      }}>
      {children}
    </NavigationContext.Provider>
  );
};
