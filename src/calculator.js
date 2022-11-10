import React, { useState, useEffect, useRef } from "react";
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
} from "./js/keys";
import { Container, Grid, Typography } from "@mui/material";
import * as CONSTANTS from "./js/constants";
import {
    doMaths,
    convertFromUnicodeToChar,
    convertFromCharToUnicode,
} from "./js/maths_engine.mjs";
import processInput from "./js/process_input.mjs";
import "./styles/main.scss";
import keyboards from "./js/keyboards";

const cookie = new Cookies();

import {
    HandleClickContextProvider,
    OnSelectContextProvider,
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
        console.log(e);
        e.target.blur();
        const keyClicked = utilityKeys
            .concat(numberKeys, functionKeys)
            .filter((k) => {
                return k.id.toString() === e.target.id;
            });
        let _clickData = {
            key: keyClicked[0].value ? keyClicked[0].value : "",
            ctrlKey: false,
            shiftKey: false,
        };
        setClickData(_clickData);
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

    const [clickData, setClickData] = useState({
        key: undefined,
        ctrlKey: false,
        shiftKey: false,
    });

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

    const [resultData, setResultData] = useState({
        className: "default",
        value: undefined,
    });

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

    const [computationData, setComputationData] = useState({
        calculationValue: undefined,
        computed: undefined,
        nextChar: undefined,
        operationType: undefined,
        operator: undefined,
        rawUserInput: undefined,
        resultValue: undefined,
    });

    useEffect(() => {
        document.addEventListener("keydown", (e) => handleKeyPress(e));

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
        document.removeEventListener("keydown", (e) => handleKeyPress(e));
    }),
        [sidebarData, animation];

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

    const handleKeyPress = (e) => {
        // prevent these keys firing
        // ctrl key 17, shift key 16 alt key 18
        // mac key codes added 91-left cmd, 93-right cmd, 37-40 arrow keys
        if (
            !(e.keyCode === 17) &&
            !(e.keyCode === 16) &&
            !(e.keyCode === 18) &&
            !(e.keyCode === 91) &&
            !(e.keyCode === 93) &&
            !(e.keyCode === 37) &&
            !(e.keyCode === 38) &&
            !(e.keyCode === 39) &&
            !(e.keyCode === 40)
        ) {
            var _key = utilityKeys
                .concat(numberKeys, functionKeys)
                .filter((k) => {
                    return k.keycode === e.keyCode;
                })[0];
            if (_key) {
                var _button = document.getElementById(_key.id);
            }
        } else {
            return;
        }
        if (!e.repeat) {
            if (_button === null || _button === undefined) {
                return;
            } else if (_button !== null || _button !== undefined) {
                _button.focus(timeout);
                var timeout = setTimeout(() => _button.blur(), 200);
            }
            if (ALLOWED_KEYS.includes(e.keyCode)) {
                let keyData = {
                    key: e.key,
                    ctrlKey: e.ctrlKey,
                    metaKey: e.metaKey,
                    shiftKey: e.shiftKey,
                    keyCode: e.keyCode,
                };
                // quick hack to get enter key to do = function
                if (e.key === "Enter") {
                    keyData.key = "=";
                }

                // quick hack to get * key to do x function
                if (e.key === "*") {
                    keyData.key = "x";
                }

                // quick hack to get * key to do x function
                if (e.key === "Escape") {
                    keyData.key = "a";
                }
                if (e.key === "Backspace") {
                    console.log("Backspace");
                    keyData.key = "c";
                }
                handleUserInput(keyData);
            }
        }
    };

    const handleUserInput = (inputData) => {
        // if maths error then prevent all input except esc for ac
        if (keyErr && inputData.key !== "a") {
            return;
        }
        if (computationData.rawUserInput) {
            computationData.rawUserInput += inputData.key;
        } else {
            computationData.rawUserInput = inputData.key;
        }
        // this.setState({ rawUserInput });
        // console.log(`rawUserInput ${rawUserInput}`);

        const { key, shiftKey, ctrlKey, metaKey, keyCode } = { ...inputData };

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
        if ((ctrlKey && keyCode === 82) || (metaKey && keyCode === 82)) {
            return;
        }
        if (computationData.computed) {
            computationData.nextChar = inputData.key;
            setComputationData(computationData);
            prepareForNextCalculation();
        } else {
            setComputationData(computationData);
            parseUserInput();
        }
    };

    const parseUserInput = () => {
        /**
         * 2 situations
         *
         * 1. not ready for maths
         * a. fresh
         * b. secondary
         *
         * 2. ready for maths
         * a. fresh math
         * b. secondary math
         *
         * 4. fresh math
         * 5. secondary math
         *
         * hallmarks
         *
         * fresh math
         *
         *      (current) result value -    null
         *      computed -                  false
         *      previous result -           null
         *      previous operator -         null
         *      computation type -          null
         *      next operator -             null
         *
         * secondary math
         *
         *      (current) result value -    NOT null
         *      computed -                  true
         *      previous result -           NOT null
         *      previous operator -         NOT null
         *      computation type -          unary or binary
         *          unary
         *      next operator -             null
         *          binary
         *      next operator -             NOT null
         *
         * tests to do
         *
         * 1. fresh or secondary
         *  is computed true
         *
         *  yes - pre-process
         *  no - is this 4
         *  yes - 4
         *  no - 1
         *  is it 1a?
         *  yes - do 1a
         *  no - do ib
         *
         */
        if (
            CONSTANTS.patternStack.MATH_CATCHER.test(
                convertFromUnicodeToChar(computationData.rawUserInput)
            )
        ) {
            // we can do maths
            computationData = doMaths({ ...computationData });
            setComputationData(computationData);
            // no result from a maths computation
            // continue to process the user input
            // build up calculation string
            // continue to purify user input
        } else {
            /**
             * we cannot do maths so continue to store the input in calculation data
             */
            computationData.calculationValue = computationData.rawUserInput;
            computationData = setComputationData(processInput(computationData));
            return;
        }
    };

    const postResultPreperation = () => {
        let {
                calculationValue,
                computed,
                nextChar,
                operationType,
                operator,
                rawUserInput,
                resultValue,
            } = computationData,
            computationData = computationData;

        console.log(
            "postResultPreperation",
            computationData,
            computationData.resultValue
        );
        if (computationData.computed) {
            delete computationData.computed;
        }
        if (
            operator !== "=" &&
            !CONSTANTS.UNARY_OPERATOR_REGEX.test(operator)
        ) {
            /**
             * maths operator
             */
            computationData.rawUserInput = resultValue + operator;
        } else if (CONSTANTS.UNARY_OPERATOR_REGEX.test(operator)) {
            console.log("UNARY_OPERATOR_REGEX hit - s or r pressed");
            // computationData.calculationValue ="";
            // computationData.rawUserInput = "";
            // computationData.resultValue = "";
            computationData.rawUserInput = resultValue;

            computationData.calculationValue = convertFromCharToUnicode(
                calculationValue + operator
            );
        }

        setComputationData(computationData);
    };

    const prepareForNextCalculation = () => {
        console.log(
            "prepareForNextCalculation",
            computationData,
            computationData.resultValue
        );
        let {
                calculationValue,
                computed,
                nextChar,
                operationType,
                operator,
                rawUserInput,
                resultValue,
            } = computationData,
            computationData = computationData;
        if (computationData.hasOwnProperty("computed")) {
            delete computationData.computed;
        }
        if (computationData.operator !== "=") {
            /**
             * maths operator + number
             */
            if (/\d/.test(computationData.nextChar)) {
                computationData.rawUserInput =
                    resultValue + operator + nextChar;
            }
        }

        setComputationData(computationData);
        parseUserInput();
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
                <Display
                    calculationData={{ ...calculationData }}
                    resultData={{ ...resultData }}
                />
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
