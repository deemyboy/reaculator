import { createContext, useContext } from "react";
import {
  HandleClickContextType,
  TErrorState,
  TThemeSettingsData,
  ThemeData,
} from "../types/types";

export const HandleClickContext = createContext<HandleClickContextType>({
  onClickFunctions: [() => {}, () => {}],
});

export const HandleClickContextProvider = HandleClickContext.Provider;

export const ThemeContext = createContext<ThemeData>({
  theme: "",
  themeType: "",
  animation: "",
  pictureType: "",
});

export const ThemeContextProvider = ThemeContext.Provider;

export const ErrorStateContext = createContext<TErrorState>({
  errorState: false,
});

export const ErrorStateContextProvider = ErrorStateContext.Provider;

export const SettingsDataContext = createContext<TThemeSettingsData>(
  {} as TThemeSettingsData
);

export const useSettings = () => {
  return useContext(SettingsDataContext);
};

export const SettingsDataContextProvider = SettingsDataContext.Provider;
