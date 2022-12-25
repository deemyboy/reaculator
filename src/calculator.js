import React, { useState, useEffect, useRef, useCallback } from "react";
import Display from "./components/display";
import Keyboard from "./components/keyboard";
import Canvas from "./components/canvas";
import { useCookies } from "react-cookie";
import SettingsIcon from "@mui/icons-material/Settings";
import { motion } from "framer-motion";
import {
    numberKeys,
    functionKeys,
    ALLOWED_KEYS,
    DISALLOWED_KEYS,
} from "./js/keys";
import { Container, Grid, Typography } from "@mui/material";
import * as CONSTANTS from "./js/constants";
import { doMath, unicodify } from "./js/maths_engine.mjs";
import { processInput } from "./js/process_input.mjs";
import "./styles/main.scss";
import keyboards from "./js/keyboards";

import {
    HandleClickContextProvider,
    DisplayContextProvider,
} from "./js/context";
import { positions } from "@mui/system";

const Calculator = () => {
    const [cookies, setCookie] = useCookies([
        "theme",
        "theme-type",
        "animation",
        "picture",
        "picture-type",
    ]);

    // const [cookies, setCookie] = useState({
    //     expires: undefined,
    //     path: undefined,
    //     label: undefined,
    //     value: undefined,
    // });
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

    const isInitialMount = useRef(true);

    const handleClick = useCallback((e) => {
        e.target.blur();
        setKeyData({
            key: [...numberKeys, ...functionKeys].filter((k) => {
                return k.id.toString() === e.target.id;
            })[0].value,
            timeStamp: e.timeStamp,
        });
    }, []);

    const handleKeyPress = useCallback((e) => {
        // prevent these keys firing
        // ctrl key 17, shift key 16 alt key 18
        // mac key codes added 91-left cmd, 93-right cmd, 37-40 arrow keys
        const { key, shiftKey, ctrlKey, metaKey, keyCode, repeat, timeStamp } =
            e;

        if (!repeat) {
            if (DISALLOWED_KEYS.includes(keyCode)) return;
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
                // Escape & Enter key hacks
                const _key =
                    key === "Escape" ? "a" : key === "Enter" ? "=" : key;

                setKeyData({
                    key: _key,
                    timeStamp: timeStamp,
                });
            }
        }
    }, []);

    const defaultTheme = "Ocean";
    const defaultThemeType = "color";

    const [theme, setTheme] = useState(defaultTheme);

    const [themeType, setThemeType] = useState(defaultThemeType);
    const onSelect = useCallback((e) => {
        e.stopPropagation();
        let cookieData = {};
        const _id = e.target.id;
        cookieData.cookieLabel = getCookieLabel(_id);
        cookieData.cookieValue = _id;
        cookieData.cookiePath = "/";
        setStateBasedOnId(_id)(_id);
        // useCookie(_id);
    }, []);

    const getOnSelect = (keyboardName) => {
        const onSelectStack = {
            number: handleClick,
            function: handleClick,
            "theme-type": onSelect,
            theme: onSelect,
            animation: onSelect,
            "picture-type": onSelect,
        };
        return onSelectStack[keyboardName];
    };

    const getCookieLabel = (labelId) => {
        const cookieLabelStack = {
            picture: "currentThemeType",
            color: "currentThemeType",
            animation: "currentThemeType",
            fire: "currentTheme",
            midnight: "currentTheme",
            ocean: "currentTheme",
            storm: "currentTheme",
            jungle: "currentTheme",
            slither: "currentAnimation",
            fireworks: "currentAnimation",
            still: "currentPictureType",
            moving: "currentPictureType",
        };
        return cookieLabelStack[labelId];
    };

    const setStateBasedOnId = (value) => {
        const setStateFunctionStack = {
            picture: setThemeType,
            color: setThemeType,
            animation: setThemeType,
            fire: setTheme,
            midnight: setTheme,
            ocean: setTheme,
            storm: setTheme,
            jungle: setTheme,
            slither: setAnimation,
            fireworks: setAnimation,
            still: setPictureType,
            moving: setPictureType,
        };
        return setStateFunctionStack[value];
    };

    const [errorState, setErrorState] = useState(false);

    const resetErrorState = () => {
        setErrorState(false);
    };

    const initialComputationData = {
        userInput: undefined,
        resultValue: 0,
        resultClassName: "result",
        calculationValue: "",
        calculationClassName: "calculation",
        computed: undefined,
        num1: undefined,
        op1: undefined,
        num2: undefined,
        op2: undefined,
        error: false,
        previousCalculationOperator: undefined,
        key: undefined,
        timeStamp: undefined,
        nextUserInput: undefined,
        // preProcessUserInput: false,
    };

    const [computationData, setComputationData] = useState({
        ...initialComputationData,
    });

    useEffect(() => {
        if (computationData.error) {
            setErrorState(true);
            computationData.calculationClassName += " calculation-error";
            computationData.resultClassName += " result-error";
        }
    }, [computationData.error]);

    useEffect(() => {
        if (computationData.computed) {
            // console.log(
            //     "computed an answer",
            //     computationData.op1,
            //     computationData.op2
            // );
            setComputationData({
                ...computationData,
                previousCalculationOperator: computationData.op2
                    ? computationData.op2
                    : computationData.op1,
                // computed: false,
                // preProcessUserInput: true,
            });
        }
        // preProcessComputationData();
    }, [computationData.computed]);

    const [keyData, setKeyData] = useState({});

    const resetKeyData = () => {
        setKeyData({});
    };

    // handleUserInput
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
        } else {
            if (Object.keys(keyData).length > 0) handleUserInput();
        }
    }, [keyData]);

    // makeCalculationData
    useEffect(() => {
        setComputationData({
            ...computationData,
            ...makeCalculationData(),
        });
    }, [computationData.userInput]);

    // tryMath
    useEffect(() => {
        if (CONSTANTS.patternStack.MATH_CATCHER.test(computationData.userInput))
            tryMath();
    }, [computationData.userInput]);

    const getVisibleKeyboardData = () => {
        let visibleKeyboardNames = ["theme-type", "theme"],
            keyboardData = [],
            keyboardObject = {};
        // if (themeType === "color") {
        // }
        if (themeType !== "color") {
            visibleKeyboardNames.push(
                themeType === "animation" ? "animation" : "picture-type"
            );
        }
        let i = 0;
        visibleKeyboardNames.forEach((name) => {
            keyboardObject = {
                index: i,
                keyboard: makeKeyboard(name),
                name: name,
            };
            keyboardData.push(keyboardObject);
            i++;
        });
        return keyboardData;
    };

    const initialSettingsData = {
        keyboardData: getVisibleKeyboardData(),
        isOpen: false,
        selected: "",
    };

    const [settingsData, setSettingsData] = useState(initialSettingsData);

    const [linesData, setLinesData] = useState({
        calculation: {
            value: "",
            className: computationData.calculationClassName,
        },
        result: { value: 0, className: computationData.resultClassName },
    });

    useEffect(() => {
        setDisplayData({
            settingsData: settingsData,
            linesData: linesData,
        });
    }, [settingsData, linesData]);

    useEffect(() => {
        setSettingsData({
            ...settingsData,
            keyboardData: getVisibleKeyboardData(),
        });
    }, [themeType]);

    const [animation, setAnimation] = useState("fireworks");

    const [pictureType, setPictureType] = useState("still");

    const toggleSettings = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const { isOpen } = settingsData;
        // prevent when in error
        if (!errorState) {
            // isOpen = !isOpen;
            setSettingsData({ ...settingsData, isOpen: !isOpen });
        }
    };

    const resetSettingsData = () => {
        // setSettingsData(initialSettingsData);
        // setTheme(defaultTheme);
        // setThemeType(defaultThemeType);
    };

    const [keyError, setKeyError] = useState(false);

    const resetComputationData = () => {
        setComputationData(initialComputationData);
    };

    const [displayData, setDisplayData] = useState({
        settingsData: settingsData,
        linesData: linesData,
    });

    useEffect(() => {
        if (computationData.previousCalculationOperator)
            preProcessComputationData();
    }, [computationData.computed && keyData]);

    // linesData calculationValue resultValue
    useEffect(() => {
        setLinesData({
            ...linesData,
            calculation: {
                value: computationData.calculationValue,
                className: computationData.calculationClassName,
            },
            result: {
                value: computationData.resultValue
                    ? computationData.resultValue
                    : 0,
                className: computationData.resultClassName,
            },
        });
    }, [
        computationData.resultValue,
        computationData.resultClassName,
        computationData.calculationValue,
        computationData.calculationClassName,
    ]);

    // animation
    useEffect(() => {
        let _id = "animation-script",
            _scriptName = animation;

        const removeScript = (id) => {
            if (document.getElementById(id)) {
                document.getElementById(id).remove();
            }
        };

        if (themeType === "animation") {
            const loadScript = function () {
                const tag = document.createElement("script");
                tag.id = _id;
                tag.async = false;
                let _src = `./animation-${_scriptName}.js`;
                tag.src = _src;
                const body = document.getElementsByTagName("body")[0];
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
            const loadScript = function () {
                const tag = document.createElement("script");
                tag.id = _id;
                tag.async = false;
                let _src = `./animation-${_scriptName}.js`;
                tag.src = _src;
                const body = document.getElementsByTagName("body")[0];
                body.appendChild(tag);
            };

            if (document.getElementById(_id)) {
                const tag = document.getElementById(_id);
                tag.remove();
            }
            loadScript();
        } else if (document.getElementById(_id)) {
            removeScript(_id);
        }
    }),
        [settingsData, animation];

    // keypress event listeners
    useEffect(() => {
        window.addEventListener("keydown", handleKeyPress);
        return () => {
            window.removeEventListener("keydown", handleKeyPress);
        };
    });

    ////////////////////////////////////////////////////////////

    // useEffect(
    //     (cookieName) => {
    //         console.log("set cookie", cookieName);
    //         const d = new Date();
    //         const year = d.getFullYear();
    //         const month = d.getMonth();
    //         const day = d.getDate();
    //         const cookieValues = {
    //             expires: new Date(year + 1, month, day),
    //             path: "/",
    //             label: undefined,
    //             value: undefined,
    //         };
    //         setCookie(cookieName, cookieValues);
    //     },
    //     [theme, themeType, pictureType, animation]
    // );

    // const getCookie = (cookieLabel, cookieDefault) => {
    //     const cookie = new Cookies();
    //     return cookie.get(cookieLabel)
    //         ? cookie.get(cookieLabel)
    //         : cookieDefault;
    // };

    const resetAll = () => {
        resetErrorState();
        resetKeyData();
        resetComputationData();
        // resetSettingsData();
    };

    function preProcessComputationData() {
        let changes = {};
        const {
            userInput,
            resultValue,
            computed,
            num1,
            op1,
            num2,
            op2,
            error,
            previousCalculationOperator,
            calculationClassName,
        } = { ...computationData };
        const { key } = { ...keyData };
        if (
            CONSTANTS.UNARY_OPERATOR_REGEX.test(previousCalculationOperator) &&
            CONSTANTS.UNARY_OPERATOR_REGEX.test(key)
        ) {
            console.log("unary op after unary op");
            changes = {
                userInput: resultValue + key,
                op1: undefined,
                num1: undefined,
                previousCalculationOperator: undefined,
                computed: false,
            };
        }
        if (
            CONSTANTS.UNARY_OPERATOR_REGEX.test(previousCalculationOperator) &&
            CONSTANTS.BINARY_OPERATOR_REGEX.test(key)
        ) {
            console.log("binary op after unary op", key);
            changes = {
                userInput: resultValue + key,
                op1: undefined,
                num1: undefined,
                previousCalculationOperator: undefined,
                computed: false,
            };
        }
        if (
            CONSTANTS.UNARY_OPERATOR_REGEX.test(previousCalculationOperator) &&
            CONSTANTS.NUMBER_REGEX.test(key)
        ) {
            console.log("number after unary op", key);
            changes = {
                userInput: key,
                op1: undefined,
                num1: undefined,
                previousCalculationOperator: undefined,
                key: undefined,
                computed: false,
                resultValue: 0,
            };
        }
        if (
            CONSTANTS.UNARY_OPERATOR_REGEX.test(previousCalculationOperator) &&
            /m/.test(key)
        ) {
            console.log("+/- (m) after unary op", key);
            changes = {
                userInput: resultValue * -1,
                op1: undefined,
                num1: undefined,
                previousCalculationOperator: undefined,
                key: undefined,
                computed: false,
                resultValue: 0,
            };
        }
        if (
            CONSTANTS.UNARY_OPERATOR_REGEX.test(previousCalculationOperator) &&
            /\./.test(key) &&
            !CONSTANTS.patternStack.UNIVERSAL_EXTRA_DOT_CATCHER.test(
                resultValue
            )
        ) {
            console.log(". after unary op", key);
            changes = {
                userInput: resultValue + key,
                op1: undefined,
                num1: undefined,
                previousCalculationOperator: undefined,
                key: undefined,
                computed: false,
                resultValue: 0,
            };
        }
        if (Object.keys(changes).length > 0) {
            setComputationData({
                ...computationData,
                ...changes,
            });
        }
    }

    const handleUserInput = () => {
        let { userInput, computed } = { ...computationData } || "";
        // if (computed)
        //     setComputationData({
        //         ...computationData,
        //         // preProcessUserInput: true,
        //     });
        const { key } = { ...keyData } || undefined;
        if (key === "a") {
            resetAll();
            return;
        }
        // if maths error then prevent all input except esc for ac (Escape key)
        if (keyError && key !== "a") {
            return;
        }
        if (
            computationData.computed &&
            key !== "m" &&
            key !== "=" &&
            key !== "c"
        ) {
            // console.log("computationData.computed", computationData.computed);
            // setComputationData({
            //     ...computationData,
            //     previousCalculationOperator: key,
            // });
        }

        if (computationData.computed && (key === "m" || key === "=")) {
            return;
        }

        if (userInput) {
            userInput += key;
        } else {
            userInput = key;
        }
        const _processedUserInput = processInput(userInput);
        if (_processedUserInput === "ac") {
            resetAll();
            return;
        }
        setComputationData({
            ...computationData,
            userInput: _processedUserInput,
            key: key,
        });
        setKeyData({});
    };

    const tryMath = () => {
        const _resultData = doMath(computationData.userInput);
        const calculationData = makeCalculationData();
        setComputationData({
            ...computationData,
            ..._resultData,
            ...calculationData,
        });
    };

    function makeCalculationData() {
        console.log("makeCalculationData");
        const {
            userInput,
            resultValue,
            computed,
            num1,
            op1,
            num2,
            op2,
            error,
            previousCalculationOperator,
            calculationClassName,
        } = { ...computationData };
        let calculationValue =
            num1 && op1 && num2
                ? "" + num1 + op1 + num2
                : num1 && op1 && !num2
                ? "" + num1 + op1
                : userInput;

        // remove last operator on binary
        calculationValue = CONSTANTS.LAST_OPERATOR_CATCHER.test(
            calculationValue
        )
            ? calculationValue.replace(/.$/, "")
            : calculationValue;
        // sqr root symbol hack - move it in front of numbers
        calculationValue = /r$/.test(calculationValue)
            ? "r" + calculationValue.replace(/.$/, "")
            : calculationValue;
        // replace strings or sysmbols with unicode chars
        let _calculationValue = processInput(calculationValue);
        _calculationValue = /[x\/sry]/.test(_calculationValue)
            ? unicodify(_calculationValue)
            : _calculationValue;
        return {
            calculationValue: _calculationValue,
            calculationClassName: calculationClassName,
        };
    }

    function makeKeyboard(keyboardName) {
        const data = keyboards.find((kb) => {
            return kb.name === keyboardName;
        });
        return (
            <HandleClickContextProvider value={getOnSelect(keyboardName)}>
                <Keyboard props={data} errorState={errorState} />
            </HandleClickContextProvider>
        );
    }

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

    return (
        <Container
            className={`container 
            ${themeType} ${theme.toLowerCase()} ${pictureType}`}
            sx={{ padding: "0!important" }}
        >
            {/* ------------ app ---------------- */}
            <p
                id="settings-icon"
                className={
                    settingsData.isOpen ? "settings-icon open" : "settings-icon"
                }
                onClick={toggleSettings}
            >
                <SettingsIcon
                    sx={{ position: "relative", zIndex: -1 }}
                    disabled
                />
                {/* <span className="cog" aria-hidden="true"></span> */}
            </p>
            <Grid
                container
                // onClick={closeSidebar}
                direction={"column"}
                id="canvas-container"
                className={"calculator"}
                meta-name="display and keyboards"
            >
                {/* ------------ canvas ---------------- */}
                <Canvas id={CONSTANTS.CANVAS_CONTAINER_ID} />
                <Typography className="title">
                    {CONSTANTS.APPLICATION_TITLE}
                </Typography>
                {/* ------------ display ---------------- */}
                {/* <Display lines={lineData} /> */}
                <Display {...displayData} />
                {/* ------------ main keyboards ---------------- */}
                <Grid
                    container
                    className={
                        !settingsData.isOpen
                            ? "main-keyboards"
                            : "main-keyboards hidden"
                    }
                    meta-name="main keyboards"
                >
                    {makeKeyboard("number")}
                    {makeKeyboard("function")}
                </Grid>
            </Grid>
        </Container>
    );
};

export default Calculator;
