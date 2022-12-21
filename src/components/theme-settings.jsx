import React, { useState, useEffect } from "react";
import { Grid } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Collapse } from "react-collapse";

const ThemeSettings = (props) => {
    const className = "settings",
        { keyboardData } = { ...props.settingsData.settingsData };

    const [checked, setChecked] = useState({});

    useEffect(() => {
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
        Object.keys(checkedData)
            .filter((key) => {
                return !keyboardNames.includes(key);
            })
            .map((key) => {
                delete checkedData[key];
            });
        setChecked(checkedData);
    }, [keyboardData]);

    const Setting = (keyboardData) => {
        const { keyboardObject } = { ...keyboardData };
        const expandMoreIconOrientation = !checked[keyboardObject.name]
            ? { transform: "rotate(0deg);transition: 300ms ease all;" }
            : { transform: "rotate(180deg);transition: 300ms ease all;" };
        let collapseClassName = "collapse";
        collapseClassName += checked[keyboardObject.name]
            ? " expanded"
            : " collapsed";
        return (
            <div className="setting-wrapper">
                <div>{keyboardObject.name.toUpperCase()}</div>
                {keyboardObject.keyboard}
            </div>
        );
    };

    return (
        <React.Fragment>
            {" "}
            <Grid
                container
                className={className}
                meta-name="settings"
                justifyContent="space-around"
                alignItems={"center"}
            >
                {keyboardData.map((keyboardObject, index) => {
                    return (
                        <Setting key={index} keyboardObject={keyboardObject} />
                    );
                })}
            </Grid>
        </React.Fragment>
    );
};
export default ThemeSettings;
