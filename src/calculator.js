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
    mathOpRgx: /([\+\-x\/ysr=])/gi,
    utilOpRgx: /[acm]/gi,
    dblMthOpRgx: /[+\-x\/y]/gi,
    snglMthOpRgx: /[sr]/gi,
    dotRgxNnGr: /\./,
    numRgxNnGr: /(\d+)/,
    mathOpRgxNnGr: /[\+\-x\/ysr=]/,
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

  parseUserInput = () => {
    const utilOpRgxNnGr = this.state.utilOpRgxNnGr;
    const snglMthOpRgxNnGr = this.state.snglMthOpRgxNnGr;
    const dblMthOpRgxNnGr = this.state.dblMthOpRgxNnGr;

    const mathOpRgxNnGr = this.state.mathOpRgxNnGr;
    const numRgxNnGr = this.state.numRgxNnGr;
    const dotRgxNnGr = this.state.dotRgxNnGr;
    const mathOpRgx = this.state.mathOpRgx;
    const numRgx = this.state.numRgx;
    const dotRgx = this.state.dotRgx;

    const num1 = this.state.num1;
    const num2 = this.state.num2;
    const op1 = this.state.op1;
    const op2 = this.state.op2;
    const dot = ".";

    const { userInput } = this.state;

    console.log(`338: ######### parseUserInput ${userInput} #########`);
    let _userInput = userInput;

    let dotMatchesNG = _userInput.match(dotRgxNnGr);
    let mathMatchesNG = _userInput.match(mathOpRgxNnGr);
    let greedyDotMatches = _userInput.match(dotRgx);
    let greedyMathMatches = _userInput.match(mathOpRgx);
    let dotMatches = [..._userInput.matchAll(dotRgx)];
    let mathMatches = [..._userInput.matchAll(mathOpRgx)];
    let numMatches = [..._userInput.matchAll(numRgx)];

    const handleMathsOp = (input) => {
      //
    };

    const handleNumber = (input) => {
      //
      console.log(`handleNumber input ${input}`);
      // return;
      let _input = input;

      //removes leading 0000s
      // also returns an integer as no decimal point detected
      if (!dotRgxNnGr.test(input)) {
        console.log("no dots");
        return Number(_input).toString();
      }

      if (dotRgxNnGr.test(input)) {
        _input = this.handleDecimal(input);
        console.log("returned from handleDecimal _input: ", _input);
        return;
      }
    };

    // this.storeComputableParts(inputData);

    if (
      (numRgxNnGr.test(userInput) || dotRgxNnGr.test(userInput)) &&
      !mathOpRgxNnGr.test(userInput)
    ) {
      _userInput = handleNumber(userInput);
      console.log("_userInput on return from handleNumber: ", _userInput);
    }
    return;
  };

  handleDecimal = (input) => {
    console.log("handleDecimal: ", input);

    const numRgx = this.state.numRgx;
    const dotRgx = this.state.dotRgx;
    const dotRgxNnGr = this.state.dotRgxNnGr;
    const numRgxNnGr = this.state.numRgxNnGr;
    const frstDtIdx = input.match(dotRgxNnGr).index;
    const numDots = input.match(dotRgx).length;
    const oneToNineRgx = /[1-9]/;
    const zeroRgx = /[0]/;
    const dot = ".";

    let frstNumIdx, numMatches, extractedNums;

    const handleUnaryDots = () => {
      console.log("handleUnaryDots");
      return "0.";
    };

    const handlePerfectDecimal = (input) => {
      console.log("handlePerfectDecimal");

      if (parseInt(input.slice(0, frstDtIdx)) === 0) {
        extractedNums = extractedNums.slice(0, frstDtIdx);
      }
      // handle numbers less than 0
      // .0 or 0. 0000.
      if (
        (frstNumIdx !== undefined && frstNumIdx > 0 && frstDtIdx === 0) ||
        (frstDtIdx === input.length - 1 && Number(extractedNums) === 0)
      ) {
        return handleFltsLssThnZero(extractedNums, frstDtIdx, frstNumIdx);
      }

      // handle numbers greater than 0
      if (
        frstNumIdx !== undefined &&
        frstNumIdx === 0 &&
        parseInt(input.slice(0, frstDtIdx)) !== 0
      ) {
        return handleFltsGrtrThnZero(extractedNums, frstDtIdx, frstNumIdx);
      }
    };

    const handleFltsLssThnZero = (extractedNums, frstDtIdx, frstNumIdx) => {
      console.log(
        "handleFltsLssThnZero extractedNums",
        extractedNums,
        "frstDtIdx",
        frstDtIdx,
        "frstNumIdx",
        frstNumIdx
      );

      if (
        // 0. or 0000.
        (extractedNums.match(zeroRgx) &&
          Number(extractedNums) === 0 &&
          frstDtIdx > 0) ||
        // 0. exactly
        (extractedNums.match(zeroRgx) &&
          extractedNums.match(zeroRgx).index === 0 &&
          extractedNums.length === 1 &&
          frstDtIdx > 0) ||
        // 098. or 000098.
        (extractedNums.match(zeroRgx) &&
          extractedNums.match(zeroRgx).index === 0 &&
          extractedNums.match(oneToNineRgx) &&
          extractedNums.match(oneToNineRgx).index > 0 &&
          frstDtIdx > 0)
      ) {
        input = this.handleLeadingZero(input);
        console.log("input after return from handleLeadingZero", input);
      }
      return "0" + dot + extractedNums.substr(frstDtIdx);
    };

    const handleFltsGrtrThnZero = (extractedNums, frstDtIdx, frstNumIdx) => {
      console.log(
        "handleFltsGrtrThnZero extractedNums",
        extractedNums,
        "frstDtIdx",
        frstDtIdx,
        "frstNumIdx",
        frstNumIdx
      );
      // if (Number(input.substr(1) === 0)) return "0." + input.substr(1);
      return (
        extractedNums.slice(frstNumIdx, frstDtIdx) +
        dot +
        extractedNums.slice(frstDtIdx)
      );
    };

    const handleExtraDots = (input) => {
      console.log("handleExtraDots: need to handle extra decimal points");

      let zeroData;
    };

    // no numbers upto this point
    // handle "." "...." entered
    if (numDots === input.length) {
      console.log(`handle only dots "." or "...." entered`);
      return handleUnaryDots();
    }

    // numbers and dots

    if (numRgxNnGr.test(input)) {
      console.log(`numbers and dots entered`);
      frstNumIdx = input.match(numRgxNnGr).index;
      numMatches = input.match(numRgx);
      extractedNums = numMatches.join("");

      // single dot
      // handle "913." or ".903" or "0093."
      // or ".00093" or "0.34" entered
      if (numDots === 1 && input.length > 1) {
        return handlePerfectDecimal(input);
      }

      // handle more than 1 dot eg. "..90" or "9.0..0"
      if (numDots > 1 && input.length > 1) {
        console.log("MORE than 0 extractedNums", extractedNums);
        return handleExtraDots(input);
      }
    }
  };

  handleLeadingZero = (input) => {
    console.log("handleLeadingZero", input);
    const oneToNineRgx = /[1-9]/;
    const zeroRgx = /[0]/;
    const dot = ".";
    const numRgx = this.state.numRgx;
    let zeroIdx, nonZeroIdx;
    let numMatches = input.match(numRgx);
    let extractedNums = numMatches.join("");

    zeroIdx = input.match(zeroRgx).index;
    if (oneToNineRgx.test(input)) {
      nonZeroIdx = input.match(oneToNineRgx).index;
    }
    if (input.charAt(0) !== "0") {
      return (
        extractedNums.slice(0, zeroIdx) + dot + extractedNums.slice(zeroIdx)
      );
    } else {
      return (
        extractedNums.slice(0, nonZeroIdx) +
        dot +
        extractedNums.slice(nonZeroIdx)
      );
    }
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
