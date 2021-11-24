import React from "react";
import Keyboard from "./keyboard";

const Sidebar = React.forwardRef((props, ref) => {
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
