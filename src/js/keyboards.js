import {
    numberKeys,
    functionKeys,
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
        location: "main",
        id: 1,
    },
    {
        name: "function",
        className: "keyboard-function",
        showTitle: false,
        keys: functionKeys,
        location: "main",
        id: 2,
    },
    {
        name: "themeType",
        className: "keyboard-theme-type",
        showTitle: true,
        keys: themeTypeKeys,
        location: "display",
        id: 3,
    },
    {
        name: "theme",
        className: "keyboard-theme",
        showTitle: true,
        keys: themeKeys,
        location: "display",
        id: 4,
    },
    {
        name: "animation",
        className: "keyboard-animation",
        showTitle: true,
        keys: animKeys,
        location: "display",
        id: 5,
    },
    {
        name: "pictureType",
        className: "keyboard-picture-type",
        showTitle: true,
        keys: pictureKeys,
        location: "display",
        id: 6,
    },
];

export default keyboards;
