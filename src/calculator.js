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
        shiftKey: true,
      },
      {
        id: 12,
        value: "-",
        title: "minus",
        keycode: 189,
        kbCode: "Minus",
        type: "func",
        shiftKey: false,
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
        shiftKey: false,
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
      calculationValue: "0",
    },
    userInput: "",
    resultData: { resultClass: "result", resultValue: "50000" },
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
      shiftKey: false,
      ctrlKey: false,
      numOp: false,
      snglOp: false,
      dblOp: false,
      utilOp: false,
    },
    operators: ["+", "-", "x", "/", "s", "r", "y", "=", "c", "a", "m", "."],
    funcOpRgx: /[sr+\/\-xy.ac=m]/g,
    utilOpRgx: /[.ac=m]/g,
    dblMathOpRgx: /[+\/\-xy=]/g,
    snglMathOpRgx: /[sr]/g,
    mathOpRgxNonGreedy: /[sr+\/\-xy.ac=m]/,
    utilOpRgxNonGreedy: /[.ac=m]/,
    dblMathOpRgxNonGreedy: /[+\/\-xy=]/,
    snglMathOpRgxNonGreedy: /[sr]/,
    matchCount: 0,
  };

  componentDidMount() {
    document.addEventListener("keydown", (e) => this.handleKeyPress(e));
  }

  // componentDidUpdate() {
  componentDidUpdate(nextProps, nextState) {
    if (this.state.userInput === nextState.userInput) {
      return false;
    } else {
      // this.storeComputableParts();
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
    let clickData = {};
    clickData.key = keyClicked[0].value ? keyClicked[0].value : "";
    clickData.ctrlKey = false;
    clickData.shiftKey = false;
    this.parseUserInput(clickData);
  };

  handleKeyPress = (e) => {
    console.log("376: handleKeyPress");
    console.log(e, e.repeat);
    const allowedKeys = [
      16, 17, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 190, 189, 187, 189, 88,
      191, 83, 82, 89, 187, 67, 65,
    ];
    if (!e.repeat) {
      if (allowedKeys.includes(e.keyCode)) {
        let pressData = {
          key: e.key,
          ctrlKey: e.ctrlKey,
          shiftKey: e.shiftKey,
        };
        this.handleActiveClass(e);
        // this.handleUserInput(pressData);
        this.parseUserInput(pressData);
      }
    }
  };

  handleActiveClass = (e) => {
    console.log("adding and removing active class");
  };

  parseUserInput = (inputData) => {
    console.log("417: parseUserInput", inputData);

    const packageIndividualParts = (part) => {
      console.log(`420: part: ${JSON.stringify(part)}`);
      let _individualParts = {};
      if (part.num1) {
        _individualParts.num1 = part.num1;
      }
      if (part.op1) {
        _individualParts.op1 = part.op1;
      }
      if (part.num2) {
        _individualParts.num2 = part.num2;
      }
      if (part.op2) {
        _individualParts.op2 = part.op2;
      }
      if (part.ctrlKey) {
        _individualParts.ctrlKey = part.ctrlKey;
      }
      if (part.shiftKey) {
        _individualParts.shiftKey = part.shiftKey;
      }
      return _individualParts;
    };

    const key = inputData.key;
    // const { userInput } = this.state;
    const funcOpRgx = this.state.funcOpRgx;
    const utilOpRgx = this.state.utilOpRgx;
    const snglMathOpRgx = this.state.snglMathOpRgx;
    const dblMathOpRgx = this.state.dblMathOpRgx;

    const mathOpRgxNonGreedy = this.state.mathOpRgxNonGreedy;
    const utilOpRgxNonGreedy = this.state.utilOpRgxNonGreedy;
    const snglMathOpRgxNonGreedy = this.state.snglMathOpRgxNonGreedy;
    const dblMathOpRgxNonGreedy = this.state.dblMathOpRgxNonGreedy;

    let individualParts = {};

    if (key.match(funcOpRgx)) {
      console.log("key.match(funcOpRgx)", key.match(funcOpRgx));
      inputData.op = key;
      // if (key.match(utilOpRgx)) {
      //   console.log("utilOp", key.match(utilOpRgx));
      //   inputData.utilOp = true;
      //   // this.storeComputableParts(inputData);
      // } else if (key.match(snglMathOpRgx)) {
      //   console.log("snglMathOp", key.match(snglMathOpRgx));
      //   inputData.snglOp = true;
      //   // this.storeComputableParts(inputData);
      // } else if (key.match(dblMathOpRgx)) {
      //   console.log("dblMathOp:", key.match(dblMathOpRgx));
      //   inputData.dblOp = true;
      // }
    } else {
      console.log(`key - just digits: ${key}`);
      inputData.num = key;
    }
    this.storeComputableParts(inputData);
    return;
  };

  setCalculationData = (data) => {
    let calculationData = { ...this.state.calculationData };
    if (data.calculationClass) {
      calculationData.calculationClass = data.calculationClass;
    }
    if (data.calculationValue) {
      calculationData.calculationValue = data.calculationValue;
    }
    this.setState({ calculationData });
  };

  storeComputableParts = (partData) => {
    let _computableParts = {
      num1: "",
      num2: "",
      op1: "",
      op2: "",
      shiftKey: false,
      ctrlKey: false,
      numOp: false,
      snglOp: false,
      dblOp: false,
      utilOp: false,
    };

    let num;
    let op;
    let computableParts = { ...this.state.computableParts };
    console.log(
      "501: storeComputableParts partData: ",
      partData,
      " computableParts: ",
      computableParts
    );
    console.log(
      "!partData.ctrlKey && !partData.shiftKey && (partData.num || partData.op)",
      !partData.ctrlKey && !partData.shiftKey && (partData.num || partData.op)
    );
    console.log("end");
    if (
      (!partData.ctrlKey &&
        !partData.shiftKey &&
        (partData.num || partData.op)) ||
      ((partData.ctrlKey || partData.shiftKey) && (partData.num || partData.op))
    ) {
      if (partData.num) {
        if (!computableParts.op1) {
          computableParts.num1 += partData.num;
        } else {
          computableParts.num2 += partData.num;
        }
      } else if (partData.op) {
        if (!computableParts.op1) {
          computableParts.op1 = partData.op;
        } else {
          computableParts.op2 = partData.op;
        }
      }
    } else if (partData.ctrlKey) {
      computableParts.ctrlKey = partData.ctrlKey;
    } else if (!partData.ctrlKey) {
      computableParts.ctrlKey = false;
    } else if (partData.shiftKey) {
      computableParts.shiftKey = partData.shiftKey;
    } else if (!partData.shiftKey) {
      computableParts.shiftKey = false;
    }
    console.log("557: ", computableParts);
    this.setState({ computableParts });
    return;
  };

  doTheMath = () => {};

  calculateResult = (op) => {
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
      case "r": {
        return Math.sqrt(num1);
      }
      case "/": {
        return num1 / num2;
      }
      case "s": {
        if (num1 === 0) return 1;
        return num1 * num1;
      }
      default: {
        return null;
      }
    }
  };

  handleNumber = (numberData) => {
    console.log(`handleNumber: ${JSON.stringify(numberData)}`);
    let _keys = Object.keys(numberData);
    console.log(_keys);
    return;
    if (Number(Number(parameters.num1) !== NaN)) {
      // store it
      this.setState({ number1: parameters.num1 });
    }
    // else
    // // handleDecimalPoint
    // // handlePlusMinus
    // }
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
