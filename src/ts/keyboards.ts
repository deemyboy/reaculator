import * as Types from "../types/types";
import {
    numberKeys,
    functionKeys,
    themeTypeKeys,
    themeKeys,
    animationKeys,
    pictureKeys,
} from "./keys";

export const keyboardMap = new Map<string, Types.TKeyboard>([
    [
        "number",
        {
            name: "number",
            className: "keyboard-number",
            showTitle: false,
            keys: numberKeys,
            location: "main",
            id: 1,
        },
    ],
    [
        "function",
        {
            name: "function",
            className: "keyboard-function",
            showTitle: false,
            keys: functionKeys,
            location: "main",
            id: 2,
        },
    ],
    [
        "themeType",
        {
            name: "themeType",
            className: "keyboard-theme-type",
            showTitle: true,
            keys: themeTypeKeys,
            location: "display",
            id: 3,
        },
    ],
    [
        "theme",
        {
            name: "theme",
            className: "keyboard-theme",
            showTitle: true,
            keys: themeKeys,
            location: "display",
            id: 4,
        },
    ],
    [
        "animation",
        {
            name: "animation",
            className: "keyboard-animation",
            showTitle: true,
            keys: animationKeys,
            location: "display",
            id: 5,
        },
    ],
    [
        "pictureType",
        {
            name: "pictureType",
            className: "keyboard-picture-type",
            showTitle: true,
            keys: pictureKeys,
            location: "display",
            id: 6,
        },
    ],
]);
