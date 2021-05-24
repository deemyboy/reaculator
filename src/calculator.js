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
      calculationValue: "100x500",
    },
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
      classForDropdown: "theme",
      currentSetting: "Default",
      callbackForDropdown: (e) => this.onSelectTheme(e),
      itemsForDropdown: [
        { itemName: "Fire" },
        { itemName: "Midnight" },
        { itemName: "Default" },
        { itemName: "Storm" },
        { itemName: "Jungle" },
      ],
    },
    theme: "default",
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
        value: "^",
        uniChar: "\uD835\uDC65\u00B2",
        title: "square (^)",
        keycode: 54,
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
      {
        id: 23,
        value: "l",
        title: "clear console (l)",
        keycode: 76,
        type: "func",
      },
    ],
  };

  handleKeyClick = (e) => {
    const keyClicked = this.state.utilityKeys
      .concat(this.state.numberKeys, this.state.functionKeys)
      .filter((k) => {
        return k.id.toString() === e.target.id;
      });
    let className = e.target.parentElement.className;
    if (className.toLowerCase().indexOf(this.state.numberKeyboardClass) > -1) {
      console.log("numberKeys clicked");
    } else if (
      className.toLowerCase().indexOf(this.state.functionKeyboardClass) > -1
    ) {
      console.log("functionKeys clicked");
    } else if (
      className.toLowerCase().indexOf(this.state.utilityKeyboardClass) > -1
    ) {
      console.log("utilityKeys clicked");
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

  packageDropdownData = (dropdownUser) => {
    let dropdownData = { ...this.state.dropdownData };
    dropdownData.labelForDropdown = dropdownUser.labelForDropdown;
    dropdownData.itemsForDropdown = dropdownUser.itemsForDropdown;
    dropdownData.classForDropdown = dropdownUser.classForDropdown;
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

  // parseInput

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
                        passClickHandler={(e) => this.handleKeyClick(e)}
                      />
                    </div>
                    <div
                      className={`col keyboard ${this.state.functionKeyboardClass}`}>
                      <Keyboard
                        keys={this.state.functionKeys}
                        passClickHandler={(e) => this.handleKeyClick(e)}
                      />
                      <div
                        className={`row keyboard ${this.state.utilityKeyboardClass}`}>
                        <Keyboard
                          keys={this.state.utilityKeys}
                          passClickHandler={(e) => this.handleKeyClick(e)}
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
