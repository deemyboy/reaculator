import React, { useState, useEffect, useRef, useCallback } from "react";
import Display from "./components/display";
import Keyboard from "./components/keyboard";
import { Canvas } from "./components/canvas";
import { useCookies } from "react-cookie";
import SettingsIcon from "@mui/icons-material/Settings";
import { ALLOWED_KEYS, DISALLOWED_KEYS, keyboardKeysMap } from "./ts/keys";
import { Container, Grid, Typography } from "@mui/material";
import * as CONSTANTS from "./utils/constants";
import { doMath } from "./utils/maths_engine.mjs";
import { unicodify, deunicodify } from "./utils/helpers";
import { processInput } from "./utils/process_input.mjs";
import "./styles/main.scss";
import { keyboardMap } from "./ts/keyboards";
import { motion, useIsPresent } from "framer-motion";
import * as Types from "./types/types";
import { keyMap } from "./ts/keys";
import { HandleClickContextProvider } from "./utils/context";

const Calculator = () => {
    const [cookies, setCookie] = useCookies([
        "theme",
        "themeType",
        "animation",
        "pictureType",
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
            key: keyMap.get(e.target.id)!.value,
            timeStamp: e.timeStamp,
        });
    }, []);

    const handleKeyPress = useCallback((e: Types.TKeyEventData) => {
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

    const defaultSettingsKeyboardNames = ["themeType", "theme"];

    const [settingsKeyboardNames, setSettingsKeyboardNames] = useState(
        defaultSettingsKeyboardNames
    );

    const defaultTheme = { name: "ocean" };
    const defaultThemeType = { name: "color" };
    const defaultAnimationType = { name: "fireworks" };
    const defaultPictureType = { name: "still" };

    const [theme, setTheme] = useState<Types.TSelect>(defaultTheme);

    const [themeType, setThemeType] = useState<Types.TSelect>(defaultThemeType);

    const [animation, setAnimation] =
        useState<Types.TSelect>(defaultAnimationType);

    const [pictureType, setPictureType] =
        useState<Types.TSelect>(defaultPictureType);

    const themeSelections = new Map<string, Types.TSelect>([
        ["theme", theme],
        ["themeType", themeType],
        ["animation", animation],
        ["pictureType", pictureType],
    ]);

    const onSelect = useCallback((e) => {
        const { classList } = e.target;
        e.stopPropagation();
        const { id } = e.target;
        if ([...classList].includes("btn-theme")) setTheme({ name: id });
        if ([...classList].includes("btn-theme-type"))
            setThemeType({ name: id });
        if ([...classList].includes("btn-animation-choose"))
            setAnimation({ name: id });
        if ([...classList].includes("btn-pic-type"))
            setPictureType({ name: id });
    }, []);

    const onSelectMap = new Map([
        ["number", handleClick],
        ["function", handleClick],
        ["theme", onSelect],
        ["themeType", onSelect],
        ["animation", onSelect],
        ["pictureType", onSelect],
    ]);

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

    const [errorState, setErrorState] = useState(false);

    const resetErrorState = () => {
        setErrorState(false);
    };

    const initialComputationData: Types.TComputationData = {
        userInput: "",
        resultValue: "0",
        resultClassName: "result",
        calculationValue: "",
        calculationClassName: "calculation",
        computed: "",
        num1: "",
        op1: "",
        num2: "",
        op2: "",
        error: false,
        previousCalculationOperator: "",
        key: "",
        timeStamp: "",
        nextUserInput: "",
    };

    const [computationData, setComputationData] = useState({
        ...initialComputationData,
    });
    const [computed, setComputed] = useState(true);

    useEffect(() => {
        if (computationData.error) {
            setErrorState(true);
            let { calculationClassName, resultClassName } = computationData;
            calculationClassName += " calculation-error";
            resultClassName += " result-error";
            setComputationData({
                ...computationData,
                calculationClassName: calculationClassName,
                resultClassName: resultClassName,
            });
        }
    }, [computationData.error]);

    useEffect(() => {
        if (computationData.computed) {
            const processedResultData = processResult();
            setComputationData({
                ...computationData,
                previousCalculationOperator: computationData.op2
                    ? computationData.op2
                    : computationData.op1,
                ...processedResultData,
            });
        }
    }, [computationData.computed]);

    const [keyData, setKeyData] = useState<Types.TKeyData>({
        key: "",
        timeStamp: 0,
    });

    const resetKeyData = () => {
        setKeyData({ key: "", timeStamp: 0 });
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
        if (CONSTANTS.patternStack.MATH_CATCHER.test(computationData.userInput))
            tryMath();
        else
            setComputationData({
                ...computationData,
                ...makeCalculationData(),
            });
    }, [computationData.userInput]);

    const initialSettingsData = {
        settingsKeyboardsData: defaultSettingsKeyboardNames.map((name) =>
            getKeyboardData(name)
        ),
        isOpen: false,
    };

    const [settingsData, setSettingsData] = useState(initialSettingsData);

    const [linesData, setLinesData] = useState({
        result: { value: "0", className: computationData.resultClassName },
        calculation: {
            value: "",
            className: computationData.calculationClassName,
        },
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
            settingsKeyboardsData: settingsKeyboardNames.map((name) =>
                getKeyboardData(name)
            ),
        });
    }, [theme, animation, pictureType, themeType]);

    useEffect(() => {
        updateSettingsKeyboardNames(themeType.name);
    }, [theme, animation, pictureType, themeType]);

    const updateSettingsKeyboardNames = (name: string) => {
        const keyboardNames = [...settingsKeyboardNames];
        // if (name !== "color" && (name !== "theme" || name !== "themeType")) {
        if (name !== "color") {
            if (keyboardNames.indexOf(name) >= 0) {
                keyboardNames.splice(keyboardNames.indexOf(name));
            }
            keyboardNames.push(
                name === "animation" ? "animation" : "pictureType"
            );
            setSettingsKeyboardNames(keyboardNames);
        } else setSettingsKeyboardNames(defaultSettingsKeyboardNames);
    };

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
                    : "0",
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
            _scriptName = animation.name;
        const canvas = document.getElementById(CONSTANTS.CANVAS_CONTAINER_ID);

        const removeScript = (id) => {
            if (document.getElementById(id)) {
                document.getElementById(id)!.remove();
            }
        };
        const createCanvas = () => {
            const canvasParent = document.getElementById("canvas-container")!;
            const canvas = document.getElementById(
                CONSTANTS.CANVAS_CONTAINER_ID
            );
            if (!canvas) {
                const newCanvas = document.createElement("canvas");
                newCanvas.setAttribute("id", CONSTANTS.CANVAS_CONTAINER_ID);
                canvasParent.appendChild(newCanvas);
            }
        };
        const removeCanvas = () => {
            if (canvas) {
                canvas.remove();
            }
        };

        if (themeType.name === "animation") {
            if (!canvas) createCanvas();
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
            removeCanvas();
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

    // const getCookie = (label, cookieDefault) => {
    //     const cookie = new Cookies();
    //     return cookie.get(label)
    //         ? cookie.get(label)
    //         : cookieDefault;
    // };

    const resetAll = () => {
        resetErrorState();
        resetKeyData();
        resetComputationData();
        // resetSettingsData();
    };

    function preProcessComputationData() {
        const { previousCalculationOperator } = computationData;
        if (CONSTANTS.UNARY_OPERATOR_REGEX.test(previousCalculationOperator)) {
            preProcessComputationDataAfterUnaryMathsOperation();
        } else if (
            CONSTANTS.BINARY_OPERATOR_REGEX.test(previousCalculationOperator)
        ) {
            preProcessComputationDataAfterBinaryMathsOperation();
        }
    }

    function preProcessComputationDataAfterUnaryMathsOperation() {
        console.log("preProcessComputationDataAfterUnaryMathsOperation");
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
        if (CONSTANTS.UNARY_OPERATOR_REGEX.test(key)) {
            console.log("unary op after unary op");
            changes = {
                userInput: resultValue + key,
                op1: undefined,
                num1: undefined,
                previousCalculationOperator: undefined,
                computed: false,
            };
        }
        if (CONSTANTS.BINARY_OPERATOR_REGEX.test(key)) {
            console.log("binary op after unary op", key);
            changes = {
                userInput: resultValue + key,
                op1: undefined,
                num1: undefined,
                previousCalculationOperator: undefined,
                computed: false,
            };
        }
        if (CONSTANTS.NUMBER_REGEX.test(key)) {
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
        if (/m/.test(key)) {
            console.log("+/- (m) after unary op", key);
            changes = {
                userInput: +resultValue * -1,
                op1: undefined,
                num1: undefined,
                previousCalculationOperator: undefined,
                key: undefined,
                computed: false,
                resultValue: 0,
            };
        }
        if (
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

    function preProcessComputationDataAfterBinaryMathsOperation() {
        console.log("preProcessComputationDataAfterBinaryMathsOperation");
        let changes = {};
        const {
            calculationValue,
            userInput,
            resultValue,
            preProcessedResult,
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
        if (CONSTANTS.UNARY_OPERATOR_REGEX.test(key)) {
            console.log("unary op after binary op");
            changes = {
                userInput: resultValue + key,
                op1: undefined,
                num1: undefined,
                previousCalculationOperator: undefined,
                computed: false,
            };
        }
        if (CONSTANTS.BINARY_OPERATOR_REGEX.test(key)) {
            console.log("binary op after binary op", key);
            changes = {
                userInput: resultValue + key,
                op1: undefined,
                num1: undefined,
                previousCalculationOperator: undefined,
                computed: false,
            };
        }
        if (CONSTANTS.NUMBER_REGEX.test(key)) {
            console.log("number after binary op", key);
            changes = {
                userInput:
                    preProcessedResult + previousCalculationOperator + key,
                op1: undefined,
                num1: undefined,
                op2: undefined,
                num2: undefined,
                previousCalculationOperator: undefined,
                key: undefined,
                computed: false,
            };
        }
        if (/m/.test(key)) {
            console.log("+/- (m) after binary op", key);
            changes = {
                userInput: +resultValue * -1,
                op1: undefined,
                num1: undefined,
                previousCalculationOperator: undefined,
                key: undefined,
                computed: false,
                resultValue: 0,
            };
        }
        if (
            /\./.test(key) &&
            !CONSTANTS.patternStack.UNIVERSAL_EXTRA_DOT_CATCHER.test(
                resultValue
            )
        ) {
            console.log(". after binary op", key);
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
    };

    const tryMath = () => {
        let _resultData = doMath(computationData);
        setComputationData({ ..._resultData });
    };

    const processResult = () => {
        const { computed, num1, num2, op1, op2, resultValue } = computationData;
        let { userInput } = computationData;
        if (
            CONSTANTS.BINARY_OPERATOR_REGEX.test(
                userInput.charAt(userInput.length - 1)
            )
        ) {
            userInput = userInput.replace(/.$/, "");
        }
        userInput = unicodify(userInput);
        const _resultValue = unicodify(resultValue);
        let resultTemplate = `Ans ${userInput} = ${_resultValue}`;

        let processedResultData = {
            computed: computed,
            num1: num1,
            num2: num2,
            op1: op1,
            op2: op2,
            preProcessedResult: resultValue,
            resultValue: resultTemplate,
        };
        return processedResultData;
    };

    function makeCalculationData() {
        // console.log("makeCalculationData");
        const {
            userInput,
            resultValue,
            resultClassName,
            calculationClassName,
            computed,
            num1,
            op1,
            num2,
            op2,
            error,
            previousCalculationOperator,
            key,
            timeStamp,
            nextUserInput,
        } = { ...computationData };

        let { calculationValue } = computationData;
        calculationValue =
            num1 && op1 && num2
                ? "" + num1 + op1 + num2
                : num1 && op1 && !num2
                ? "" + num1 + op1
                : userInput;
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
        };
    }

    function getKeyboardData(keyboardName: string): Types.TKeyboard {
        const keyboard = {
            ...keyboardMap.get(keyboardName)!,
        };
        keyboard.selected = themeSelections.get(keyboardName);
        keyboard.errorState = errorState;
        keyboard.onClick = onSelectMap.get(keyboardName)!;
        return keyboard;
    }
    const showMainKeyboards = () => {
        return (
            <motion.div
                initial={{ y: 2000, opacity: 0.25, height: 0 }}
                animate={{ height: "auto", opacity: 1, y: 0 }}
                transition={{
                    type: "spring",
                    duration: 0.5,
                    delay: 0.3,
                }}
            >
                <Grid
                    container
                    className="main-keyboards"
                    meta-name="main-keyboards"
                >
                    <Keyboard {...getKeyboardData("number")} />
                    <Keyboard {...getKeyboardData("function")} />
                </Grid>
            </motion.div>
        );
    };
    return (
        <Container
            className={`container 
            ${themeType.name} ${theme.name} ${pictureType.name}`}
            sx={{ padding: "0!important" }}
        >
            <p
                id="settings-icon"
                className={
                    settingsData.isOpen ? "settings-icon open" : "settings-icon"
                }
                onClick={toggleSettings}
            >
                <SettingsIcon sx={{ position: "relative", zIndex: -1 }} />
            </p>
            <Grid
                container
                direction={"column"}
                id="canvas-container"
                className={"calculator"}
                meta-name="display and keyboards"
            >
                <Typography className="title">
                    {CONSTANTS.APPLICATION_TITLE}
                </Typography>
                <Display {...displayData} />
                {!settingsData.isOpen ? showMainKeyboards() : <></>}
            </Grid>
        </Container>
    );
};

export default Calculator;
