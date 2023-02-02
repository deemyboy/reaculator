import React from "react";
import * as Types from "../types/types";
export const HandleClickContext = React.createContext({});

export const HandleClickContextProvider = HandleClickContext.Provider;

// export const ThemeContext = React.createContext<Types.TThemeSelections2>({
//     theme: "",
//     themeType: "",
//     animation: "",
//     pictureType: "",
//     onClick: undefined,
// });
export const ThemeContext = React.createContext({});

export const ThemeContextProvider = ThemeContext.Provider;

export const ErrorStateContext = React.createContext<Types.TErrorState>({
    errorState: false,
});

export const ErrorStateContextProvider = ErrorStateContext.Provider;
