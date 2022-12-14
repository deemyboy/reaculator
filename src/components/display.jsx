import React, { useContext } from "react";
import { Grid, useMediaQuery } from "@mui/material";
import ThemeSettings from "./theme-settings";
import { motion } from "framer-motion";
import Line from "./line";
import { red } from "@mui/material/colors";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const theme = createTheme({
    palette: {
        primary: {
            main: red[500],
        },
    },
});

const Display = ({ linesData, settingsData }) => {
    const mediaQueryBreakPoints = {
        xs: "480px",
        sm: "767px",
        md: "992px",
        lg: "1200px",
    };

    const getBreakPoint2 = (breakPoints) => {
        let brPoint = "";
        const match = Object.keys(breakPoints).filter((bp) => {
            const mq = `(min-width:${breakPoints[bp]})`;
            if (useMediaQuery(`(min-width:${breakPoints[bp]})`)) {
                brPoint = bp;
            }
        });
        return brPoint;
    };
    const currentBreakPoint = getBreakPoint2(mediaQueryBreakPoints);

    const getDisplayHeight = (numberOfKeyboards, breakPointSize) => {
        // console.log(numberOfKeyboards, breakPointSize);
    };

    const displayClass = "display",
        { isOpen, selected } = settingsData;
    const displayHeight = getDisplayHeight(
        settingsData.keyboardData.length,
        currentBreakPoint
    );
    let i = 0;
    if (!isOpen) {
        return (
            <ThemeProvider theme={theme}>
                <Grid className={displayClass}>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ type: "tween", duration: 0.25 }}
                    >
                        {Object.keys(linesData).map((line) => {
                            i++;
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
            </ThemeProvider>
        );
    } else {
        return (
            <Grid className={displayClass}>
                <motion.div
                    animate={{ opacity: 1 }}
                    transition={{ type: "tween", duration: 0.25 }}
                >
                    <ThemeSettings {...settingsData} />
                </motion.div>
            </Grid>
        );
    }
};
export default Display;
