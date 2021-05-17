import React from "react";
import "./display.scss";

const Display = React.forwardRef((props, ref) => {
  return (
    <div className="col">
      <div className={props.dispClass} ref={ref}>
        <p className={props.calcClass}>{props.calculation}</p>
        <p className="clearIt"></p>
        <p className={props.resClass}>{props.result}</p>
      </div>
    </div>
  );
});
export default Display;
