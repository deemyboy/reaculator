import * as React from "react";
import { Grid } from "@mui/material";

import Calculation from "./calculation";
import Result from "./result";

const Display = React.forwardRef((props, ref) => {
  const displayClass = "display";
  return (
    <Grid sx={{}} className={displayClass} ref={ref}>
      <Calculation calculationData={props.calculationData}>
        500 x 100
      </Calculation>
      <p className="clearIt"></p>
      <Result resultData={props.resultData}>50000</Result>
    </Grid>
  );
});
export default Display;
