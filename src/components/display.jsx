import React from "react";
import "./display.scss";
import Calculation from "./calculation";
import Result from "./result";

const Display = React.forwardRef((props, ref) => {
  return (
    <div className="col">
      <div className={props.dispClass} ref={ref}>
        <Calculation calculationData={props.calculationData} />
        <p className="clearIt"></p>
        <Result resultData={props.resultData} />
      </div>
    </div>
  );
});
export default Display;
