import * as React from "react";
import { Grid } from "@mui/material";

import Calculation from "./calculation";
import Result from "./result";

const Display = (props) => {
    let displayClass = "display";
    if (props.displayClass) {
        displayClass = props.displayClass;
    }
    return (
        <Grid sx={{}} className={displayClass}>
            <Calculation calculationData={props.calculationData}>
                500 x 100
            </Calculation>
            <p className="clearIt"></p>
            <Result resultData={props.resultData}>50000</Result>
        </Grid>
    );
};
export default Display;
