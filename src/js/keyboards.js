import {
    numberKeys,
    functionKeys,
    utilityKeys,
    themeTypeKeys,
    themeKeys,
    animKeys,
    pictureKeys,
} from "./keys";

export const keyboards = [
    {
        name: "number",
        className: "keyboard-number",
        showTitle: false,
        keys: numberKeys,
        xs: 7,
        md: 7,
    },
    {
        name: "function",
        className: "keyboard-function",
        showTitle: false,
        keys: functionKeys,
        xs: 5,
        md: 5,
    },
    {
        name: "utility",
        className: "keyboard-utility",
        showTitle: false,
        keys: utilityKeys,
        xs: 12,
        md: 12,
        lg: 12,
    },
    {
        name: "theme-type",
        className: "keyboard-theme-type",
        showTitle: true,
        keys: themeTypeKeys,
    },
    {
        name: "theme",
        className: "keyboard-theme",
        showTitle: true,
        keys: themeKeys,
    },
    {
        name: "animation",
        className: "keyboard-animation",
        showTitle: true,
        keys: animKeys,
    },
    {
        name: "picture-type",
        className: "keyboard-picture-type",
        showTitle: true,
        keys: pictureKeys,
    },
];

export default keyboards;
