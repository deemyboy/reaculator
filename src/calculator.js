import React, { useState, useEffect, useRef, useCallback } from "react";
import Display from "./components/display";
import Keyboard from "./components/keyboard";
import Canvas from "./components/canvas";
import Sidebar from "./components/sidebar";
import Cookies from "universal-cookie";
import {
    numberKeys,
    functionKeys,
    utilityKeys,
    themeTypeKeys,
    themeKeys,
    animKeys,
    pictureKeys,
    ALLOWED_KEYS,
    DISALLOWED_KEYS,
} from "./js/keys";
import { Container, Grid, Typography } from "@mui/material";
import * as CONSTANTS from "./js/constants";
import {
    doMaths,
    convertFromUnicodeToChar,
    convertFromCharToUnicode,
} from "./js/maths_engine.mjs";
import { processRawInput } from "./js/process_input.mjs";
import "./styles/main.scss";
import keyboards from "./js/keyboards";

const cookie = new Cookies();

import {
    HandleClickContextProvider,
    CalculationContextProvider,
} from "./js/context";

const Calculator = () => {
    // displayRef = React.createRef();
    const displayRef = useRef(null);
    // canvasRef = React.createRef();
    const canvasRef = useRef(null);
    // constructor(props) {
    //     super(props);

    //     theme = getCookie("currentTheme", "theme");
    //     themeType = getCookie("currentThemeType", "themeType");
    //     animation = getCookie("currentAnimation", "animation");
    //     pictureType = getCookie(
    //         "currentPictureType",
    //         "pictureType"
    //     );
    // }

    const title = "Reaculator";

    const handleClick = (e) => {
        e.target.blur();
        const _keyData = {};
        const keyClicked = utilityKeys
            .concat(numberKeys, functionKeys)
            .filter((k) => {
                return k.id.toString() === e.target.id;
            });
        let key = keyClicked[0].value ? keyClicked[0].value : "";
        _keyData.key = key;
        _keyData.timeStamp = e.timeStamp;
        setInputData(_keyData);
    };

    const onSelectThemeType = (e) => {
        e.stopPropagation();
        let cookieData = {};
        let _themeTypeData = {};
        _themeTypeData.currentSetting = e.target.id;
        cookieData.cookieLabel = "currentThemeType";
        cookieData.cookieValue = _themeTypeData.currentSetting;
        cookieData.cookiePath = "/";
        setThemeType(_themeTypeData.currentSetting);
    };

    const onSelectTheme = (e) => {
        e.stopPropagation();
        let cookieData = {};
        let _themesData = {};
        _themesData.currentSetting = e.target.id;
        cookieData.cookieLabel = "currentTheme";
        cookieData.cookieValue = _themesData.currentSetting;
        cookieData.cookiePath = "/";
        setTheme(_themesData.currentSetting);
        // setCookie(cookieData);
    };

    const onSelectAnimation = (e) => {
        e.stopPropagation();
        let cookieData = {};
        let _animation = e.target.id;
        cookieData.cookieLabel = "currentAnimation";
        cookieData.cookieValue = _animation;
        cookieData.cookiePath = "/";
        setAnimation(_animation);
        // setCookie(cookieData);
    };

    const onSelectPictureType = (e) => {
        e.stopPropagation();
        let cookieData = {};
        let _pictureType = {};
        _pictureType = e.target.id;
        cookieData.cookieLabel = "currentPictureType";
        cookieData.cookieValue = _pictureType;
        cookieData.cookiePath = "/";
        setPictureType(_pictureType);
        // setCookie(cookieData);
    };

    const [inputData, setInputData] = useState({
        key: undefined,
        timeStamp: undefined,
    });

    const isInitialMount = useRef(true);

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
        } else {
            handleUserInput();
        }
    }, [inputData]);

    const [theme, setTheme] = useState("Ocean");

    const [themeType, setThemeType] = useState("color");

    useEffect(() => {
        let _visibleKeyboards = getVisibleSidebarKeyboards();
        sidebarData.keyboardNames = _visibleKeyboards;
        setSidebarData({ ...sidebarData });
    }, [themeType]);

    const [animation, setAnimation] = useState("fireworks");

    const [pictureType, setPictureType] = useState("still");

    const [calculationData, setCalculationData] = useState({
        className: "default",
        value: "",
    });

    const initialResultData = {
        className: "default",
        value: undefined,
        computed: undefined,
        num1: undefined,
        op1: undefined,
        num2: undefined,
        op2: undefined,
    };

    const [resultData, setResultData] = useState({
        ...initialResultData,
    });

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
        } else {
            handleUserInput();
        }
    }, [inputData]);

    const handleResult = () => {};

    const toggleSidebar = (e) => {
        console.log(e, sidebarData);
        e.preventDefault();
        e.stopPropagation();
        sidebarData.isOpen = !sidebarData.isOpen;
        setSidebarData({ ...sidebarData });
    };

    const closeSidebar = (e) => {
        e.preventDefault();
        e.stopPropagation();
        sidebarData.isOpen = false;
        setSidebarData({ ...sidebarData });
    };

    const getVisibleSidebarKeyboards = () => {
        const defaultSidebarKeyboardNames = ["theme-type", "theme"];
        let sidebarVisibleKeyboardNames = defaultSidebarKeyboardNames;

        if (themeType !== "color") {
            sidebarVisibleKeyboardNames.push(
                themeType === "animation" ? "animation" : "picture-type"
            );
        }
        return sidebarVisibleKeyboardNames;
    };

    const [sidebarData, setSidebarData] = useState({
        keyboardNames: getVisibleSidebarKeyboards(),
        isOpen: false,
        selected: "",
    });

    const [keyErr, setKeyErr] = useState(false);

    const initialComputationData = {
        rawInput: undefined,
        parsedInput: undefined,
        calculationValue: undefined,
        computed: undefined,
        nextChar: undefined,
        op1: undefined,
        op2: undefined,
        resultValue: undefined,
    };

    const [computationData, setComputationData] = useState({
        ...initialComputationData,
    });

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
        } else {
            tryMath();
        }
    }, [computationData.rawInput]);

    useEffect(() => {
        let _id = "animation-script",
            _scriptName = animation;

        const removeScript = (id) => {
            if (document.getElementById(id)) {
                document.getElementById(id).remove();
            }
        };

        if (themeType === "animation") {
            var loadScript = function () {
                var tag = document.createElement("script");
                tag.id = _id;
                tag.async = false;
                let _src = `./animation-${_scriptName}.js`;
                tag.src = _src;
                var body = document.getElementsByTagName("body")[0];
                body.appendChild(tag);
            };
            if (document.getElementById(_id)) {
                removeScript(_id);
            }
            loadScript();
        } else if (document.getElementById(_id)) {
            removeScript(_id);
        }

        if (themeType === "animation") {
            var loadScript = function () {
                var tag = document.createElement("script");
                tag.id = _id;
                tag.async = false;
                let _src = `./animation-${_scriptName}.js`;
                tag.src = _src;
                var body = document.getElementsByTagName("body")[0];
                body.appendChild(tag);
            };

            if (document.getElementById(_id)) {
                var tag = document.getElementById(_id);
                tag.remove();
            }
            loadScript();
        } else if (document.getElementById(_id)) {
            removeScript(_id);
        }
    }),
        [sidebarData, animation];

    useEffect(() => {
        window.addEventListener("keydown", handleKeyPress);
        return () => {
            window.removeEventListener("keydown", handleKeyPress);
        };
    });

    //    const [cookieData, setCookie] = useState(
    //       {   d:  new Date(),
    //          year:  d.getFullYear(),
    //          month:  d.getMonth(),
    //          day:  d.getDate(),
    //          expires:  new Date(year + 1, month, day),
    //            path: cookieData.cookiePath,
    //            label: undefined,
    //          value:undefined,
    // }

    // );
    // const     setCookie(
    //     cookie.set(
    //     cookieData.cookieLabel,
    //     cookieData.cookieValue,
    //     path,
    //     expires)
    //     );

    // const     getCookie = (cookieLabel, cookieDefault) => {
    //         const cookie = new Cookies();
    //         return cookie.get(cookieLabel)
    //             ? cookie.get(cookieLabel)
    //             : state[cookieDefault];
    //     };

    const makeKeyboard = (keyboardName) => {
        const data = keyboards.find((kb) => {
            return kb.name === keyboardName;
        });
        return (
            <HandleClickContextProvider value={getOnSelect(keyboardName)}>
                <Keyboard props={data} />
            </HandleClickContextProvider>
        );
    };

    const getOnSelect = (keyboardName) => {
        const onSelectStack = {
            number: handleClick,
            function: handleClick,
            utility: handleClick,
            "theme-type": onSelectThemeType,
            theme: onSelectTheme,
            animation: onSelectAnimation,
            "picture-type": onSelectPictureType,
        };
        return onSelectStack[keyboardName];
    };

    const makeSidebar = (data) => {
        let _keyboards = [],
            _keyboardData = {},
            _data = data;

        data.keyboardNames.map((keyboardName) => {
            let _keyboardName = () => {
                keyboards.find((kb) => {
                    return kb.name === keyboardName;
                });
            };
            _keyboards.push(makeKeyboard(keyboardName));
            _keyboardData.keyboards = _keyboards;
        });

        _data.keyboards = _keyboards;
        return <Sidebar props={_data} />;
    };

    const handleKeyPress = useCallback(
        (e) => {
            const _keyData = {};
            // prevent these keys firing
            // ctrl key 17, shift key 16 alt key 18
            // mac key codes added 91-left cmd, 93-right cmd, 37-40 arrow keys
            const {
                key,
                shiftKey,
                ctrlKey,
                metaKey,
                keyCode,
                repeat,
                timeStamp,
            } = e;
            if (!DISALLOWED_KEYS.includes(keyCode)) {
                var _key = utilityKeys
                    .concat(numberKeys, functionKeys)
                    .filter((k) => {
                        return k.keycode === keyCode;
                    })[0];
                if (_key) {
                    var _button = document.getElementById(_key.id);
                }
            } else {
                return;
            }
            if (!repeat) {
                if (_button === null || _button === undefined) {
                    return;
                } else if (_button !== null || _button !== undefined) {
                    _button.focus(timeout);
                    var timeout = setTimeout(() => _button.blur(), 200);
                }
                if (ALLOWED_KEYS.includes(keyCode)) {
                    // exceptions
                    ////
                    if (ctrlKey && key !== "") {
                        return;
                    }
                    // handle shift key pressed by itself
                    // prevent going forward
                    // shift key only allowed with "+" key
                    // shift key alone keyCode === 16
                    if (shiftKey && keyCode === 16) {
                        return;
                    }

                    // prevent ctrl/cmd + r triggering sqr root
                    if (
                        (ctrlKey && keyCode === 82) ||
                        (metaKey && keyCode === 82)
                    ) {
                        return;
                    }
                }
                _keyData.key = key;
                _keyData.timeStamp = timeStamp;
                setInputData(_keyData);
            }
        },
        [inputData]
    );

    const handleUserInput = () => {
        // if maths error then prevent all input except esc for ac

        let _computationData = { ...computationData },
            { rawInput } = _computationData || "";
        const { key } = inputData;
        if (keyErr && key !== "a") {
            return;
        }
        if (rawInput) {
            rawInput += key;
        } else {
            rawInput = key;
        }
        _computationData.rawInput = processRawInput(rawInput);
        setComputationData({ ..._computationData });
    };

    const tryMath = () => {
        const { rawInput } = computationData || undefined;
        console.log("tryMath", rawInput);

        // if (rawInput) {
        //     if (CONSTANTS.patternStack.MATH_CATCHER.test(rawInput)) {
        // we can do maths

        let _resultData = doMaths(rawInput);
        if (_resultData.computed) {
            console.log(
                "we have returned from doing maths",
                "_resultData",
                _resultData
            );

            const { computed, op1, num1, num2, op2, value } = _resultData;
            setResultData({ ...resultData, ..._resultData });
        } else {
            let _calculationData = { ...calculationData };
            _calculationData.value = rawInput;
            console.log(
                " // no result from a maths computationc continue to process the user input build up calculation string continue to purify user input code",
                _resultData,
                _calculationData,
                rawInput
            );
            setCalculationData(_calculationData);
        }
    };

    const getSelected = (keyboardName) => {
        switch (keyboardName) {
            case "theme-type":
                return themeType;
            case "theme":
                return theme;
            case "animation":
                return animation;
            case "picture-type":
                return pictureType;
            default:
                return;
        }
    };

    const setResultClass = (newClassName) => {
        resultData.className = newClassName;
        setResultData(resultData);
    };

    return (
        <Container
            className={`container ${
                sidebarData.isOpen === true ? "open" : ""
            } ${themeType} ${theme.toLowerCase()} ${pictureType}`}
            sx={{ p: "0!important" }}
        >
            {/* ------------ app ---------------- */}
            {/* ------------ display and keyboards---------------- */}
            <p className="settings" onClick={toggleSidebar}>
                <i className="cog" aria-hidden="true"></i>
            </p>
            <Grid
                container
                onClick={closeSidebar}
                direction={"column"}
                id="canvas-container"
                className={"calculator"}
                meta-name="display and keyboards"
            >
                <Canvas ref={canvasRef} id={CONSTANTS.CANVAS_CONTAINER_ID} />
                <Typography className="title">
                    {CONSTANTS.APPLICATION_TITLE}
                </Typography>
                {/* ------------ display ---------------- */}
                <CalculationContextProvider value={calculationData}>
                    <Display
                        // calculationData={{ ...calculationData }}
                        resultData={{ ...resultData }}
                    />
                </CalculationContextProvider>
                {/* ------------ main keyboards ---------------- */}
                <Grid
                    container
                    className="main-keyboards"
                    meta-name="main keyboards"
                >
                    {makeKeyboard("number")}
                    {makeKeyboard("function")}
                    {makeKeyboard("utility")}
                </Grid>
            </Grid>
            {/* ------------ sidebar ---------------- */}
            {/* <Sidebar props={sidebarData} /> */}
            {makeSidebar(sidebarData)}
        </Container>
    );
};

export default Calculator;
