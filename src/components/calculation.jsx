import React from "react";
import Paper from "@mui/material/Paper";

const Calculation = (props) => {
    const { value, className } = props.calculationData;
    const defaultClassName = "calculation";
    const errClassName = "calculation_err";
    let _className = defaultClassName;
    _className += className === "err" ? " " + errClassName : "";
    return <Paper className={_className}>{value}</Paper>;
};
export default Calculation;
