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
        type: "num",
      },
      {
        id: 1,
        value: "1",
        title: "one",
        keycode: 49,
        type: "num",
      },
      {
        id: 2,
        value: "2",
        title: "two",
        keycode: 50,
        type: "num",
      },
      {
        id: 3,
        value: "3",
        title: "three",
        keycode: 51,
        type: "num",
      },
      {
        id: 4,
        value: "4",
        title: "four",
        keycode: 52,
        type: "num",
      },
      {
        id: 5,
        value: "5",
        title: "five",
        keycode: 53,
        type: "num",
      },
      {
        id: 6,
        value: "6",
        title: "six",
        keycode: 54,
        type: "num",
      },
      {
        id: 7,
        value: "7",
        title: "seven",
        keycode: 55,
        type: "num",
      },
      {
        id: 8,
        value: "8",
        title: "eight",
        keycode: 56,
        type: "num",
      },
      {
        id: 9,
        value: "9",
        title: "nine",
        keycode: 57,
        type: "num",
      },
      {
        id: 10,
        value: ".",
        title: "dot",
        keycode: 190,
        type: "num",
      },
      {
        id: 11,
        value: "m",
        uniChar: "\u00B1",
        title: "plus minus (m)",
        keycode: 189,
        type: "num",
      },
    ],
    functionKeys: [
      {
        id: 19,
        value: "+",
        title: "plus",
        keycode: 187,
        type: "func",
      },
      {
        id: 12,
        value: "-",
        title: "minus",
        keycode: 189,
        type: "func",
      },
      {
        id: 13,
        value: "x",
        uniChar: "\u00D7",
        title: "multiply (x)",
        keycode: 88,
        type: "func",
      },
      {
        id: 14,
        value: "/",
        uniChar: "\u00F7",
        title: "divide (/)",
        keycode: 191,
        type: "func",
      },
      {
        id: 15,
        value: "s",
        uniChar: "\uD835\uDC65\u00B2",
        title: "square (s)",
        keycode: 83,
        type: "func",
      },
      {
        id: 21,
        value: "r",
        uniChar: "\u00B2\u221A",
        title: "square root (r)",
        keycode: 82,
        type: "func",
      },
      {
        id: 20,
        value: "y",
        uniChar: "\uD835\uDC65\u02B8",
        title: "x to the power y (y)",
        keycode: 89,
        type: "func",
      },
      {
        id: 16,
        value: "=",
        specialClass: "btn-success",
        title: "equals",
        keycode: 187,
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
        type: "func",
      },
      {
        id: 18,
        value: "a",
        uniChar: "\u0061\u0063",
        specialClass: "btn-danger",
        title: "all clear (a)",
        keycode: 65,
        type: "func",
      },
    ],

    operators: ["+", "-", "x", "/", "s", "r", "y", "=", "c", "a"],
    allMathsOperatorsRegex: /[sr+\-\/x\=acy\.]/g,
    singleMathsOperatorsRegex: /[sr]/g,
    allMathsOperatorsRegexNonGreedy: /[sr+\-\/x\=acy\.]/,
    singleMathsOperatorsRegexNonGreedy: /[sr]/,
    matchCount: 0,
  };

  // componentDidMount() {
  //   document.addEventListener("keydown", (e) => this.handleKeyPress(e));
  //   this.doTheMaths();
  // }

  // componentDidUpdate() {
  componentDidUpdate(nextProps, nextState) {
    if (
      this.state.userInput === nextState.userInput &&
      this.state.calculationData === nextState.calculationData
    ) {
      return false;
    } else {
      this.storeComputableParts();
      return true;
    }
  }
  // shouldComponentUpdate(nextProps, nextState) {
  //   if (this.state.userInput === nextState.userInput) {
  //     return false;
  //   } else {
  //     this.storeComputableParts();
  //     return true;
  //   }
  // }

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
    let { userInput } = this.state;

    e.target.blur();
    const keyClicked = this.state.utilityKeys
      .concat(this.state.numberKeys, this.state.functionKeys)
      .filter((k) => {
        return k.id.toString() === e.target.id;
      });
    let className = e.target.parentElement.className;
    if (className.indexOf(this.state.numberKeyboardClass) > -1) {
      // console.log("numberKeys clicked");
    } else if (className.indexOf(this.state.functionKeyboardClass) > -1) {
      // console.log("functionKeys clicked");
    } else if (className.indexOf(this.state.utilityKeyboardClass) > -1) {
      // console.log("utilityKeys clicked");
    }
    userInput += e.target.value;
    // this.setState({ userInput }, this.doTheMaths);
    this.setState({ userInput });
  };

  handleKeyPress = (event) => {
    if (!event.repeat) {
      // console.log(event, event.key, event.repeat);

      this.setState({ lastPressedKey: event.key });
      this.setState({ lastPressedKeyCode: event.keyCode });
      this.setState({ shiftKey: event.shiftKey });
    }
  };

  handleActiveClass = () => {};

  // parseInput
  parseUserInput = () => {
    const { userInput } = this.state;
    const regex = this.state.allMathsOperatorsRegex;
    let individualParts = {};
    const packageIndividualParts = (part) => {
      console.log(`part: ${JSON.stringify(part)}`);
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
    console.log("parseUserInput"), userInput;

    // function key pressed
    if (userInput.match(regex)) {
      let numOfMathsOperatorsFound = userInput.match(regex);
      console.log("matched");
      // handle function key first
      if (userInput.length === 1) {
        console.log(
          `${userInput.match(
            regex
          )}, ${userInput} : you pressed a function key without a number key first`
        );
        return;
      } else {
        console.log(
          `user input.length greater than 1: ${numOfMathsOperatorsFound},${numOfMathsOperatorsFound.length},${userInput.length},${userInput}`
        );
        // match found, userinput length > 1
        // 1 match
        if (numOfMathsOperatorsFound.length === 1) {
          console.log("only 1 function key");
          // do maths.
          individualParts = packageIndividualParts({
            op1: userInput.match(
              this.state.singleMathsOperatorsRegexNonGreedy
            )[0],
            num1: userInput.substr(
              0,
              userInput.match(this.state.singleMathsOperatorsRegexNonGreedy)
                .index
            ),
          });

          console.log("449", individualParts);
          return individualParts;
        }
        // 2 matches
        else if (numOfMathsOperatorsFound.length === 2) {
          console.log("we stop here and do maths");
        } else {
          console.log("we should not reach this point");
        }
      }
      // no function key - must be a number
    } else {
      console.log("no match: ", userInput);
      individualParts = packageIndividualParts({ num1: userInput });
      return individualParts;
    }
    return;
    if (userInput.length > 1) {
    } else if (userInput.match(regex) && userInput.length === 1) {
      console.log(
        `${userInput.match(
          regex
        )}, ${userInput} : you pressed a function key without a number key first`
      );
      return;
    } else if (!userInput.match(regex) && userInput.length === 1) {
      packageIndividualParts("num", userInput);
    } else if (userInput.length > 1) {
      if (userInput.match(regex)) {
        individualParts.push("ops", userInput.match(regex));
      }
    } else console.log(userInput);
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

  doTheMaths = () => {
    console.log(`doTheMaths`);
    let parameters = this.parseUserInput();
    console.log(parameters);
    if (parameters && Object.keys(parameters).length > 0) {
      console.log(
        `parameters: ${parameters}, length: ${Object.keys(parameters).length}`
      );
      if (Object.keys(parameters).length === 2) {
        // is the operator a single response key?
        if (parameters["op"].match(this.state.singleMathsOperatorsRegex)) {
          console.log("yes it is single resp");

          console.log(`${parameters} -  doing single maths`);
        }
      } else if (Object.keys(parameters).length === 4) {
        //
        console.log(parameters);
      }
    }
    return;
  };

  storeComputableParts = () => {
    console.log(`storeComputableParts`);
    let parameters = this.parseUserInput();
    console.log(`parameters: ${JSON.stringify(parameters)}`);
    if (parameters && Object.keys(parameters).length > 0) {
      console.log(
        `parameters: ${parameters}, length: ${Object.keys(parameters).length}`
      );
      if (Object.keys(parameters).length === 1) {
        // is the operator a single response key?
        // handleNumber
        this.handleNumber(parameters);
        if (Object.keys(parameters).length === 2) {
          // is the operator a single response key?
          if (parameters["op"].match(this.state.singleMathsOperatorsRegex)) {
            console.log("yes it is single resp");

            console.log(`${parameters} -  doing single maths`);
          }
        } else if (Object.keys(parameters).length === 3) {
          //
          console.log(parameters);
        }
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
    console.log(keys);
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
