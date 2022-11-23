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
        previous: undefined,
        value: undefined,
        className: classNames.calculation.default,
    };

    const [calculationData, setCalculationData] = useState({
        ...initialCalculationData,
    });

    const resetCalculationData = () => {
        // console.log("resetCalculationData");
        setCalculationData(initialCalculationData);
    };

    const resetResultData = () => {
        // console.log("resetResultData");
        setResultData(initialResultData);
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

    const getVisibleSidebarKeyboards = (level) => {
        const defaultSidebarKeyboardNames = ["theme-type", "theme"];
        if (level === "default") {
            return defaultSidebarKeyboardNames;
        }
        let sidebarVisibleKeyboardNames = defaultSidebarKeyboardNames;

        if (themeType !== "color") {
            sidebarVisibleKeyboardNames.push(
                themeType === "animation" ? "animation" : "picture-type"
            );
        }
        return sidebarVisibleKeyboardNames;
    };
    const initialSidebarData = {
        keyboardNames: getVisibleSidebarKeyboards("default"),
        isOpen: false,
        selected: "",
    };

    const [sidebarData, setSidebarData] = useState(initialSidebarData);

    const resetSidebarData = () => {
        setSidebarData(initialSidebarData);
        setTheme(defaultTheme);
        setThemeType(defaultThemeType);
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

    const initialResultData = {
        value: 0,
        computed: false,
        num1: undefined,
        op1: undefined,
        num2: undefined,
        op2: undefined,
        error: false,
        className: classNames.result.default,
    };

    const [resultData, setResultData] = useState({
        ...initialResultData,
    });

    const setClassName = (key) => {
        if (errorState) {
            return classNames[key].default + " " + classNames[key].error;
        } else {
            return classNames[key].default;
        }
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

    // makeCalculationData or tryMath
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
        } else {
            // if (
            //     (CONSTANTS.patternStack.UNNARY_MATH_CATCHER.test(
            //         computationData.rawInput
            //     ) &&
            //         computationData.computed) ||
            //     (computationData.rawInput !== undefined &&
            //         !CONSTANTS.patternStack.MATH_CATCHER.test(
            //             computationData.rawInput
            //         ))
            // )

            if (
                (CONSTANTS.patternStack.UNNARY_MATH_CATCHER.test(
                    computationData.rawInput
                ) &&
                    computationData.computed) ||
                (computationData.rawInput !== undefined &&
                    !CONSTANTS.patternStack.MATH_CATCHER.test(
                        computationData.rawInput
                    ))
            ) {
                console.log("useEffect 277 makeCalculationData", {
                    computationData,
                });
                makeCalculationData();
            } else {
                console.log("useEffect 280 tryMath", { computationData });
                tryMath();
                // makeCalculationData();
            }
        }
    }, [computationData.rawInput, computationData.computed]);

    const initialErrorState = false;

    const [errorState, setErrorState] = useState(initialErrorState);

    const resetErrorState = () => {
        setErrorState(initialErrorState);
    };

    const lineData = [
        {
            className: calculationData.className,
            value: calculationData.value,
        },
        {
            className: resultData.className,
            value: resultData.value,
        },
    ];

    //  errorState
    useEffect(() => {
        if (computationData.error) {
            setErrorState(true);
        } else {
            setErrorState(false);
        }
    }, [computationData.error]);

    // tryMath
    // useEffect(() => {
    //     if (isInitialMount.current) {
    //         isInitialMount.current = false;
    //     } else {
    //         if (
    //             CONSTANTS.patternStack.MATH_CATCHER.test(
    //                 computationData.rawInput
    //             )
    //         ) {
    //             console.log("useEffect 319 tryMath");
    //             tryMath();
    //         }
    //     }
    // }, [computationData.rawInput]);

    useEffect(() => {
        console.log(
            "useEffect processComputationDataPostResult resultData.computed",
            resultData.computed
        );
        if (isInitialMount.current) {
            isInitialMount.current = false;
        } else {
            if (resultData.computed) {
                processComputationDataPostResult();
            }
            // else {
            //     makeCalculationData();
            // }
        }
    }, [resultData.computed]);

    useEffect(() => {
        console.log(
            "useEffect preProcessComputationData computationData.nextChar",
            computationData.nextChar
        );
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
        [sidebarData, animation];

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
        resetSidebarData();
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

    const makeCalculationData = () => {
        console.log("makeCalculationData", { computationData });

        let { rawInput, value } = computationData;

        value = /[x\/sry]/.test(rawInput) ? unicodify(rawInput) : rawInput;

        setCalculationData({
            ...calculationData,
            value: value,
        });
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
        // console.log("makeDisplay", data);
        return <Display lines={data} />;
    };

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

    const handleUserInput = () => {
        // console.log("handleUserInput", { computationData });
        let _computationData = { ...computationData },
            rawInput;

        rawInput =
            _computationData.rawInput !== undefined
                ? _computationData.rawInput
                : "";
        const { key } = inputData;
        if (key === "a") {
            resetAll();
            return;
        }
        // if maths error then prevent all input except esc for ac
        if (keyError && key !== "a") {
            return;
        }
        if (_computationData.computed) {
            console.log("_computationData.computed", _computationData.computed);
            _computationData.nextChar = key;
            // let _resultData = { ...resultData };
            // _resultData.computed = false;
        } else {
            if (rawInput) {
                rawInput += key;
            } else {
                rawInput = key;
            }
            _computationData.rawInput = processRawInput(rawInput);
            // console.log({ computationData, _computationData });
        }
        setComputationData(_computationData);
    };

    const processComputationDataPostResult = () => {
        console.log("processComputationDataPostResult", {
            resultData,
            computationData,
        });
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
        console.log(
            "rawInput",
            rawInput,
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
            "nextChar",
            nextChar,
            "value",
            value,
            "resultData.rawInput",
            resultData.rawInput
        );
        // setComputationData({ ...computationData, rawInput: undefined });
        if (nextChar) {
            return;
        }
        if (op2) {
            // binary maths
            console.log(" // binary maths");
            // EQUALS
            if (op2 === "=") {
                console.log(" // binary maths | EQUALS | TRIGGER -> = ");
                // non continuing
                return;
            }
            // computed = false;
            // x/-+
            console.log(" // binary maths | TRIGGER -> ", op2);
            setResultData({ ...resultData, computed: false });
            setComputationData({
                ...computationData,
                computed: true,
                rawInput: resultData.value + op2,
            });

            return;
        }
        // console.log(" // binary maths | NUMBER");
        // unary maths

        console.log(" // unary maths", op1);
        // console.log(" // unary maths | NUMBER");
        // setResultData({ ...resultData, computed: false });
        setComputationData({
            ...computationData,
            computed: true,
            rawInput: +value / +num1 + op1,
        });

        return;
        // console.log(" // unary maths | operator pressed | DO continue");
        // _resultData.computed = false;
        // setResultData(_resultData);
        // resetCalculationData();
        return;
    };

    const preProcessComputationData = () => {
        console.log("preProcessComputationData", computationData);
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
        console.log(
            "rawInput",
            rawInput,
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
            "nextChar",
            nextChar,
            "value",
            value,
            "resultData.rawInput",
            resultData.rawInput
        );
        // setComputationData({ ...computationData, rawInput: undefined });
        // NUMBER
        if (/\d/.test(nextChar)) {
            // number pressed
            console.log("NUMBER pressed | add to rawInput");
            setResultData({ ...resultData, computed: false });
            setComputationData({
                ...computationData,
                computed: false,
                rawInput: rawInput + nextChar,
                nextChar: undefined,
            });
            return;
        }
        // OPERATOR
        else {
            console.log(" // OPERATOR pressed | replace it");
            setResultData({ ...resultData, computed: false });
            setComputationData({
                ...computationData,
                computed: false,
                rawInput: rawInput.replace(/.$/, nextChar),
                nextChar: undefined,
            });
            // _computationData.computed = false;
            return;
            setResultData(_computationData);
            // resetCalculationData();
        }
        // // binary maths
        // if (/\d/.test(nextChar)) {
        //     // NUMBER
        //     console.log(" // binary maths | NUMBER");
        //     if (op2 === "=") {
        //         console.log(
        //             " // binary maths | NUMBER | TRIGGER -> = | NOT continue"
        //         );
        //         // non continuing
        //     } else {
        //         //
        //         console.log(
        //             " // binary maths | NUMBER | TRIGGER -> op | DO continue"
        //         );
        //         // _computationData.computed = false;
        //         setResultData(_computationData);
        //         // resetCalculationData();
        //     }
        // }

        // else {
        //     // OPERATOR
        //     console.log(" // binary maths | OPERATOR");
        //     console.log(" // binary maths | op pressed check previous op");
        //     if (op2 === "=") {
        //         // = = = = = =
        //         console.log(
        //             " // binary maths | OPERATOR | TRIGGER -> =   | DO continue"
        //         );
        //         // CONTINUING
        //         // _computationData.computed = false;
        //         setResultData(_computationData);
        //         // resetCalculationData();
        //     } else {
        //         //  + - / x + - / x
        //         console.log(" // binary maths | OPERATOR");
        //         console.log(
        //             " // binary maths | OPERATOR | TRIGGER -> + - / x   | DO continue",
        //             _computationData
        //         );
        //         // CONTINUING
        //         // _computationData.computed = false;
        //         setResultData(_computationData);
        //         // resetCalculationData();
        //     }
        // }
    };

    const tryMath = () => {
        console.log("tryMath");
        let _resultData,
            _computationData = { ...computationData };

        let { rawInput, computed } = _computationData || undefined;
        if (!computed && rawInput) {
            _resultData = doMath(rawInput);
            console.log(
                "we have returned from doing maths",
                "_resultData",
                _resultData
            );
            setResultData({ ...resultData, ..._resultData });
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
                <Canvas id={CONSTANTS.CANVAS_CONTAINER_ID} />
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
