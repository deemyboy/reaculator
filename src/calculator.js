import React, { Component } from "react";
import Display from "./components/display";
import Keyboard from "./components/keyboard";
import Canvas from "./components/canvas";
import Sidebar from "./components/sidebar";
import Cookies from "universal-cookie";
import keyboards from "./js/keyboards";
// import regexParser from "./js/regex_parser";
import { numberKeys, functionKeys, utilityKeys, ALLOWED_KEYS } from "./js/keys";
import { Container, Grid, Typography } from "@mui/material";
import * as CONSTANTS from "./js/constants";
import {
    doMaths,
    convertFromUnicodeToChar,
    convertFromCharToUnicode,
} from "./js/maths_engine.mjs";
import purifyRawUserInput from "./js/purify_raw_user_input.mjs";
import "./styles/main.scss";

class Calculator extends Component {
    displayRef = React.createRef();
    canvasRef = React.createRef();
    constructor(props) {
        super(props);

        this.state.theme = this.getCookie("currentTheme", "theme");
        this.state.themeType = this.getCookie("currentThemeType", "themeType");
        this.state.animation = this.getCookie("currentAnimation", "animation");
        this.state.pictureType = this.getCookie(
            "currentPictureType",
            "pictureType"
        );
    }

    state = {
        title: "Reaculator",
        theme: "Ocean",
        themeType: "color",
        animation: "",
        pictureType: "still",
        calculationData: {
            className: "default",
            value: "",
        },
        resultData: {
            className: "default",
            value: undefined,
        },
        sidebarIsOpen: false,
        keyErr: false,
        rawUserInput: "",
        computationData: {
            calculationValue: undefined,
            computed: undefined,
            nextChar: undefined,
            operationType: undefined,
            operator: undefined,
            rawUserInput: undefined,
            resultValue: undefined,
        },
    };

    componentDidMount() {
        document.addEventListener("keydown", (e) => this.handleKeyPress(e));

        let _id = "animation-script",
            _scriptName = this.state.animation;

        if (this.state.themeType === "animation") {
            var loadScript = function () {
                var tag = document.createElement("script");
                tag.id = _id;
                tag.async = false;
                let _src = `./animation-${_scriptName}.js`;
                tag.src = _src;
                var body = document.getElementsByTagName("body")[0];
                body.appendChild(tag);
            };
            var removeScript = function (id) {
                if (document.getElementById(id)) {
                    document.getElementById(id).remove();
                }
            };
            if (document.getElementById(_id)) {
                removeScript(_id);
            }
            loadScript();
        } else if (document.getElementById(_id)) {
            removeScript(_id);
        }
    }

    componentDidUpdate(nextProps, nextState) {
        let _id = "animation-script",
            _scriptName = this.state.animation;

        if (
            this.state.themeType === "animation" &&
            this.state.animation !== nextState.animation
        ) {
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
            var removeScript = function (id) {
                var tag = document.getElementById(id);
                if (tag) {
                    tag.remove();
                }
            };
            removeScript(_id);
        }
    }

    componentWillUnmount() {
        document.removeEventListener("keydown", (e) => this.handleKeyPress(e));
    }

    setCookie = (cookieData) => {
        let d = new Date();
        let year = d.getFullYear();
        let month = d.getMonth();
        let day = d.getDate();
        let expires = new Date(year + 1, month, day);

        const cookie = new Cookies();

        const path = cookieData.cookiePath;
        cookie.set(
            cookieData.cookieLabel,
            cookieData.cookieValue,
            path,
            expires
        );
    };

    getCookie = (cookieLabel, cookieDefault) => {
        const cookie = new Cookies();
        return cookie.get(cookieLabel)
            ? cookie.get(cookieLabel)
            : this.state[cookieDefault];
    };

    handleClick = (e) => {
        e.target.blur();
        const keyClicked = utilityKeys
            .concat(numberKeys, functionKeys)
            .filter((k) => {
                return k.id.toString() === e.target.id;
            });
        let clickData = {
            key: keyClicked[0].value ? keyClicked[0].value : "",
            ctrlKey: false,
            shiftKey: false,
        };
        this.handleUserInput(clickData);
    };

    handleKeyPress = (e) => {
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
                this.handleUserInput(keyData);
            }
        }
    };

    handleUserInput = (inputData) => {
        let { computationData } = this.state;

        // if maths error then prevent all input except esc for ac
        if (this.state.keyErr && inputData.key !== "a") {
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
            this.setState({ computationData }, this.prepareForNextCalculation);
        } else {
            this.setState({ computationData }, this.parseUserInput);
        }
    };

    parseUserInput = () => {
        let computationData = { ...this.state.computationData };

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
        // if (computationData.resultValue !== undefined) {
        // } else {
        //     computationData = { ...this.state.computationData };
        // }
        if (
            CONSTANTS.patternStack.MATH_CATCHER.test(
                convertFromUnicodeToChar(computationData.rawUserInput)
            )
        ) {
            // we can do maths
            computationData = doMaths({ ...this.state.computationData });
            this.setState(
                {
                    computationData,
                }
                // this.postResultPreperation
            );
            // no result from a maths computation
            // continue to process the user input
            //  build up calculation string
            //  continue to purify user input
        }
        // if (!_result.computed) {

        /**
         * we cannot do maths so continue to store the input in calculation data
         */
        else {
            computationData.calculationValue = computationData.rawUserInput;
            computationData = purifyRawUserInput(computationData);
            // if (computationData.updateUserInput) {
            //     delete computationData.updateUserInput;
            //     (computationData.rawUserInput =
            //         computationData.calculationValue),
            //         this.setState({
            //             computationData,
            //         });
            // } else {
            this.setState({
                computationData: { ...computationData },
            });
            // }
            return;
        }

        // result.computed ==  true
        // a valid computational unit was achieved
        //  we are post-result processing
        //      2 ways to arrive here
        //
        //      A
        //          i   unary operator after num1 || rs - unaryPrimaryOperation
        //          ii   binary operator after num1, op1 || num2 = xy\/\-+ - binaryPrimaryOperation
        //      B   "="" after num1, op1, num2 || num2 = "="
        //
        //      2 choices here
        //          press an operator
        //          press a number
        //
        //      what happens if
        //          Ai + unary operator     unOperation
        //          Ai + binary operator    binOperation
        //          Ai + number
        //
        //              operator
        // number
        // maths operator
        //

        // const getFormatType = (formatType) => {
        //     if (UNARY_OPERATOR_REGEX.test(_computationalUnit.op1)) {
        //         if (!resultValue) {
        //             _result.unaryPrimaryOperation = true;
        //         } else if (!resultValue) {
        //             _result.unarySecondaryOperation = true;
        //         }
        //     }
        //     if (BINARY_OPERATOR_REGEX.test(_computationalUnit.op1)) {
        //         if (!resultValue) {
        //             _result.binaryPrimaryOperation = true;
        //         } else if (resultValue) {
        //             _result.binarySecondaryOperation = true;
        //         }
        //     }
        // };

        // [_result, rawUserInput] = this.preMathsFormatting(
        //     _result,
        //     rawUserInput
        // );
        // computationData.calculationValue = computationData.rawUserInput;
        // console.log("_result.computed", _result);
        // computationData.resultValue = _result.value;
        // computationData.resultComputed = true;
        // computationData.computationType = _result.operationType;
        // computationData.previousResultValue = _result.value.toString();
        // computationData = purifyRawUserInput(computationData);
        // this.setState({
        //     computationData,
        // });
        // END result.computed ==  true
    };

    postResultPreperation = () => {
        let {
                calculationValue,
                computed,
                nextChar,
                operationType,
                operator,
                rawUserInput,
                resultValue,
            } = this.state.computationData,
            computationData = this.state.computationData;

        console.log(
            "postResultPreperation",
            this.state.computationData,
            this.state.computationData.resultValue
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

        this.setState({
            computationData: computationData,
        });
    };

    prepareForNextCalculation = () => {
        console.log(
            "prepareForNextCalculation",
            this.state.computationData,
            this.state.computationData.resultValue
        );
        let {
                calculationValue,
                computed,
                nextChar,
                operationType,
                operator,
                rawUserInput,
                resultValue,
            } = this.state.computationData,
            computationData = this.state.computationData;
        if (computationData.hasOwnProperty("computed")) {
            delete computationData.computed;
        }
        if (computationData.operator !== "=") {
            // computationData.
            /**
             * maths operator + number
             */
            if (/\d/.test(computationData.nextChar)) {
                computationData.rawUserInput =
                    resultValue + operator + nextChar;
            }
        }

        this.setState(
            {
                computationData: computationData,
            },
            this.parseUserInput
        );
    };

    getComputationData = () => {
        return { ...this.state.computationData };
    };
    //  {
    // // let calculationData = {};
    // return (
    //     ([calculationData.value, calculationData.class] = {
    //         calculationValue,
    //         calculationClass,
    //     }),
    //     this.state.computationData
    // );
    // };

    // preMathsFormatting = (
    //     resultData,
    //     rawUserInput,
    //     calculationData,
    //     mathType
    // ) => {
    //     let _operator = resultData.operator;

    //     console.log(
    //         "postResultFormatting",
    //         resultData,
    //         rawUserInput,
    //         calculationData,
    //         mathType
    //     );

    //     const formatData =
    //         (formatters) => (resData, rawUInput, calcData, mType) => {
    //             const _computationType = resData.computationType;
    //             console.log("formatData called");
    //             // return _computationType === "unaryPrimaryOperation" ||
    //             //     _computationType === "unarySecondaryOperation"
    //             return mType === "fresh"
    //                 ? formatters[mType][_computationType](
    //                       resData,
    //                       rawUInput,
    //                       calcData
    //                   )
    //                 : mType === "continuing"
    //                 ? formatters[mType][_computationType](
    //                       resData,
    //                       rawUInput,
    //                       calcData
    //                   )
    //                 : 1;

    //             // computationType === "binaryPrimaryOperation";
    //             // computationType === "binarySecondaryOperation";
    //         };

    //     const formatStack = {
    //         fresh: {
    //             unaryPrimaryOperation: function (
    //                 resultData,
    //                 rawUserInput,
    //                 calcData
    //             ) {
    //                 //
    //                 console.log("formatStack", "unaryPrimaryOperation");
    //                 if (
    //                     CONSTANTS.CONTINUING_MATH_OPERATOR_CATCHER.test(
    //                         rawUserInput.charAt(rawUserInput.length - 1)
    //                     )
    //                 ) {
    //                     rawUserInput =
    //                         computationData.resultValue +
    //                         rawUserInput.substring(
    //                             CONSTANTS.CONTINUING_MATH_OPERATOR_CATCHER.exec(
    //                                 rawUserInput
    //                             ).index
    //                         );
    //                 } else {
    //                     console.log(
    //                         CONSTANTS.CONTINUING_MATH_OPERATOR_CATCHER.exec(
    //                             rawUserInput
    //                         )
    //                     );
    //                     // tbc
    //                     rawUserInput = rawUserInput.substring(
    //                         CONSTANTS.CONTINUING_MATH_OPERATOR_CATCHER.exec(
    //                             rawUserInput
    //                         ).index + 1
    //                     );
    //                     computationData.resultValue = undefined;
    //                 }
    //                 return [resultData, rawUserInput, calcData];
    //             },
    //             unarySecondaryOperation: function (resultData, rawUserInput) {
    //                 console.log("formatStack", "unarySecondaryOperation");
    //                 if (_operator === "=") {
    //                     //
    //                 } else {
    //                     //
    //                 }
    //                 return [resultData, rawUserInput, calcData];
    //             },
    //             binaryPrimaryOperation: function (resultData, rawUserInput) {
    //                 if (_operator === "=") {
    //                     //
    //                 } else {
    //                     //
    //                 }
    //                 return [resultData, rawUserInput, calcData];
    //             },
    //             binarySecondaryOperation: function (resultData, rawUserInput) {
    //                 if (_operator === "=") {
    //                     //
    //                 } else {
    //                     //
    //                 }
    //                 return [resultData, rawUserInput, calcData];
    //             },
    //         },
    //         continuing: {
    //             unaryPrimaryOperation: function (resultData, rawUserInput) {
    //                 //
    //                 return [resultData, rawUserInput, calcData];
    //             },
    //             unarySecondaryOperation: function (resultData, rawUserInput) {
    //                 if (_operator === "=") {
    //                     //
    //                 } else {
    //                     //
    //                 }
    //                 return [resultData, rawUserInput, calcData];
    //             },
    //             binaryPrimaryOperation: function (resultData, rawUserInput) {
    //                 if (_operator === "=") {
    //                     //
    //                 } else {
    //                     //
    //                 }
    //                 return [resultData, rawUserInput, calcData];
    //             },
    //             binarySecondaryOperation: function (resultData, rawUserInput) {
    //                 if (_operator === "=") {
    //                     //
    //                 } else {
    //                     //
    //                 }
    //                 return [resultData, rawUserInput, calcData];
    //             },
    //         },
    //     };
    //     const doFormatting = formatData(formatStack);

    //     return ([resultData, rawUserInput, calcData] = doFormatting(
    //         resultData,
    //         rawUserInput,
    //         calculationData,
    //         mathType
    //     ));
    // };

    toggleSidebar = (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.setState((prevState) => ({
            sidebarIsOpen: !prevState.sidebarIsOpen,
        }));
    };

    closeSidebar = (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.setState({
            sidebarIsOpen: false,
        });
    };

    onSelectThemeType = (e) => {
        e.stopPropagation();
        let cookieData = {};
        let _themeTypeData = {};
        _themeTypeData.currentSetting = e.target.id;
        cookieData.cookieLabel = "currentThemeType";
        cookieData.cookieValue = _themeTypeData.currentSetting;
        cookieData.cookiePath = "/";
        this.setState({
            themeType: _themeTypeData.currentSetting,
        });
        this.setCookie(cookieData);
    };

    onSelectTheme = (e) => {
        e.stopPropagation();
        let cookieData = {};
        let _themesData = {};
        _themesData.currentSetting = e.target.id;
        cookieData.cookieLabel = "currentTheme";
        cookieData.cookieValue = _themesData.currentSetting;
        cookieData.cookiePath = "/";
        this.setState({
            theme: _themesData.currentSetting,
        });
        this.setCookie(cookieData);
    };

    onSelectAnimation = (e) => {
        e.stopPropagation();
        let cookieData = {};
        let _animation = e.target.id;
        cookieData.cookieLabel = "currentAnimation";
        cookieData.cookieValue = _animation;
        cookieData.cookiePath = "/";
        this.setState({
            animation: _animation,
        });
        this.setCookie(cookieData);
    };

    onSelectPictureType = (e) => {
        e.stopPropagation();
        let cookieData = {};
        let _pictureType = {};
        _pictureType = e.target.id;
        cookieData.cookieLabel = "currentPictureType";
        cookieData.cookieValue = _pictureType;
        cookieData.cookiePath = "/";
        this.setState({
            pictureType: _pictureType,
        });
        this.setCookie(cookieData);
    };

    getKeyboardData = (keyboardName) => {
        let _keyboardData = keyboards.find((keyboard) => {
            return keyboard.name === keyboardName ? keyboard : undefined;
        });
        _keyboardData.onClick = this[_keyboardData.onClickFunction];
        return _keyboardData;
    };

    getSidebarKeyboardNames = () => {
        const defaultSidebarKeyboardNames = ["theme-type", "theme"];
        let sidebarKeyboardNames = defaultSidebarKeyboardNames;

        if (this.state.themeType !== "color") {
            sidebarKeyboardNames.push(
                this.state.themeType === "animation"
                    ? "animation"
                    : "picture-type"
            );
        }
        return sidebarKeyboardNames;
    };

    getKeyboardOnclick = (keyboardName) => {
        switch (keyboardName) {
            case "theme-type":
                return this.onSelectThemeType;
            case "theme":
                return this.onSelectTheme;
            case "animation":
                return this.onSelectAnimation;
            case "picture-type":
                return this.onSelectPictureType;
            default:
                return;
        }
    };

    getSelected = (keyboardName) => {
        switch (keyboardName) {
            case "theme-type":
                return this.state.themeType;
            case "theme":
                return this.state.theme;
            case "animation":
                return this.state.animation;
            case "picture-type":
                return this.state.pictureType;
            default:
                return;
        }
    };

    getSidebarData = () => {
        let keyboardNames = this.getSidebarKeyboardNames();
        let sidebarData = {
            isOpen: this.state.sidebarIsOpen,
            keyboardNames: keyboardNames,
            getSelected: this.getSelected,
            getKeyboardOnclick: this.getKeyboardOnclick,
        };
        return sidebarData;
    };

    setResultClass = () => {
        let { resultData } = { ...this.state };
        resultData.resultClass = this.state.resultData;
        this.setState({ resultData, keyErr: true });
    };

    GridItem({ classes }) {
        return (
            // From 0 to 600px wide (smart-phones), I take up 12 columns, or the whole device width!
            // From 600-690px wide (tablets), I take up 6 out of 12 columns, so 2 columns fit the screen.
            // From 960px wide and above, I take up 25% of the device (3/12), so 4 columns fit the screen.
            <Grid item xs={12} sm={6} md={3}>
                <Paper className={classes.paper}>item</Paper>
            </Grid>
        );
    }

    render = () => {
        return (
            <Container
                className={`container ${
                    this.state.sidebarIsOpen === true ? "open" : ""
                } ${this.state.themeType} ${this.state.theme.toLowerCase()} ${
                    this.state.pictureType
                }`}
                sx={{ p: "0!important" }}
            >
                {/* ------------ app ---------------- */}
                {/* ------------ display and keyboards---------------- */}
                <p className="settings" onClick={this.toggleSidebar}>
                    <i className="cog" aria-hidden="true"></i>
                </p>
                <Grid
                    container
                    onClick={this.closeSidebar}
                    direction={"column"}
                    id="canvas-container"
                    className={"calculator"}
                    meta-name="display and keyboards"
                >
                    <Canvas
                        ref={this.animate}
                        id={CONSTANTS.CANVAS_CONTAINER_ID}
                    />
                    <Typography className="title">
                        {CONSTANTS.APPLICATION_TITLE}
                    </Typography>
                    {/* ------------ display ---------------- */}
                    <Display
                        calculationData={{ ...this.state.calculationData }}
                        resultData={{ ...this.state.resultData }}
                    />
                    {/* ------------ main keyboards ---------------- */}
                    <Grid
                        container
                        className="main-keyboards"
                        meta-name="main keyboards"
                    >
                        <Keyboard
                            xs={7}
                            md={7}
                            props={this.getKeyboardData("number")}
                        />
                        <Keyboard
                            xs={5}
                            md={5}
                            props={this.getKeyboardData("function")}
                        />
                        <Keyboard
                            xs={12}
                            md={12}
                            lg={12}
                            props={this.getKeyboardData("utility")}
                        />
                    </Grid>
                </Grid>
                {/* ------------ sidebar ---------------- */}
                <Sidebar props={this.getSidebarData()} />
            </Container>
        );
    };
}

export default Calculator;
