import React, { Component } from "react";
import "./styles/main.scss";
import Display from "./components/display";
import Keyboard from "./components/keyboard";
import Canvas from "./components/canvas";
import Cookies from "universal-cookie";
import { themeKeys } from "./js/keys";
import { numberKeys } from "./js/keys";
import { functionKeys } from "./js/keys";
import { utilityKeys } from "./js/keys";
import { allowedKeys } from "./js/keys";
import { themeTypeKeys } from "./js/keys";
import { animKeys } from "./js/keys";

class Calculator extends Component {
  displayRef = React.createRef();
  canvasRef = React.createRef();
  constructor(props) {
    super(props);

    this.state.theme = this.getCookie("currentTheme", "theme");
    this.state.themeType = this.getCookie("currentThemeType", "themeType");
    this.state.animation = this.getCookie("currentAnim", "anim");
    this.numberKeys = numberKeys;
    this.functionKeys = functionKeys;
    this.utilityKeys = utilityKeys;
    this.allowedKeys = allowedKeys;
    this.themeTypeKeys = themeTypeKeys;
    this.themeKeys = themeKeys;
    this.animKeys = animKeys;
  }

  state = {
    title: "Reaculator",
    theme: "Ocean",
    themeType: "color",
    animation: "",
    calculationData: {
      calculationClass: "calculation",
      calculationValue: "",
    },
    displayClass: "col display",
    resultData: {
      resultClass: "result",
      resultCount: 0,
      resultValue: "",
      resultInitValue: "0",
    },
    resultDefaultClass: "result",
    resultErrorClass: "result_err",
    sidebarData: {
      sidebarClass: "sidebar",
      sidebarValue: "Settings",
      isOpen: false,
    },

    sidebarKeyboards: "",

    circleDefaultClassName: "circle",
    circle1Data: { id: "circle1", className: "circle-1", showing: false },
    circle2Data: { id: "circle2", className: "circle-2", showing: false },
    visibleClassName: "showing",
    currentSidebarSecondKeyboard: "",
    defaultSidebarSecondKeyboard: "themesKeyboardData",
    animationData: {
      animations: ["slither", "fireworks", "twist"],
      currentSetting: "slither",
      onClick: (e) => this.onSelectAnim(e),
    },
    canvasId: "cvs",
    keyboards: [
      {
        name: "number",
        keyboardTitle: "Number Keyboard",
        className: "keyboard-number",
        kb: "num",
        keys: numberKeys,
        onClick: (e) => this.handleClick(e),
      },
      {
        name: "function",
        keyboardTitle: "Function Keyboard",
        className: "keyboard-function",
        kb: "func",
        keys: functionKeys,
        onClick: (e) => this.handleClick(e),
      },
      {
        name: "utility",
        keyboardTitle: "Utility Keyboard",
        className: "keyboard-utility",
        kb: "util",
        keys: utilityKeys,
        onClick: (e) => this.handleClick(e),
      },
      {
        name: "theme-type",
        keyboardTitle: "Select Theme Type",
        className: "keyboard-theme-type",
        kb: "theme-type",
        keys: themeTypeKeys,
        onClick: (e) => this.onSelectThemeType(e),
      },
      {
        name: "theme",
        keyboardTitle: "Select Theme",
        className: "keyboard-theme",
        kb: "theme",
        keys: themeKeys,
        onClick: (e) => this.onSelectTheme(e),
      },
      {
        name: "animations",
        className: "keyboard-theme",
        keyboardTitle: "Select Animation",
        kb: "anim",
        keys: [
          { keys: themeKeys, onClick: (e) => this.onSelectTheme(e) },
          { keys: animKeys, onClick: (e) => this.onSelectAnim(e) },
        ],
      },
    ],
    numberKeyboardClass: "keyboard-number",
    functionKeyboardClass: "keyboard-function",
    utilityKeyboardClass: "keyboard-utility",
    num1: "",
    num2: "",
    op1: "",
    op2: "",
    dotRgx: /\./g,
    numRgx: /(\d+)/g,
    mathOpRgx: /([+\-x\/ysr=])/gi,
    utilOpRgx: /[acm]/gi,
    dblMthOpRgx: /[+\-x\/y]/gi,
    snglMthOpRgx: /[sr]/gi,
    dotRgxNnGr: /\./,
    numRgxNnGr: /(\d+)/,
    mathOpRgxNnGr: /[+\-x\/ysr=]/i,
    utilOpRgxNnGr: /[acm]/i,
    dblMthOpRgxNnGr: /[+\-x\/y]/i,
    snglMthOpRgxNnGr: /[sr]/i,
    userInput: "",
  };

  componentDidMount() {
    // console.log("componentDidMount");
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

    const cookies = new Cookies();

    const path = cookieData.cookiePath;
    cookies.set(cookieData.cookieLabel, cookieData.cookieValue, path, expires);
  };

  getCookie = (cookieLabel, cookieDefault) => {
    const cookies = new Cookies();
    return cookies.get(cookieLabel)
      ? cookies.get(cookieLabel)
      : this.state[cookieDefault];
  };

  handleClick = (e) => {
    // console.log("189: handleClick", e);
    e.target.blur();
    const keyClicked = this.utilityKeys
      .concat(this.numberKeys, this.functionKeys)
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
    // console.log("207: handleKeyPress", e);
    var _code = e.keyCode;
    var _key = this.utilityKeys
      .concat(this.numberKeys, this.functionKeys)
      .filter((k) => {
        return k.keycode === e.keyCode;
      })[0];

    if (!e.keyCode === 17) {
      var _button = document.getElementById(_key.id);
    }
    if (!e.repeat) {
      if (_button === null || _button === undefined) {
        // console.log("local_button equals null"); // do thing
      } else if (_button !== null || _button !== undefined) {
        _button.focus(timeout);
        var timeout = setTimeout(() => _button.blur(), 200);
      }
      if (this.allowedKeys.includes(e.keyCode)) {
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
    // console.log("269: handleUserInput inputData: ", inputData);
    let _userInput;
    let { userInput } = this.state;

    const key = inputData.key;
    const shiftKey = inputData.shiftKey;
    const ctrlKey = inputData.ctrlKey;
    const keyCode = inputData.keyCode;
    _userInput = userInput;

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
      _userInput += key;
    }

    // compound input
    // allow "+" => shift & "=" key
    if (shiftKey && keyCode === 187) {
      _userInput += key;
    }

    if (this.state.utilOpRgxNnGr.test(key)) {
      this.handleUtilityOperator(key);
      return;
    }
    this.setState({ userInput: _userInput }, this.parseUserInput);
  };

  handleUtilityOperator = (key) => {
    let resultData = { ...this.state.resultData };
    console.log("490: handleUtilityOperator key:", key, "key", key);

    if (key === "a") {
      console.log("ac pressed");
      resultData.resultValue = "0";
      resultData.resultCount = 0;
      resultData.resultClass = this.state.resultDefaultClass;

      this.setState(
        {
          num1: "",
          num2: "",
          op1: "",
          op2: "",
          resultData,
          userInput: "",
          keyErr: false,
        },
        this.setCalculationValue
      );
    }
    if (key === "c") {
      let { userInput } = this.state;
    }
    // if (key === "=") {
    //   console.log(
    //     `297: num1: ${this.state.num1} num2: ${this.state.num2} op1: ${this.state.op1} op2: ${this.state.op2}`
    //   );
    //   if (
    //     this.state.num1 &&
    //     this.state.num1 !== "" &&
    //     this.state.num2 &&
    //     this.state.num2 !== ""
    //   ) {
    //     console.log("304: hit");
    //     this.updateOperator("=");
    //   }
    // }
  };

  parseUserInput = () => {
    const mathOpRgxNnGr = this.state.mathOpRgxNnGr;
    const numRgxNnGr = this.state.numRgxNnGr;
    const dotRgxNnGr = this.state.dotRgxNnGr;
    // const resultData = {...this.state.resultData}
    let _userInput;

    let { userInput } = this.state;

    console.log(`373 ######### parseUserInput ${userInput} #########`);

    let _num1, _num2, _op1, _op2;

    if (this.state.resultData.resultValue) {
      // _userInput = userInput;
      // input = this.preProcessUserInput(input);
    }

    // exceptions
    ////
    // handle operators entered before numerals
    // reset user input
    // allow "." as we see below in [b]

    if (
      isNaN(userInput.charAt(0)) &&
      userInput.length === 1 &&
      userInput.charAt(0) !== "."
    ) {
      console.log("hit NaN");
      this.setState({ userInput: "" });
      return;
    }

    // [a]  repeated 0
    // handles  00 or 00000 or 00000000000
    // cast input to a number
    // strings such as "00000" = 0 when cast
    // dotRgx.test excludes "0." because when cast === 0 therefore we would lose the .
    console.log(userInput, +userInput, +userInput === 0);
    if (+userInput === 0 && this.state.dotRgx.test(userInput) === false) {
      console.log("hit pure 0");
      // userInput = "0";
      this.setState({ userInput: "0" });
    }
    this.state.dotRgx.lastIndex = 0;

    // [b]  handle "0." and "."
    // if user types a decimal place without a zero
    //  then we assume they intended to write a 0.x decimal
    //  therefore we replace "." with "0."
    if (
      (+userInput === 0 && this.state.dotRgx.test(userInput) === true) ||
      userInput === "."
    ) {
      console.log("hit 0. or .", userInput);
      this.setState({ userInput: "0." });
    }

    //  at this point we should have only
    // "0" or "0."
    // or any integer eg "123" or "34"
    //  or a float eg. "9." or 2.03

    // now we need to handle multipe dots eg. "x.xx."
    // if multiple dots are found we remove the last char as that is where it has to be found
    if (
      userInput.match(this.state.dotRgx) &&
      userInput.match(this.state.dotRgx).length > 1
    ) {
      console.log("multiple dots ", userInput.match(this.state.dotRgx).length);
      this.setState({ userInput: userInput.slice(0, -1) });
    }

    // handle operators in input string
    if(userInput.slice(-1).test) {

    }


    // if (this.state.op2 === "=") {
    //   this.setState({ userInput: "", num2: "" });
    //   return;
    // }
    // exceptions
    //
    // handle single leading dot
    // if (this.state.dotRgxNnGr.exec(userInput) !== null) {
    //   this.setState({ userInput: this.formatDecimal(userInput) });
    // }

    // if (this.state.mathOpRgxNnGr.exec(userInput) !== null) {
    // if (!_userInput) {
    this.makeNumbersAndOperators(userInput);
    // } else {
    //   this.makeNumbersAndOperators(_userInput);
    // }
  };

  /**
   *

  * @param input
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
  preProcessUserInput = (input) => {
    // check if "=" was pressed to get a result followed by a number
    // if it is then the previous function (post Result clearup)
    // has put the previous result into userInput
    // ** this is not desirable
    //
    // so we:
    // 1. isolate the last char entered
    // 2. replace userInput with it
    // 3. wipe clean the result - set it "0"

    // he user has entered = after result
    // delete last char
    //set userInput as result
    if (this.state.resultData.resultValue) {
      if (input.length > 0 && input.charAt(input.length - 1) === "=") {
        this.setState({ userInput: input.substr(0, input.length - 1) });
        return;
      }
      if (
        this.state.op2 === "=" &&
        userInput
          .charAt(userInput.length - 1)
          .match(this.state.mathOpRgxNnGr) === null
      ) {
        _userInput = userInput.charAt(userInput.length - 1);
        this.setState({ userInput: _userInput });
        _resultData.resultValue = "0";
        this.setResultData(_resultData, null);
      }

      if (
        this.state.op2 === "=" &&
        userInput
          .charAt(userInput.length - 1)
          .match(this.state.mathOpRgxNnGr) !== null
      ) {
        const opIdx = userInput.length - 1;
        _op1 = userInput.substr(opIdx);
        _userInput = this.state.resultData.resultValue + _op1;
        this.setState({ userInput: _userInput });
        _resultData.resultValue = "0";
        this.setResultData(_resultData, null);
      }
    }
  };

  setResultData = (data, callback) => {
    let resultData = { ...this.state.resultData },
      _resultData = {};

    if (data.resultClass) {
      _resultData.resultClass = data.resultClass;
    } else {
      _resultData.resultClass = this.state.resultDefaultClass;
    }
    if (data.resultValue) {
      _resultData.resultValue = data.resultValue;
    } else {
      _resultData.resultValue = resultData.resultValue;
    }
    if (data.resultCount) {
      _resultData.resultCount = data.resultCount;
    } else {
      _resultData.resultCount = resultData.resultCount;
    }
    if (callback) {
      this.setState({ resultData: _resultData }, () => callback());
    } else {
      this.setState({ resultData: _resultData });
    }
  };

  makeNumbersAndOperators = (input) => {
    let _opRgxOuter = /[+\-x\/ysr=]/i,
      _opRgxLoop = /[+\-x\/ysr=]/gi,
      _opRgxLoopInnerTest = /[+\-x\/ysr=]/gi,
      dotRgxNnGr = this.state.dotRgxNnGr,
      _count = 0,
      _frstOpIdx,
      _scndOpIdx,
      _num1,
      _num2,
      _op1,
      _op2,
      { num1 } = this.state,
      { num2 } = this.state,
      { op1 } = this.state,
      { op2 } = this.state,
      matches = [],
      match,
      loops = 0;

    while (_opRgxLoop.exec(input) !== null) {
      ++loops;
    }

    if (loops === 0) {
      this.setState({ num1: input });
    }
    for (var i = 0; i < loops; i++) {
      if (!num1) {
      }
    }

    // if(op1 && op2) {
    //   this.doMath();
    // }

    // this.setState(
    //   { num1: _num1, num2: _num2, op1: _op1, op2: _op2 },
    //   this.goForMath
    // );
  };

  formatDecimal = (decimal) => {
    let _formattedDecimal,
      dotRgx = /\./g,
      _count = 0,
      matches;

    if (decimal.length === 1) {
      console.log("con 1");
      return "0.";
    } else {
      while ((matches = dotRgx.exec(decimal)) !== null) {
        console.log(matches, matches.length);
        _count++;
      }
      if (_count === 1) {
        if (decimal.charAt(0) === ".") {
          console.log("con 2", _count, decimal);
          return "0" + decimal;
        }
        console.log(_count, matches);
      }

      if (_count > 1) {
        console.log("con 3", _count, decimal);

        _formattedDecimal = decimal.substring(0, decimal.length - (_count - 1));
      }

      if (typeof _formattedDecimal !== "undefined") {
        return _formattedDecimal;
      } else {
        return decimal;
      }
    }
  };

  formatDots = (decimal) => {
    //
    let _formattedDecimal,
      dotRgx = /\./g,
      _count = 0;
    return "0.";
  };

  toggleSidebar = (e) => {
    e.stopPropagation();
    let sidebarData = { ...this.state.sidebarData };
    let _isOpen = sidebarData.isOpen;

    // test if body touched (not menu icon)
    // if (
    //   e.target.className !== "fa fa-cog" ||
    //   e.target.className !== "settings"
    // ) {
    //   // if sidebar open allow touch on calculator body  to close sidebar
    //   if (isOpen) {
    //     isOpen = false;
    //     sidebarData.isOpen = isOpen;
    //     this.setState({ sidebarData });
    //   } else {
    //     isOpen = true;
    //     sidebarData.isOpen = isOpen;
    //     this.setState({ sidebarData });
    //   }
    // } else {
    if (!_isOpen) {
      _isOpen = true;
    } else {
      _isOpen = false;
    }

    sidebarData.isOpen = _isOpen;
    // }
    this.setState({ sidebarData });
  };

  closeSidebar = (e) => {
    let _sidebarData = { ...this.state.sidebarData },
      _circle1Data = { ...this.state.circle1Data },
      _circle2Data = { ...this.state.circle2Data };

    _sidebarData.isOpen = false;
    _circle1Data.showing = false;
    _circle2Data.showing = false;

    this.setState({
      sidebarData: _sidebarData,
      circle1Data: _circle1Data,
      circle2Data: _circle2Data,
    });
  };

  showKeyboard = (e) => {
    e.stopPropagation();
    let _circleData;
    // only allow interaction on visible sidebar
    if (this.state.sidebarData.isOpen) {
      if (e.target.id === "circle1") {
        _circleData = { ...this.state.circle1Data };
        _circleData.showing = true;
        this.setState({ circle1Data: _circleData });
      } else {
        _circleData = { ...this.state.circle2Data };
        _circleData.showing = true;
        this.setState({ circle2Data: _circleData });
      }
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

  keyboardLoader = (kbName) => {
    console.log(kbName.target.id);
    let _kbData,
      _kbCurrent = this.state.currentSidebarSecondKeyboard,
      _kbsAvalaible = this.state.keyboards,
      _id = kbName.target.id;
    this.setState({ currentSidebarSecondKeyboard: kbName.target.id });
    // switch(_id) {
    //     case "picture": {
    //       //
    //       console.log("hit", _id);
    //       // _kbData = this
    //       this.setState({currentSidebarKeyboard : _id})
    //       break;
    //     }
    //     case "color": {
    //       //
    //       console.log("hit", _id);
    //       this.setState({currentSidebarKeyboard : _id})
    //       break;
    //     }
    //     case "anim": {
    //       //
    //       console.log("hit", _id);
    //       this.setState({currentSidebarKeyboard : _id})
    //       break;
    //     }
    //     case "": {
    //       //
    //       break;
    //     }
    //     case "": {
    //       //
    //       break;
    //     }
    //     case "": {
    //       //
    //       break;
    //     }
    //     case "": {
    //       //
    //       break;
    //     }
    //     default: {
    //       break;
    //     }
    //   }
  };

  getKeyboardData = (keyboardName) => {
    let _kb;
    while (typeof _kb === "undefined") {
      this.state.keyboards.forEach((element) => {
        if (element.name === keyboardName) {
          _kb = element;
        }
      });
    }
    return _kb;
  };

  getCircleClasses = (position) => {
    let _circleData;
    if (position === 1) {
      _circleData = this.state.circle1Data;
    } else if (position === 2) {
      _circleData = this.state.circle2Data;
    }
    return _circleData.showing
      ? this.state.circleDefaultClassName +
          " " +
          _circleData.className +
          " " +
          this.state.visibleClassName
      : this.state.circleDefaultClassName + " " + _circleData.className;
  };

  getCircleId = (position) => {
    let _circleData;
    if (position === 1) {
      _circleData = this.state.circle1Data;
    } else if (position === 2) {
      _circleData = this.state.circle2Data;
    }
    return _circleData.id;
  };

  goForMath = () => {
    this.setCalculationValue();
    let mathObj = {};
    if (
      typeof this.state.num1 !== "undefined" &&
      typeof this.state.op1 !== "undefined" &&
      this.state.op1.match(this.state.snglMthOpRgx)
    ) {
      mathObj.type = "single";
      this.doMath(mathObj);
    } else if (
      typeof this.state.num1 !== "undefined" &&
      typeof this.state.op1 !== "undefined" &&
      typeof this.state.num2 !== "undefined" &&
      typeof this.state.op2 !== "undefined" &&
      this.state.op1.match(this.state.dblMthOpRgx) &&
      this.state.op2.match(this.state.dblMthOpRgx)
    ) {
      mathObj.type = "double";
      this.doMath(mathObj);
    } else if (
      typeof this.state.num1 !== "undefined" &&
      typeof this.state.op1 !== "undefined" &&
      typeof this.state.num2 !== "undefined" &&
      typeof this.state.op2 !== "undefined" &&
      this.state.op1.match(this.state.dblMthOpRgx) &&
      this.state.op2 === "="
    ) {
      mathObj.type = "double";
      this.doMath(mathObj);
    }
  };

  setCalculationValue = () => {
    let calcDataObj = {};

    let _op1;
    const { num1 } = this.state,
      { num2 } = this.state,
      { op1 } = this.state;

    let calculationData = { ...this.state.calculationData };

    const setCalculationDisplayChar = (op) => {
      return this.functionKeys
        .filter((k) => k.value === op)
        .filter((k) => {
          if ("calculationDisplayChar" in k) return k;
        });
    };

    if (op1) {
      _op1 =
        setCalculationDisplayChar(op1).length > 0
          ? setCalculationDisplayChar(op1)[0].calculationDisplayChar
          : op1;
    }

    if (typeof calcDataObj.calculationValue === "undefined") {
      calcDataObj.calculationValue = "";
    }
    calcDataObj.calculationValue += num1 ? num1 : "";
    if (!_op1) {
      calcDataObj.calculationValue += op1 ? op1 : "";
    } else {
      calcDataObj.calculationValue += _op1;
    }
    calcDataObj.calculationValue += num2 ? num2 : "";

    if (calculationData.calculationClass) {
      calcDataObj.calculationClass = calculationData.calculationClass;
    }

    // console.log(
    //   "715: setCalculationValue calcDataObj: ",
    //   calcDataObj,
    //   "calculationData: ",
    //   calculationData
    // );
    calculationData = calcDataObj;
    this.setState({ calculationData });
  };

  //  resultData: { resultClass: "result", resultCount: 0, resultValue: "0" }
  doMath = (mathObj) => {
    console.log(`yaaay we're doing ${mathObj.type} math!`);

    let resultData = { ...this.state.resultData };
    const op = this.state.op1;
    const num1 = Number(this.state.num1);
    const num2 = Number(this.state.num2);
    let _resultData = {};

    if (this.state.num1 + this.state.op1 + this.state.num2 === "404+545") {
      _resultData.resultValue = "Hello Baba, \uD83D\uDC95 you!";
      _resultData.resultClass = "baba";
      this.setResultData(_resultData, null);
      return;
    } else if (
      this.state.num1 + this.state.op1 + this.state.num2 ===
      "404-545"
    ) {
      _resultData.resultValue = "Bye Baba, miss you \uD83D\uDC96";
      _resultData.resultClass = "baba";
      this.setResultData(_resultData, null);
      return;
    }

    if (!op || op == "") return;

    if (
      this.state.dblMthOpRgxNnGr.test(op) &&
      (!num2 || num2 === "") &&
      num2 !== 0
    ) {
      return;
    }
    switch (op) {
      case "r": {
        _resultData.resultValue = Math.sqrt(num1);
        break;
      }
      case "s": {
        if (num1 === 0) _resultData.resultValue = 1;
        else _resultData.resultValue = Math.pow(num1, 2);
        break;
      }
      case "+": {
        _resultData.resultValue = num1 + num2;
        break;
      }
      case "-": {
        _resultData.resultValue = num1 - num2;
        break;
      }
      case "x": {
        _resultData.resultValue = num1 * num2;
        break;
      }
      case "y": {
        _resultData.resultValue = Math.pow(num1, num2);
        break;
      }
      case "/": {
        _resultData.resultValue = num1 / num2;
        break;
      }
      default: {
        break;
      }
    }
    _resultData.resultCount = 1;
    // _resultData.resultValue = this.formatResult(_resultData.resultValue);
    this.setResultData(_resultData, () => this.postResultClearUp(mathObj));
  };

  formatResult = (resValue) => {
    if (resValue.length > 13) {
      return resValue.toExponetial();
    } else {
      return resValue;
    }
  };

  postResultClearUp = (mathObj) => {
    console.log("701 postResultClearUp", mathObj);
    let _userInput,
      _num1,
      _num2,
      _op1,
      _op2,
      _resultData = {},
      resultData = { ...this.state.resultData };
    if (!isFinite(resultData.resultValue)) {
      this.setResultErrorClass("result");
      this.setState({ keyErr: true });
      return;
    }
    const { num1 } = this.state,
      { num2 } = this.state,
      { op1 } = this.state,
      { op2 } = this.state;

    // console.log("713 resultData", resultData);

    if (op2 !== "=") {
      _op2 = "";
      _num1 = resultData.resultValue;
      _num2 = "";
      _op1 = op2;
      _userInput = resultData.resultValue + op2;
    } else {
      _op2 = op2;
      _num1 = num1;
      _num2 = num2;
      _op1 = op1;
      _userInput = resultData.resultValue;
    }

    if (resultData.resultClass) {
      _resultData.resultClass = resultData.resultClass;
    }
    if (resultData.resultValue) {
      _resultData.resultValue = resultData.resultValue;
    }
    _resultData.resultCount = 0;

    // save the 2nd operator to the 1st operatr
    // before blanking the 2nd operator
    // console.log("824 _resultData", _resultData);
    this.setState(
      {
        op1: _op1,
        op2: _op2,
        num1: _num1,
        num2: _num2,
        userInput: _userInput,
        // resultData: _resultData,
      },
      this.setCalculationValue
    );
  };

  setResultErrorClass = () => {
    let resultData = { ...this.state.resultData };
    let _resultData = {};
    _resultData.resultClass = this.state.resultErrorClass;
    this.setResultData(_resultData, null);
  };

  render = () => {
    const renderSecondSidebarKeyboard = () => {
      if (this.state.themeType === "anim") {
        return (
          <Keyboard kbData={this.getKeyboardData("animations")}></Keyboard>
        );
      } else {
        return <Keyboard kbData={this.getKeyboardData("theme")}></Keyboard>;
      }
    };

    return (
      <React.Fragment>
        <div
          className={`container ${
            this.state.sidebarData.isOpen === true ? "open" : ""
          } ${this.state.themeType} ${this.state.theme.toLowerCase()}`}
          // onClick={this.closeSidebar}
          // onTouchStart={this.closeSidebar}
        >
          {/* ------------ app ---------------- */}
          <div className="row flex-nowrap" meta-name="app">
            {/* ------------ display and keyboards---------------- */}
            <p
              className="settings"
              onClick={this.toggleSidebar}
              onTouchStart={this.toggleSidebar}
            >
              <i className="fa fa-cog" aria-hidden="true"></i>
            </p>
            <div
              id="canvas-container"
              className={`col calculator `}
              meta-name="display and keyboards"
            >
              <Canvas ref={this.animate} canId={this.state.canvasId} />
              <p className="title">{this.state.title}</p>
              {/* ------------ display ---------------- */}
              <div className="row g-0" meta-name="display">
                <Display
                  calculationData={this.state.calculationData}
                  resultData={this.state.resultData}
                  displayClass={this.state.displayClass}
                />
              </div>
              {/* ------------ main keyboards ---------------- */}
              <div className="row g-0" meta-name="main keyboards">
                <div className="col">
                  <Keyboard kbData={this.getKeyboardData("number")}></Keyboard>
                </div>
                <div className="col">
                  <Keyboard
                    kbData={this.getKeyboardData("function")}
                  ></Keyboard>
                  <Keyboard kbData={this.getKeyboardData("utility")}></Keyboard>
                </div>
              </div>
            </div>
            {/* ------------ sidebar ---------------- */}
            <div
              className="col sidebar "
              // className=" col"
              meta-name="sidebar"
            >
              <div className="h-50 sidebar-keyboard-wrapper">
                <div
                  id={this.getCircleId(1)}
                  className={this.getCircleClasses(1)}
                  onClick={this.showKeyboard}
                ></div>
                {/* ------------ sidebar keyboards ---------------- */}
                <Keyboard
                  kbData={this.getKeyboardData("theme-type")}
                ></Keyboard>
              </div>
              <div className="h-50 sidebar-keyboard-wrapper">
                <div
                  id={this.getCircleId(2)}
                  className={this.getCircleClasses(2)}
                  onClick={this.showKeyboard}
                ></div>
                {renderSecondSidebarKeyboard()}
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  };
}

export default Calculator;
