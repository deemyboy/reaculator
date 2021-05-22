import React from "react";
// import "./scss/result.scss";

const Result = React.forwardRef((props, ref) => {
  return (
    <React.Fragment>
      <p className={props.resultData.resultClass}>
        {props.resultData.resultValue}
      </p>
    </React.Fragment>
  );
});
export default Result;
