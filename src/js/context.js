import React from "react";

const HandleClickContext = React.createContext({});

export const HandleClickContextProvider = HandleClickContext.Provider;

export const DisplayContext = React.createContext({});

export const DisplayContextProvider = DisplayContext.Provider;

export default HandleClickContext;
