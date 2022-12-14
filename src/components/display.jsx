import React, { useContext } from "react";
import { Grid } from "@mui/material";
// import { DisplayContext } from "../js/context";
import ThemeSettings from "./theme-settings";

import Line from "./line";

const Display = (props) => {
    const { content } = props;
    let _linesData, _settingsData;
    if (content.hasOwnProperty("linesData")) {
        ({ linesData: _linesData } = content);
    } else if (content.hasOwnProperty("settingsData")) {
        ({ settingsData: _settingsData } = content);
    }
    let displayClass = "display";
    if (props.displayClass) {
        displayClass = props.displayClass;
    }
    if (_linesData && Object.keys(_linesData).length > 0) {
        let i = 0;
        return (
            <Grid sx={{}} className={displayClass}>
                {Object.keys(_linesData).map((line) => {
                    i++;
                    return (
                        <Line
                            key={_linesData[line].className + "-" + i}
                            className={_linesData[line].className}
                            value={_linesData[line].value}
                        />
                    );
                })}
            </Grid>
        );
    } else if (_settingsData) {
        return (
            <Grid sx={{}} className={displayClass}>
                <ThemeSettings settingsData={_settingsData} />
            </Grid>
        );
        //
    }
};
export default Display;
