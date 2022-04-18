import React from "react";
import Paper from '@mui/material/Paper';

const Calculation = React.forwardRef((props) => {
  const {value, className} = props.calculationData;
  return (
    <React.Fragment>
      <Paper className={className}>
        {value}
      </Paper>
    </React.Fragment>
  );
});
export default Calculation;
