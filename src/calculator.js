import React, { Component } from "react";
import "./calculator.scss";
import Display from "./components/display";
import Keyboard from "./components/keyboard";
import Sidebar from "./components/sidebar";
import Cookies from "universal-cookie";
class Calculator extends Component {
  displayRef = React.createRef();
  constructor(props) {
    super(props);

    this.state.theme = this.getCookie("currentTheme");
    this.state.themesData.currentSetting = this.getCookie("currentTheme");
  }

  state = {
    numberKeys: [
      {
        id: 0,
        value: "0",
        title: "zero",
        keycode: 48,
        kbCode: "Digit0",
        type: "num",
      },
      {
        id: 1,
        value: "1",
        title: "one",
        keycode: 49,
        kbCode: "Digit1",
        type: "num",
      },
      {
        id: 2,
        value: "2",
        title: "two",
        keycode: 50,
        kbCode: "Digit2",
        type: "num",
      },
      {
        id: 3,
        value: "3",
        title: "three",
        keycode: 51,
        kbCode: "Digit3",
        type: "num",
      },
      {
        id: 4,
        value: "4",
        title: "four",
        keycode: 52,
        kbCode: "Digit4",
        type: "num",
      },
      {
        id: 5,
        value: "5",
        title: "five",
        keycode: 53,
        kbCode: "Digit5",
        type: "num",
      },
      {
        id: 6,
        value: "6",
        title: "six",
        keycode: 54,
        kbCode: "Digit6",
        type: "num",
      },
      {
        id: 7,
        value: "7",
        title: "seven",
        keycode: 55,
        kbCode: "Digit7",
        type: "num",
      },
      {
        id: 8,
        value: "8",
        title: "eight",
        keycode: 56,
        kbCode: "Digit8",
        type: "num",
      },
      {
        id: 9,
        value: "9",
        title: "nine",
        keycode: 57,
        kbCode: "Digit9",
        type: "num",
      },
      {
        id: 10,
        value: ".",
        title: "dot",
        keycode: 190,
        kbCode: "Period",
        type: "num",
      },
      {
        id: 11,
        value: "m",
        uniChar: "\u00B1",
        title: "plus minus (m)",
        keycode: 189,
        kbCode: "KeyM",
        type: "num",
      },
    ],
    functionKeys: [
      {
        id: 19,
        value: "+",
        title: "plus",
        keycode: 187,
        kbCode: "Equal",
        type: "func",
      },
      {
        id: 12,
        value: "-",
        title: "minus",
        keycode: 189,
        kbCode: "Minus",
        type: "func",
      },
      {
        id: 13,
        value: "x",
        uniChar: "\u00D7",
        title: "multiply (x)",
        keycode: 88,
        kbCode: "KeyX",
        type: "func",
      },
      {
        id: 14,
        value: "/",
        uniChar: "\u00F7",
        title: "divide (/)",
        keycode: 191,
        kbCode: "Slash",
        type: "func",
      },
      {
        id: 15,
        value: "s",
        uniChar: "\uD835\uDC65\u00B2",
        title: "square (s)",
        keycode: 83,
        kbCode: "KeyS",
        type: "func",
      },
      {
        id: 21,
        value: "r",
        uniChar: "\u00B2\u221A",
        title: "square root (r)",
        keycode: 82,
        kbCode: "KeyR",
        type: "func",
        ctrlKey: false,
      },
      {
        id: 20,
        value: "y",
        uniChar: "\uD835\uDC65\u02B8",
        title: "x to the power y (y)",
        keycode: 89,
        kbCode: "KeyY",
        type: "func",
      },
      {
        id: 16,
        value: "=",
        specialClass: "btn-success",
        title: "equals",
        keycode: 187,
        kbCode: "Equal",
        type: "func",
      },
    ],
    utilityKeys: [
      {
        id: 17,
        value: "c",
        specialClass: "btn-danger",
        title: "clear last keypress (c)",
        keycode: 67,
        kbCode: "KeyC",
        type: "func",
      },
      {
        id: 18,
        value: "a",
        uniChar: "\u0061\u0063",
        specialClass: "btn-danger",
        title: "all clear (a)",
        keycode: 65,
        kbCode: "KeyA",
        type: "func",
      },
    ],
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
    numberRgx: /[0123456789]/g,
    mathOpRgx: /[=+-x/\\ysr]/g,
    utilOpRgx: /[ac]/g,
    dblMathOpRgx: /[=+-x/\\y]/g,
    snglMathOpRgx: /[sr]/g,
    numberRgxNonGreedy: /[0123456789]/,
    mathOpRgxNonGreedy: /[=+-x/\\ysr]/,
    utilOpRgxNonGreedy: /[ac]/,
    dblMathOpRgxNonGreedy: /[=+-x/\\y]/,
    snglMathOpRgxNonGreedy: /[sr]/,
    userInput: "",
  };

  componentDidMount() {
    document.addEventListener("keydown", (e) => this.handleKeyPress(e));
  }

  // componentDidUpdate() {
  componentDidUpdate(nextProps, nextState) {
    if (this.state.computableParts === nextState.computableParts) {
      return false;
    } else {
      // this.storeComputableParts();
      this.doTheMath();
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
    const keyClicked = this.state.utilityKeys
      .concat(this.state.numberKeys, this.state.functionKeys)
      .filter((k) => {
        return k.id.toString() === e.target.id;
      });
    let clickData = {
      key: keyClicked[0].value ? keyClicked[0].value : "",
      ctrlKey: false,
      shiftKey: false,
    };
    this.parseUserInput(clickData);
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
        this.parseUserInput(pressData);
      }
    }
  };

  handleActiveClass = (e) => {
    // console.log("adding and removing active class");
  };

  routeInput = (input) => {
    const mathOpRgxNonGreedy = this.state.mathOpRgxNonGreedy;
    const utilOpRgxNonGreedy = this.state.utilOpRgxNonGreedy;

    if (utilOpRgxNonGreedy.test(key)) {
      console.log(
        "440: utilOpRgxNonGreedy.test(key)",
        utilOpRgxNonGreedy.test(key)
      );
      this.doUtilityFunction(key);
      return;
    }
  };

  doUtilityFunction = (key) => {
    console.log("395: doUtilityFunction key:", key);
    let resultData = { ...this.state.resultData };
    let computableParts = { ...this.state.computableParts };

    if (key === "a") {
      resultData.resultValue = "0";
      computableParts.num1 = "";
      computableParts.num2 = "";
      computableParts.op1 = "";
      computableParts.op2 = "";

      console.log("ac pressed", computableParts);
      this.setState({ computableParts }, () => {
        this.setCalculationData();
        this.setResultData(resultData);
      });
    }
    if (key === "c") {
      let { userInput } = this.state;
    }
    if (key === "=") {
    }
  };

  parseUserInput = (inputData) => {
    console.log(
      "423: parseUserInputparseUserInputparseUserInputparseUserInputparseUserInput",
      inputData
    );

    const key = inputData.key;
    delete inputData["key"];
    // const { userInput } = this.state;
    const mathOpRgxNonGreedy = this.state.mathOpRgxNonGreedy;
    const utilOpRgxNonGreedy = this.state.utilOpRgxNonGreedy;

    if (utilOpRgxNonGreedy.test(key)) {
      console.log(
        "440: utilOpRgxNonGreedy.test(key)",
        utilOpRgxNonGreedy.test(key)
      );
      this.doUtilityFunction(key);
      return;
    }

    if (mathOpRgxNonGreedy.test(key)) {
      console.log(
        "449: mathOpRgxNonGreedy.test(key)",
        mathOpRgxNonGreedy.test(key)
      );
      inputData.op = key;
    } else {
      inputData.num = key;
    }
    this.storeComputableParts(inputData);
    let { userInput } = this.state;
    // userInput += key;
    this.setState({ userInput: (userInput += key) });
  };

  storeComputableParts = (partData) => {
    console.log("463: storeComputableParts partData: ", partData);

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
                        keys={this.state.numberKeys}
                        passClickHandler={(e) => this.handleClick(e)}
                      />
                    </div>
                    <div
                      className={`col keyboard ${this.state.functionKeyboardClass}`}>
                      <Keyboard
                        keys={this.state.functionKeys}
                        passClickHandler={(e) => this.handleClick(e)}
                      />
                      <div
                        className={`row keyboard ${this.state.utilityKeyboardClass}`}>
                        <Keyboard
                          keys={this.state.utilityKeys}
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
