// import Dropdown from "./dropdown";
import React from "react";
import Keyboard from "./keyboard";

const Sidebar = React.forwardRef((props, ref) => {
  //   <Keyboard
  //   keys={this.functionKeys}
  //   passClickHandler={(e) => this.handleClick(e)}
  //   keyErr={this.state.keyErr}
  // />
  return (
    <div className={props.sidebarData.sidebarClass}>
      <div className="title">{props.sidebarData.sidebarValue}</div>
      <div className="keyboard">
        <Keyboard
          keys={props.keyboardData.itemsForThemeKeyboard}
          passClickHandler={props.keyboardData.onClick}
        ></Keyboard>
      </div>
    </div>
  );
});
export default Sidebar;
