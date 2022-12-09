import React, { useContext } from "react";
import { Grid } from "@mui/material";
// import { DisplayContext } from "../js/context";
import Settings from "../components/settings";

import Line from "./line";

const Display = (props) => {
    const { content } = props;
    let _linesData, _settingsData;
    if (content.hasOwnProperty("linesData")) {
        ({ linesData: _linesData } = content);
    } else if (content.hasOwnProperty("settingsData")) {
        ({ settingsData: _settingsData } = content);
    }
    // console.log("Display", props);
    let displayClass = "display";
    if (props.displayClass) {
        displayClass = props.displayClass;
    }
    if (_linesData) {
        return (
            <Grid sx={{}} className={displayClass}>
                {_linesData.map((line) => {
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
    } else if (_settingsData) {
        return (
            <Grid sx={{}} className={displayClass}>
                <Settings settingsData={_settingsData} />
            </Grid>
        );
        //
    }
};
export default Display;
