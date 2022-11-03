import React from "react";
import { Paper } from "@mui/material";

const Result = React.forwardRef((props, ref) => {
    let { resultValue, resultClassName } = props.resultData;
    resultValue = resultValue ? resultValue : "0";
    return (
        <React.Fragment>
            <Paper className={resultClassName}>{resultValue}</Paper>
        </React.Fragment>
    );
});
export default Result;
