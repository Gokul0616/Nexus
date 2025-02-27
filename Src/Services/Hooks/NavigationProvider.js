import React, {createContext, useState} from 'react';

export const NavigationContext = createContext();

export const NavigationProvider = ({children}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeEnabled, setSwipeEnabled] = useState(true);
  const [topStackIndex, setTopStackIndex] = useState(true);
  return (
    <NavigationContext.Provider
      value={{
        currentIndex,
        setCurrentIndex,
        swipeEnabled,
        setSwipeEnabled,
        topStackIndex,
        setTopStackIndex,
      }}>
      {children}
    </NavigationContext.Provider>
  );
};
