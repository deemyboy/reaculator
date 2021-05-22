import React from "react";
// import "./scss/key.scss";

const Key = React.forwardRef((props, ref) => {
  const setKeyClasses = (keyObj) => {
    let classes = "btn btn-lg btn-key";
    const numClass = "btn-primary";
    const funcClass = "btn-secondary";

    if (keyObj.specialClass) {
      classes += " " + keyObj.specialClass;
      return classes;
    } else if (keyObj.type === "num") {
      classes += " " + numClass;
    } else if (keyObj.type === "func") {
      classes += " " + funcClass;
    }
    return classes;
  };
  console.log(props.handleKeyClick);
  return (
    <button
      id={props.kObj.id}
      className={setKeyClasses(props.kObj)}
      type="button"
      value={props.kObj.value}
      onClick={(e) => props.handleKeyClick(e)}>
      {props.kObj.uniChar ? props.kObj.uniChar : props.kObj.value}
    </button>
  );
  // };
});
export default Key;
