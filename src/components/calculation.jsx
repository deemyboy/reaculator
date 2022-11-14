import React, { useContext } from "react";
import Paper from "@mui/material/Paper";
import CalculationContext from "../js/context";

const Calculation = () => {
    const { calculationData } = useContext(CalculationContext);
    const { value } = calculationData || "";
    const { className } = calculationData || "";
    const defaultClassName = "calculation";
    const errClassName = "calculation_err";
    let _className = defaultClassName;
    _className += className === "err" ? " " + errClassName : "";
    return <Paper className={_className}>{value}</Paper>;
};
export default Calculation;
