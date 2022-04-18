import React, { Component } from "react";
import "./styles/main.scss";
import Display from "./components/display";
import { Keyboard } from "./components/keyboard";
import Canvas from "./components/canvas";
import { Sidebar } from "./components/sidebar";
import Cookies from "universal-cookie";
import { keyboards } from "./js/keyboards";
import { themeKeys } from "./js/keys";
import { numberKeys } from "./js/keys";
import { functionKeys } from "./js/keys";
import { utilityKeys } from "./js/keys";
import { allowedKeys } from "./js/keys";
import { themeTypeKeys } from "./js/keys";
import { animKeys } from "./js/keys";
import { Container, Grid, Typography } from "@mui/material";

class Calculator extends Component {
  displayRef = React.createRef();
  canvasRef = React.createRef();
  constructor(props) {
    super(props);

    this.state.theme = this.getCookie("currentTheme", "theme");
    this.state.themeType = this.getCookie("currentThemeType", "themeType");
    this.state.animation = this.getCookie("currentAnim", "anim");
  }

  state = {
    title: "Reaculator",
    theme: "Ocean",
    themeType: "color",
    animation: "",
    calculationData: {
      className: "calculation",
      value: "",
    },
    displayClass: "display",
    resultData: {
      className: "result",
      value: "",
      defaultClass: "result",
      errorClass: "result_err",
    },
    animationData: {
      animations: ["slither", "fireworks", "twist"],
      currentSetting: "slither",
      onClick: (e) => this.onSelectAnim(e),
    },
    canvasId: "cvs",
    sidebarIsOpen: false,
    circle1IsOpen: false,
    circle2IsOpen: false,
    circle3IsOpen: false,

    keyErr: false,
    numberKeyboardClass: "keyboard-number",
    functionKeyboardClass: "keyboard-function",
    utilityKeyboardClass: "keyboard-utility",
    num1: "",
    num2: "",
    op1: "",
    op2: "",
    dotRgx: /\./g,
    dotRgxD: /(\.)/d,
    numRgx: /(\d+)/g,
    mathOpRgx: /([+\-x\/ysr=])/gi,
    utilOpRgx: /[acm]/gi,
    dblMthOpRgx: /[+\-x\/y]/gi,
    snglMthOpRgx: /[sr]/gi,
    dotRgxNnGr: /\./,
    dotRgxDNnGr: /\./d,
    numRgxNnGr: /(\d+)/,
    mathOpRgxNnGr: /[+\-x\/ysr=]/i,
    utilOpRgxNnGr: /[acm]/i,
    dblMthOpRgxNnGr: /[+\-x\/y]/i,
    snglMthOpRgxNnGr: /[sr]/i,
    userInput: "",
  };

  componentDidMount() {
    document.addEventListener("keydown", (e) => this.handleKeyPress(e));

    let _id = "anim-script",
      _scriptName = this.state.animationData.currentSetting;

    if (this.state.themeType === "anim") {
      var loadScript = function () {
        var tag = document.createElement("script");
        tag.id = _id;
        tag.async = false;
        let _src = `./anim-${_scriptName}.js`;
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
    let _id = "anim-script",
      _scriptName = this.state.animationData.currentSetting;

    if (
      this.state.themeType === "anim" &&
      this.state.animation !== nextState.animation
    ) {
      var loadScript = function () {
        var tag = document.createElement("script");
        tag.id = _id;
        tag.async = false;
        let _src = `./anim-${_scriptName}.js`;
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
      this.state.resultData.resultValue !== nextState.resultData.resultValue
    ) {
      this.setCalculationValue();
    }
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", (e) => this.handleKeyPress(e));
    // window.removeEventListener("load", this.handleLoad);
  }

  setCookie = (cookieData) => {
    let d = new Date();
    let year = d.getFullYear();
    let month = d.getMonth();
    let day = d.getDate();
    let expires = new Date(year + 1, month, day);

    const cookie = new Cookies();

    const path = cookieData.cookiePath;
    cookie.set(cookieData.cookieLabel, cookieData.cookieValue, path, expires);
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
    if (!(e.keyCode === 17) && !(e.keyCode === 16) && !(e.keyCode === 18)) {
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
    let { userInput } = { ...this.state };

    // if maths error then prevent all input except a for ac
    if (this.state.keyErr && inputData.key !== "a") {
      return;
    }

    if (
      this.state.op2 === "=" ||
      this.state.snglMthOpRgxNnGr.test(this.state.op1)
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

    if (this.state.utilOpRgxNnGr.test(key)) {
      this.handleUtilityOperator(key);
      return;
    }

    this.setState({ userInput }, this.parseUserInput);
  };

  handleUtilityOperator = (key) => {
    let resultData = { ...this.state.resultData };

    if (key === "a") {
      resultData.resultValue = "";
      resultData.resultClass = this.state.resultData.resultDefaultClass;

      this.setState(
        {
          num1: "",
          num2: "",
          op1: "",
          op2: "",
          resultData,
          userInput: "",
          keyErr: false,
        }
        // this.setCalculationValue
      );
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
    const mathOpRgx = this.state.mathOpRgx;
    const numRgxNnGr = this.state.numRgxNnGr;
    const dotRgxNnGr = this.state.dotRgxNnGr;
    const dotRgx = this.state.dotRgx;
    const dotRgxD = this.state.dotRgxD;

    const re =
      /([-]?\d*\.?\d*)([srx\-+\/my]?)([-]?\d*\.?\d*)([srx\-=+\/my]?)/dgi;

    let matches = re.exec(this.state.userInput);

    let matchesNum1 = matches[1],
      matchesOp1 = matches[2],
      matchesNum2 = matches[3],
      matchesOp2 = matches[4];

    let { num1, num2, op1, op2, userInput } = { ...this.state };

    if (this.state.resultData.resultValue) {
      // _userInput = userInput;
      // input = this.preProcessUserInput(input);
    }

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
    if (+userInput === 0 && !this.state.dotRgxNnGr.test(userInput)) {
      this.setState({ userInput: "0", num1: "0" });
      return;
    }

    // single maths op in op2
    if (
      op1 &&
      op1 !== "" &&
      this.state.dblMthOpRgxNnGr.test(op1) &&
      this.state.snglMthOpRgxNnGr.test(userInput.slice(-1)) &&
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
    if (this.state.dotRgxNnGr.test(num)) {
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
   * -  resultValue
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
    let { userInput } = { ...this.state };
    let _resVal = this.state.resultData.resultValue;

    // single maths
    // maths op
    if (
      userInput &&
      userInput.length > 0 &&
      this.state.snglMthOpRgxNnGr.test(this.state.op1) &&
      this.state.mathOpRgxNnGr.test(inputData.key)
    ) {
      //
      this.setState({ num1: _resVal });
      return _resVal;
    } else if (
      userInput &&
      userInput.length > 0 &&
      this.state.snglMthOpRgxNnGr.test(this.state.op1) &&
      /^-?\d+$/.test(inputData.key)
    ) {
      //
      this.setState({
        op1: "",
        resultData: { ...this.state.resultData, resultValue: "" },
      });
      return "";
    }
    // double maths
    // maths operator pressed
    if (
      userInput &&
      userInput.length > 0 &&
      (this.state.op2 === "=" ||
        this.state.snglMthOpRgxNnGr.test(this.state.op1)) &&
      this.state.mathOpRgxNnGr.test(inputData.key)
    ) {
      let _resVal = this.state.resultData.resultValue;
      // resultValue = "";

      // this.setState({
      //   access: {
      //     ...this.state.access,
      //     hospital_id: 1,
      //   },
      // });

      this.setState({
        num1: _resVal,
        op1: inputData.key,
        num2: "",
        op2: "",
        resultData: { ...this.state.resultData, resultValue: "" },
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
      // resultValue = "";
      this.setState({
        num1: "",
        op1: "",
        num2: "",
        op2: "",
        // resultData,
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
      // resultValue = "";
      this.setState({
        num1: "",
        op1: "",
        num2: "",
        op2: "",
        // resultData,
      });
      return "";
    }
  };

  setResultData = (data, callback) => {
    let resultData = { ...this.state.resultData };
    // resultData = {};

    if (data.resultClass) {
      resultData.resultClass = data.resultClass;
    } else {
      resultData.resultClass = this.state.resultData.resultDefaultClass;
    }
    if (data.resultValue) {
      resultData.resultValue = data.resultValue;
    } else {
      resultData.resultValue = resultData.resultValue;
    }
    if (callback) {
      this.setState({ resultData }, () => callback());
    } else {
      this.setState({ resultData });
    }
  };

  formatDecimal = (numToProcess) => {
    const _dotRgx = this.state.dotRgx;
    let dotMatch,
      dotMatch2,
      dotMatches = [],
      dotMatches2 = [];

    while ((dotMatch = _dotRgx.exec(numToProcess)) != null) {
      dotMatches.push(dotMatch.index);
    }

    do {
      dotMatches2.push(dotMatch2);
    } while ((dotMatch2 = _dotRgx.exec(numToProcess)) != null);

    // return;

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
    e.stopPropagation();
    let _isOpen = this.state.sidebarIsOpen;

    if (!_isOpen) {
      _isOpen = true;
    } else {
      _isOpen = false;
    }

    this.setState({ sidebarIsOpen: _isOpen });
  };

  closeSidebar = (e) => {
    e.stopPropagation();
    this.setState({
      sidebarIsOpen: false,
      circle1IsOpen: false,
      circle2IsOpen: false,
      circle3IsOpen: false,
    });
  };

  showKeyboard = (e) => {
    console.log("hit showKeyboard _isOpen: ", this.state.sidebarIsOpen, e);
    e.stopPropagation();
    let _circleData;
    let _key = "IsOpen";
    // only allow interaction on visible sidebar
    if (this.state.sidebarIsOpen) {
      // if (e.target.id === "circle1") {
      //   this.setState({ circle1IsOpen: true });

      //   // _circleData.showing = true;
      //   this.setState({ circle1Data: _circleData });
      // } else {
      //   _circleData = { ...this.state.circle2Data };
      //   _circleData.showing = true;
      //   this.setState({ circle2Data: _circleData });
      // }
      _key = _key.replace(/^/, e.target.id);
      console.log(_key);
      this.setState({ [_key]: true });
    }
  };

  onSelectThemeType = (e) => {
    e.stopPropagation();
    let cookieData = {};
    let _themeTypeData = { ...this.getKeyboardData("theme-type") };
    // let _themeTypeData = { ...this.state.themeTypeKeyboardData };
    _themeTypeData.currentSetting = e.target.value;
    cookieData.cookieLabel = "currentThemeType";
    cookieData.cookieValue = _themeTypeData.currentSetting;
    cookieData.cookiePath = "/";
    this.setState({
      themeTypeKeyboardData: _themeTypeData,
      themeType: _themeTypeData.currentSetting,
    });
    this.setCookie(cookieData);
  };

  onSelectTheme = (e) => {
    e.stopPropagation();
    let cookieData = {};
    let _themesData = { ...this.state.themesKeyboardData };
    _themesData.currentSetting = e.target.id;
    cookieData.cookieLabel = "currentTheme";
    cookieData.cookieValue = _themesData.currentSetting;
    cookieData.cookiePath = "/";
    this.setState({
      themesData: _themesData,
      theme: _themesData.currentSetting,
    });
    this.setCookie(cookieData);
  };

  onSelectAnim = (e) => {
    e.stopPropagation();
    let cookieData = {};
    let _animData = { ...this.state.animationData };
    _animData.currentSetting = e.target.value;
    cookieData.cookieLabel = "currentAnim";
    cookieData.cookieValue = _animData.currentSetting;
    cookieData.cookiePath = "/";
    this.setState({
      animationData: _animData,
      animation: _animData.currentSetting,
    });
    this.setCookie(cookieData);
  };

  getKeyboardData = (name) => {
    let _keyboardData = {};
    while (typeof _keyboardData === "undefined") {
      keyboards.forEach((keyboard) => {
        if (keyboard.name === name) {
          _keyboardData.keyboard = keyboard;
          _keyboardData.keyErr = this.state.keyErr;
        }
      });
    }
    return _keyboardData;
  };

  getKeyboard = (keyboardName) => {
    return keyboards.find((keyboard) => {
      return keyboard.name === keyboardName ? keyboard : undefined;
    });
  };

  getSidebarData = (themeType) => {
    let sidebarData = {
      isOpen: this.state.sidebarIsOpen,
    };
    let components = [
      { keyboard: "theme-type", isOpen: this.state.circle1IsOpen },
      { keyboard: "theme", isOpen: this.state.circle2IsOpen },
    ];
    sidebarData.circleOnClick = this.showKeyboard;

    if (themeType === "anim") {
      components.push({
        keyboard: "animation",
        isOpen: this.state.circle3IsOpen,
      });
    }
    sidebarData.components = components;
    return sidebarData;
  };

  setCalculationValue = () => {
    console.log("hit setCalculationValue");
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

    if (_num1 === "." || this.state.dotRgxNnGr.test(_num1)) {
      _num1 = processDecimal(_num1);
    } else if (_num2 === "." || (this.state.dotRgxNnGr.test(_num2) && op2)) {
      _num2 = processDecimal(_num2);
    }

    // if (op2) {
    //   _num2 = processDecimal(_num2);
    // }

    calculationData.calculationValue = _num1 + _op1 + _num2;
    // calculationData = calculationData;
    if (
      calculationData.calculationValue !==
      this.state.calculationData.calculationValue
    ) {
      this.setState({ calculationData });
    }
  };

  //  resultData: { resultClass: "result", resultValue: "0" }
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
      resultData.resultValue = "Hello Baba, \uD83D\uDC95 you!";
      resultData.resultClass = "baba";
      this.setResultData(resultData, null);
      return;
    } else if (
      this.state.num1 + this.state.op1 + this.state.num2 ===
      "404-545"
    ) {
      resultData.resultValue = "Bye Baba, miss you \uD83D\uDC96";
      resultData.resultClass = "baba";
      this.setResultData(resultData, null);
      return;
    }

    // no operator
    if (!_op || _op === "") return;

    // dble number maths but no num2
    if (
      this.state.dblMthOpRgxNnGr.test(_op) &&
      (!_num2 || _num2 === "") &&
      _num2 !== 0
    ) {
      return;
    }

    if (!this.state.snglMthOpRgxNnGr.test(_op) && (!_op2 || _op2 === "")) {
      return;
    }

    // switch statement rather than if else
    switch (_op) {
      case "r": {
        resultData.resultValue = Math.sqrt(_num1);
        break;
      }
      case "s": {
        if (_num1 === 0) resultData.resultValue = 1;
        else resultData.resultValue = Math.pow(_num1, 2);
        break;
      }
      case "+": {
        resultData.resultValue = _num1 + _num2;
        break;
      }
      case "-": {
        resultData.resultValue = _num1 - _num2;
        break;
      }
      case "x": {
        resultData.resultValue = _num1 * _num2;
        break;
      }
      case "y": {
        resultData.resultValue = Math.pow(_num1, _num2);
        break;
      }
      case "/": {
        resultData.resultValue = _num1 / _num2;
        break;
      }
      default: {
        break;
      }
    }

    if (resultData.resultValue.length > 13) {
      resultData.resultValue = this.formatResult(resultData.resultValue);
    } else {
      resultData.resultValue = String(resultData.resultValue);
    }
    this.setState({ resultData }, () => this.postResultClearUp());
    // this.setState(resultData);
  };

  formatResult = (resValue) => {
    return String(resValue.toExponetial());
  };

  postResultClearUp = () => {
    let { resultValue } = { ...this.state.resultData };
    let { num1, num2, op1, op2, userInput } = { ...this.state };

    if (!isFinite(resultValue)) {
      this.setResultErrorClass();
      return;
    }

    if (op2 !== "=" && op1 !== "s" && op1 !== "r") {
      num1 = resultValue;
      num2 = "";
      op1 = op2;
      op2 = "";
      // userInput = "";
      userInput = resultValue + op1;
    }
    // } else {
    //   op2 = op2;
    //   num1 = num1;
    //   num2 = num2;
    //   op1 = op1;
    //   // _userInput = "";
    //   // _userInput = resultValue;
    // }

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

  render = () => {
    return (
      <Container
        className={`container ${
          this.state.sidebarIsOpen === true ? "open" : ""
        } ${this.state.themeType} ${this.state.theme.toLowerCase()}`}
        sx={{ p: "0!important" }}
      >
        {/* ------------ app ---------------- */}
        {/* ------------ display and keyboards---------------- */}
        <Grid
          onClick={this.closeSidebar}
          onTouchStart={this.closeSidebar}
          direction={"column"}
          id="canvas-container"
          className={"calculator"}
          meta-name="display and keyboards"
        >
          <p
            className="settings"
            onClick={this.toggleSidebar}
            onTouchStart={this.toggleSidebar}
          >
            <i className="fa fa-cog" aria-hidden="true"></i>
          </p>
          <Canvas ref={this.animate} canId={this.state.canvasId} />
          <Typography className="title">{this.state.title}</Typography>
          {/* ------------ display ---------------- */}
          <Display
            calculationData={this.state.calculationData}
            resultData={this.state.resultData}
            displayClass={this.state.displayClass}
          />
          {/* ------------ main keyboards ---------------- */}
          <Grid container className="" meta-name="main keyboards">
            <Grid item xs={6} md={6} className="">
              <Keyboard props={this.getKeyboard("number")}></Keyboard>
            </Grid>
            <Grid item xs={6} md={6} className="">
              <Keyboard props={this.getKeyboard("function")}></Keyboard>
            </Grid>
            <Grid item xs={12} md={12} className="">
              <Keyboard props={this.getKeyboard("utility")}></Keyboard>
            </Grid>
          </Grid>
        </Grid>
        {/* ------------ sidebar ---------------- */}
        <Sidebar props={this.getSidebarData(this.state.themeType)} />
      </Container>
    );
  };
}

export default Calculator;
