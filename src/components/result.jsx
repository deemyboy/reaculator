import React from "react";

const Result = React.forwardRef((props, ref) => {
  let resVal = props.resultData.resultValue ? props.resultData.resultValue :props.resultData.resultInitValue
  
  return (
    <React.Fragment>
      <p className={props.resultData.resultClass}>
        {resVal}
      </p>
    </React.Fragment>
  );
});
export default Result;
