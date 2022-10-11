import React, { Component } from "react";
import Display from "./components/display";
import Keyboard from "./components/keyboard";
import Canvas from "./components/canvas";
import Sidebar from "./components/sidebar";
import Cookies from "universal-cookie";
import keyboards from "./js/keyboards";
import { numberKeys, functionKeys, utilityKeys, allowedKeys } from "./js/keys";
import { Container, Grid, Typography } from "@mui/material";
import * as CONSTANTS from "./utils/constants";
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
            className: "calculation",
            value: "",
        },
        resultData: {
            className: "result",
            value: "",
            defaultClass: "result",
            errorClass: "result_err",
        },
        sidebarIsOpen: false,
        keyErr: false,
        num1: "",
        num2: "",
        op1: "",
        op2: "",
        userInput: "",
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
        if (
            this.state.num1 !== nextState.num1 ||
            this.state.op1 !== nextState.op1 ||
            this.state.num2 !== nextState.num2 ||
            this.state.resultData.value !== nextState.resultData.value
        ) {
            this.value();
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
        var _code = e.keyCode;
        var _key = utilityKeys.concat(numberKeys, functionKeys).filter((k) => {
            return k.keycode === e.keyCode;
        })[0];

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
            var _button = document.getElementById(_key.id);
        } else {
            return;
        }
        if (!e.repeat) {
            if (_button === null || _button === undefined) {
            } else if (_button !== null || _button !== undefined) {
                _button.focus(timeout);
                var timeout = setTimeout(() => _button.blur(), 200);
            }
            if (allowedKeys.includes(e.keyCode)) {
                let keyData = {
                    key: e.key,
                    ctrlKey: e.ctrlKey,
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
                this.handleUserInput(keyData);
            }
        }
    };

    handleUserInput = (inputData) => {
        let { userInput } = this.state;

        // if maths error then prevent all input except a for ac
        if (this.state.keyErr && inputData.key !== "a") {
            return;
        }

        if (
            this.state.op2 === "=" ||
            CONSTANTS.UNARY_OP_RGX_NN_GR.test(this.state.op1)
        ) {
            userInput = this.preProcessUserInput(inputData);
        }

        const { key, shiftKey, ctrlKey, keyCode } = { ...inputData };

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

        // handle shift & ctrl keys to stop "Control" and "Shift" being inserted into userInput

        // simple input
        // no shift or ctrl keys involved
        // append key value
        if (!shiftKey && !ctrlKey) {
            userInput += key;
        }

        // compound input
        // allow "+" => shift & "=" key
        if (shiftKey && keyCode === 187) {
            userInput += key;
        }

        if (CONSTANTS.UTIL_OP_RGX.test(key)) {
            this.handleUtilityOperator(key);
            return;
        }

        this.setState({ userInput }, this.parseUserInput);
    };

    handleUtilityOperator = (key) => {
        let resultData = { ...this.state.resultData };

        if (key === "a") {
            resultData.value = "";
            resultData.resultClass = this.state.resultData.resultDefaultClass;

            this.setState({
                num1: "",
                num2: "",
                op1: "",
                op2: "",
                resultData,
                userInput: "",
                keyErr: false,
            });
        }
        if (key === "c") {
            let { userInput } = this.state;
        }
        // if (key === "=") {
        //     `297: num1: ${this.state.num1} num2: ${this.state.num2} op1: ${this.state.op1} op2: ${this.state.op2}`
        //   );
        //   if (
        //     this.state.num1 &&
        //     this.state.num1 !== "" &&
        //     this.state.num2 &&
        //     this.state.num2 !== ""
        //   ) {
        //     this.updateOperator("=");
        //   }
        // }
        if (key === "m") {
            this.toggleSign();
        }
    };

    parseUserInput = () => {
        const re =
            /([-]?\d*\.?\d*)([srx\-+\/my]?)([-]?\d*\.?\d*)([srx\-=+\/my]?)/dgi;

        let matches = re.exec(this.state.userInput);

        let matchesNum1 = matches[1],
            matchesOp1 = matches[2],
            matchesNum2 = matches[3],
            matchesOp2 = matches[4];

        let { num1, num2, op1, op2, userInput } = { ...this.state };

        // exceptions
        ////////////

        // handle operators entered before numerals
        // reset user input
        // allow "." as we see below in [b]
        if (
            isNaN(userInput.charAt(0)) &&
            userInput.length === 1 &&
            userInput.charAt(0) !== "."
        ) {
            this.setState({ userInput: "" });
            return;
        }

        // [a]  repeated 0
        // handles  00 or 00000 or 00000000000
        if (+userInput === 0 && !CONSTANTS.DOT_RGX_NN_GR.test(userInput)) {
            this.setState({ userInput: "0", num1: "0" });
            return;
        }

        // single maths op in op2
        if (
            op1 &&
            op1 !== "" &&
            CONSTANTS.BINARY_OP_RGX_NN_GR.test(op1) &&
            CONSTANTS.UNARY_OP_RGX_NN_GR.test(userInput.slice(-1)) &&
            userInput.slice(userInput.indexOf(op1), -1) !== op1
        ) {
            this.setState({ userInput: userInput.slice(0, -1) });
            return;
        }

        if (
            matchesNum1 !== "" &&
            matchesOp1 === "" &&
            matchesNum2 === "" &&
            matchesOp2 === ""
        ) {
            num1 = matchesNum1;
        } else if (
            matchesNum1 !== "" &&
            matchesOp1 !== "" &&
            matchesNum2 === "" &&
            matchesOp2 === ""
        ) {
            op1 = matchesOp1;
        } else if (
            matchesNum1 !== "" &&
            matchesOp1 !== "" &&
            matchesNum2 === "" &&
            matchesOp2 !== "" &&
            matchesOp2 !== "="
        ) {
            op1 = matchesOp2;
            this.setState({ userInput: userInput.slice(0, -2) + matchesOp2 });
        } else if (
            (matchesNum1 !== "" &&
                matchesOp1 !== "" &&
                matchesNum2 !== "" &&
                !isNaN(parseFloat(matchesNum2)) &&
                matchesOp2 === "") ||
            (matchesNum1 !== "" &&
                matchesOp1 !== "" &&
                matchesNum2 === "." &&
                matchesOp2 === "")
        ) {
            num2 = matchesNum2;
        } else if (
            matchesNum1 !== "" &&
            matchesOp1 !== "" &&
            matchesNum2 !== "" &&
            matchesOp2 !== ""
        ) {
            op2 = matchesOp2;
        } else if (
            (matchesNum1 !== "" &&
                matchesOp1 === "" &&
                matchesNum2 === "" &&
                matchesOp2 !== "") ||
            (matchesNum1 !== "" &&
                matchesOp1 !== "" &&
                matchesNum2 === "" &&
                matchesOp2 !== "") ||
            (isNaN(parseFloat(matchesNum2)) &&
                matchesNum2 !== "" &&
                matchesNum2 !== ".")
        ) {
            if (matchesNum2 === "-") {
                op1 = matchesNum2;
            } else if (matchesOp2 === "=") {
                num1 = matchesNum1;
            }
            this.setState({ userInput: userInput.slice(0, -1) });
        }

        this.setState(
            {
                num1,
                op1,
                num2,
                op2,
            },
            this.doMath
        );
    };

    processNumber = (num) => {
        if (CONSTANTS.DOT_RGX_NN_GR.test(num)) {
            return (num = this.formatDecimal(num));
        } else {
            return num;
        }

        return num;
    };

    /**
   *

  * @param userInput
   *
   * set correct values for
   *
   * num1
   * num2
   * op1
   * op2
   * resultData
   * -  value
   * -  condtinuousMaths
   * userinput
   *
   * dependencies
   * -  was equals last pressed
   */
    preProcessUserInput = (inputData) => {
        // check if "=" was pressed to get a result followed by a number
        // if it is then the previous function (post Result clearup)
        // has put the previous result into userInput
        // ** this is not desirable
        //
        // so we:
        // 1. isolate the last char entered
        // 2. replace userInput with it
        // 3. wipe clean the result - set it "0"

        // exceptions

        // single maths op

        // user has entered "=" after result
        // || user used single number maths operator s = squre or r = sqrt
        // delete last char
        //set userInput as result
        let { userInput } = this.state;
        let _resVal = this.state.resultData.value;

        // single maths
        // maths op
        if (
            userInput &&
            userInput.length > 0 &&
            CONSTANTS.UNARY_OP_RGX_NN_GR.test(this.state.op1) &&
            CONSTANTS.MATH_OP_RGX_NN_GR.test(inputData.key)
        ) {
            this.setState({ num1: _resVal });
            return _resVal;
        } else if (
            userInput &&
            userInput.length > 0 &&
            CONSTANTS.UNARY_OP_RGX_NN_GR.test(this.state.op1) &&
            /^-?\d+$/.test(inputData.key)
        ) {
            this.setState({
                op1: "",
                resultData: { ...this.state.resultData, value: "" },
            });
            return "";
        }
        // double maths
        // maths operator pressed
        if (
            userInput &&
            userInput.length > 0 &&
            (this.state.op2 === "=" ||
                CONSTANTS.UNARY_OP_RGX_NN_GR.test(this.state.op1)) &&
            CONSTANTS.MATH_OP_RGX_NN_GR.test(inputData.key)
        ) {
            let _resVal = this.state.resultData.value;

            this.setState({
                num1: _resVal,
                op1: inputData.key,
                num2: "",
                op2: "",
                resultData: { ...this.state.resultData, value: "" },
            });
            return _resVal;
        }
        // number
        else if (
            userInput &&
            userInput.length > 0 &&
            this.state.op2 === "=" &&
            /^-?\d+$/.test(inputData.key)
        ) {
            this.setState({
                num1: "",
                op1: "",
                num2: "",
                op2: "",
            });
            return "";
        }
        // number
        else if (
            userInput &&
            userInput.length > 0 &&
            this.state.op2 === "=" &&
            /^-?\d+$/.test(inputData.key)
        ) {
            this.setState({
                num1: "",
                op1: "",
                num2: "",
                op2: "",
            });
            return "";
        }
    };

    setResultData = (data, callback) => {
        let resultData = { ...this.state.resultData };

        if (data.resultClass) {
            resultData.resultClass = data.resultClass;
        } else {
            resultData.resultClass = this.state.resultData.resultDefaultClass;
        }
        if (data.value) {
            resultData.value = data.value;
        } else {
            resultData.value = resultData.value;
        }
        if (callback) {
            this.setState({ resultData }, () => callback());
        } else {
            this.setState({ resultData });
        }
    };

    formatDecimal = (numToProcess) => {
        let dotMatch,
            dotMatch2,
            dotMatches = [],
            dotMatches2 = [];

        while ((dotMatch = CONSTANTS.DOT_RGX.exec(numToProcess)) != null) {
            dotMatches.push(dotMatch.index);
        }

        do {
            dotMatches2.push(dotMatch2);
        } while ((dotMatch2 = CONSTANTS.DOT_RGX.exec(numToProcess)) != null);

        // if called in error ie. handle no dots
        if (dotMatches.length < 1) {
            return numToProcess;
        } else if (dotMatches.length < 2) {
            if (dotMatches[0] < 1) {
                this.setState({ userInput: "0." });
                return "0.";
            } else {
                return numToProcess;
            }
        } else {
            let _userInput = this.state.userInput;
            this.setState({ userInput: this.state.userInput.slice(0, -1) });

            // remove last char which has to be a "."
            return numToProcess.slice(0, -1);
        }
    };

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

    value = () => {
        const setCalculationDisplayChar = (op) => {
            return functionKeys
                .filter((k) => k.value === op)
                .filter((k) => {
                    if ("calculationDisplayChar" in k) return k;
                });
        };

        const processDecimal = (num) => {
            if (num.slice(-1) === "." && Number.isInteger(+num)) {
                return num.slice(0, -1);
            } else if (num.slice(-1) !== "." && Number.isInteger(+num)) {
                return String(+num);
            } else if (num === ".") {
                this.setState({ userInput: "0." });
                return "0.";
            } else {
                return num;
            }
        };

        const { num1, op1, num2, op2 } = { ...this.state };

        let _num1, _op1, _num2;

        let calculationData = { ...this.state.calculationData };

        _num1 = num1 ? num1 : "";
        _num2 = num2 ? num2 : "";

        if (op1) {
            _op1 =
                setCalculationDisplayChar(op1).length > 0
                    ? setCalculationDisplayChar(op1)[0].calculationDisplayChar
                    : op1;
        } else {
            _op1 = "";
        }

        if (_num1 === "." || CONSTANTS.DOT_RGX_NN_GR.test(_num1)) {
            _num1 = processDecimal(_num1);
        } else if (
            _num2 === "." ||
            (CONSTANTS.DOT_RGX_NN_GR.test(_num2) && op2)
        ) {
            _num2 = processDecimal(_num2);
        }

        calculationData.value = _num1 + _op1 + _num2;
        if (calculationData.value !== this.state.calculationData.value) {
            this.setState({ calculationData });
        }
    };

    doMath = () => {
        let resultData = { ...this.state.resultData };
        let _num1, _num2;

        if (this.state.num1 && this.state.num1 !== "") {
            _num1 = Number(this.state.num1);
        }
        const _op = this.state.op1;
        if (this.state.num2 && this.state.num2 !== "") {
            _num2 = Number(this.state.num2);
        }
        const _op2 = this.state.op2;

        if (this.state.num1 + this.state.op1 + this.state.num2 === "404+545") {
            resultData.value = "Hello Baba, \uD83D\uDC95 you!";
            resultData.resultClass = "baba";
            this.setResultData(resultData, null);
            return;
        } else if (
            this.state.num1 + this.state.op1 + this.state.num2 ===
            "404-545"
        ) {
            resultData.value = "Bye Baba, miss you \uD83D\uDC96";
            resultData.resultClass = "baba";
            this.setResultData(resultData, null);
            return;
        }

        // no operator
        if (!_op || _op === "") return;

        // dble number maths but no num2
        if (
            CONSTANTS.BINARY_OP_RGX_NN_GR.test(_op) &&
            (!_num2 || _num2 === "") &&
            _num2 !== 0
        ) {
            return;
        }

        if (!CONSTANTS.UNARY_OP_RGX_NN_GR.test(_op) && (!_op2 || _op2 === "")) {
            return;
        }

        // switch statement rather than if else
        switch (_op) {
            case "r": {
                resultData.value = Math.sqrt(_num1);
                break;
            }
            case "s": {
                if (_num1 === 0) resultData.value = 1;
                else resultData.value = Math.pow(_num1, 2);
                break;
            }
            case "+": {
                resultData.value = _num1 + _num2;
                break;
            }
            case "-": {
                resultData.value = _num1 - _num2;
                break;
            }
            case "x": {
                resultData.value = _num1 * _num2;
                break;
            }
            case "y": {
                resultData.value = Math.pow(_num1, _num2);
                break;
            }
            case "/": {
                resultData.value = _num1 / _num2;
                break;
            }
            default: {
                break;
            }
        }

        if (resultData.value.length > 13) {
            resultData.value = this.formatResult(resultData.value);
        } else {
            resultData.value = String(resultData.value);
        }
        this.setState({ resultData }, () => this.postResultClearUp());
    };

    formatResult = (resValue) => {
        return String(resValue.toExponetial());
    };

    postResultClearUp = () => {
        let { value } = { ...this.state.resultData };
        let { num1, num2, op1, op2, userInput } = { ...this.state };

        if (!isFinite(value)) {
            this.setResultErrorClass();
            return;
        }

        if (op2 !== "=" && op1 !== "s" && op1 !== "r") {
            num1 = value;
            num2 = "";
            op1 = op2;
            op2 = "";
            userInput = value + op1;
        }

        this.setState({
            num1,
            num2,
            op1,
            op2,
            userInput,
        });
    };

    setResultErrorClass = () => {
        let { resultData } = { ...this.state };
        resultData.resultClass = this.state.resultData.resultErrorClass;
        this.setState({ resultData, keyErr: true });
    };

    toggleSign = () => {
        let { num1 } = { ...this.state };
        let { op1 } = { ...this.state };
        let { num2 } = { ...this.state };

        if (!num2) {
            this.setState({
                num1: String(num1 * -1),
                userInput: String(num1 * -1) + op1,
            });
        } else {
            this.setState({
                num2: String(num2 * -1),
                userInput: num1 + op1 + String(num2 * -1),
            });
        }
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
                        calculationData={this.state.calculationData}
                        resultData={this.state.resultData}
                        displayClass={this.state.displayClass}
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
