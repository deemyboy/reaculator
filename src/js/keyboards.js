import { themeKeys } from "./keys";
import { numberKeys } from "./keys";
import { functionKeys } from "./keys";
import { utilityKeys } from "./keys";
import { themeTypeKeys } from "./keys";
import { animKeys } from "./keys";

export const keyboards = [
  {
    name: "number",
    className: "keyboard-number",
    keys: numberKeys,
    onClick: (e) => handleClick(e),
  },
  {
    name: "function",
    className: "keyboard-function",
    keys: functionKeys,
    onClick: (e) => handleClick(e),
  },
  {
    name: "utility",
    className: "keyboard-utility",
    keys: utilityKeys,
    onClick: (e) => handleClick(e),
  },
  {
    name: "theme-type",
    className: "keyboard-theme-type",
    keys: themeTypeKeys,
    onClick: (e) => onSelectThemeType(e),
  },
  {
    name: "theme",
    className: "keyboard-theme",
    keys: themeKeys,
    onClick: (e) => onSelectTheme(e),
  },
  {
    name: "animation",
    className: "keyboard-theme",
    keys: animKeys,
    onClick: (e) => onSelectAnim(e),
  },
];
