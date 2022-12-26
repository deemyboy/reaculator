import React, { useState, useEffect } from "react";
import { Grid, Collapse } from "@mui/material";
import { motion } from "framer-motion";

const ThemeSettings = ({ keyboardData: content }) => {
    const className = "settings";
    const [checked, setChecked] = useState({});

    useEffect(() => {
        let checkedData = { ...checked };

        const keyboardNames = content.map((keyboard) => {
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
    }, [content]);

    const Setting = (content) => {
        const { keyboard, name } = { ...content };
        return (
            <motion.div
                className="setting-wrapper"
                initial={{ y: -500, opacity: 0.25 }}
                animate={{ height: 130, opacity: 1, y: 0 }}
                transition={{
                    type: "spring",
                    duration: 0.5,
                    delay: 0.1,
                }}
            >
                <div className="settings-keyboard-title">
                    {name.toUpperCase()}
                </div>
                {keyboard}
            </motion.div>
        );
    };

    return (
        <Grid
            container
            className={className}
            meta-name="settings"
            justifyContent="space-around"
            alignItems={"center"}
        >
            {content.map((keyboard, index) => {
                return <Setting key={index} {...keyboard} />;
            })}
        </Grid>
    );
};
export default ThemeSettings;
