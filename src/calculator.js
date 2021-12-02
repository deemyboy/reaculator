import React, { Component, useRef, useEffect } from "react";
import "./calculator.scss";
// import anim from "./static/anim";
import Display from "./components/display";
import Keyboard from "./components/keyboard";
import Sidebar from "./components/sidebar";
import Canvas from "./components/canvas";
import Cookies from "universal-cookie";
import { sidebarKeys } from "./keys";
import { numberKeys } from "./keys";
import { functionKeys } from "./keys";
import { utilityKeys } from "./keys";
import { allowedKeys } from "./keys";
import { themeTypeKeys } from "./keys";


class Calculator extends Component {
  displayRef = React.createRef();
  canvasRef = React.createRef();
  // console.log("canvasRef",canvasRef);
  // const canvasRef = useRef();
  constructor(props) {
    super(props);

    this.handleLoad = this.handleLoad.bind(this);

    
    this.state.theme = this.getCookie("currentTheme", "theme");
    this.state.themeType = this.getCookie("currentThemeType", "themeType");
    this.state.themesKeyboardData.currentSetting = this.getCookie(
      "currentTheme",
      "theme"
    );
    this.state.themeTypeKeyboardData.currentSetting = this.getCookie(
      "currentThemeType",
      "themeType"
    );
    this.sidebarKeys = sidebarKeys;
    this.numberKeys = numberKeys;
    this.functionKeys = functionKeys;
    this.utilityKeys = utilityKeys;
    this.allowedKeys = allowedKeys;
    this.themeTypeKeys = themeTypeKeys;

    // useEffect(() => {
    //   const divElement = elementRef.current;
    //   console.log(divElement); // logs <div>I'm an element</div>
    // }, []);
  }

  state = {
    canId:"cvs",
    calculationData: {
      calculationClass: "calculation",
      calculationValue: "",
    },
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
    num1: "",
    num2: "",
    op1: "",
    op2: "",
    themesKeyboardData: {
      labelForKeyboard: "Theme",
      currentSetting: "Ocean",
      onClick: (e) => this.onSelectTheme(e),
      itemsForKeyboard: sidebarKeys,
    },
    themeTypeKeyboardData: {
      labelForKeyboard: "Theme Type",
      currentSetting: "picture",
      onClick: (e) => this.onSelectThemeType(e),
      itemsForKeyboard: themeTypeKeys,
    },
    theme: "Ocean",
    themeType: "color",
    numberKeyboardClass: "keyboard-number",
    functionKeyboardClass: "keyboard-function",
    utilityKeyboardClass: "keyboard-utility",
    title: "Calculator",
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

animate = (e) => {
console.log("animate",e)
// anim();
}

  componentDidMount() {
    document.addEventListener("keydown", (e) => this.handleKeyPress(e));
    // window.addEventListener('load', this.handleLoad);
    // // anim();
    // const script = document.createElement("script");

    // script.src = "/static/anim.js";
    // script.async = true;

    // document.body.appendChild(script);

    var loadScript = function (src) {
      var tag = document.createElement('script');
      tag.async = false;
      tag.src = src;
      var body = document.getElementsByTagName('body')[0];
      body.appendChild(tag);
    }

    loadScript('./anim.js');
    this.animate()
  }

  componentDidUpdate(nextProps, nextState) {
    let resultData = { ...this.state.resultData };
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", (e) => this.handleKeyPress(e));
    window.removeEventListener('load', this.handleLoad);
  }

  
 handleLoad() {
  $("myclass") //  $ is available here
 }

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

  toggleSidebar = (e) => {
    let sidebarData = { ...this.state.sidebarData };
    let isOpen = sidebarData.isOpen;

    // test if body touched (not menu icon)
    if (
      e.target.className !== "menu-icon" &&
      e.target.className !== "icon-bar"
    ) {
      // if sidebar open allow touch on calculator body  to close sidebar
      if (isOpen) {
        isOpen = false;
        sidebarData.isOpen = isOpen;
        this.setState({ sidebarData });
      }
    } else {
      if (!isOpen) {
        isOpen = true;
      } else {
        isOpen = false;
      }

      sidebarData.isOpen = isOpen;
    }
    this.setState({ sidebarData });
  };

  packageKeyboardData = (keyboardUser) => {
    return this.state[keyboardUser];
  };

  onSelectTheme = (e) => {
    let cookieData = {};
    let _themesData = { ...this.state.themesKeyboardData };
    _themesData.currentSetting = e.target.innerHTML;
    cookieData.cookieLabel = "currentTheme";
    cookieData.cookieValue = _themesData.currentSetting;
    cookieData.cookiePath = { path: "/" };
    this.setState({
      themesData: _themesData,
      theme: _themesData.currentSetting,
    });
    this.setCookie(cookieData);
    // this.toggleSidebar(e);
  };

  onSelectThemeType = (e) => {
    let cookieData = {};
    let _themeTypeData = { ...this.state.themeTypeKeyboardData };
    _themeTypeData.currentSetting = e.target.value;
    cookieData.cookieLabel = "currentThemeType";
    cookieData.cookieValue = _themeTypeData.currentSetting;
    cookieData.cookiePath = { path: "/" };
    this.setState({
      themeTypeKeyboardData: _themeTypeData,
      themeType: _themeTypeData.currentSetting,
    });
    this.setCookie(cookieData);
    // this.selectThemeType(e);
    // this.toggleSidebar(e);
  };

  setCookie = (cookieData) => {
    let d = new Date();
    let year = d.getFullYear();
    let month = d.getMonth();
    let day = d.getDate();
    let expires = new Date(year + 1, month, day);

    const cookies = new Cookies();

    const path = cookieData.cookiePath;
    cookies.set(cookieData.cookieLabel, cookieData.cookieValue, {
      path,
      expires,
    });
  };

  getCookie = (cookieLabel, cookieDefault) => {
    const cookies = new Cookies();
    return cookies.get(cookieLabel)
      ? cookies.get(cookieLabel)
      : this.state[cookieDefault];
  };

  // selectThemeType = (e) => {
  //   let themeTypeData = { ...this.state.themeTypeKeyboardData };
  //   //
  // };

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
    var local_button = document.getElementById(e.key);
    if (!e.repeat) {
      if (local_button === null || local_button === undefined) {
        // console.log("local_button equals null"); // do thing
      } else if (local_button !== null || local_button !== undefined) {
        local_button.focus(timeout);
        var timeout = setTimeout(() => local_button.blur(), 200);
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

    // handle shift & ctrl keys to stop Control and Shift being inserted into userInput
    if (ctrlKey && key !== "") {
      return;
    }
    if (!shiftKey && !ctrlKey) {
      _userInput += key;
    }
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

    console.log(`346: ######### parseUserInput ${userInput} #########`);

    let _num1, _num2, _op1, _op2;

    if (this.state.resultData.resultValue) {
      // _userInput = userInput;
      // input = this.preProcessUserInput(input);
    }

    // exceptions
    //
    // handle operators entered before numerals
    // reset user input
    // if a . then handle decimal

    if (isNaN(userInput.charAt(0)) && userInput.charAt(0) !== ".") {
      console.log("hit NaN");
      this.setState({ userInput: "" });
      // return;
    }
    // exceptions
    //
    // repeated 0
    if (+userInput === 0 && this.state.dotRgx.test(userInput) === null) {
      userInput = "0";
      this.setState({ userInput: "0" });
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
      match;

    if (!_opRgxOuter.test(input)) {
      _num1 = input;
    } else {
      while ((match = _opRgxLoop.exec(input))) {
        matches.push(match);
        if (_count === 0) {
          if (!_frstOpIdx) {
            _frstOpIdx = matches[0].index;
          }
          if (!_num1) {
            _num1 = input.substring(0, _frstOpIdx);
          }
          if (!_op1 && input.charAt(_frstOpIdx) !== "=") {
            _op1 = input.charAt(_frstOpIdx);
          } else if (input.charAt(_frstOpIdx) === "=") {
            this.setState({ userInput: input.substr(0, _frstOpIdx) });
            // return;
          }
          if (
            input.length > _frstOpIdx + 1 &&
            !_num2 &&
            !/[+\-x\/ysr=]/i.test(input.charAt(input.length - 1))
          ) {
            _num2 = input.substring(_frstOpIdx + 1);
            if (
              _num2.charAt(_num2.length - 1).match(_opRgxLoopInnerTest) !== null
            ) {
              _num2 = _num2.substring(0, _num2.length - 1);
            }
          }
        }
        if (_count === 1) {
          if (!_scndOpIdx) {
            _scndOpIdx = matches[1].index;
            if (/\d+/.test(input.substring(_frstOpIdx + 1, _scndOpIdx))) {
              _num2 = input.substring(_frstOpIdx + 1, _scndOpIdx);
              if (_num2) {
                _op2 = input.charAt(_scndOpIdx);
              }
            }
          }
        }
        _count++;
      }
      if (matches.length > 0) {
      }
      if (matches.length > 1) {
      }
    }
    if (typeof _num1 !== "undefined") {
      if (
        _num1.match(dotRgxNnGr) !== null &&
        this.state.numRgxNnGr.test(_num1)
      ) {
        _num1 = this.formatDecimal(_num1);
      } else if (
        _num1.match(dotRgxNnGr) !== null &&
        !this.state.numRgxNnGr.test(_num1)
      ) {
        _num1 = this.formatDots(_num1);
      }
    }
    if (typeof _num2 !== "undefined") {
      if (
        _num2.match(dotRgxNnGr) !== null &&
        this.state.numRgxNnGr.test(_num2)
      ) {
        _num2 = this.formatDecimal(_num2);
      } else if (
        _num2.match(dotRgxNnGr) !== null &&
        !this.state.numRgxNnGr.test(_num2)
      ) {
        _num2 = this.formatDots(_num2);
      }
    }
    if (_op1 && +_num1 === 0) {
      _num1 = "0";
    }
    this.setState(
      { num1: _num1, num2: _num2, op1: _op1, op2: _op2 },
      this.goForMath
    );
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
    return (
      <div 
        className={`container ${
          this.state.sidebarData.isOpen === true ? "open" : ""
        } ${this.state.themeType}`}
      >
        <div className="flex-row row">
          <div id="canvas-container"
            className={`calculator ${this.state.theme.toLowerCase()}`}
            onClick={(e) => this.toggleSidebar(e)}
          >
        <Canvas ref={this.animate} canId={this.state.canId} />
            <div className="title">{this.state.title}</div>
            <div className="menu-icon" onClick={(e) => this.toggleSidebar(e)}>
              <div className="icon-bar"></div>
              <div className="icon-bar"></div>
              <div className="icon-bar"></div>
            </div>
            <div className="body container">
              <div className="row">
                <div className="col">
                  <div className="row">
                    <div className="col display">
                      <Display
                        calculationData={this.state.calculationData}
                        resultData={this.state.resultData}
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div
                      className={`col keyboard ${this.state.numberKeyboardClass}`}
                    >
                      <Keyboard
                        keys={this.numberKeys}
                        passClickHandler={(e) => this.handleClick(e)}
                        keyErr={this.state.keyErr}
                      />
                    </div>
                    <div
                      className={`col keyboard ${this.state.functionKeyboardClass}`}
                    >
                      <Keyboard
                        keys={this.functionKeys}
                        passClickHandler={(e) => this.handleClick(e)}
                        keyErr={this.state.keyErr}
                      />
                      <div
                        className={`row keyboard ${this.state.utilityKeyboardClass}`}
                      >
                        <Keyboard
                          keys={this.utilityKeys}
                          passClickHandler={(e) => this.handleClick(e)}
                          keyErr={this.state.keyErr}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Sidebar
            sidebarData={this.state.sidebarData}
            themeTypeKbData={this.packageKeyboardData("themeTypeKeyboardData")}
            themesKbData={this.packageKeyboardData("themesKeyboardData")}
          ></Sidebar>
        </div>
      </div>
    );
  };
}

export default Calculator;
