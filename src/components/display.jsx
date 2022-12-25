import React, { useContext } from "react";
import { Grid } from "@mui/material";
import ThemeSettings from "./theme-settings";
import { motion } from "framer-motion";
import Line from "./line";

const Display = ({ linesData, settingsData }) => {
    const displayClass = "display",
        { isOpen } = settingsData;

    if (!isOpen) {
        let i = 0;
        return (
            <motion.div
                initial={{ opacity: 0, height: 376 }}
                animate={{ height: 176, opacity: 1 }}
                transition={{ type: "tween" }}
            >
                <Grid className={displayClass}>
                    {Object.keys(linesData).map((line) => {
                        i++;
                        return (
                            <motion.div
                                initial={{ opacity: 0, height: 176 }}
                                animate={{ height: 64, opacity: 1 }}
                                transition={{ type: "tween" }}
                                key={linesData[line].className + "-" + i}
                            >
                                <Line
                                    className={linesData[line].className}
                                    value={linesData[line].value}
                                />
                            </motion.div>
                        );
                    })}
                </Grid>
            </motion.div>
        );
    } else {
        return (
            <motion.div
                animate={{ height: 356, opacity: 1 }}
                transition={{ type: "tween" }}
            >
                <Grid sx={{}} className={displayClass}>
                    <ThemeSettings {...settingsData} />
                </Grid>
            </motion.div>
        );
    }
};
export default Display;
