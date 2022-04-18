import React from "react";

export function Circle(propsIn) {
  const { ...props } = propsIn.props;
  let className = "circle ";
  if (propsIn.isOpen) {
    className += "showing";
  }

  return (
    <React.Fragment>
      <div
        className={className}
        onClick={(e) => props.onclick(e)}
        id={propsIn.id}
      ></div>
    </React.Fragment>
  );
}
