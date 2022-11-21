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

    const handleClick = useCallback((e) => {
        e.target.blur();
        const _keyData = {};
        const keyClicked = numberKeys.concat(functionKeys).filter((k) => {
            return k.id.toString() === e.target.id;
        });
        let key = keyClicked[0].value ? keyClicked[0].value : "";
        _keyData.key = key;
        _keyData.timeStamp = e.timeStamp;
        setInputData(_keyData);
    }, []);

    const onSelectThemeType = useCallback((e) => {
        e.stopPropagation();
        let cookieData = {};
        let _themeTypeData = {};
        _themeTypeData.currentSetting = e.target.id;
        cookieData.cookieLabel = "currentThemeType";
        cookieData.cookieValue = _themeTypeData.currentSetting;
        cookieData.cookiePath = "/";
        setThemeType(_themeTypeData.currentSetting);
    }, []);

    const onSelectTheme = useCallback((e) => {
        e.stopPropagation();
        let cookieData = {};
        let _themesData = {};
        _themesData.currentSetting = e.target.id;
        cookieData.cookieLabel = "currentTheme";
        cookieData.cookieValue = _themesData.currentSetting;
        cookieData.cookiePath = "/";
        setTheme(_themesData.currentSetting);
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
        let _pictureType = {};
        _pictureType = e.target.id;
        cookieData.cookieLabel = "currentPictureType";
        cookieData.cookieValue = _pictureType;
        cookieData.cookiePath = "/";
        setPictureType(_pictureType);
        // setCookie(cookieData);
    }, []);

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

    const classNames = {
        calculation: {
            default: "calculation",
            error: "calculation-error",
        },
        result: {
            default: "result",
            error: "result-error",
        },
    };

    const initialCalculationData = {
        className: classNames.calculation.default,
        value: "",
    };

    const [calculationData, setCalculationData] = useState({
        ...initialCalculationData,
    });

    const resetCalculationData = () => {
        // console.log("resetCalculationData");
        setCalculationData(initialCalculationData);
    };

    const toggleSidebar = (e) => {
        e.preventDefault();
        e.stopPropagation();
        let _sidebarData = { ...sidebarData };
        if (!errorState) {
            // disable when in error
            _sidebarData.isOpen = !_sidebarData.isOpen;
            setSidebarData(_sidebarData);
        }
    };

    const closeSidebar = (e) => {
        e.preventDefault();
        e.stopPropagation();
        let _sidebarData = { ...sidebarData };
        _sidebarData.isOpen = false;
        setSidebarData({ ...sidebarData });
        setSidebarData(_sidebarData);
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
        previousInput: undefined,
        calculationValue: undefined,
        resultValue: 0,
        computed: undefined,
        num1: undefined,
        op1: undefined,
        num2: undefined,
        op2: undefined,
        error: false,
        calculationClassName: "calculation",
        resultClassName: "result",
        nextChar: undefined,
    };

    const setClassName = (key) => {
        if (errorState) {
            return classNames[key].default + " " + classNames[key].error;
        } else {
            return classNames[key].default;
        }
    };

    const getLineData = (key) => {
        let _lineData = {};
        const _suffix = "ClassName";
        const _suffix2 = "Value";
        _lineData.className = computationData[key + _suffix];
        _lineData.value = computationData[key + _suffix2];
        return _lineData;
    };

    const setResultData = (data) => {
        setComputationData({
            rawInput: data.rawInput,
            previousInput: data.rawInput,
            calculationValue: data.calculationValue,
            resultValue: data.resultValue,
            computed: data.computed,
            num1: data.num1,
            op1: data.op1,
            num2: data.num2,
            op2: data.op2,
            error: data.error,
            // calculationClassName: setClassName("calculation"),
            // resultClassName: setClassName("result"),
            nextChar: data.nextChar,
        });
    };

    const [computationData, setComputationData] = useState({
        ...initialComputationData,
    });

    const resetComputationData = () => {
        setComputationData(initialComputationData);
    };

    const makeCalculationData = () => {
        console.log("makeCalculationData");

        let _computationData = { ...computationData };
        let calculationValue,
            { rawInput, op2 } = _computationData;

        calculationValue = /[x\/sry]/.test(rawInput)
            ? unicodify(rawInput)
            : rawInput;

        if (op2) {
            calculationValue = calculationValue.replace(/.$/, "");
        }

        setComputationData({
            ...computationData,
            calculationValue: calculationValue,
        });
    };

    const resetAll = () => {
        setErrorState(resetErrorState);
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
    }, [computationData.rawInput, computationData.resultValue]);

    const resetErrorState = false;

    const [errorState, setErrorState] = useState();

    const lineData = [
        {
            className: computationData.calculationClassName,
            value: computationData.calculationValue,
        },
        {
            className: computationData.resultClassName,
            value: computationData.resultValue,
        },
    ];

    //  errorState
    useEffect(() => {
        let _errorState;
        if (computationData.error) {
            _errorState = true;
        } else {
            _errorState = false;
        }
        setErrorState(_errorState);
    }, [computationData.error]);

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
            if (computationData.nextChar !== undefined) {
                preProcessComputationData();
            }
        }
    }, [computationData.nextChar]);

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
                <Keyboard props={data} errorState={errorState} />
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
            _keyboardData = {};

        data.keyboardNames.map((keyboardName) => {
            let _keyboardName = () => {
                keyboards.find((kb) => {
                    return kb.name === keyboardName;
                });
            };
            _keyboards.push(makeKeyboard(keyboardName));
            _keyboardData.keyboards = _keyboards;
        });

        data.keyboards = _keyboards;
        return <Sidebar sidebarData={data} />;
    };

    const makeDisplay = (data) => {
        console.log("makeDisplay", data);
        return <Display lines={data} />;
    };

    const handleKeyPress = useCallback((e) => {
        const _keyData = {};
        // prevent these keys firing
        // ctrl key 17, shift key 16 alt key 18
        // mac key codes added 91-left cmd, 93-right cmd, 37-40 arrow keys
        const { key, shiftKey, ctrlKey, metaKey, keyCode, repeat, timeStamp } =
            e;
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
    }, []);

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
        if (_computationData.computed) {
            _computationData.nextChar = key;
        } else {
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
        }
        setComputationData(_computationData);
    };

    const preProcessComputationData = () => {
        console.log("preProcessComputationData hit", computationData);
        let _computationData = { ...computationData };

        let {
            rawInput,
            previousInput,
            calculationValue,
            // resultValue,
            computed,
            num1,
            op1,
            num2,
            op2,
            error,
            nextChar,
        } = _computationData;
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
            // "resultValue",
            // resultValue,
            "rawInput",
            rawInput,
            "nextChar",
            nextChar,
            "computationData.rawInput",
            computationData.rawInput
        );
        // setComputationData({ ...computationData, rawInput: undefined });
        if (!op2) {
            // unary maths
            if (/\d/.test(nextChar)) {
                // number pressed
                // does not intend to continue maths
                // reset
                console.log(
                    " // unary maths | number pressed does not intend to | NOT continue"
                );
            } else {
                console.log(" // unary maths | operator pressed | DO continue");
                // _computationData.computed = false;
                setResultData(_computationData);
                // resetCalculationData();
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
                } else {
                    //
                    console.log(
                        " // binary maths | NUMBER | TRIGGER -> op | DO continue"
                    );
                    // _computationData.computed = false;
                    setResultData(_computationData);
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
                    // _computationData.computed = false;
                    setResultData(_computationData);
                    // resetCalculationData();
                } else {
                    //  + - / x + - / x
                    console.log(" // binary maths | OPERATOR");
                    console.log(
                        " // binary maths | OPERATOR | TRIGGER -> + - / x   | DO continue",
                        _computationData
                    );
                    // CONTINUING
                    // _computationData.computed = false;
                    setResultData(_computationData);
                    // resetCalculationData();
                }
            }
        }
    };

    const tryMath = () => {
        console.log("tryMath");
        let _resultData,
            _computationData = computationData;

        let { rawInput, computed } = _computationData || undefined;
        if (!computed && rawInput) {
            _resultData = doMath(rawInput);
            console.log(
                "we have returned from doing maths",
                "_resultData",
                _resultData
            );
            setResultData(_resultData);
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
                {/* <Display lines={lineData} /> */}
                {makeDisplay(lineData)}
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
