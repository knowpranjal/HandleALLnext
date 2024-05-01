'use client'

import React, { createContext, useState } from 'react';

// Creating a context
export const handleContext = createContext();

// Creating a provider component
export const HandleProvider = ({ children }) => {
  const [cid, setCID] = useState('');
  const [textInput, setTextInput] = useState("");
  const [state, setState] = useState({
    provider: null,
    signer: null,
    contract: null
  });
  console.log(state);


  

  return (
    <handleContext.Provider value={{ cid, setCID, setState, state, textInput, setTextInput }}>
      {children}
    </handleContext.Provider>
  );
};
