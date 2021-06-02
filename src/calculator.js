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

    operators: ["+", "-", "x", "/", "s", "r", "y", "=", "c", "a", "m", "."],
    mathOpRgx: /[sr+\-xy.ac=m]/g,
    utilOpRgx: /[.ac=m]/g,
    dblMathOpRgx: /[+\-xy=]/g,
    snglMathOpRgx: /[sr]/g,
    mathOpRgxNonGreedy: /[sr+\-xy.ac=m]/,
    utilOpRgxNonGreedy: /[.ac=m]/,
    dblMathOpRgxNonGreedy: /[+\-xy=]/,
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
    console.log("handleClick");
    e.target.blur();
    // console.log(e);
    const keyClicked = this.state.utilityKeys
      .concat(this.state.numberKeys, this.state.functionKeys)
      .filter((k) => {
        return k.id.toString() === e.target.id;
      });
    console.log(keyClicked);
    let inputData = this.packageInputData({ ["key"]: keyClicked[0].value });
    this.handleUserInput(inputData);
  };

  handleKeyPress = (e) => {
    console.log("handleKeyPress");
    // console.log(e);
    if (!e.repeat) {
      let inputData = this.packageInputData({
        ["key"]: e.key,
        ctrlKey: e.ctrlKey,
        shiftKey: e.shiftKey,
      });
      this.handleUserInput(inputData);
      this.handleActiveClass(e);
    }
  };

  packageInputData = (inputData) => {
    let _inputData = {};
    if ("key" in inputData) {
      _inputData.key = inputData.key;
    } else {
      _inputData.key = "";
    }
    if ("ctrlKey" in inputData) {
      _inputData.ctrlKey = inputData.ctrlKey;
    } else {
      _inputData.ctrlKey = false;
    }
    if ("shiftKey" in inputData) {
      _inputData.shiftKey = inputData.shiftKey;
    } else {
      _inputData.shiftKey = false;
    }
    return _inputData;
  };

  handleUserInput = (event) => {
    console.log("handleUserInput: ", event);

    // const keyClicked = this.state.utilityKeys
    //   .concat(this.state.numberKeys, this.state.functionKeys)
    //   .filter((k) => {
    //     return k.id.toString() === event.target.id;
    //   });
    // console.log("keyClicked: ", keyClicked);
    // let className = event.target.parentElement.className;
    // if (className.indexOf(this.state.numberKeyboardClass) > -1) {
    //   // console.log("numberKeys clicked");
    // } else if (className.indexOf(this.state.functionKeyboardClass) > -1) {
    //   // console.log("functionKeys clicked");
    // } else if (className.indexOf(this.state.utilityKeyboardClass) > -1) {
    //   // console.log("utilityKeys clicked");
    // }
    const key = event.key;
    const shiftKey = event.shiftKey;
    const ctrlKey = event.ctrlKey;
    let inputData = {};
    console.log(key, ctrlKey, shiftKey);
    inputData = this.packageInputData({
      ["key"]: key,
      ["ctrlKey"]: ctrlKey,
      ["shiftKey"]: shiftKey,
    });

    this.parseUserInputTest(inputData);
  };

  handleActiveClass = (e) => {
    console.log("adding and removing active class");
  };

  // parseInput
  parseUserInput = () => {
    const { userInput } = this.state;
    const mathOpRgx = this.state.mathOpRgx;
    const utilOpRgx = this.state.utilOpRgx;
    const snglMathOpRgx = this.state.snglMathOpRgx;
    const dblMathOpRgx = this.state.dblMathOpRgx;

    const mathOpRgxNonGreedy = this.state.mathOpRgxNonGreedy;
    const utilOpRgxNonGreedy = this.state.utilOpRgxNonGreedy;
    const snglMathOpRgxNonGreedy = this.state.snglMathOpRgxNonGreedy;
    const dblMathOpRgxNonGreedy = this.state.dblMathOpRgxNonGreedy;

    let individualParts = {};

    const packageIndividualParts = (part) => {
      console.log(`389: part: ${JSON.stringify(part)}`);
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
      return _individualParts;
    };

    console.log("406: parseUserInput"), userInput;

    // function key pressed
    if (userInput.match(mathOpRgx)) {
      let operator = userInput.match(mathOpRgx)[0];
      let numOfMathOpFound = userInput.match(mathOpRgx).length;

      console.log("413: matched All regex");
      // handle function key first
      if (userInput.length === 1) {
        console.log(
          `${userInput.match(
            mathOpRgx
          )} ${userInput} : function key without a number key first`
        );
        return;
      } else {
        console.log(
          `424: user input.length ${userInput.length} greater than 1 | maths operators: ${operator} , numOfMathOpFound ${numOfMathOpFound}, userInput${userInput}`
        );
        // match found, userinput length > 1
        // 1 match
        if (operator.length === 1) {
          console.log("only 1 function key");
          // do maths.
          if (userInput.match(snglMathOpRgx)) {
            individualParts = packageIndividualParts({
              op1: userInput.match(snglMathOpRgxNonGreedy)[0],
              num1: userInput.substr(
                0,
                userInput.match(snglMathOpRgxNonGreedy).index
              ),
            });

            console.log("440", individualParts);
            return individualParts;
          } else if (userInput.match(dblMathOpRgx)) {
            individualParts = packageIndividualParts({
              op1: userInput.match(dblMathOpRgxNonGreedy)[0],
              num1: userInput.substr(
                0,
                userInput.match(dblMathOpRgxNonGreedy).index
              ),
            });
          }
        }

        // 2 matches
        else if (operator.length === 2) {
          console.log("we stop here and do maths");
        } else {
          console.log("we should not reach this point");
        }
      }
      // no function key - must be a number, +/- or .
    } else {
      console.log("no match: ", userInput);
      individualParts = packageIndividualParts({ num1: userInput });
      return individualParts;
    }
    return;
    if (userInput.length > 1) {
    } else if (userInput.match(mathOpRgx) && userInput.length === 1) {
      console.log(
        `${userInput.match(
          mathOpRgx
        )}, ${userInput} : you pressed a function key without a number key first`
      );
      return;
    } else if (!userInput.match(mathOpRgx) && userInput.length === 1) {
      packageIndividualParts("num", userInput);
    } else if (userInput.length > 1) {
      if (userInput.match(mathOpRgx)) {
        individualParts.push("ops", userInput.match(mathOpRgx));
      }
    } else console.log(userInput);
  };

  parseUserInputTest = (inputData) => {
    console.log(inputData);
    return;
    const key = inputData.key;
    // const { userInput } = this.state;
    const mathOpRgx = this.state.mathOpRgx;
    const utilOpRgx = this.state.utilOpRgx;
    const snglMathOpRgx = this.state.snglMathOpRgx;
    const dblMathOpRgx = this.state.dblMathOpRgx;

    const mathOpRgxNonGreedy = this.state.mathOpRgxNonGreedy;
    const utilOpRgxNonGreedy = this.state.utilOpRgxNonGreedy;
    const snglMathOpRgxNonGreedy = this.state.snglMathOpRgxNonGreedy;
    const dblMathOpRgxNonGreedy = this.state.dblMathOpRgxNonGreedy;

    let individualParts = {};
    console.log(`we are testing parseUserInputTest ${key}`);

    if (key.match(mathOpRgx)) {
      console.log("key.match(mathOpRgx)", key.match(mathOpRgx));
    } else if (key.match(utilOpRgx)) {
      console.log("key.match(utilOpRgx)", key.match(utilOpRgx));
    } else if (key.match(snglMathOpRgx)) {
      console.log("key.match(snglMathOpRgx)", key.match(snglMathOpRgx));
    } else if (key.match(dblMathOpRgx)) {
      console.log("key.match(dblMathOpRgx):", key.match(dblMathOpRgx));
    } else {
      console.log(`key - just digits: ${key}`);
    }
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

  storeComputableParts = () => {
    console.log(`storeComputableParts`);
    // let parameters = this.parseUserInput();
    this.parseUserInputTest();
    return;
    console.log(`517: parameters: ${JSON.stringify(parameters)}`);
    if (parameters && Object.keys(parameters).length > 0) {
      console.log(
        `520: parameters: ${JSON.stringify(parameters)}, length: ${
          Object.keys(parameters).length
        } Object.keys(parameters) ${Object.keys(parameters)}
        `
      );
      if (Object.keys(parameters).length === 1) {
        // is the operator a single response key?
        // handleNumber
        this.handleNumber(parameters);
      }
      if (Object.keys(parameters).length === 2) {
        // is the operator a single response key?
        console.log("524: parameters:op1", parameters["op1"]);
        return;
        if (parameters["op1"].match(this.state.snglMathOpRgx)) {
          console.log("yes it is single resp");

          console.log(`${parameters} -  doing single maths`);
        }
      } else if (Object.keys(parameters).length === 3) {
        //
        console.log(parameters);
      } else if (Object.keys(parameters).length === 4) {
        //
        console.log(parameters);
      }
    }
    return;
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
