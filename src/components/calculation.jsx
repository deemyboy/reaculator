import React from "react";
import Paper from "@mui/material/Paper";

const Calculation = React.forwardRef((props, ref) => {
  const { value, className } = props.calculationData;
  return <Paper className={className}>{value}</Paper>;
});
export default Calculation;
