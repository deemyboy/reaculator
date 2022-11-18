import React, { useState, useEffect, useRef, useCallback } from "react";
import Display from "./components/display";
import Keyboard from "./components/keyboard";
import Canvas from "./components/canvas";
import Sidebar from "./components/sidebar";
import Cookies from "universal-cookie";
import {
    numberKeys,
    functionKeys,
    ALLOWED_KEYS,
    DISALLOWED_KEYS,
} from "./js/keys";
import { Container, Grid, Typography } from "@mui/material";
import * as CONSTANTS from "./js/constants";
import { doMath, unicodify, deunicodify } from "./js/maths_engine.mjs";
import { processRawInput } from "./js/process_input.mjs";
import "./styles/main.scss";
import keyboards from "./js/keyboards";

const cookie = new Cookies();

import {
    HandleClickContextProvider,
    DisplayContextProvider,
} from "./js/context";

const Calculator = () => {
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
        const keyClicked = numberKeys.concat(functionKeys).filter((k) => {
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

    // handleUserInput
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
        } else {
            handleUserInput();
        }
    }, [inputData]);

    const [theme, setTheme] = useState("Ocean");

    const [themeType, setThemeType] = useState("color");

    // setSidebarData - visibleKeyboards
    useEffect(() => {
        let _visibleKeyboards = getVisibleSidebarKeyboards();
        sidebarData.keyboardNames = _visibleKeyboards;
        setSidebarData({ ...sidebarData });
    }, [themeType]);

    const [animation, setAnimation] = useState("fireworks");

    const [pictureType, setPictureType] = useState("still");

    const getClassNames = (componentData) => {
        if (appState === "error") {
            componentData.className =
                classNames[componentData.name].defaultClassName +
                " " +
                classNames[componentData.name].errorClassName;
        } else {
            componentData.className =
                classNames[componentData.name].defaultClassName;
        }
        return componentData;
    };

    const classNames = {
        calculation: {
            defaultClassName: "calculation",
            errorClassName: "calculation-error",
        },
        result: {
            defaultClassName: "result",
            errorClassName: "result-error",
        },
    };

    const initialCalculationData = {
        name: classNames.calculation.defaultClassName,
        className: classNames.calculation.defaultClassName,
        value: "",
    };

    const [calculationData, setCalculationData] = useState({
        ...initialCalculationData,
    });

    const resetCalculationData = () => {
        // console.log("resetCalculationData");
        setCalculationData(initialCalculationData);
    };

    const makeCalculationData = () => {
        console.log("makeCalculationData");

        let _calculationData = { ...calculationData };
        let _rawInput;
        _rawInput =
            computationData.rawInput !== undefined
                ? computationData.rawInput
                : undefined;

        // convert symbols to unicode if present
        if (appState !== "error") {
            _calculationData.value = /[x\/sry]/.test(_rawInput)
                ? unicodify(_rawInput).replace(
                      CONSTANTS.LAST_OPERATOR_CATCHER,
                      ""
                  )
                : _rawInput.replace(CONSTANTS.LAST_OPERATOR_CATCHER, "");
        } else {
            _calculationData.value = resultData.rawInput.replace(
                CONSTANTS.LAST_OPERATOR_CATCHER,
                ""
            );
        }
        setCalculationData(_calculationData);
    };

    const initialResultData = {
        name: classNames.result.defaultClassName,
        className: classNames.result.defaultClassName,
        value: 0,
        computed: undefined,
        num1: undefined,
        op1: undefined,
        num2: undefined,
        op2: undefined,
    };

    const [resultData, setResultData] = useState({
        ...initialResultData,
    });

    const resetResultData = () => {
        setResultData(initialResultData);
    };

    const handleResult = () => {
        let _resultData = { ...resultData };
        let { value, computed, num1, op1, num2, op2 } = _resultData;
        if (!op2) {
            // unary math
        } else {
            // binary math
        }
    };

    const toggleSidebar = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (appState !== "error") {
            // disable when in error
            sidebarData.isOpen = !sidebarData.isOpen;
            setSidebarData({ ...sidebarData });
        }
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

    const [keyError, setKeyError] = useState(false);

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

    const resetComputationData = () => {
        setComputationData(initialComputationData);
    };

    const resetAll = () => {
        setAppState(resetAppState);
        resetResultData();
        resetCalculationData();
        resetComputationData();
    };

    // makeCalculationData
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
        } else if (computationData.rawInput !== undefined) {
            makeCalculationData();
        }
    }, [computationData.rawInput]);

    const resetAppState = "default";

    const [appState, setAppState] = useState();

    const lines = [getClassNames(calculationData), getClassNames(resultData)];

    //  appState
    useEffect(() => {
        let _appState;
        if (resultData.error) {
            _appState = "error";
        } else {
            _appState = "default";
        }
        setAppState(_appState);
    }, [resultData.error]);

    // tryMath
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
        } else {
            if (
                CONSTANTS.patternStack.MATH_CATCHER.test(
                    computationData.rawInput
                )
            ) {
                tryMath();
            }
        }
    }, [computationData.rawInput]);

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
        } else {
            if (resultData.computed === true) {
                processResultData();
            }
        }
    }, [resultData.computed]);

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

    // key press event listeners
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
                <Keyboard props={data} appState={appState} />
            </HandleClickContextProvider>
        );
    };

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
                var _key = numberKeys.concat(functionKeys).filter((k) => {
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
        // console.log("handleUserInput");
        let _computationData = { ...computationData },
            rawInput;

        rawInput =
            _computationData.rawInput !== undefined
                ? _computationData.rawInput
                : "";
        const { key } = inputData;
        // if maths error then prevent all input except esc for ac
        if (keyError && key !== "a") {
            return;
        }
        if (rawInput) {
            rawInput += key;
        } else {
            rawInput = key;
        }
        _computationData.rawInput = processRawInput(rawInput);
        if (_computationData.rawInput === "a") {
            resetAll();
            return;
        }
        setComputationData(_computationData);
    };

    const processResultData = () => {
        let _resultData = { ...resultData };
        console.log("processResultData hit");
        let nextChar = computationData.rawInput.charAt(
            computationData.rawInput.length - 1
        );

        let { computed, op1, num1, num2, op2, value, rawInput } = _resultData;
        console.log(
            "computed",
            computed,
            "op1",
            op1,
            "num1",
            num1,
            "num2",
            num2,
            "op2:",
            op2,
            "!op2",
            !op2,
            "value",
            value,
            "rawInput",
            rawInput,
            "nextChar",
            nextChar,
            "computationData.rawInput",
            computationData.rawInput
        );
        setComputationData({ ...computationData, rawInput: undefined });
        if (!op2) {
            // unary maths
            if (/\d/.test(nextChar)) {
                // number pressed
                // does not intend to continue maths
                // reset
                console.log(
                    " // unary maths | number pressed does not intend to | NOT continue"
                );
                resetResultData();
            } else {
                console.log(" // unary maths | operator pressed | DO continue");
                _resultData.computed = false;
                setResultData({ ..._resultData });
                resetCalculationData();
            }
        } else {
            // binary maths
            if (/\d/.test(nextChar)) {
                // NUMBER
                console.log(" // binary maths | NUMBER");
                if (op2 === "=") {
                    console.log(
                        " // binary maths | NUMBER | TRIGGER -> = | NOT continue"
                    );
                    // non continuing
                    resetResultData();
                } else {
                    //
                    console.log(
                        " // binary maths | NUMBER | TRIGGER -> op | DO continue"
                    );
                    _resultData.computed = false;
                    setResultData({ ..._resultData });
                    // resetCalculationData();
                }
            } else {
                // OPERATOR
                console.log(" // binary maths | OPERATOR");
                console.log(" // binary maths | op pressed check previous op");
                if (op2 === "=") {
                    // = = = = = =
                    console.log(
                        " // binary maths | OPERATOR | TRIGGER -> =   | DO continue"
                    );
                    // CONTINUING
                    _resultData.computed = false;
                    setResultData({ ..._resultData });
                    resetCalculationData();
                } else {
                    //  + - / x + - / x
                    console.log(" // binary maths | OPERATOR");
                    console.log(
                        " // binary maths | OPERATOR | TRIGGER -> + - / x   | DO continue"
                    );
                    // CONTINUING
                    _resultData.computed = false;
                    setResultData({ ..._resultData });
                    resetCalculationData();
                }
            }
        }
    };

    const tryMath = () => {
        console.log("tryMath");
        let _rawInput, _resultData;
        _rawInput = computationData.rawInput || undefined;
        if (!resultData.computed && _rawInput) {
            _resultData = doMath(_rawInput);
            console.log(
                "we have returned from doing maths",
                "_resultData",
                _resultData
            );
            setResultData({
                ...resultData,
                ..._resultData,
                rawInput: _rawInput,
            });
            setComputationData({
                ...computationData,
                resultValue: _resultData.value,
                computed: _resultData.computed,
                num1: _resultData.num1,
                op1: _resultData.op1,
                num2: _resultData.num2,
                op2: _resultData.op2,
            });
        }
        // else {
        //     setResultData({
        //         ...resultData,
        //         computed: false,
        //     });
        // }
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
            className={`container ${
                sidebarData.isOpen === true ? "open" : ""
            } ${themeType} ${theme.toLowerCase()} ${pictureType}`}
            sx={{ p: "0!important" }}
        >
            {/* ------------ app ---------------- */}
            <p className="settings" onClick={toggleSidebar} disabled>
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
                {/* ------------ canvas ---------------- */}
                <Canvas ref={canvasRef} id={CONSTANTS.CANVAS_CONTAINER_ID} />
                <Typography className="title">
                    {CONSTANTS.APPLICATION_TITLE}
                </Typography>
                {/* ------------ display ---------------- */}
                <DisplayContextProvider value={lines}>
                    <Display />
                </DisplayContextProvider>
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
            {makeSidebar(sidebarData)}
        </Container>
    );
};

export default Calculator;
