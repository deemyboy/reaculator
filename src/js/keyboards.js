import {
  themeKeys,
  numberKeys,
  functionKeys,
  utilityKeys,
  themeTypeKeys,
  animKeys,
  pictureKeys,
} from "./keys";

export const keyboards = [
  {
    name: "number",
    className: "keyboard-number",
    keys: numberKeys,
    onClickFunction: "handleClick",
  },
  {
    name: "function",
    className: "keyboard-function",
    keys: functionKeys,
    onClickFunction: "handleClick",
  },
  {
    name: "utility",
    className: "keyboard-utility",
    keys: utilityKeys,
    onClickFunction: "handleClick",
  },
  {
    name: "theme-type",
    className: "keyboard-theme-type",
    keys: themeTypeKeys,
    onClickFunction: "onSelectThemeType",
  },
  {
    name: "theme",
    className: "keyboard-theme",
    keys: themeKeys,
    onClickFunction: "onSelectTheme",
  },
  {
    name: "animation",
    className: "keyboard-animation",
    keys: animKeys,
    onClickFunction: "onSelectAnim",
  },
  {
    name: "picture-type",
    className: "keyboard-picture-type",
    keys: pictureKeys,
    onClickFunction: "onSelectPictureType",
  },
];
