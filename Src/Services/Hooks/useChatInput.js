import React, {createContext, useState, useContext} from 'react';

// Create Context
const ChatInputContext = createContext();

// Provider Component
export const ChatInputProvider = ({children}) => {
  const [inputValue, setInputValue] = useState('');

  const clearInputValue = () => setInputValue('');

  return (
    <ChatInputContext.Provider
      value={{inputValue, setInputValue, clearInputValue}}>
      {children}
    </ChatInputContext.Provider>
  );
};

// Custom Hook to use ChatInputContext
export const useChatInput = () => useContext(ChatInputContext);
