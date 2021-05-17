import React from "react";
import "./calculator.scss";
import Display from "./display";

const Calculator = React.forwardRef((props, ref) => {
  return (
    <div className="calculator">
      <div className="title">Calculator</div>
      <div className="body">
        <Display />
      </div>
    </div>
  );
});

export default Calculator;
