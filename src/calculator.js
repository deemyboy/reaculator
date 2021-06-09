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
    numRgx: /[0-9]/g,
    mathOpRgx: /[+\-x\/ysr]/g,
    utilOpRgx: /[acm=]/g,
    dblMthOpRgx: /[+\-x\/y]/g,
    snglMthOpRgx: /[sr]/g,
    dotRgxNnGr: /\./,
    numRgxNnGr: /[0-9]/,
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
      resultData.resultCount < 2
    ) {
      resultData.resultValue = this.doSnglOpMath();
      resultData.resultCount += 1;
      clearUpData.opType = "sngl";
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
      resultData.resultCount < 2
    ) {
      resultData.resultValue = this.doDblOpMath();
      resultData.resultCount += 1;
      clearUpData.opType = "dbl";
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
    // console.log("182: handleClick");
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
    // console.log("200: handleKeyPress");
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
        this.state.utilOpRgxNnGr.test(key)
      );

      this.handleUtilityOperator(inputData);
      return;
    }

    this.setState({ userInput: _userInput }, this.parseUserInput);
  };

  handleUtilityOperator = (inputData) => {
    console.log("268: handleUtilityOperator inputData:", inputData);
    const key = inputData.key;
    let resultData = { ...this.state.resultData };

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
      console.log("296", this.state.num1, this.state.num2);
      if (
        this.state.num1 &&
        this.state.num1 !== "" &&
        this.state.num2 &&
        this.state.num2 !== ""
      ) {
        console.log("hit");
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
    console.log("314: ######### parseUserInput #########");
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

    let isDecimal;

    let _userInput, op, num;
    _userInput = userInput;

    let dotMatches = [..._userInput.matchAll(dotRgx)];
    let mathMatches = [..._userInput.matchAll(mathRgx)];
    let numMatches = [..._userInput.matchAll(numRgx)];
    // console.log("335: userInput: ", userInput);

    const handleDecimal = (input) => {
      console.log(
        "345: handleDecimal input: ",
        input,
        " _userInput: ",
        _userInput
      );

      console.log("mathMatches", mathMatches.length);
      if (
        mathMatches &&
        mathMatches.length > 0 &&
        numMatches &&
        numMatches.length === 0
      ) {
        return "0";
      }

      if (numMatches && numMatches.length === 0) {
        return "0.";
      }

      // handle input 5. or 2.
      // returns the int part + the operator
      // casts back to a String before concating operator
      if (
        numMatches &&
        numMatches.length === 1 &&
        mathMatches &&
        mathMatches.length > 0
      ) {
        return input.substr(0, mathMatches[0].index - 1) + mathMatches[0][0];
      }

      if (
        numMatches &&
        numMatches.length > 0 &&
        mathMatches &&
        mathMatches.length > 0
      ) {
        let _op = mathMatches[0][0];
        let prefix = "";
        let frstDotIdx = dotMatches[0].index;
        let numMatchesJoined = numMatches.join("");

        let numMatchesIntPart = numMatchesJoined.substr(0, frstDotIdx);
        let numMatchesDecPart = numMatchesJoined.substr(frstDotIdx);
        console.log("377: ", numMatchesIntPart, numMatchesDecPart);
        if (numMatchesIntPart == "") {
          prefix = "0";
        }
        input = prefix + numMatchesIntPart + "." + numMatchesDecPart + _op;
        // console.log("382: dec friendly input: ", input);
      }
      return input;
    };

    const extractComputationParts = (input, opType) => {
      console.log("401 extractComputationParts: input:", input);
      let dotMatches = [...input.matchAll(dotRgx)];
      let numMatches = [...input.matchAll(numRgx)];

      let opMatches;
      let extractions = {};
      if (opType === "sngl")
        opMatches = [...input.matchAll(this.state.snglMthOpRgx)];
      if (opType === "dbl")
        opMatches = [...input.matchAll(this.state.dblMthOpRgx)];
      console.log(
        "412: input: ",
        input,
        "opMatches: ",
        opMatches,
        "numMatches: ",
        numMatches
      );

      if (numMatches && numMatches.length > 0)
        console.log(
          `422 extractComputationParts: opType: ${opType} num: ${numMatches[0][0]} op: ${opMatches[0][0]}`
        );

      // console.log(input.substr(0, mathMatches[0].index));

      extractions.op = opMatches[0][0];
      extractions.num = input.substr(0, mathMatches[0].index);
      console.log("429: extractions:", extractions);
      // if (dotMatches && dotMatches.length > 0) {
      //   extractions.num = handleDecimal(extractions.num);
      //   console.log("input after handle decimal", extractions.num);
      // }
      return extractions;
    };

    console.log(
      "437: mathMatches",
      mathMatches,
      " mathMatches.length",
      mathMatches.length
    );

    // handle a maths op being repeatedly entered first
    if (
      mathOpRgxNnGr.test(_userInput) &&
      !numRgxNnGr.test(_userInput) &&
      !dotRgxNnGr.test(_userInput)
    ) {
      // clear the user input
      this.setState({ userInput: "" });
      return;
    }

    // handle decimal numbers
    if (dotRgxNnGr.test(_userInput)) {
      console.log("431: dotRgx op found");
      isDecimal = true;
      _userInput = handleDecimal(_userInput);
    }

    console.log(
      "462: _userInput after handleDecimal: ",
      _userInput,
      "isDecimal: ",
      isDecimal
    );

    console.log(
      "(snglMthOpRgxNnGr.test(_userInput)): ",
      snglMthOpRgxNnGr.test(_userInput)
    );

    if (snglMthOpRgxNnGr.test(_userInput)) {
      console.log("474: snglMthOpRgxNnGr op found");
      let _compParts = extractComputationParts(_userInput, "sngl");
      console.log("476", _compParts, _compParts.num, _compParts.op);
      this.updateOperator(_compParts.op);
      this.updateNumber(_compParts.num);
      this.setState({ userInput: "" });
      return;
    }

    console.log(
      "(dblMthOpRgxNnGr.test(_userInput)): ",
      dblMthOpRgxNnGr.test(_userInput)
    );
    if (dblMthOpRgxNnGr.test(_userInput)) {
      console.log("488: dblMthOpRgxNnGr op found");
      let _compParts = extractComputationParts(_userInput, "dbl");
      this.updateOperator(_compParts.op);
      this.updateNumber(_compParts.num);
      this.setState({ userInput: "" });
      return;
    }

    return;

    // this.storeComputableParts(inputData);
  };

  setCalculationData = (data) => {
    const computableParts = { ...this.state.computableParts };
    // console.log("411: setCalculationData computableParts: ", computableParts);
    let calcDataObj = {};
    calcDataObj.calculationClass = this.state.calculationData.calculationClass; // default class
    const num1 = computableParts.num1;
    const num2 = computableParts.num2;
    const op1 = computableParts.op1;
    const op2 = computableParts.op2;

    let calculationData = { ...this.state.calculationData };
    console.log(
      "469: setCalculationData calcDataObj: ",
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
    console.log("547: ", calculationData);
    this.setState({ calculationData });
  };

  doSnglOpMath = () => {
    let resultData = { ...this.state.resultData };
    const op = this.state.op1;
    const num = Number(this.state.num1);
    console.log("555  : doSnglOpMath: op", op);

    if (!op || op == "") return;

    switch (op) {
      case "r": {
        console.log("561: r");
        return Math.sqrt(num);
      }
      case "s": {
        console.log("566: s");
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
    console.log("503: doSnglOpMath: op");
    let resultData = { ...this.state.resultData };

    const op = this.state.op1;
    const num1 = Number(this.state.num1);
    const num2 = Number(this.state.num2);

    console.log(`585: doDblOpMath op: ${op} num1: ${num1} num2: ${num2}`);
    switch (op) {
      case "+": {
        console.log("+");
        return num1 + num2;
      }
      case "-": {
        console.log("-");
        return num1 - num2;
      }
      case "x": {
        console.log("x");
        return num1 * num2;
      }
      case "y": {
        console.log("y");
        return Math.pow(num1, num2);
      }
      case "/": {
        console.log("/");
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
    console.log("616: setResultData data: ", data);
    let callback, callbackData;
    let resultData = { ...this.state.resultData };

    if (data.resultClass) {
      resultData.resultClass = data.resultClass;
    }
    if (data.callback) {
      callback = data.callback;
      callbackData = data.callbackData;
    }
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
    console.log("546: clearResultCount", resultData);
    this.setState({ resultData });
  };

  postResultClearUp = (clearUpData) => {
    console.log("562: postResultClearUp clearUpData: ", clearUpData);
    let _num1, _num2, _op1, _op2;
    let resultData = { ...this.state.resultData };
    delete resultData.callback;
    delete resultData.callbackData;

    resultData.resultCount = 0;

    if (clearUpData.opType === "sngl") {
      // op1 = "";
      _num1 = resultData.resultValue;

      this.setState({ op1: "", userInput: _num1, num1: "", resultData });
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
        }`}>
        <div className="flex-row row">
          <div
            className={`calculator ${this.state.theme.toLowerCase()}`}
            onClick={(e) => this.toggleSidebar(e)}>
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
                      className={`col keyboard ${this.state.numberKeyboardClass}`}>
                      <Keyboard
                        keys={this.numberKeys}
                        passClickHandler={(e) => this.handleClick(e)}
                      />
                    </div>
                    <div
                      className={`col keyboard ${this.state.functionKeyboardClass}`}>
                      <Keyboard
                        keys={this.functionKeys}
                        passClickHandler={(e) => this.handleClick(e)}
                      />
                      <div
                        className={`row keyboard ${this.state.utilityKeyboardClass}`}>
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
            dropdownData={this.packageDropdownData(
              this.state.themesData
            )}></Sidebar>
        </div>
      </div>
    );
  };
}

export default Calculator;
