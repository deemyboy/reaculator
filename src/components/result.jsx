import React from "react";
import { Paper } from "@mui/material";

const Result = (props) => {
    let { value, resultClassName } = props.resultData;

    const resultErrorClassName = "result_err",
        resultDefaultClassName = "result";

    value = value ? value : "0";
    return (
        <React.Fragment>
            <Paper className={resultClassName}>{value}</Paper>
        </React.Fragment>
    );
};
export default Result;
