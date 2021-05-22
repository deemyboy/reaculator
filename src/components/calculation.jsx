import React from "react";
// import "./scss/calculation.scss";

const Calculation = React.forwardRef((props, ref) => {
  return (
    <React.Fragment>
      <p className={props.calculationData.calculationClass}>
        {props.calculationData.calculationValue}
      </p>
    </React.Fragment>
  );
});
export default Calculation;
