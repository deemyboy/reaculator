import React from "react";
import "./calculation.scss";

const Calculation = React.forwardRef((props, ref) => {
  return (
    <div className="col">
      <p className={props.calculationClass}>{props.calculationValue}</p>
    </div>
  );
});
export default Calculation;
