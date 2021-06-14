import React, { Component } from "react";
import "./calculator.scss";
import Display from "./components/display";
import Keyboard from "./components/keyboard";
import Sidebar from "./components/sidebar";
import Cookies from "universal-cookie";
import { numberKeys } from "./keys";
import { functionKeys } from "./keys";
import { utilityKeys } from "./keys";

class Calculator extends Component {
  displayRef = React.createRef();
  constructor(props) {
    super(props);

    this.state.theme = this.getCookie("currentTheme");
    this.state.themesData.currentSetting = this.getCookie("currentTheme");
    this.numberKeys = numberKeys;
    this.functionKeys = functionKeys;
    this.utilityKeys = utilityKeys;
  }

  state = {
    calculationData: {
      calculationClass: "calculation",
      calculationValue: "",
    },
    resultData: { resultClass: "result", resultCount: 0, resultValue: "0" },
    sidebarData: {
      sidebarClass: "sidebar",
      sidebarValue: "Settings",
      isOpen: false,
    },
    dropdownData: {
      dropdownClass: "dropdown",
    },
    themesData: {
      labelForDropdown: "Theme",
      currentSetting: "Ocean",
      callbackForDropdown: (e) => this.onSelectTheme(e),
      itemsForDropdown: [
        { itemName: "Fire" },
        { itemName: "Midnight" },
        { itemName: "Ocean" },
        { itemName: "Storm" },
        { itemName: "Jungle" },
      ],
    },
    theme: "ocean",
    numberKeyboardClass: "numberKeyboard",
    functionKeyboardClass: "functionKeyboard",
    utilityKeyboardClass: "utilityKeyboard",
    title: "Calculator",
    dotRgx: /\./g,
    numRgx: /(\d+)/g,
    mathOpRgx: /[+\-x\/ysr]/g,
    utilOpRgx: /[acm=]/g,
    dblMthOpRgx: /[+\-x\/y]/g,
    snglMthOpRgx: /[sr]/g,
    dotRgxNnGr: /\./,
    numRgxNnGr: /(\d+)/g,
    mathOpRgxNnGr: /[+\-x\/ysr]/,
    utilOpRgxNnGr: /[acm=]/,
    dblMthOpRgxNnGr: /[+\-x\/y]/,
    snglMthOpRgxNnGr: /[sr]/,
    userInput: "",
  };

  componentDidMount() {
    document.addEventListener("keydown", (e) => this.handleKeyPress(e));
  }

  componentDidUpdate(nextProps, nextState) {
    let resultData = { ...this.state.resultData };
    let clearUpData = {};
    resultData.callback = this.postResultClearUp;
    if (
      this.state.num1 &&
      this.state.num1 !== "" &&
      this.state.op1 &&
      this.state.op1 !== "" &&
      this.state.snglMthOpRgxNnGr.test(this.state.op1) &&
      resultData.resultCount < 1
    ) {
      resultData.resultValue = this.doSnglOpMath();
      resultData.resultCount++;
      clearUpData.opType = "sngl";
      clearUpData.callback = this.postResultClearUp;
      resultData.callbackData = clearUpData;

      this.setResultData(resultData);
    }

    if (
      this.state.num1 &&
      this.state.num1 !== "" &&
      this.state.op1 &&
      this.state.op1 !== "" &&
      this.state.num2 &&
      this.state.num2 !== "" &&
      this.state.op2 &&
      this.state.op2 !== "" &&
      (this.state.dblMthOpRgxNnGr.test(this.state.op1) ||
        this.state.op2 === "=") &&
      resultData.resultCount < 1
    ) {
      resultData.resultValue = this.doDblOpMath();
      if (isNaN(resultData.resultValue)) {
        resultData.resultValue = "err";
      }
      resultData.resultCount++;
      clearUpData.opType = "dbl";
      clearUpData.callback = this.postResultClearUp;
      resultData.callbackData = clearUpData;
      this.setResultData(resultData);
    }
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", (e) => this.handleKeyPress(e));
  }

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

  packageDropdownData = (dropdownUser) => {
    let dropdownData = { ...this.state.dropdownData };
    dropdownData.labelForDropdown = dropdownUser.labelForDropdown;
    dropdownData.itemsForDropdown = dropdownUser.itemsForDropdown;
    dropdownData.currentSetting = dropdownUser.currentSetting;
    dropdownData.onClick = dropdownUser.callbackForDropdown;
    return dropdownData;
  };

  onSelectTheme = (e) => {
    let cookieData = {};
    let themesData = { ...this.state.themesData };
    themesData.currentSetting = e.target.innerHTML;
    cookieData.cookieLabel = "currentTheme";
    cookieData.cookieValue = themesData.currentSetting;
    cookieData.cookiePath = { path: "/" };
    this.setState({ themesData, theme: themesData.currentSetting });
    this.setCookie(cookieData);
    this.toggleSidebar(e);
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

  getCookie = (cookieLabel) => {
    const cookies = new Cookies();
    return cookies.get(cookieLabel)
      ? cookies.get(cookieLabel)
      : this.state.theme;
  };

  handleClick = (e) => {
    // console.log("189: handleClick");
    e.target.blur();
    // console.log(e);
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
    // this.routeInput(clickData);
  };

  handleKeyPress = (e) => {
    // console.log("207: handleKeyPress");
    const allowedKeys = [
      16, 17, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 65, 67, 77, 82, 83, 88,
      89, 187, 189, 190, 191,
    ];
    if (!e.repeat) {
      if (allowedKeys.includes(e.keyCode)) {
        let pressData = {
          key: e.key,
          ctrlKey: e.ctrlKey,
          shiftKey: e.shiftKey,
        };
        this.handleActiveClass(e);
        this.handleUserInput(pressData);
        // this.routeInput(pressData);
      }
    }
  };

  handleActiveClass = (e) => {
    // console.log("228: handleActiveClass adding and removing active class");
  };

  handleUserInput = (inputData) => {
    // console.log("229: handleUserInput inputData: ", inputData);
    const resultData = { ...this.state.resultData };
    if (resultData.resultCount > 0) {
      this.clearResultCount();
    }

    let _userInput;
    let { userInput } = this.state;
    const key = inputData.key;
    const shiftKey = inputData.shiftKey;
    const ctrlKey = inputData.ctrlKey;
    _userInput = userInput;

    // handle shift & ctrl keys to stop Control and Shift
    // being inserted into userInput
    if (ctrlKey && key !== "") {
      return;
    }
    if (!shiftKey && !ctrlKey) {
      _userInput += key;
    }
    if (shiftKey && key === "+") {
      _userInput += key;
    }

    if (this.state.utilOpRgxNnGr.test(key)) {
      console.log(
        "256: utilOpRgxNnGr.test(key): ",
        this.state.utilOpRgxNnGr.test(key),
        _userInput
      );

      this.handleUtilityOperator(_userInput);
      return;
    }

    this.setState({ userInput: _userInput }, this.parseUserInput);
  };

  handleUtilityOperator = (inputData) => {
    const key = inputData.key;
    let resultData = { ...this.state.resultData };
    console.log("268: handleUtilityOperator inputData:", inputData);

    if (key === "a") {
      console.log("ac pressed");
      resultData.resultValue = "0";
      resultData.resultCount = "0";

      this.setState(
        {
          num1: "",
          num2: "",
          op1: "",
          op2: "",
          resultData,
          userInput: "",
        },
        () => {
          // this.setCalculationData();
        }
      );
    }
    if (key === "c") {
      let { userInput } = this.state;
    }
    if (key === "=") {
      console.log(
        `297: num1: ${this.state.num1} num2: ${this.state.num2} op1: ${this.state.op1} op2: ${this.state.op2}`
      );
      if (
        this.state.num1 &&
        this.state.num1 !== "" &&
        this.state.num2 &&
        this.state.num2 !== ""
      ) {
        console.log("304: hit");
        this.updateOperator("=");
      }
    }
    // this.setState({ userInput: "" });
  };

  updateNumber = (num) => {
    if (!this.state.num1) {
      this.setState({ num1: num });
    } else if (!this.state.num2) {
      this.setState({ num2: num });
    }
  };

  updateOperator = (op) => {
    if (!this.state.op1) {
      this.setState({ op1: op });
    } else if (!this.state.op2) {
      this.setState({ op2: op });
    }
  };

  parseUserInput = () => {
    console.log("338: ######### parseUserInput #########");
    const utilOpRgxNnGr = this.state.utilOpRgxNnGr;
    const snglMthOpRgxNnGr = this.state.snglMthOpRgxNnGr;
    const dblMthOpRgxNnGr = this.state.dblMthOpRgxNnGr;

    const mathOpRgxNnGr = this.state.mathOpRgxNnGr;
    const numRgxNnGr = this.state.numRgxNnGr;
    const dotRgxNnGr = this.state.dotRgxNnGr;
    const mathRgx = this.state.mathOpRgx;
    const numRgx = this.state.numRgx;
    const dotRgx = this.state.dotRgx;

    const num1 = this.state.num1;
    const num2 = this.state.num2;
    const op1 = this.state.op1;
    const op2 = this.state.op2;

    const { userInput } = this.state;

    let _userInput = userInput;

    let dotMatches = [..._userInput.matchAll(dotRgx)];
    let mathMatches = [..._userInput.matchAll(mathRgx)];
    let numMatches = [..._userInput.matchAll(numRgx)];

    const handleDecimal = (input) => {
      console.log("358: handleDecimal input: ", input);

      const _dot = ".";

      if (numMatches.length > 0) {
        /*
          _didx  - dot index
          _matches - array of regex matches for numbers 0-9
          _joined - numbers extracted from _matches back into a string,
          _res - final result,
          _resInt - intger part of final result
          _resFloat - decimal part
          _firstNumIdx - index of first number found
        */
        let _matches = input.match(numRgx),
          _joined = _matches.join(""),
          _didx = 0,
          _res,
          _resInt = 0, // default
          _resFloat,
          _firstNumIdx = 0;

        // first char is a .
        if (input.charAt(0) === _dot) {
          _firstNumIdx = input.search(numRgx);
          _didx = input.search(numRgx) - 1;
          _resInt = 0;
          _resFloat = _joined;
        }
        // first char was a number
        if (input.charAt(0) !== _dot) {
          // repeated zeros
          // if - only 0s eg. 0000
          if (Number(_joined) === 0) {
            _didx = input.lastIndexOf("0");
            _resInt = 0;
            _resFloat = "";
          }
          // else - different number after 0s eg 0009
          else if (Number(_matches[0]) === 0) {
            _didx = input.indexOf(_dot);
            _resInt = 0;
            _resFloat = _joined.substr(_didx);
          } else {
            _didx = input.indexOf(_dot);
            // casting to Number and back to string removes lead 0s
            // eg. 09090. -> 9090.
            _resInt = Number(_joined.substr(0, _didx)).toString();
            _resFloat = _joined.substr(_didx);
          }
        }

        _res = _resInt + _dot + _resFloat;

        return _res;
      }
      return "0" + input.charAt(0);
    };

    const extractComputationParts = (input, opType) => {
      console.log(
        "502: extractComputationParts: input:",
        "input: ",
        input,
        "dotMatches: ",
        dotMatches,
        "numMatches: ",
        numMatches,
        "mathMatches: ",
        mathMatches
      );

      let opMatches;
      let extractions = {};
      if (opType === "sngl")
        opMatches = [...input.matchAll(this.state.snglMthOpRgx)];
      if (opType === "dbl")
        opMatches = [...input.matchAll(this.state.dblMthOpRgx)];
      // console.log(
      //   "466: input: ",
      //   input,
      //   "opMatches: ",
      //   opMatches,
      //   "numMatches: ",
      //   numMatches
      // );

      if (numMatches.length > 0)
        // console.log(
        //   `422 extractComputationParts: opType: ${opType} num: ${numMatches[0][0]} op: ${opMatches[0][0]}`
        // );

        // console.log(input.substr(0, mathMatches[0].index));

        extractions.op = opMatches[0][0];
      extractions.num = input.substr(0, mathMatches[0].index);
      // console.log("429: extractions:", extractions);
      // if ( dotMatches.length > 0) {
      //   extractions.num = handleDecimal(extractions.num);
      //   console.log("input after handle decimal", extractions.num);
      // }
      return extractions;
    };

    const handleOperator = () => {
      console.log("handleOperator hit mathMatches: ", mathMatches);
      let _resultData = { ...this.state.resultData };
      let op = mathMatches[mathMatches.length - 1][0];
      let stateProp;

      if (this.state.num1 && !this.state.num2) {
        stateProp = "op1";
      }
      if (this.state.num1 && this.state.num2) {
        stateProp = "op2";
      }

      console.log("handleOperator hit, op set was ", op, "into ", stateProp);
      this.setState({ [stateProp]: op, userInput: "" });
      return;
    };

    // handle a maths op change after num1 was set
    if (
      mathOpRgxNnGr.test(_userInput) &&
      !numRgxNnGr.test(_userInput) &&
      !dotRgxNnGr.test(_userInput)
    ) {
      console.log("543: hit - math function: _userInput: ", _userInput);

      handleOperator();
      // clear the user input

      return;
    }

    // handle a maths op being repeatedly entered first

    if (
      mathOpRgxNnGr.test(_userInput) &&
      !numRgxNnGr.test(_userInput) &&
      !dotRgxNnGr.test(_userInput) &&
      !this.resultData.resultValue
    ) {
      console.log(
        "543: hit - math function: _userInput: ",
        _userInput,
        " - removing"
      );
      // clear the user input
      this.setState({ userInput: "" });

      return;
    }

    // all numbers after here

    // console.log("554: all numbers and dots after here");

    // handle repeated zero
    if (
      numRgxNnGr.test(_userInput) &&
      Number(_userInput) === 0 &&
      !dotRgxNnGr.test(_userInput)
    ) {
      console.log("552: hit - 0 entered: _userInput: ", _userInput);
      // this.setState({ userInput: parseInt(Number(_userInput)) });
      // this.setState({ userInput: "0" });
      _userInput = "0";
      return "0";
      console.log("590:AFTER hit - 0 entered: _userInput: ", _userInput);
    }

    // handle decimal numbers
    if (dotRgxNnGr.test(_userInput)) {
      // console.log("559: dotRgx op found");
      _userInput = handleDecimal(_userInput);
      console.log(
        `i just came back from handleDecimal, i was ${userInput} but now I'm ${_userInput}`
      );
    }

    // console.log(
    //   "570: checking if an operator has been hit: _userInput currently: ",
    //   _userInput
    // );

    // console.log(
    //   "570: (snglMthOpRgxNnGr.test(_userInput)): ",
    //   snglMthOpRgxNnGr.test(_userInput)
    // );

    if (snglMthOpRgxNnGr.test(_userInput)) {
      console.log("580: snglMthOpRgxNnGr op found");
      let _compParts = extractComputationParts(_userInput, "sngl");
      console.log("582", _compParts, _compParts.num, _compParts.op);
      this.updateOperator(_compParts.op);
      this.updateNumber(_compParts.num);
      this.setState({ userInput: "" });
      return;
    }

    // console.log(
    //   "585: (dblMthOpRgxNnGr.test(_userInput)): ",
    //   dblMthOpRgxNnGr.test(_userInput)
    // );

    if (dblMthOpRgxNnGr.test(_userInput)) {
      // console.log("590: dblMthOpRgxNnGr op found");
      let _compParts = extractComputationParts(_userInput, "dbl");
      // console.log("597", _compParts, _compParts.num, _compParts.op);
      this.updateOperator(_compParts.op);
      this.updateNumber(_compParts.num);
      this.setState({ userInput: "" });
      return;
    }
    // console.log(
    //   "599: returning at end of parseUserInput _userInput: ",
    //   _userInput,
    //   "typeof _userInput: ",
    //   typeof _userInput
    // );
    return;

    // this.storeComputableParts(inputData);
  };

  setCalculationData = (data) => {
    const computableParts = { ...this.state.computableParts };
    // console.log("611: setCalculationData computableParts: ", computableParts);
    let calcDataObj = {};
    calcDataObj.calculationClass = this.state.calculationData.calculationClass; // default class
    const num1 = computableParts.num1;
    const num2 = computableParts.num2;
    const op1 = computableParts.op1;
    const op2 = computableParts.op2;

    let calculationData = { ...this.state.calculationData };
    console.log(
      "621: setCalculationData calcDataObj: ",
      calcDataObj,
      "calculationData: ",
      calculationData
    );

    if (data) {
      if (data.calculationClass) {
        calcDataObj.calculationClass = data.calculationClass;
      }
    }

    // // default
    // if (!op1) {
    //   calcDataObj.calculationValue = num1;
    // }
    // calcDataObj.calculationValue = num2;

    calcDataObj.calculationValue = num1 + op1 + num2 + op2;

    calculationData = calcDataObj;
    console.log("642: ", calculationData);
    this.setState({ calculationData });
  };

  doSnglOpMath = () => {
    let resultData = { ...this.state.resultData };
    const op = this.state.op1;
    const num = Number(this.state.num1);
    console.log("650  : doSnglOpMath: op", op);

    if (!op || op == "") return;

    switch (op) {
      case "r": {
        console.log("656: r");
        return Math.sqrt(num);
      }
      case "s": {
        console.log("660: s");
        if (num === 0) return 1;
        return Math.pow(num, 2);
      }
      default: {
        break;
      }
    }
    resultData.resultCount += 1;
    return resultData;
  };

  doDblOpMath = () => {
    console.log("673: double maths op: ", this.state.op1);
    let resultData = { ...this.state.resultData };

    const op = this.state.op1;
    const num1 = Number(this.state.num1);
    const num2 = Number(this.state.num2);

    console.log(`680: doDblOpMath op: ${op} num1: ${num1} num2: ${num2}`);
    switch (op) {
      case "+": {
        return num1 + num2;
      }
      case "-": {
        return num1 - num2;
      }
      case "x": {
        return num1 * num2;
      }
      case "y": {
        return Math.pow(num1, num2);
      }
      case "/": {
        return num1 / num2;
      }
      default: {
        break;
      }
    }
    resultData.resultCount += 1;
    return resultData;
  };

  setResultData = (data) => {
    console.log("711: setResultData data: ", data);
    let callback, callbackData;
    let resultData = { ...this.state.resultData };

    if (data.resultClass) {
      resultData.resultClass = data.resultClass;
    }
    if (data.callback) {
      callback = data.callback;
      callbackData = data.callbackData;
    }
    console.log("770: callback: ", callback);
    delete data.callback;
    delete data.callbackData;
    resultData.resultValue = data.resultValue;
    resultData.resultCount = data.resultCount;
    if (!callback) {
      this.setState({ resultData });
    } else {
      this.setState({ resultData }, () => callback(callbackData));
    }
  };

  clearResultCount = () => {
    let resultData = { ...this.state.resultData };
    resultData.resultCount = 0;
    console.log("741: clearResultCount", resultData);
    this.setState({ resultData });
  };

  postResultClearUp = (clearUpData) => {
    console.log("790: postResultClearUp clearUpData: ", clearUpData);
    let _num1, _num2, _op1, _op2;
    let resultData = { ...this.state.resultData };
    delete resultData.callback;
    delete resultData.callbackData;

    resultData.resultCount = 0;

    if (clearUpData.opType === "sngl") {
      // op1 = "";
      // _num1 = "";

      this.setState({ op1: "", userInput: "", num1: "", resultData });
    } else if (clearUpData.opType === "dbl") {
      //
      _op2 = this.state.op2;
      this.setState({
        op1: _op2,
        op2: "",
        // userInput: ,
        num1: resultData.resultValue,
        num2: "",
        resultData,
      });
    }
  };

  render = () => {
    return (
      <div
        className={`container ${
          this.state.sidebarData.isOpen === true ? "open" : ""
        }`}
      >
        <div className="flex-row row">
          <div
            className={`calculator ${this.state.theme.toLowerCase()}`}
            onClick={(e) => this.toggleSidebar(e)}
          >
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
                      />
                    </div>
                    <div
                      className={`col keyboard ${this.state.functionKeyboardClass}`}
                    >
                      <Keyboard
                        keys={this.functionKeys}
                        passClickHandler={(e) => this.handleClick(e)}
                      />
                      <div
                        className={`row keyboard ${this.state.utilityKeyboardClass}`}
                      >
                        <Keyboard
                          keys={this.utilityKeys}
                          passClickHandler={(e) => this.handleClick(e)}
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
            dropdownData={this.packageDropdownData(this.state.themesData)}
          ></Sidebar>
        </div>
      </div>
    );
  };
}

export default Calculator;
