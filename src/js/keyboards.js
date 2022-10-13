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
        showTitle: false,
    },
    {
        name: "function",
        className: "keyboard-function",
        keys: functionKeys,
        onClickFunction: "handleClick",
        showTitle: false,
    },
    {
        name: "utility",
        className: "keyboard-utility",
        keys: utilityKeys,
        onClickFunction: "handleClick",
        showTitle: false,
    },
    {
        name: "theme-type",
        className: "keyboard-theme-type",
        keys: themeTypeKeys,
        onClickFunction: "onSelectThemeType",
        showTitle: true,
    },
    {
        name: "theme",
        className: "keyboard-theme",
        keys: themeKeys,
        onClickFunction: "onSelectTheme",
        showTitle: true,
    },
    {
        name: "animation",
        className: "keyboard-animation",
        keys: animKeys,
        onClickFunction: "onSelectAnim",
        showTitle: true,
    },
    {
        name: "picture-type",
        className: "keyboard-picture-type",
        keys: pictureKeys,
        onClickFunction: "onSelectPictureType",
        showTitle: true,
    },
];
