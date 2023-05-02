import * as Types from "../types/types";

export const keyboardMap = new Map<string, Types.TKeyboardProps>([
    [
        "number",
        {
            name: "number",
            className: "keyboard-number",
            showTitle: false,
            keyboardKeys: "number",
            location: "main",
        },
    ],
    [
        "function",
        {
            name: "function",
            className: "keyboard-function",
            showTitle: false,
            keyboardKeys: "function",
            location: "main",
        },
    ],
    [
        "themeType",
        {
            name: "themeType",
            className: "keyboard-theme-type",
            showTitle: true,
            keyboardKeys: "themeType",
            location: "display",
        },
    ],
    [
        "theme",
        {
            name: "theme",
            className: "keyboard-theme",
            showTitle: true,
            keyboardKeys: "theme",
            location: "display",
        },
    ],
    [
        "animation",
        {
            name: "animation",
            className: "keyboard-animation",
            showTitle: true,
            keyboardKeys: "animation",
            location: "display",
        },
    ],
    [
        "pictureType",
        {
            name: "pictureType",
            className: "keyboard-picture-type",
            showTitle: true,
            keyboardKeys: "pictureType",
            location: "display",
        },
    ],
]);
