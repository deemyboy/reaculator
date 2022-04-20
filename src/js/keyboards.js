import { themeKeys } from "./keys";
import { numberKeys } from "./keys";
import { functionKeys } from "./keys";
import { utilityKeys } from "./keys";
import { themeTypeKeys } from "./keys";
import { animKeys } from "./keys";
import { pictureKeys } from "./keys";

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
    className: "keyboard-theme",
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