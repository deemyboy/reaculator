import React from "react";

const Key = React.forwardRef((props, ref) => {
  const setKeyClasses = (keyObj) => {
    let classes = "btn btn-lg btn-key";
    const numClass = "btn-primary";
    const funcClass = "btn-secondary";
    const thmClass = "btn-theme";
    const thmTypeClass = "btn-theme-type";
    const errClass = "btn-error";
    const useMeClass = "btn-use-me";
    const specialClass = keyObj.specialClass ? keyObj.specialClass : "";
    const errState = props.keyErr ? props.keyErr : "";

    if (keyObj.type === "num") {
      classes += " " + numClass;
    } else if (keyObj.type === "func") {
      classes += " " + funcClass;
    } else if (keyObj.type === "thm") {
      classes += " " + thmClass;
    } else if (keyObj.type === "thype") {
      classes += " " + thmTypeClass;
    }
    if (specialClass) {
      classes += " " + specialClass;
    }
    if (errState) {
      if (keyObj.value !== "a") {
        classes += " " + errClass;
      } else {
        classes += " " + useMeClass;
      }
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
      onClick={(e) => props.handleClick(e)}
    >
      {props.kObj.uniChar ? props.kObj.uniChar : props.kObj.value}
    </button>
  );
});
export default Key;
