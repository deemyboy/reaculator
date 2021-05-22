import React from "react";
// import "./scss/display.scss";
import Calculation from "./calculation";
import Result from "./result";

const Display = React.forwardRef((props, ref) => {
  return (
    <React.Fragment>
      <div className={props.dispClass} ref={ref}>
        <Calculation calculationData={props.calculationData}>
          500 x 100
        </Calculation>
        <p className="clearIt"></p>
        <Result resultData={props.resultData}>50000</Result>
      </div>
    </React.Fragment>
  );
});
export default Display;
