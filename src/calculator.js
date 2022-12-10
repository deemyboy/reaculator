import React, { useState, useEffect, useRef, useCallback } from "react";
import Line from "./components/line";
import Display from "./components/display";
import Keyboard from "./components/keyboard";
import Canvas from "./components/canvas";
import Sidebar from "./components/sidebar";
import Settings from "./components/settings";
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
import { processRawInput } from "./js/process_input.mjs";
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
        const _keyData = {};
        const keyClicked = numberKeys.concat(functionKeys).filter((k) => {
            return k.id.toString() === e.target.id;
        });
        let key = keyClicked[0].value ? keyClicked[0].value : "";
        _keyData.key = key;
        _keyData.timeStamp = e.timeStamp;
        setInputData(_keyData);
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

    const initialErrorState = false;

    const [errorState, setErrorState] = useState(initialErrorState);

    const resetErrorState = () => {
        setErrorState(initialErrorState);
    };

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
            // Escape key hack
            if (key === "Escape") {
                _keyData.key = "a";
            }
            _keyData.timeStamp = timeStamp;
            setInputData(_keyData);
        }
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

    const initialInputData = {
        key: undefined,
        timeStamp: undefined,
    };

    const [inputData, setInputData] = useState({ ...initialInputData });

    const isInitialMount = useRef(true);

    const resetInputData = () => {
        // console.log("resetInputData");
        setInputData(initialInputData);
    };

    // handleUserInput
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
        } else {
            handleUserInput();
        }
    }, [inputData]);

    const defaultTheme = "Ocean";
    const defaultThemeType = "color";

    const [theme, setTheme] = useState(defaultTheme);

    const [themeType, setThemeType] = useState(defaultThemeType);

    // setSidebarData - visibleKeyboards
    // useEffect(() => {
    //     let _visibleKeyboards = getVisibleSidebarKeyboards();
    //     sidebarData.keyboardNames = _visibleKeyboards;
    //     setSidebarData({ ...sidebarData });
    // }, [themeType]);

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

    // const [sidebarData, setSidebarData] = useState(initialSidebarData);
    const [settingsData, setSettingsData] = useState(initialSettingsData, []);

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
    }, [settingsData.isOpen, settingsData.keyboardData]);

    useEffect(() => {
        // let _visibleKeyboards = getVisibleSidebarKeyboards();
        // keyboardNames = _visibleKeyboards;
        const _keyboardData = getVisibleKeyboardData();
        // console.log(settingsData);
        setSettingsData({
            ...settingsData,
            keyboardData: _keyboardData,
        });
        // console.log(settingsData);
    }, [themeType]);

    const [animation, setAnimation] = useState("fireworks");

    const [pictureType, setPictureType] = useState("still");

    const initialCalculationData = {
        previous: undefined,
        value: undefined,
        className: "calculation",
    };

    const [calculationData, setCalculationData] = useState({
        ...initialCalculationData,
    });

    const initialResultData = {
        value: 0,
        computed: false,
        num1: undefined,
        op1: undefined,
        num2: undefined,
        op2: undefined,
        error: false,
        className: "result",
    };

    const [resultData, setResultData] = useState({
        ...initialResultData,
    });

    const linesData = [
        {
            className: calculationData.className,
            value: calculationData.value,
        },
        {
            className: resultData.className,
            value: resultData.value,
        },
    ];
    // const [linesData, setLinesData] = useState(defaultLinesData);

    const defaultDisplayData = linesData;

    const [displayData, setDisplayData] = useState({
        linesData: defaultDisplayData,
    });

    const resetCalculationData = () => {
        // console.log("resetCalculationData");
        setCalculationData(initialCalculationData);
    };

    const resetResultData = () => {
        // console.log("resetResultData");
        setResultData(initialResultData);
    };

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

    const initialComputationData = {
        rawInput: undefined,
        resultValue: undefined,
        computed: undefined,
        num1: undefined,
        op1: undefined,
        num2: undefined,
        op2: undefined,
        error: false,
        nextChar: undefined,
    };

    const processResult = (data) => {
        console.log("processResult");
        setComputationData({
            rawInput: data.rawInput,
            previousInput: data.rawInput,
            calculationValue: calculationData.value,
            resultValue: resultData.value,
            computed: data.computed,
            num1: data.num1,
            op1: data.op1,
            num2: data.num2,
            op2: data.op2,
            error: data.error,
            // calculationClassName: setClassNames("calculation"),
            // resultClassName: setClassNames("result"),
            nextChar: data.nextChar,
        });
    };

    const [computationData, setComputationData] = useState({
        ...initialComputationData,
    });

    const resetComputationData = () => {
        setComputationData(initialComputationData);
    };

    // makeCalculationData or tryMath
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
        } else {
            if (
                CONSTANTS.patternStack.UNNARY_MATH_CATCHER.test(
                    computationData.rawInput
                )
            ) {
                console.log("useEffect makeCalculationData", {
                    computationData,
                });
                makeCalculationData();
            } else {
                // console.log("useEffect tryMath", { computationData });
                tryMath();
                // makeCalculationData();
            }
            makeCalculationData();
        }
    }, [
        computationData.rawInput,
        computationData.computed,
        settingsData.isOpen,
    ]);

    const setClassNames = () => {
        // console.log("setClassNames", errorState);
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

        let calculationClassName, resultClassName;

        if (errorState) {
            calculationClassName =
                classNames.calculation.default +
                " " +
                classNames.calculation.error;
            resultClassName =
                classNames.result.default + " " + classNames.result.error;
        } else {
            calculationClassName = classNames.calculation.default;
            resultClassName = classNames.result.default;
        }
        setCalculationData({
            ...calculationData,
            className: calculationClassName,
        });
        setResultData({
            ...resultData,
            className: resultClassName,
        });
    };

    // setClassNames
    useEffect(() => {
        // console.log("useEffect setClassNames", errorState);
        setClassNames();
    }, [errorState]);

    //  errorState
    useEffect(() => {
        if (resultData.error) {
            setErrorState(true);
        } else {
            setErrorState(false);
        }
    }, [resultData.error]);

    useEffect(() => {
        // console.log(
        //     "useEffect processComputationDataPostResult resultData.computed",
        //     resultData.computed
        // );
        if (isInitialMount.current) {
            isInitialMount.current = false;
        } else {
            if (resultData.computed) {
                processComputationDataPostResult();
            }
        }
    }, [resultData.computed]);

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
        resetInputData();
        resetCalculationData();
        resetResultData();
        resetComputationData();
        // resetSettingsData();
    };

    const makeCalculationData = () => {
        // console.log("makeCalculationData", { computationData, settingsData });

        let { rawInput, value } = computationData;

        // if (settingsData.isOpen) {
        //     value = makeSettings(themeType);
        // } else {
        value = /[x\/sry]/.test(rawInput) ? unicodify(rawInput) : rawInput;
        // }

        setCalculationData({
            ...calculationData,
            value: value,
        });
    };

    const makeDisplay = (data) => {
        // console.log("makeDisplay", data);
        return <Display content={data} />;
    };

    const handleUserInput = () => {
        // console.log("handleUserInput", { computationData });
        let _rawInput =
                computationData.rawInput !== undefined
                    ? computationData.rawInput
                    : "",
            _nextChar;
        const { key } = inputData;
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
            _nextChar = key;
        }

        if (computationData.computed && (key === "m" || key === "=")) {
            return;
        }

        if (_rawInput) {
            _rawInput += key;
        } else {
            _rawInput = key;
        }
        _rawInput = processRawInput(_rawInput);
        // processedInput = processRawInput(_rawInput);
        // console.log({ computationData, computationData });
        // console.log({ computationData }, _rawInput);
        if (_rawInput === "clear all") {
            resetAll();
            return;
        }
        setComputationData({
            ...computationData,
            nextChar: _nextChar,
            rawInput: _rawInput,
        });
    };

    const processComputationDataPostResult = () => {
        // console.log("processComputationDataPostResult", {
        //     resultData,
        //     computationData,
        // });
        let _resultData = { ...resultData },
            _computationData = { ...computationData };
        let { rawInput, nextChar } = _computationData;
        let {
            previousInput,
            calculationValue,
            computed,
            num1,
            op1,
            num2,
            op2,
            error,
            value,
        } = _resultData;

        // setComputationData({ ...computationData, rawInput: undefined });
        if (nextChar) {
            return;
        }
        if (op2) {
            // binary maths
            // console.log(" // binary maths");
            // EQUALS
            if (op2 === "=") {
                // console.log(" // binary maths | EQUALS | TRIGGER -> = ");
                setResultData({ ...resultData, computed: false });
                setComputationData({
                    ...computationData,
                    computed: true,
                    operationType: "=",
                    rawInput: rawInput.replace(/.$/, ""),
                });
                return;
            }
            // computed = false;
            // x/-+
            // console.log(" // binary maths | TRIGGER -> ", op2);
            setResultData({ ...resultData, computed: false });
            setComputationData({
                ...computationData,
                computed: true,
                operationType: "binary",
                rawInput: resultData.value + op2,
            });

            return;
        }
        // console.log(" // binary maths | NUMBER");
        // unary maths

        // console.log(" // unary maths", op1);
        setComputationData({
            ...computationData,
            computed: true,
            operationType: "unary",
            rawInput: num1 + op1,
        });

        return;

        return;
    };

    const preProcessComputationData = () => {
        // console.log("preProcessComputationData", computationData, resultData);
        let { rawInput, nextChar, operationType } = computationData;

        if (operationType === "unary") {
            // console.log("operationType : unary");
            // NUMBER
            if (/\d/.test(nextChar)) {
                //
                // console.log("NUMBER pressed after unary ", resultData.op1);
                setResultData({ ...resultData, computed: false, value: 0 });
                setComputationData({
                    ...computationData,
                    computed: false,
                    rawInput: nextChar,
                    nextChar: undefined,
                    operationType: undefined,
                });
                return;
            }
            //   OPERATOR
            else {
                // console.log(
                //     "OPERATOR pressed after unary ",
                //     resultData.op1,
                //     nextChar
                // );
                // //
                // console.log("unary op as nextChar");
                setResultData({ ...resultData, computed: false });
                setComputationData({
                    ...computationData,
                    computed: false,
                    rawInput: resultData.value + nextChar,
                    nextChar: undefined,
                    operationType: undefined,
                });
                return;
            }
        }
        if (operationType === "=") {
            // console.log("operationType : =");
            // NUMBER
            if (/\d/.test(nextChar)) {
                //
                // console.log("NUMBER pressed | = | add to rawInput");
                setResultData({ ...resultData, computed: false, value: 0 });
                setComputationData({
                    ...computationData,
                    computed: false,
                    rawInput: nextChar,
                    nextChar: undefined,
                    operationType: undefined,
                });
                return;
            }
            //   OPERATOR
            else {
                if (nextChar !== "m") {
                    // console.log(
                    //     "OPERATOR pressed | = | add to rawInput",
                    //     nextChar,
                    //     nextChar !== "m"
                    // );
                    //
                    setResultData({ ...resultData, computed: false });
                    setComputationData({
                        ...computationData,
                        computed: false,
                        rawInput: resultData.value + nextChar,
                        nextChar: undefined,
                        operationType: undefined,
                    });
                    return;
                }
            }
        }
        if (operationType === "binary") {
            // console.log("operationType : binary");
            // NUMBER
            if (/\d/.test(nextChar)) {
                //
                // console.log("NUMBER pressed | binary | add to rawInput");
                setResultData({ ...resultData, computed: false });
                setComputationData({
                    ...computationData,
                    computed: false,
                    // rawInput: rawInput + nextChar,
                    nextChar: undefined,
                    operationType: undefined,
                });
                return;
            }
            //   OPERATOR
            else {
                // nextChar = unary op
                if (CONSTANTS.patternStack.UNNARY_MATH_CATCHER.test(nextChar)) {
                    // console.log("unary op as nextChar");
                    setResultData({ ...resultData, computed: false });
                    setComputationData({
                        ...computationData,
                        computed: false,
                        rawInput: resultData.value + nextChar,
                        nextChar: undefined,
                        operationType: undefined,
                    });
                    return;
                }
                // nextChar = binary op
                else {
                    // console.log(
                    //     " binary OPERATOR pressed | replace it",
                    //     nextChar
                    // );
                    setResultData({ ...resultData, computed: false });
                    setComputationData({
                        ...computationData,
                        computed: false,
                        rawInput: rawInput.replace(/.$/, nextChar),
                        nextChar: undefined,
                        operationType: undefined,
                    });
                    return;
                }
            }
        }
    };

    const tryMath = () => {
        // console.log("tryMath");
        let _resultData,
            _computationData = { ...computationData };

        let { rawInput, computed } = _computationData || undefined;
        if (!computed && rawInput) {
            _resultData = doMath(rawInput);
            // console.log(
            //     "we have returned from doing maths",
            //     "_resultData",
            //     _resultData
            // );
            setResultData({
                ..._resultData,
                className: resultData.className,
            });
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
            className={`container 
            ${themeType} ${theme.toLowerCase()} ${pictureType}`}
            // ${
            // sidebarData.isOpen === true ? "open" : ""
            // }
            sx={{ p: "0!important" }}
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
                {makeDisplay(displayData)}
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
