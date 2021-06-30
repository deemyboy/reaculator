import React, { Component } from "react";
import "./calculator.scss";
import Display from "./components/display";
import Keyboard from "./components/keyboard";
import Sidebar from "./components/sidebar";
import Cookies from "universal-cookie";
import { numberKeys } from "./keys";
import { functionKeys } from "./keys";
import { utilityKeys } from "./keys";
import { allowedKeys } from "./keys";

class Calculator extends Component {
  displayRef = React.createRef();
  constructor(props) {
    super(props);

    this.state.theme = this.getCookie("currentTheme");
    this.state.themesData.currentSetting = this.getCookie("currentTheme");
    this.numberKeys = numberKeys;
    this.functionKeys = functionKeys;
    this.utilityKeys = utilityKeys;
    this.allowedKeys = allowedKeys;
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
    mathOpRgx: /([+\-x\/ysr=])/gi,
    utilOpRgx: /[acm]/gi,
    dblMthOpRgx: /[+\-x\/y]/gi,
    snglMthOpRgx: /[sr]/gi,
    dotRgxNnGr: /\./,
    numRgxNnGr: /(\d+)/,
    mathOpRgxNnGr: /[+\-x\/ysr=]/,
    utilOpRgxNnGr: /[acm]/,
    dblMthOpRgxNnGr: /[+\-x\/y]/,
    snglMthOpRgxNnGr: /[sr]/,
    userInput: "",
  };

  componentDidMount() {
    document.addEventListener("keydown", (e) => this.handleKeyPress(e));
  }

  componentDidUpdate(nextProps, nextState) {
    let resultData = { ...this.state.resultData };

    if (
      this.state.mathOpRgxNnGr.test(this.state.op1) &&
      resultData.resultCount < 1
    ) {
      if (
        (this.state.num1 &&
          this.state.num1 !== "" &&
          this.state.op1 &&
          this.state.op1 !== "") ||
        (this.state.num1 &&
          this.state.num1 !== "" &&
          this.state.op1 &&
          this.state.op1 !== "" &&
          this.state.num2 &&
          this.state.num2 !== "" &&
          this.state.op2 &&
          this.state.op2 !== "")
      ) {
        var res = {};
        var rv = this.doMath(),
          resultValue = rv !== undefined ? rv : undefined;
        console.log(rv);
        if (resultValue) resultData.resultValue = resultValue;
        if (resultData.resultValue !== undefined) {
          if (isNaN(resultData.resultValue)) {
            resultData.resultValue = "err";
          }
          if (this.state.snglMthOpRgxNnGr.test(this.state.op1)) {
            resultData.mathOpType = "sngl";
          } else {
            resultData.mathOpType = "dbl";
          }
          resultData.resultCount++;
          this.setResultData(resultData);
        }
      }
    }

    console.log(
      "113",
      this.state.num1 !== nextState.num1 ||
        this.state.num2 !== nextState.num2 ||
        this.state.op1 !== nextState.op1
    );
    if (
      this.state.num1 !== nextState.num1 ||
      this.state.num2 !== nextState.num2 ||
      this.state.op1 !== nextState.op1
    ) {
      this.setCalculationValue();
    }
    if (resultData.resultCount === 1) {
      console.log("128", resultData);
      if (this.state.op2 && this.state.op2 !== "") {
        this.postResultClearUp("dbl");
      } else {
        this.postResultClearUp("sngl");
      }
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

    if (!e.repeat) {
      if (this.allowedKeys.includes(e.keyCode)) {
        let pressData = {
          key: e.key,
          ctrlKey: e.ctrlKey,
          shiftKey: e.shiftKey,
        };
        // quick hack to get enter key to do = function
        if (e.key === "Enter") {
          pressData.key = "=";
        }

        if (e.key === "*") {
          pressData.key = "x";
        }
        this.handleActiveClass(e);
        this.handleUserInput(pressData);
      }
    }
  };

  handleActiveClass = (e) => {
    // console.log("228: handleActiveClass adding and removing active class");
  };

  handleUserInput = (inputData) => {
    // console.log("229: handleUserInput inputData: ", inputData);
    const resultData = { ...this.state.resultData };

    let _userInput;
    let { userInput } = this.state;
    const key = inputData.key;

    const shiftKey = inputData.shiftKey;
    const ctrlKey = inputData.ctrlKey;
    _userInput = userInput;

    // handle shift & ctrl keys to stop Control and Shift being inserted into userInput
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

  parseUserInput = () => {
    const mathOpRgxNnGr = this.state.mathOpRgxNnGr;
    const numRgxNnGr = this.state.numRgxNnGr;
    const dotRgxNnGr = this.state.dotRgxNnGr;

    const { userInput } = this.state;

    console.log(`338: ######### parseUserInput ${userInput} #########`);
    let _userInput = userInput;

    if (mathOpRgxNnGr.test(userInput)) {
      this.handleMathsOp(_userInput);
    } else if (
      (numRgxNnGr.test(userInput) || dotRgxNnGr.test(userInput)) &&
      !mathOpRgxNnGr.test(userInput)
    ) {
      _userInput = this.handleNumber(userInput);
      console.log("_userInput on return from handleNumber: ", _userInput);
      this.storeNumber(_userInput);
    }
  };

  handleMathsOp = (input) => {
    // console.log(`338:handleMathsOp ${input}`);

    const mathOpRgxNnGr = this.state.mathOpRgxNnGr;

    const { num2 } = this.state;

    let op = input.match(mathOpRgxNnGr)[0];

    if (!num2) {
      this.setState({ op1: op, userInput: "" });
    } else {
      this.setState({ op2: op, userInput: "" });
    }
  };

  handleNumber = (input) => {
    //
    console.log(`handleNumber input ${input}`);
    const dotRgxNnGr = this.state.dotRgxNnGr;

    const num1 = this.state.num1;
    const num2 = this.state.num2;
    const op1 = this.state.op1;
    const op2 = this.state.op2;
    const dot = ".";
    let _input = input;

    // removes leading 0000s
    // also returns an integer as no decimal point detected
    if (!dotRgxNnGr.test(input) && input.charAt(0) === "0") {
      _input = this.handleLeadingZero(input);
      console.log("returned from handleLeadingZero: _input", _input);
    }

    if (dotRgxNnGr.test(input)) {
      console.log("decimal"), input;
      _input = this.handleDecimal(input);
      console.log("returned from handleDecimal _input: ", _input);
    }
    return _input;
  };

  handleDecimal = (input) => {
    console.log("handleDecimal: ", input);

    const numRgx = this.state.numRgx;
    const dotRgx = this.state.dotRgx;
    const dotRgxNnGr = this.state.dotRgxNnGr;
    const numRgxNnGr = this.state.numRgxNnGr;
    const dtIdx = input.match(dotRgxNnGr).index;
    const numDots = input.match(dotRgx).length;
    const oneToNineRgx = /[1-9]/;
    const zeroRgx = /[0]/;
    const dot = ".";

    let frstNumIdx, numMatches, extractedNums, int, flt, _input;

    if (numRgxNnGr.test(input)) {
      extractedNums = input.match(numRgx).join("");
    }

    const handleProperFraction = (integer, float) => {
      // console.log("handleProperFraction: integer", integer, "float", float);
      if (integer.charAt(0) === "0") {
        integer = this.handleLeadingZero(integer);
      }
      if (
        // .0 or .0000
        (integer === "" && float !== "") ||
        // 0.023 or 0000.023
        (Number(integer) === 0 && float !== "")
      ) {
        return "0." + float;
      }
      if (
        // 0. or 0000.
        Number(int) === 0 &&
        float === ""
      ) {
        return "0.";
      }

      return "0" + dot + extractedNums.substr(dtIdx);
    };

    const handleMixedNumber = (integer, float) => {
      // console.log("handleMixedNumber: integer", integer, "float", float);
      if (integer.charAt(0) === "0") {
        integer = this.handleLeadingZero(integer);
      }
      return integer + dot + float;
    };

    const handleExtraDots = (input) => {
      // console.log("handleExtraDots: input", input);
      let frstDtIdx, frstNumIdx;

      frstDtIdx = input.search(dotRgx);
      frstNumIdx = input.search(numRgx);

      if (frstDtIdx < frstNumIdx) {
        return dot + extractedNums;
      } else {
        return extractedNums.slice(0, dtIdx) + dot + extractedNums.slice(dtIdx);
      }
    };

    // no numbers upto this point
    // handle "." "...." entered
    if (numDots === input.length) {
      // console.log(`handle only dots "." or "...." entered`);
      return "0.";
    }

    // numbers and dots

    // need to provide lower expressions with single decimal numbers
    // must process and remove extra dots
    if (numDots > 1) {
      input = handleExtraDots(input);
    }

    int = input.slice(0, dtIdx);
    flt = input.slice(dtIdx + 1);

    if (
      int === "" ||
      (Number(int) === 0 && flt !== "") ||
      input.charAt(input.length - 1) === dot
    ) {
      _input = handleProperFraction(int, flt);
    }
    if (int !== "" && Number(int) !== 0) {
      _input = handleMixedNumber(int, flt);
    }
    return _input;
  };

  handleLeadingZero = (input) => {
    console.log("handleLeadingZero", input);
    const oneToNineRgx = /[1-9]/g;
    const oneToNineRgxNGr = /[1-9]/;
    const zeroRgxNGr = /[0]/;
    const zeroRgx = /[0]/g;
    let lastZeroIdx, nonZeroIdx, oneToNineMatches;

    if (oneToNineRgxNGr.test(input)) {
      nonZeroIdx = input.match(oneToNineRgxNGr).index;
      oneToNineMatches = input.match(oneToNineRgx);
    } else if (zeroRgxNGr.test(input) && !oneToNineRgxNGr.test(input)) {
      // all zeros
      return "0";
    }

    /**
     * @input.matchAll
     *  - only matchAll gives an index for all matches
     * to get the last match index:
     *    1. get and array of all 0 matches
     *       - the last 0 will be the last array element at index: array[array.length -1]
     *    2. use the "index" value of last array element to determine last index of 0
     */
    lastZeroIdx = [...input.matchAll(zeroRgx)][nonZeroIdx - 1].index;

    return input.slice(nonZeroIdx);
  };

  storeNumber = (number) => {
    console.log(`storeNumber number ${number}`);
    const { op1 } = this.state;
    let numKey;
    if (!op1) {
      numKey = "num1";
    } else {
      numKey = "num2";
    }
    this.setState({ [numKey]: number });
  };

  handleUtilityOperator = (inputData) => {
    const key = inputData.key;
    let resultData = { ...this.state.resultData };
    console.log("490: handleUtilityOperator inputData:", inputData);

    if (key === "a") {
      console.log("ac pressed");
      resultData.resultValue = "0";
      resultData.resultCount = "0";

      this.setState({
        num1: "",
        num2: "",
        op1: "",
        op2: "",
        resultData,
        userInput: "",
      });
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
  };

  setCalculationValue = () => {
    let calcDataObj = {};
    const num1 = this.state.num1;
    const num2 = this.state.num2;
    const op1 = this.state.op1;
    const op2 = this.state.op2;

    let calculationData = { ...this.state.calculationData };
    console.log(
      "532: setCalculationValue calcDataObj: ",
      calcDataObj
      // "calculationData: ",
      // calculationData
    );

    const setCalculationDisplayChar = (op) => {
      return this.functionKeys
        .filter((k) => k.value === op)
        .filter((k) => {
          if ("calculationDisplayChar" in k) return k;
        });
    };

    let _op1;

    if (op1) {
      _op1 =
        setCalculationDisplayChar(op1).length > 0
          ? setCalculationDisplayChar(op1)[0].calculationDisplayChar
          : op1;
    }

    if (calcDataObj.calculationValue === undefined) {
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

    calculationData = calcDataObj;
    this.setState({ calculationData });
  };

  doMath = () => {
    let resultData = { ...this.state.resultData };
    const op = this.state.op1;
    const num1 = Number(this.state.num1);
    const num2 = Number(this.state.num2);
    console.log("674  : doMath: op", op);

    if (!op || op == "") return;

    if (this.state.dblMthOpRgxNnGr.test(op) && (!num2 || num2 === "")) {
      return;
    }
    switch (op) {
      case "r": {
        console.log("589: r");
        return Math.sqrt(num1);
      }
      case "s": {
        console.log("593: s");
        if (num1 === 0) return 1;
        return Math.pow(num1, 2);
      }
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
    console.log("639: setResultData data: ", data);
    let resultData = { ...this.state.resultData },
      _resultData = {};

    if (data.resultClass) {
      _resultData.resultClass = data.resultClass;
    } else {
      _resultData.resultClass = resultData.resultClass;
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
    this.setState({ resultData: _resultData });
  };

  postResultClearUp = (operationType) => {
    let _num1,
      _num2,
      _op1,
      _op2,
      _resultData = {};
    let resultData = { ...this.state.resultData };
    console.log(
      "666: postResultClearUp operationType: ",
      operationType,
      "current resultData b4 rescnt 0",
      resultData
    );

    if (resultData.resultClass) {
      _resultData.resultClass = resultData.resultClass;
    }
    if (resultData.resultValue) {
      _resultData.resultValue = resultData.resultValue;
    }
    _resultData.resultCount = 0;
    // _resultData.resultCount = 0;
    console.log(
      "674: after rescnt 0 - current resultData",
      resultData,
      "_resultData",
      _resultData
    );
    // return;

    if (operationType === "sngl") {
      console.log("677 s: resultData: ", resultData);
      this.setResultData({ resultData: _resultData });
    } else if (operationType === "dbl") {
      // save the 2nd operator to the 1st operatr
      // before blanking the 2nd operator
      _op1 = this.state.op2;
      console.log("683 d: resultData: ", resultData);

      this.setState(
        {
          op1: _op1,
          op2: "",
          num1: resultData.resultValue,
          num2: "",
        },
        this.setResultData({ resultData })
      );
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
