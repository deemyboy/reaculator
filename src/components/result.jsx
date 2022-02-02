import React from "react";

const Result = React.forwardRef((props, ref) => {
  let resVal = props.resultData.resultValue
    ? props.resultData.resultValue
    : "0";

  return (
    <React.Fragment>
      <p className={props.resultData.resultClass}>{resVal}</p>
    </React.Fragment>
  );
});
export default Result;
