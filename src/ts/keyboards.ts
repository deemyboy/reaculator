import * as Types from "../types/types";

import { keyboardKeysMap } from "./keys";

export const keyboardMap = new Map<string, Types.TKeyboard>([
    [
        "number",
        {
            name: "number",
            className: "keyboard-number",
            showTitle: false,
            keys: keyboardKeysMap.get("num")!,
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
            keys: keyboardKeysMap.get("func")!,
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
            keys: keyboardKeysMap.get("themeType")!,
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
            keys: keyboardKeysMap.get("theme")!,
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
            keys: keyboardKeysMap.get("animation")!,
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
            keys: keyboardKeysMap.get("pictureType")!,
            location: "display",
            id: 6,
        },
    ],
]);
