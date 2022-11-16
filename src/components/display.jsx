import React, { useContext } from "react";
import { Grid } from "@mui/material";
import { DisplayContext } from "../js/context";

import Line from "./line";

const Display = (props) => {
    const lines = useContext(DisplayContext);
    let displayClass = "display";
    if (props.displayClass) {
        displayClass = props.displayClass;
    }
    return (
        <Grid sx={{}} className={displayClass}>
            {lines.map((line) => {
                return (
                    <Line
                        key={Math.random()}
                        className={line.className}
                        value={line.value}
                    />
                );
            })}
        </Grid>
    );
};
export default Display;
