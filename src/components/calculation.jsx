import React from "react";
import Paper from "@mui/material/Paper";

const Calculation = React.forwardRef((props, ref) => {
    const { calculationValue, calculationClassName } = props.calculationData;
    return <Paper className={calculationClassName}>{calculationValue}</Paper>;
});
export default Calculation;
