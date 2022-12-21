import React, { useContext } from "react";
import { Grid } from "@mui/material";
// import { DisplayContext } from "../js/context";
import ThemeSettings from "./theme-settings";
import { Collapse } from "react-collapse";

import Line from "./line";

const Display = (props) => {
    const { content } = { ...props };
    let linesData,
        settingsData,
        displayClass = "display",
        isOpened = false;
    if (content.hasOwnProperty("linesData")) {
        linesData = { ...content };
    } else if (content.hasOwnProperty("settingsData")) {
        settingsData = { ...content };
        displayClass += " open";
        isOpened = true;
    }

    if (linesData && Object.keys(linesData).length > 0) {
        let i = 0;
        return (
            <Collapse isOpened={!isOpened}>
                <Grid className={displayClass}>
                    {Object.keys(linesData["linesData"]).map((line) => {
                        i++;
                        return (
                            <Line
                                key={
                                    linesData["linesData"][line].className +
                                    "-" +
                                    i
                                }
                                className={
                                    linesData["linesData"][line].className
                                }
                                value={linesData["linesData"][line].value}
                            />
                        );
                    })}
                </Grid>
            </Collapse>
        );
    } else if (settingsData && Object.keys(settingsData).length > 0) {
        return (
            <Collapse isOpened={isOpened}>
                <Grid sx={{}} className={displayClass}>
                    <ThemeSettings settingsData={settingsData} />
                </Grid>
            </Collapse>
        );
        //
    }
};
export default Display;
