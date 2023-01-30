import React, { useState, useEffect } from "react";
import { Grid } from "@mui/material";
import { motion } from "framer-motion";
import { Setting } from "./setting";
import * as Types from "types/types";

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
                (keyboardData: Types.TKeyboard, index: number) => {
                    return <Setting key={index} {...keyboardData} />;
                }
            )}
        </Grid>
    );
};
export default ThemeSettings;
