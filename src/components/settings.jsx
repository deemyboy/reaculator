import React, { useRef, useState, useEffect } from "react";
import { Grid, Collapse, Slide, SlideProps } from "@mui/material";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import keyboards from "../js/keyboards";
import Line from "./line";

const Settings = (props) => {
    const className = "settings",
        { keyboardData } = props.settingsData;

    const [checked, setChecked] = useState({});

    useEffect(() => {
        let checkedData = {};
        // let _checked = { ...checked };
        keyboardData.map((keyboard) => {
            checkedData[keyboard.name] = false;
        });
        setChecked({ ...checked, ...checkedData });
    }, [keyboardData]);

    const makeSettingsComponent = (keyboardObject) => {
        return (
            <React.Fragment>
                <ExpandMoreIcon
                    sx={{ transform: "rotate(90deg)" }}
                    data-index={keyboardObject.name}
                    onClick={(e) => toggleSlide(e)}
                />
                <Collapse
                    in={checked[keyboardObject.name]}
                    sx={{
                        // // height: "100%",
                        // // width: "auto",
                        // top: "0",
                        // position: "relative",
                        // left: "-6%",
                        transition:
                            "height 3000ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
                        border: "1px dashed red",
                    }}
                >
                    {keyboardObject.keyboard}
                </Collapse>
            </React.Fragment>
        );
    };

    const toggleSlide = (event) => {
        const idx = event.currentTarget.dataset.index;
        let _checked = { ...checked };
        let newVal = {};
        // const _checked = (index) => {
        //     let res;
        //     for (let check of Object.keys(checked)) {
        //         console.log(
        //             checked[check],
        //             checked[index],
        //             "check",
        //             check,
        //             "index",
        //             index
        //         );
        //         return checked[check] === index
        //             ? !checked[check]
        //             : checked[check];
        //     }
        // };

        Object.keys(checked).map((k) => {
            if (k === idx) {
                newVal[k] = !checked[k];
            }
            _checked = { ..._checked, ...newVal };
        });

        setChecked(_checked);
    };

    // const { keyboardData } = props.settingsData;
    // const { keyboardData } = props.settingsData;

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
