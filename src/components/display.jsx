import * as React from "react";

import Calculation from "./calculation";
import Result from "./result";
import { Grid } from "@mui/material";

const Display = React.forwardRef((props, ref) => {
  return (
    <Grid sx={{}} className={props.displayClass} ref={ref}>
      <Calculation calculationData={props.calculationData}>
        500 x 100
      </Calculation>
      <p className="clearIt"></p>
      <Result resultData={props.resultData}>50000</Result>
    </Grid>
  );
});
export default Display;
