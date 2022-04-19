import React from "react";
import Button from "@mui/material/Button";

const Key = React.forwardRef((props, ref) => {
  const setKeyClasses = (keyObj) => {
    let classes = "btn btn-lg";
    const numClass = "btn-primary";
    const funcClass = "btn-secondary";
    const thmClass = "btn-theme";
    const thmTypeClass = "btn-theme-type";
    const picTypeClass = "btn-pic-type";
    const errClass = "btn-error";
    const useMeClass = "btn-use-me";
    const specialClass = keyObj.specialClass ? keyObj.specialClass : "";
    const errState = props.keyErr ? props.keyErr : "";
    const selected = keyObj.selected ? "selected" : "";

    if (keyObj.type === "num") {
      classes += " " + numClass;
    } else if (keyObj.type === "func") {
      classes += " " + funcClass;
    } else if (keyObj.type === "thm") {
      classes += " " + thmClass;
    } else if (keyObj.type === "thype") {
      classes += " " + thmTypeClass;
    } else if (keyObj.type === "picTypeChs") {
      classes += " " + picTypeClass;
    }
    if (specialClass) {
      classes += " " + specialClass;
    }
    if (selected) {
      classes += " " + selected;
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
    <React.Fragment>
      <Button
        ref={ref.id}
        id={props.kObj.id}
        className={setKeyClasses(props.kObj)}
        onClick={(e) => props.handleClick(e)}
        size="large"
        variant={"outlined"}
      >
        {props.kObj.uniChar ? props.kObj.uniChar : props.kObj.value}
      </Button>
    </React.Fragment>
  );
});
export default Key;
