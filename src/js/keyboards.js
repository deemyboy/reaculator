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
        xs: 7,
        md: 7,
        location: "main",
        id: 1,
    },
    {
        name: "function",
        className: "keyboard-function",
        showTitle: false,
        keys: functionKeys,
        xs: 5,
        md: 5,
        location: "main",
        id: 2,
    },
    {
        name: "theme-type",
        className: "keyboard-theme-type",
        showTitle: true,
        keys: themeTypeKeys,
        location: "sidebar",
        id: 3,
    },
    {
        name: "theme",
        className: "keyboard-theme",
        showTitle: true,
        keys: themeKeys,
        location: "sidebar",
        id: 4,
    },
    {
        name: "animation",
        className: "keyboard-animation",
        showTitle: true,
        keys: animKeys,
        location: "sidebar",
        id: 5,
    },
    {
        name: "picture-type",
        className: "keyboard-picture-type",
        showTitle: true,
        keys: pictureKeys,
        location: "sidebar",
        id: 6,
    },
];

export default keyboards;
