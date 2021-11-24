import React from "react";
import Keyboard from "./keyboard";

const Sidebar = React.forwardRef((props, ref) => {
  return (
    <div className={props.sidebarData.sidebarClass}>
      <div className="title">{props.sidebarData.sidebarValue}</div>
      <div className="theme-type-keyboard">
        <Keyboard
          keys={props.themeTypeKbData.itemsForKeyboard}
          passClickHandler={props.themeTypeKbData.onClick}
        ></Keyboard>
      </div>
      <div className="keyboard">
        <Keyboard
          keys={props.themesKbData.itemsForKeyboard}
          passClickHandler={props.themesKbData.onClick}
        ></Keyboard>
      </div>
    </div>
  );
});
export default Sidebar;
