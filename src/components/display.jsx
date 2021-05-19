import React from "react";
import "./display.scss";
import Calculation from "./calculation";
import Result from "./result";

const Display = React.forwardRef((props, ref) => {
  return (
    <div className="col">
      <div className={props.dispClass} ref={ref}>
        <Calculation />
        <p className="clearIt"></p>
        <Result />
      </div>
    </div>
  );
});
export default Display;
