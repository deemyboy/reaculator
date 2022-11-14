import React from "react";

const HandleClickContext = React.createContext({});

export const HandleClickContextProvider = HandleClickContext.Provider;

const CalculationContext = React.createContext({});

export const CalculationContextProvider = CalculationContext.Provider;

export default HandleClickContext;
