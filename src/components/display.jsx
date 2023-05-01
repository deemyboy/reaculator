import React, { useContext } from "react";
import { Grid } from "@mui/material";
import ThemeSettings from "./theme-settings";
import { motion } from "framer-motion";
import Line from "./line";
import { red } from "@mui/material/colors";

const Display = ({ linesData, settingsData }) => {
    const displayClass = "display",
        { isOpen } = settingsData;
    if (!isOpen) {
        return (
            <Grid className={displayClass}>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ type: "tween", duration: 0.25 }}
                >
                    {Object.keys(linesData).map((line, i) => {
                        return (
                            <motion.div
                                initial={{ opacity: 0, y: 500 }}
                                animate={{
                                    // height: LINE_HEIGHTS[i - 1],
                                    opacity: 1,
                                    y: 0,
                                }}
                                transition={{
                                    type: "spring",
                                    duration: 0.5,
                                    delay: 0.1,
                                }}
                                key={linesData[line].className + "-" + i}
                            >
                                <Line
                                    className={linesData[line].className}
                                    value={linesData[line].value}
                                />
                            </motion.div>
                        );
                    })}
                </motion.div>
            </Grid>
        );
    } else {
        return (
            <Grid className={displayClass}>
                <motion.div
                    animate={{ opacity: 1 }}
                    transition={{ type: "tween", duration: 0.25 }}
                >
                    <ThemeSettings />
                </motion.div>
            </Grid>
        );
    }
};
export default Display;
