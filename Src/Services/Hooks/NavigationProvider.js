import React, {createContext, useState} from 'react';

export const NavigationContext = createContext();

export const NavigationProvider = ({children}) => {
  const [currentIndex, setCurrentIndex] = useState(0); // Default index is 0

  return (
    <NavigationContext.Provider value={{currentIndex, setCurrentIndex}}>
      {children}
    </NavigationContext.Provider>
  );
};
