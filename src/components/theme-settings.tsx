import React, { useState, useEffect, useContext } from "react";
import { Grid } from "@mui/material";
import { motion } from "framer-motion";
import { Setting } from "./setting";
import * as Types from "types/types";
import { ThemeContext } from "../utils/context";
const ThemeSettings = ({ settingsKeyboardsData }) => {
    const className: string = "settings";
    return (
        <Grid
            id="settings"
            container
            className={className}
            meta-name="settings"
        >
            {settingsKeyboardsData.map(
                (keyboardName: string, index: number) => {
                    return <Setting key={index} keyboardName={keyboardName} />;
                }
            )}
        </Grid>
    );
};
export default ThemeSettings;
