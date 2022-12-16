import React, { useState, useEffect, useRef, useCallback } from "react";
import Line from "./components/line";
import Display from "./components/display";
import Keyboard from "./components/keyboard";
import Canvas from "./components/canvas";
import Sidebar from "./components/sidebar";
import ThemeSettings from "./components/theme-settings";
import Cookies from "universal-cookie";
import {
    numberKeys,
    functionKeys,
    ALLOWED_KEYS,
    DISALLOWED_KEYS,
} from "./js/keys";
import {
    Container,
    Grid,
    Typography,
    Collapse,
    Slide,
    SlideProps,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import * as CONSTANTS from "./js/constants";
import { doMath, unicodify, deunicodify } from "./js/maths_engine.mjs";
import { processUserInput } from "./js/process_input.mjs";
import "./styles/main.scss";
import keyboards from "./js/keyboards";

const cookie = new Cookies();

import {
    HandleClickContextProvider,
    DisplayContextProvider,
} from "./js/context";

const Calculator = () => {
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

    const handleClick = useCallback((e) => {
        e.target.blur();
        const keyClicked = numberKeys.concat(functionKeys).filter((k) => {
            return k.id.toString() === e.target.id;
        });
        let key = keyClicked[0].value ? keyClicked[0].value : "";
        setKeyData({
            key: key,
            timeStamp: e.timeStamp,
        });
    }, []);

    const handleKeyPress = useCallback((e) => {
        let _button;
        // prevent these keys firing
        // ctrl key 17, shift key 16 alt key 18
        // mac key codes added 91-left cmd, 93-right cmd, 37-40 arrow keys
        const { key, shiftKey, ctrlKey, metaKey, keyCode, repeat, timeStamp } =
            e;
        if (!DISALLOWED_KEYS.includes(keyCode)) {
            const _key = numberKeys.concat(functionKeys).filter((k) => {
                return k.keycode === keyCode;
            })[0];
            if (_key) {
                _button = document.getElementById(_key.id);
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
            // Escape key hack
            const _key = key === "Escape" ? "a" : key;

            setKeyData({
                key: _key,
                timeStamp: timeStamp,
            });
        }
    }, []);

    const getOnSelect = (keyboardName) => {
        const onSelectStack = {
            number: handleClick,
            function: handleClick,
            "theme-type": onSelectThemeType,
            theme: onSelectTheme,
            animation: onSelectAnimation,
            "picture-type": onSelectPictureType,
        };
        return onSelectStack[keyboardName];
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
        nextChar: undefined,
        key: undefined,
        timeStamp: undefined,
    };

    const [computationData, setComputationData] = useState({
        ...initialComputationData,
    });

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
        } else {
            if (computationData.error) {
                setErrorState(true);
                computationData.calculationClassName += " calculation-error";
                computationData.resultClassName += " result-error";
            }
        }
    }, [computationData.error]);

    useEffect(() => {
        // console.log("linesData calculationValue", { linesData });
        if (isInitialMount.current) {
            isInitialMount.current = false;
        } else {
            if (computationData.computed)
                console.log("computed an answer", computationData.op2);
        }
    }, [computationData.computed]);

    const makeKeyboard = (keyboardName) => {
        const data = keyboards.find((kb) => {
            return kb.name === keyboardName;
        });
        return (
            <HandleClickContextProvider value={getOnSelect(keyboardName)}>
                <Keyboard props={data} errorState={errorState} />
            </HandleClickContextProvider>
        );
    };

    const onSelectThemeType = useCallback((e) => {
        e.stopPropagation();
        let cookieData = {};
        const _themeType = e.target.id;
        cookieData.cookieLabel = "currentThemeType";
        cookieData.cookieValue = _themeType;
        cookieData.cookiePath = "/";
        setThemeType(_themeType);
    }, []);

    const onSelectTheme = useCallback((e) => {
        e.stopPropagation();
        let cookieData = {};
        const _theme = e.target.id;
        cookieData.cookieLabel = "currentTheme";
        cookieData.cookieValue = _theme;
        cookieData.cookiePath = "/";
        setTheme(_theme);
        // setCookie(cookieData);
    }, []);

    const onSelectAnimation = useCallback((e) => {
        e.stopPropagation();
        let cookieData = {};
        let _animation = e.target.id;
        cookieData.cookieLabel = "currentAnimation";
        cookieData.cookieValue = _animation;
        cookieData.cookiePath = "/";
        setAnimation(_animation);
        // setCookie(cookieData);
    }, []);

    const onSelectPictureType = useCallback((e) => {
        e.stopPropagation();
        let cookieData = {};
        const _pictureType = e.target.id;
        cookieData.cookieLabel = "currentPictureType";
        cookieData.cookieValue = _pictureType;
        cookieData.cookiePath = "/";
        setPictureType(_pictureType);
        // setCookie(cookieData);
    }, []);

    const isInitialMount = useRef(true);

    const [keyData, setKeyData] = useState({});

    const resetKeyData = () => {
        setKeyData({});
    };

    // handleUserInput
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
        } else {
            handleUserInput();
        }
    }, [keyData]);

    // tryMath
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
        } else {
            if (
                CONSTANTS.patternStack.MATH_CATCHER.test(
                    computationData.userInput
                )
            )
                tryMath();
            else makeCalculationData();
        }
    }, [computationData.userInput]);

    const defaultTheme = "Ocean";
    const defaultThemeType = "color";

    const [theme, setTheme] = useState(defaultTheme);

    const [themeType, setThemeType] = useState(defaultThemeType);

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
        // console.log(keyboardData);
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
        if (isInitialMount.current) {
            isInitialMount.current = false;
        } else {
            if (settingsData.isOpen) {
                setDisplayData({
                    settingsData: settingsData,
                });
            } else {
                setDisplayData({
                    linesData: linesData,
                });
            }
        }
    }, [settingsData, linesData]);

    useEffect(() => {
        const _keyboardData = getVisibleKeyboardData();
        setSettingsData({
            ...settingsData,
            keyboardData: _keyboardData,
        });
    }, [themeType]);

    const [animation, setAnimation] = useState("fireworks");

    const [pictureType, setPictureType] = useState("still");

    const toggleSettings = (e) => {
        e.preventDefault();
        e.stopPropagation();
        let { isOpen } = settingsData;
        // prevent when in error
        if (!errorState) {
            isOpen = !isOpen;
            setSettingsData({ ...settingsData, isOpen: isOpen });
        }
    };

    // const closeSidebar = (e) => {
    //     e.preventDefault();
    //     e.stopPropagation();
    //     let _sidebarData = { ...sidebarData };
    //     _sidebarData.isOpen = false;
    //     setSidebarData({ ...sidebarData });
    //     setSidebarData(_sidebarData);
    // };

    const resetSettingsData = () => {
        // setSettingsData(initialSettingsData);
        // setTheme(defaultTheme);
        // setThemeType(defaultThemeType);
    };

    const [keyError, setKeyError] = useState(false);

    const resetComputationData = () => {
        setComputationData(initialComputationData);
    };

    const [displayData, setDisplayData] = useState(linesData);

    useEffect(() => {
        // console.log(
        //     "useEffect preProcessComputationData computationData.nextChar",
        //     computationData.nextChar
        // );
        if (isInitialMount.current) {
            isInitialMount.current = false;
        } else {
            if (computationData.nextChar) {
                preProcessComputationData();
            }
        }
    }, [computationData.nextChar]);

    // linesData calculationValue
    useEffect(() => {
        // console.log("linesData calculationValue", { linesData });
        if (isInitialMount.current) {
            isInitialMount.current = false;
        } else {
            setLinesData({
                ...linesData,
                calculation: {
                    value: computationData.calculationValue,
                    className: computationData.calculationClassName,
                },
            });
        }
    }, [
        computationData.calculationValue,
        computationData.calculationClassName,
    ]);

    // linesData resultValue
    useEffect(() => {
        // console.log("linesData resultValue", { linesData });
        if (isInitialMount.current) {
            isInitialMount.current = false;
        } else {
            setLinesData({
                ...linesData,
                result: {
                    value: computationData.resultValue
                        ? computationData.resultValue
                        : 0,
                    className: computationData.resultClassName,
                },
            });
        }
    }, [computationData.resultValue]);

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

    // key press event listeners
    useEffect(() => {
        window.addEventListener("keydown", handleKeyPress);
        return () => {
            window.removeEventListener("keydown", handleKeyPress);
        };
    });

    ////////////////////////////////////////////////////////////

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

    const resetAll = () => {
        resetErrorState();
        resetKeyData();
        resetComputationData();
        // resetSettingsData();
    };

    const handleUserInput = () => {
        let { userInput } = { ...computationData } || "";
        const { key } = { ...keyData } || undefined;
        console.log(key);
        if (key === "a") {
            resetAll();
            return;
        }
        // if maths error then prevent all input except esc for ac
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
            setComputationData({
                ...computationData,
                nextChar: key,
            });
        }

        if (computationData.computed && (key === "m" || key === "=")) {
            return;
        }

        if (userInput) {
            userInput += key;
        } else {
            userInput = key;
        }
        const _processedUserInput = processUserInput(userInput);
        if (_processedUserInput === "ac") {
            resetAll();
            return;
        }
        setComputationData({
            ...computationData,
            userInput: _processedUserInput,
        });
    };

    const tryMath = () => {
        console.log("tryMath", { computationData });
        const _resultData = doMath(computationData.userInput);
        setComputationData({ ...computationData, ..._resultData });
    };

    const makeCalculationData = () => {
        // console.log("makeCalculationData", { computationData });

        const {
            userInput,
            resultValue,
            computed,
            num1,
            op1,
            num2,
            op2,
            error,
            nextChar,
        } = { ...computationData };
        let calculationValue =
            num1 && op1 && num2 ? "" + num1 + op1 + num2 : userInput;

        calculationValue = /[x\/sry]/.test(calculationValue)
            ? unicodify(calculationValue)
            : calculationValue;

        setComputationData({
            ...computationData,
            calculationValue: calculationValue,
        });
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

    return (
        <Container
            className={`container 
            ${themeType} ${theme.toLowerCase()} ${pictureType}`}
            sx={{ padding: "0!important" }}
        >
            {/* ------------ app ---------------- */}
            <p className="settings-icon" onClick={toggleSettings} disabled>
                <i className="cog" aria-hidden="true"></i>
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
                <Display content={displayData} />
                {/* ------------ main keyboards ---------------- */}
                <Grid
                    container
                    className="main-keyboards"
                    meta-name="main keyboards"
                >
                    {makeKeyboard("number")}
                    {makeKeyboard("function")}
                </Grid>
            </Grid>
            {/* ------------ sidebar ---------------- */}
            {/* {makeSidebar(sidebarData)} */}
        </Container>
    );
};

export default Calculator;
