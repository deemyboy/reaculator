import { createContext } from "react";
import * as Types from "../types/types";

export const HandleClickContext = createContext({});

export const HandleClickContextProvider = HandleClickContext.Provider;

export const ThemeContext = createContext<Types.TThemeSelections>({
  theme: "",
  themeType: "",
  animation: "",
  pictureType: "",
});
// export const ThemeContext = createContext({});

export const ThemeContextProvider = ThemeContext.Provider;

export const ErrorStateContext = createContext<Types.TErrorState>({
  errorState: false,
});

export const ErrorStateContextProvider = ErrorStateContext.Provider;

export const SettingsDataContext = createContext<Types.TSettingsDataContext>(
  {} as Types.TSettingsDataContext
);

export const SettingsDataContextProvider = SettingsDataContext.Provider;
