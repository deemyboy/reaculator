// import {
//     handleClick,
//     onSelectThemeType,
//     onSelectTheme,
//     onSelectAnimation,
//     onSelectPictureType,
// } from "../calculator";

// allowed key codes for keyPress event handler
export const ALLOWED_KEYS = [
    8, 13, 16, 17, 27, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 67, 77, 82, 83,
    88, 89, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 109,
    110, 111, 187, 189, 190, 191,
];

export const DISALLOWED_KEYS = [16, 17, 18, 37, 38, 39, 40, 91, 93];

export const numberKeys = [
    {
        id: 1,
        value: "1",
        title: "one",
        keycode: 49,
        code: "Digit1",
        type: "num",
        location: "main",
        className: "btn btn-lg btn-primary",
    },
    {
        id: 2,
        value: "2",
        title: "two",
        keycode: 50,
        code: "Digit2",
        type: "num",
        location: "main",
        className: "btn btn-lg btn-primary",
    },
    {
        id: 3,
        value: "3",
        title: "three",
        keycode: 51,
        code: "Digit3",
        type: "num",
        location: "main",
        className: "btn btn-lg btn-primary",
    },
    {
        id: 4,
        value: "4",
        title: "four",
        keycode: 52,
        code: "Digit4",
        type: "num",
        location: "main",
        className: "btn btn-lg btn-primary",
    },
    {
        id: 5,
        value: "5",
        title: "five",
        keycode: 53,
        code: "Digit5",
        type: "num",
        location: "main",
        className: "btn btn-lg btn-primary",
    },
    {
        id: 6,
        value: "6",
        title: "six",
        keycode: 54,
        code: "Digit6",
        type: "num",
        location: "main",
        className: "btn btn-lg btn-primary",
    },
    {
        id: 7,
        value: "7",
        title: "seven",
        keycode: 55,
        code: "Digit7",
        type: "num",
        location: "main",
        className: "btn btn-lg btn-primary",
    },
    {
        id: 8,
        value: "8",
        title: "eight",
        keycode: 56,
        code: "Digit8",
        type: "num",
        location: "main",
        className: "btn btn-lg btn-primary",
    },
    {
        id: 9,
        value: "9",
        title: "nine",
        keycode: 57,
        code: "Digit9",
        type: "num",
        location: "main",
        className: "btn btn-lg btn-primary",
    },
    {
        id: 0,
        value: "0",
        title: "zero",
        keycode: 48,
        code: "Digit0",
        type: "num",
        location: "main",
        className: "btn btn-lg btn-primary",
    },
    {
        id: 10,
        value: ".",
        title: "dot",
        keycode: 190,
        code: "Period",
        type: "num",
        location: "main",
        className: "btn btn-lg btn-primary",
    },
    {
        id: 11,
        value: "m",
        // uniChar: "\u00B1",
        uniChar: "\u207A\u2044-",
        title: "plus minus (m)",
        keycode: 77,
        code: "KeyM",
        type: "num",
        location: "main",
        className: "btn btn-lg btn-primary",
        subTitle: "m",
    },
];

export const functionKeys = [
    {
        id: 19,
        value: "+",
        title: "plus",
        keycode: 187,
        code: "Equal",
        type: "func",
        location: "main",
        className: "btn btn-lg btn-secondary",
    },
    {
        id: 12,
        value: "-",
        title: "minus",
        keycode: 189,
        code: "Minus",
        type: "func",
        location: "main",
        className: "btn btn-lg btn-secondary",
    },
    {
        id: 13,
        value: "x",
        uniChar: "\u00D7",
        calculationDisplayChar: "\u00D7",
        title: "multiply (x)",
        keycode: 88,
        code: "KeyX",
        type: "func",
        location: "main",
        className: "btn btn-lg btn-secondary",
        subTitle: "x",
    },
    {
        id: 14,
        value: "/",
        uniChar: "\u00F7",
        calculationDisplayChar: "\u00F7",
        title: "divide (/)",
        keycode: 191,
        code: "Slash",
        type: "func",
        location: "main",
        className: "btn btn-lg btn-secondary",
        subTitle: "/",
    },
    {
        id: 15,
        value: "s",
        uniChar: "\uD835\uDC65\u00B2",
        calculationDisplayChar: "\u00B2",
        title: "square (s)",
        keycode: 83,
        code: "KeyS",
        type: "func",
        location: "main",
        className: "btn btn-lg btn-secondary",
        subTitle: "s",
    },
    {
        id: 21,
        value: "r",
        uniChar: "\u221A2",
        calculationDisplayChar: "\u221A",
        title: "square root (r)",
        keycode: 82,
        code: "KeyR",
        type: "func",
        location: "main",
        className: "btn btn-lg btn-secondary",
        ctrlKey: false,
        subTitle: "r",
    },
    {
        id: 20,
        value: "y",
        uniChar: "\uD835\uDC65\u02B8",
        calculationDisplayChar: "\u02B8",
        title: "x to the power y (y)",
        keycode: 89,
        code: "KeyY",
        type: "func",
        location: "main",
        className: "btn btn-lg btn-secondary",
        subTitle: "y",
    },
    {
        id: 16,
        value: "=",
        title: "equals",
        keycode: 187,
        code: "Equal",
        type: "func",
        location: "main",
        className: "btn btn-lg btn-success btn-secondary",
    },
    {
        id: 17,
        value: "c",
        title: "clear last keypress (backspace)",
        keycode: 8,
        code: "Backspace",
        type: "func",
        location: "main",
        className: "btn btn-lg btn-danger btn-secondary",
        subTitle: "\u232b", // erase left
        // subTitle: "\u2190", // left arrow
        // subTitle: "\u27A9", // left arrow 3d
        // subTitle: "bksp",
    },
    {
        id: 18,
        value: "a",
        uniChar: "\u0061\u0063",
        title: "all clear (esc)",
        keycode: 27,
        code: "Escape",
        type: "func",
        location: "main",
        className: "btn btn-lg btn-danger btn-secondary",
        subTitle: "esc",
    },
];

export const themeTypeKeys = [
    {
        id: "picture",
        value: "picture",
        uniChar: "\uD83D\uDCF7",
        title: "picture",
        keycode: 65,
        code: "KeyA",
        type: "thype",
        location: "sidebar",
        className: "btn btn-lg btn-theme-type",
        showTitle: true,
    },
    {
        id: "color",
        value: "color",
        uniChar: "\uD83C\uDFA8",
        title: "color",
        keycode: 65,
        code: "KeyA",
        type: "thype",
        location: "sidebar",
        className: "btn btn-lg btn-theme-type",
        showTitle: true,
    },
    {
        id: "animation",
        value: "animation",
        uniChar: "\u221E",
        uniChar: "\uD83D\uDE80",
        title: "animation",
        keycode: 65,
        code: "KeyA",
        type: "thype",
        location: "sidebar",
        className: "btn btn-lg move-it btn-theme-type",
        showTitle: true,
    },
];

export const themeKeys = [
    {
        id: "fire",
        value: "fire",
        uniChar: "\uD83D\uDD25",
        title: "fire",
        keycode: 55,
        code: "Digit7",
        type: "thm",
        location: "sidebar",
        className: "btn btn-lg btn-fire fire btn-theme",
        showTitle: true,
    },
    {
        id: "midnight",
        value: "midnight",
        uniChar: "\uD83C\uDF03",
        title: "midnight",
        keycode: 55,
        code: "Digit7",
        type: "thm",
        location: "sidebar",
        className: "btn btn-lg btn-midnight midnight btn-theme",
        showTitle: true,
    },
    {
        id: "ocean",
        value: "ocean",
        uniChar: "\uD83C\uDF0A",
        title: "ocean",
        keycode: 55,
        code: "Digit7",
        type: "thm",
        location: "sidebar",
        className: "btn btn-lg btn-ocean ocean btn-theme",
        showTitle: true,
    },
    {
        id: "storm",
        value: "storm",
        uniChar: "\u2614",
        title: "storm",
        keycode: 55,
        code: "Digit7",
        type: "thm",
        location: "sidebar",
        className: "btn btn-lg btn-storm storm btn-theme",
        showTitle: true,
    },
    {
        id: "jungle",
        value: "jungle",
        uniChar: "\uD83C\uDF33",
        title: "jungle",
        keycode: 55,
        code: "Digit7",
        type: "thm",
        location: "sidebar",
        className: "btn btn-lg btn-jungle jungle btn-theme",
        showTitle: true,
    },
];

export const animKeys = [
    {
        id: "slither",
        value: "slither",
        // uniChar: "\uD83D\uDD00",
        uniChar: "\u219D",
        title: "slither",
        keycode: null,
        code: "",
        type: "animChs",
        location: "sidebar",
        className: "btn btn-lg btn-animation-choose",
        showTitle: true,
    },
    {
        id: "fireworks",
        value: "fireworks",
        // uniChar: "\uD83C\uDF86",// firework
        // uniChar: "\uD83C\uDF87",// sparkler
        uniChar: "\uD83D\uDCA5", // explosion
        title: "fireworks",
        keycode: null,
        code: "",
        type: "animChs",
        location: "sidebar",
        className: "btn btn-lg btn-animation-choose",
        showTitle: true,
    },
    // {
    //     id: "twist",
    //     value: "twist",
    //     // uniChar: "\uD83D\uDD00",// twisted-right
    //     // uniChar: "\uD83D\uDD01",// Clockwise Rightwards and Leftwards Open Circle Arrows
    //     // uniChar: "\uD83C\uDF0C" ,// milkyway symbol
    //     uniChar: "\uD83D\uDCAB", // dizzy symbol
    //     title: "twist",
    //     keycode: null,
    //     code: "",
    //     type: "animChs",
    //     location: "sidebar",
    // className: "btn btn-lg btn-animation-choose",
    //     showTitle: true,
    // },
];

// 0xD83C 0xDFAE ps4 controller
// 0xD83D 0xDCA3 bomb
// 0xD83D 0xDD2B pistol

// numClass: "btn-primary",
// funcClass: "btn-secondary",
// thmClass: "btn-theme",
// thmTypeClass: "btn-theme-type",
// picTypeClass: "btn-pic-type",
// errorClass: "btn-error",
// useMeClass: "btn-use-me",

export const pictureKeys = [
    {
        id: "still",
        value: "still",
        uniChar: "\u23F8",
        title: "still",
        keycode: 55,
        code: "Digit7",
        type: "picTypeChs",
        location: "sidebar",
        className: "btn btn-lg btn-still still btn-pic-type",
        showTitle: true,
    },
    {
        id: "moving",
        value: "moving",
        uniChar: "\u23E9",
        title: "moving",
        keycode: 55,
        code: "Digit7",
        type: "picTypeChs",
        location: "sidebar",
        className: "btn btn-lg btn-moving moving btn-pic-type",
        showTitle: true,
    },
];
