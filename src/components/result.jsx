import React from "react";
import { Paper } from "@mui/material";

const Result = (props) => {
    let { resultValue, resultClassName } = props.resultData;

    const resultErrorClassName = "result_err",
        resultDefaultClassName = "result";

    resultValue = resultValue ? resultValue : "0";
    return (
        <React.Fragment>
            <Paper className={resultClassName}>{resultValue}</Paper>
        </React.Fragment>
    );
};
export default Result;
