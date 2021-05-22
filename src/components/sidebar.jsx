import React from "react";
// import "./scss/sidebar.scss";

const Sidebar = React.forwardRef((props, ref) => {
  return <React.Fragment>{props.sidebarData.sidebarValue}</React.Fragment>;
});
export default Sidebar;
