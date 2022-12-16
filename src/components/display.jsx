import React, { useContext } from "react";
import { Grid } from "@mui/material";
// import { DisplayContext } from "../js/context";
import ThemeSettings from "./theme-settings";

import Line from "./line";

const Display = (props) => {
    const { content } = { ...props };
    let linesData, settingsData;
    if (content.hasOwnProperty("linesData")) {
        linesData = { ...content };
    } else if (content.hasOwnProperty("settingsData")) {
        settingsData = { ...content };
    }
    let displayClass = "display";
    if (props.displayClass) {
        displayClass = props.displayClass;
    }
    if (linesData && Object.keys(linesData).length > 0) {
        let i = 0;
        return (
            <Grid sx={{}} className={displayClass}>
                {Object.keys(linesData["linesData"]).map((line) => {
                    i++;
                    return (
                        <Line
                            key={
                                linesData["linesData"][line].className + "-" + i
                            }
                            className={linesData["linesData"][line].className}
                            value={linesData["linesData"][line].value}
                        />
                    );
                })}
            </Grid>
        );
    } else if (settingsData) {
        return (
            <Grid sx={{}} className={displayClass}>
                <ThemeSettings settingsData={settingsData} />
            </Grid>
        );
        //
    }
};
export default Display;
