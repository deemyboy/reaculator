import React, { useRef, useState, useEffect } from "react";
import { Grid, Slide, SlideProps } from "@mui/material";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import keyboards from "../js/keyboards";

import Line from "./line";

const Settings = (props) => {
    const className = "settings",
        { keyboardData } = props.settingsData;

    const [checked, setChecked] = useState({});

    useEffect(() => {
        let count = 0;
        // let checkedData = {};
        let checkedData = { ...checked };

        //  initial setup of checked data
        if (Object.keys(checkedData).length === 0) {
            keyboardData.map((keyboard) => {
                checkedData[keyboard.name] = false;
            });
            setChecked(checkedData);
            return;
        }
        // add a new property
        keyboardData.map((keyboard) => {
            if (!checkedData.hasOwnProperty(keyboard.name)) {
                checkedData[keyboard.name] = false;
            }
        });
        // delete a property when switching them types
        keyboardData.map((keyboard) => {
            if (checkedData.hasOwnProperty(keyboard.name)) {
                const keysToRemoveFromChecked = Object.keys(checkedData).filter(
                    (key) => {
                        console.log(
                            "keysToRemoveFromChecked keyboard.name",
                            keyboard.name
                        );
                        const keyboardNames = keyboardData.map((keyboard) => {
                            return keyboard.name;
                        });
                        return !keyboardNames.includes(key);
                    }
                );
                keysToRemoveFromChecked.map((key) => {
                    delete checkedData[key];
                });
                setChecked(checkedData);
                return;

                // checkedData[keyboard.name] = false;
                // delete checkedData[keyboard.name];
            }
        });
        // }
        setChecked(checkedData);
    }, [keyboardData]);

    const makeSettingsComponent = (keyboardObject) => {
        let collapseClassName = "collapse";
        console.log("makeSettingsComponent", checked[keyboardObject.name]);
        collapseClassName += checked[keyboardObject.name]
            ? " expanded"
            : " collapsed";
        return (
            <React.Fragment>
                <ExpandMoreIcon
                    sx={{ transform: "rotate(90deg)" }}
                    data-index={keyboardObject.name}
                    onClick={(e) => toggleSlide(e)}
                />
                <div className={collapseClassName}>
                    {keyboardObject.keyboard}
                </div>
            </React.Fragment>
        );
    };

    const toggleSlide = (event) => {
        const idx = event.currentTarget.dataset.index;
        let _checked = { ...checked };
        let newVal = {};

        Object.keys(checked).map((k) => {
            if (k === idx) {
                newVal[k] = !checked[k];
            }
            _checked = { ..._checked, ...newVal };
        });

        setChecked(_checked);
    };

    let i = 0;

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
export default Settings;
