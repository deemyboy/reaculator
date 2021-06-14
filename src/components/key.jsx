import React from "react";

const Key = React.forwardRef((props, ref) => {
  const setKeyClasses = (keyObj) => {
    let classes = "btn btn-lg btn-key";
    const numClass = "btn-primary";
    const funcClass = "btn-secondary";
    const specialClass = keyObj.specialClass ? keyObj.specialClass : "";

    if (keyObj.type === "num") {
      classes += " " + numClass;
    } else if (keyObj.type === "func") {
      classes += " " + funcClass;
    }
    if (specialClass) {
      classes += " " + specialClass;
    }

    return classes;
  };
  return (
    <button
      ref={ref.id}
      id={props.kObj.id}
      className={setKeyClasses(props.kObj)}
      type="button"
      value={props.kObj.value}
      onClick={(e) => props.handleClick(e)}>
      {props.kObj.uniChar ? props.kObj.uniChar : props.kObj.value}
    </button>
  );
});
export default Key;
