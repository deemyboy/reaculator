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
    resultData: { resultClass: "result", resultValue: "0" },
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
    computableParts: {
      num1: "",
      num2: "",
      op1: "",
      op2: "",
    },
    numberData: {
      num1: "",
      num2: "",
    },
    operatorData: {
      op1: "",
      op2: "",
    },
    numberRgx: /[0-9\.]*/g,
    mathOpRgx: /[+\-x\/ysr]/g,
    utilOpRgx: /[acm\.=]/g,
    dblMathOpRgx: /[+\-x\/y]/g,
    snglMathOpRgx: /[sr]/g,
    numberRgxNonGreedy: /[0-9\.]/,
    mathOpRgxNonGreedy: /[+\-x\/ysr]/,
    utilOpRgxNonGreedy: /[acm\.=]/,
    dblMathOpRgxNonGreedy: /[+\-x\/y]/,
    snglMathOpRgxNonGreedy: /[sr]/,
    userInput: "",
  };

  componentDidMount() {
    document.addEventListener("keydown", (e) => this.handleKeyPress(e));
  }

  // componentDidUpdate() {
  componentDidUpdate(nextProps, nextState) {
    if (this.state.computableParts !== nextState.computableParts) {
      this.doTheMath();
    }

    if (this.state.userInput !== nextState.userInput) {
      this.parseUserInput();
      return true;
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
    // console.log("347: handleClick");
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
    // console.log("376: handleKeyPress");
    // console.log(e);
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
    // console.log("adding and removing active class");
  };

  routeInput = (inputData) => {
    const mathOpRgxNonGreedy = this.state.mathOpRgxNonGreedy;
    const utilOpRgxNonGreedy = this.state.utilOpRgxNonGreedy;
    const numberRgxNonGreedy = this.state.numberRgxNonGreedy;
    const key = inputData.key;
    console.log("397: routeInput inputData: ", inputData);

    if (utilOpRgxNonGreedy.test(key)) {
      console.log(
        "401: utilOpRgxNonGreedy.test(key)",
        utilOpRgxNonGreedy.test(key)
      );
      this.handleUtilityOperator(inputData);
      return;
    }

    if (mathOpRgxNonGreedy.test(key)) {
      console.log(
        "410: mathOpRgxNonGreedy.test(key)",
        mathOpRgxNonGreedy.test(key)
      );
      this.handleMathOperator(inputData);
      return;
    }

    if (numberRgxNonGreedy.test(key)) {
      console.log(
        "419: numberRgxNonGreedy.test(key)",
        numberRgxNonGreedy.test(key)
      );
      this.handleNumberOperator(inputData);
      return;
    }
  };

  handleUtilityOperator = (inputData) => {
    console.log("428: handleUtilityOperator inputData:", inputData);
    // return;
    const key = inputData.key;
    let resultData = { ...this.state.resultData };
    let computableParts = { ...this.state.computableParts };

    if (key === "a") {
      resultData.resultValue = "0";
      computableParts.num1 = "";
      computableParts.num2 = "";
      computableParts.op1 = "";
      computableParts.op2 = "";

      // console.log("ac pressed", computableParts);
      // this.setState({ computableParts }, () => {
      //   this.setCalculationData();
      //   this.setResultData(resultData);
      // });
    }
    if (key === "c") {
      let { userInput } = this.state;
    }
    if (key === "=") {
    }
    this.setState({ userInput: "" });
  };

  handleMathOperator = (inputData) => {
    console.log("454: handleMathOperator inputData:", inputData);
    let computableParts = { ...this.state.computableParts };
    const key = inputData.key;
    if (!computableParts.op1 || computableParts.op1 === "") {
      console.log(true);
      computableParts.op1 = key;
      console.log("computableParts", computableParts);
      this.setState({ computableParts });
      return;
    }
    computableParts.op2 = key;
    this.setState({ computableParts });
    // let
    return;
  };

  handleNumberOperator = (inputData) => {
    console.log("458: handleNumberOperator inputData:", inputData);
    let computableParts = { ...this.state.computableParts };
    const key = inputData.key;
    if (!computableParts.num1 || computableParts.num1 === "") {
      computableParts.num1 = key;
      this.setState({ computableParts });
      return;
    }
    computableParts.num2 = key;
    this.setState({ computableParts });
    // let
    return;
  };

  parseUserInput = () => {
    // console.log("465: parseUserInput parseUserInput parseUserInput");
    const utilOpRgxNonGreedy = this.state.utilOpRgxNonGreedy;
    const mathOpRgxNonGreedy = this.state.mathOpRgxNonGreedy;
    const numberRgxNonGreedy = this.state.numberRgxNonGreedy;

    const { userInput } = this.state;

    let _userInput, op, num;
    _userInput = userInput;
    console.log("347: userInput:", userInput);

    const handleDecimal = (number) => {
      const dotRgx = /\./g;
      const numRgx = /\d/g;
      // console.log("325: handleDecimal number: ", number);
      let matches = number.matchAll(dotRgx) ? [...number.matchAll(dotRgx)] : [];
      // console.log(matches, matches.length);
      let dotMatches = [...number.matchAll(dotRgx)];
      let numMatches = [...number.matchAll(numRgx)];
      // console.log("330: ", dotMatches.length, numMatches.length);

      if (number === ".") {
        return "0.";
      }
      if (dotMatches.length > 1) {
        let prefix = "";
        let frstDotIdx = dotMatches[0].index;
        let numMatchesJoined = numMatches.join("");

        let numMatchesIntPart = numMatchesJoined.substr(0, frstDotIdx);
        let numMatchesDecPart = numMatchesJoined.substr(frstDotIdx);
        // console.log("342: ", numMatchesIntPart, numMatchesDecPart);
        if (numMatchesIntPart == "") {
          prefix = "0";
        }
        number = prefix + numMatchesIntPart + "." + numMatchesDecPart;
        // console.log("347: dec friendly number: ", number);
      }
      return number;
    };

    const extractNumbers = (inputData) => {
      // let matches = [...userInput.matchAll(this.state.numberRgx)];
      return Array.from(
        inputData.matchAll(this.state.numberRgx),
        (m) => m[0]
      ).filter((item) => item);
    };

    let decimalFriendlyUserInput = handleDecimal(userInput);
    // this.setState({ userInput: decimalFriendlyUserInput });

    console.log("363: decimalFriendlyUserInput: ", decimalFriendlyUserInput);
    // return;
    let matches = extractNumbers(decimalFriendlyUserInput);
    console.log("363: matches: ", matches);

    // this.storeComputableParts(inputData);
  };

  handleUserInput = (inputData) => {
    console.log("535: handleUserInput handleUserInput", inputData);
    let _userInput;
    let { userInput } = this.state;
    const key = inputData.key;
    const shiftKey = inputData.shiftKey;
    const ctrlKey = inputData.ctrlKey;
    _userInput = userInput;

    // handle shift & ctrl
    if (!shiftKey && !ctrlKey) {
      _userInput += key;
    }
    if (shiftKey && key === "+") {
      _userInput += key;
    }

    this.setState({ userInput: _userInput });
  };

  storeComputableParts = (partData) => {
    console.log("500: storeComputableParts partData: ", partData);

    let computableParts = { ...this.state.computableParts };

    const num1 = computableParts.num1;
    const num2 = computableParts.num2;
    const op1 = computableParts.op1;
    const op2 = computableParts.op2;

    const handleDecimal = () => {
      let numToProcess = null;
      if (!computableParts.op1) {
        numToProcess = computableParts.num1;
      } else {
        numToProcess = computableParts.num2;
      }
      if (numToProcess === "") {
        return "0.";
      }
      if (numToProcess.indexOf(".") < 0) {
        console.log('numToProcess.indexOf(".")', numToProcess.indexOf("."));
        return ".";
      }
      if (numToProcess.indexOf(".") > 0) {
        console.log('numToProcess.indexOf(".")', numToProcess.indexOf("."));
        return "";
      }
    };

    const storeNum = (num) => {
      // console.log("567: storeNum", num);
      if (computableParts.op1 === "y") {
        computableParts.num2 += num;
      }
      if (num === ".") {
        num = handleDecimal();
      }
      if (!computableParts.op1) {
        computableParts.num1 += num;
      } else {
        computableParts.num2 += num;
      }
    };

    const storeOp = (op) => {
      // console.log("582: storeOp");
      if (!num1) {
        console.log("584: cannot store any ops. when num1 not present");
        return;
      }
      if (!op1) {
        op1 = op;
        return;
      }
      if (!num2) {
        console.log("592: cannot add op when num2 not present");
        return;
      }
      if (!op2) {
        op2 = op;
      }
    };

    // console.log("599: storeComputableParts partData: ", partData);
    if (num1 && num2 && op1 && op2) {
      // do. nothing
      console.log("607: do nothing -  all 4 parts are set.");
      return;
    }

    if (!partData.ctrlKey && !partData.shiftKey) {
      // no shift or ctrl.
      // do num or op storage
      if (partData.num) {
        // store num
        storeNum(partData.num);
      } else if (partData.op) {
        // store op
        storeOp(partData.op);
      }
    }
    if (partData.shiftKey && partData.op === "+") {
    }
    if (partData.ctrlKey) {
      // ctrlKey = partData.ctrlKey;
    }
    if (!partData.ctrlKey) {
      // ctrlKey = false;
    }
    if (partData.shiftKey) {
      // shiftKey = partData.shiftKey;
    }
    if (!partData.shiftKey) {
      // shiftKey = false;
    }

    computableParts.num1 = num1;
    computableParts.num2 = num2;
    computableParts.op1 = op1;
    computableParts.op2 = op2;
    this.setState({ computableParts }, this.setCalculationData);
    return;
  };

  setCalculationData = (data) => {
    const computableParts = { ...this.state.computableParts };
    // console.log("457: setCalculationData computableParts: ", computableParts);
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
    console.log("489: ", calculationData);
    this.setState({ calculationData });
  };

  doTheMath = () => {
    let operator = null;

    const calculateDbleOpResult = (op) => {
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
          return null;
        }
      }
    };

    const calculateSnglOpResult = (op) => {
      switch (op) {
        case "r": {
          console.log("r");
          return Math.sqrt(num1);
        }
        case "s": {
          console.log("s");
          if (num1 === 0) return 1;
          return num1 * num1;
        }
        default: {
          return null;
        }
      }
    };

    const computableParts = { ...this.state.computableParts };
    // console.log("667: doTheMath - trying to do maths", computableParts);

    // console.log(
    //   "670",
    //   computableParts.num1,
    //   typeof computableParts.num1,
    //   typeof Number(computableParts.num1)
    // );

    // let num1 = Number(computableParts.num1)
    //   ? Number(computableParts.num1)
    //   : computableParts.num1;
    let num1, num2, op1, op2;
    if (computableParts.num1) {
      num1 = Number(computableParts.num1);
    }
    if (computableParts.num1) {
      num2 = Number(computableParts.num2);
    }

    op1 = computableParts.op1;
    op2 = computableParts.op2;

    // console.log(num1, num2, op1, op2);
    let resultData = { ...this.state.resultData };

    // check parts
    if (!num1) {
      // console.log("num1 not present: maths not possible");
      return;
    }
    if (!op1) {
      // console.log(
      //   num1,
      //   " <- num1,  op1 not present: maths not possible",
      //   typeof num1
      // );
      return;
    }

    if (this.state.snglMathOpRgxNonGreedy.test(op1)) {
      console.log("758: single maths op detected");
      // operator = op1;
      if (resultData.resultValue !== "0") {
        num1 = resultData.resultValue;
        num2 = num1;
        computableParts.num1 = num1;
        // this.setState({ computableParts });.
      }
      num2 = num1;
      op2 = op1;
      resultData.resultValue = calculateSnglOpResult(op1);
      this.setState({ resultData });
      return;
    }

    if (!num2) {
      // console.log("no num2");
      return;
    }

    if (!op2) {
      // console.log('!op2 && !op1 === "y"', !op2 && !op1 === "y");
      // console.log("no op 2");
      return;
    }

    // console.log(calculateResult(op1));
    resultData.resultValue = calculateDbleOpResult(op1);
    this.setState({ resultData });
    // let result =
  };

  setResultData = (data) => {
    // console.log("452: setResultData ");

    let resultData = { ...this.state.resultData };

    if (data.resultClass) {
      resultData.resultClass = data.resultClass;
    }

    resultData.resultValue = data.resultValue;
    this.setState({ resultData });
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
