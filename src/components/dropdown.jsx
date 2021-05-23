import React from "react";

const Dropdown = React.forwardRef((props, ref) => {
  const makeDropdownItems = function (item) {
    return (
      <li key={item.itemName}>
        <a
          className="dropdown-item"
          href="#"
          onClick={(e) => props.dropdownData.onClick(e)}>
          {item.itemName}
        </a>
      </li>
    );
  };
  return (
    <React.Fragment>
      <div className="title">{props.dropdownData.labelForDropdown}</div>
      <div className={`dropdown ${props.dropdownData.classForDropdown}`}>
        <a
          className="btn btn-dropdown dropdown-toggle"
          href="#"
          role="button"
          id="dropdownMenuLink"
          data-bs-toggle="dropdown"
          aria-expanded="false">
          {props.dropdownData.currentSetting}
        </a>

        <ul className="dropdown-menu" aria-labelledby="dropdownMenuLink">
          {props.dropdownData.itemsForDropdown.map(makeDropdownItems)}
        </ul>
      </div>
    </React.Fragment>
  );
});
export default Dropdown;
