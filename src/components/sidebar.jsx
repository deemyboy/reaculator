import Dropdown from "./dropdown";
import React from "react";

const Sidebar = React.forwardRef((props, ref) => {
  return (
    <div className={props.sidebarData.sidebarClass}>
      <div className="title">{props.sidebarData.sidebarValue}</div>
      <Dropdown dropdownData={props.dropdownData}></Dropdown>
    </div>
  );
});
export default Sidebar;
