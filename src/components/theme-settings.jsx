import React, { useRef, useState, useEffect } from "react";
import { Grid, Slide, SlideProps } from "@mui/material";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import keyboards from "../js/keyboards";

import Line from "./line";

const ThemeSettings = (props) => {
    const className = "settings",
        { keyboardData } = props.settingsData;

    const [checked, setChecked] = useState({});

    useEffect(() => {
        let count = 0;
        // let checkedData = {};
        let checkedData = { ...checked };

        const keyboardNames = keyboardData.map((keyboard) => {
            return keyboard.name;
        });
        //  initial setup of checked data
        if (Object.keys(checkedData).length === 0) {
            keyboardNames.map((keyboardName) => {
                checkedData[keyboardName] = false;
            });
            setChecked(checkedData);
            return;
        }
        // add a new property
        keyboardNames.map((keyboardName) => {
            if (!checkedData.hasOwnProperty(keyboardName)) {
                checkedData[keyboardName] = false;
            }
            setChecked(checkedData);
            return;
        });
        // delete a property when switching theme types
        const keysToRemoveFromChecked = Object.keys(checkedData).filter(
            (key) => {
                return !keyboardNames.includes(key);
            }
        );
        keysToRemoveFromChecked.map((key) => {
            delete checkedData[key];
        });
        setChecked(checkedData);
    }, [keyboardData]);

    const makeSettingsComponent = (keyboardObject) => {
        let collapseClassName = "collapse";
        collapseClassName += checked[keyboardObject.name]
            ? " expanded"
            : " collapsed";
        return (
            <div className="setting-wrapper">
                <ExpandMoreIcon
                    sx={{ transform: "rotate(90deg)" }}
                    data-index={keyboardObject.name}
                    onClick={(e) => toggleSlide(e)}
                />
                <div className={collapseClassName}>
                    {keyboardObject.keyboard}
                </div>
            </div>
        );
    };

    const toggleSlide = (event) => {
        const idx = event.currentTarget.dataset.index;
        let newVal = {};

        Object.keys(checked).map((k) => {
            if (k === idx) {
                newVal[k] = !checked[k];
            }
        });

        setChecked({ ...checked, ...newVal });
    };

    return (
        <React.Fragment>
            {" "}
            <Grid
                container
                key={Math.random()}
                // direction="column"
                className={className}
                meta-name="settings"
                justifyContent="space-around"
                alignItems={"center"}
            >
                {keyboardData.map((keyboard, index) => {
                    return (
                        <React.Fragment key={index}>
                            {makeSettingsComponent(keyboard)}
                        </React.Fragment>
                    );
                })}
            </Grid>
        </React.Fragment>
    );
};
export default ThemeSettings;
