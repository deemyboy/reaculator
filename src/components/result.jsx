import React from "react";
import {Paper} from '@mui/material';

const Result = React.forwardRef((props, ref) => {
  let { value, className} = props.resultData;
  value = value ? value : "0";

  return (
    <React.Fragment>
      <Paper className={className}>{value}</Paper>
    </React.Fragment>
  );
});
export default Result;
