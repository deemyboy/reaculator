import React, { useContext } from "react";
import { Grid } from "@mui/material";
import ThemeSettings from "./theme-settings";
import { motion } from "framer-motion";
import Line from "./line";

const Display = ({ linesData, settingsData }) => {
    const displayClass = "display",
        { isOpen } = settingsData;
    const size = settingsData.keyboardData.length === 2 ? 316 : 466;

    if (!isOpen) {
        let i = 0;
        return (
            <Grid className={displayClass}>
                <motion.div
                    initial={{ opacity: 0, height: 376 }}
                    animate={{ height: 106, opacity: 1 }}
                    transition={{ type: "tween", duration: 0.25 }}
                >
                    {Object.keys(linesData).map((line) => {
                        i++;
                        return (
                            <motion.div
                                initial={{ opacity: 0, y: 500 }}
                                animate={{ height: 64, opacity: 1, y: -10 }}
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
            <Grid sx={{}} className={displayClass}>
                <motion.div
                    animate={{ height: size, opacity: 1 }}
                    transition={{ type: "tween", duration: 0.25 }}
                >
                    <ThemeSettings {...settingsData} />
                </motion.div>
            </Grid>
        );
    }
};
export default Display;
