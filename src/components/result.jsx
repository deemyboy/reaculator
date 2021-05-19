import React from "react";
import "./result.scss";

const Result = React.forwardRef((props, ref) => {
  return (
    <div className="col">
        <p className={props.resClass}>{props.result}</p>
    </div>
  );
});
export default Result;
