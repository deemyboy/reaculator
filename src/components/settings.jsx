import React, { useRef, useState, useEffect } from "react";
import { Grid, Collapse, Slide, SlideProps } from "@mui/material";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import keyboards from "../js/keyboards";

const Settings = (props) => {
    let className = "settings",
        { keyboardNames, keyboardData } = props.settingsData;
    const [checked, setChecked] = useState([]);

    const isInitialMount = useRef(true);

    // useEffect(() => {
    //     // console.log("setChecked");
    //     // if (isInitialMount.current) {
    //     //     isInitialMount.current = false;
    //     // } else {
    //     let s = {};
    //     // let _checked = { ...checked };
    //     keyboardNames.map((kn) => {
    //         s[kn] = false;
    //     });
    //     // return s;
    //     console.log("setChecked", isInitialMount);
    //     setChecked({ ...checked, ...s });
    //     // }
    // }, [keyboardNames]);

    const getKeyboard = (index) => {
        return keyboardData.keyboards[index];
    };

    const makeSettingsComponent = (keyboardObject) => {
        return (
            <React.Fragment>
                <ExpandMoreIcon
                    sx={{ transform: "rotate(90deg)" }}
                    data-index={keyboardObject.name}
                    onClick={(e) => toggleSlide(e)}
                />
                <Collapse
                    in={checked[keyboardNames[index]]}
                    // orientation="horizontal"
                    // collapsedSize={1000}
                    sx={{
                        height: "100%",
                        width: "auto",
                        top: "0",
                        position: "relative",
                        left: "-6%",
                    }}
                >
                    {keyboardObject.keyboard}
                </Collapse>
            </React.Fragment>
        );
    };

    // const toggleSlide = (event) => {
    //     const idx = event.currentTarget.dataset.index;
    //     console.log(event.currentTarget.dataset.index);
    //     let _checked = { ...checked };
    //     let newVal = {};
    //     // const _checked = (index) => {
    //     //     let res;
    //     //     for (let check of Object.keys(checked)) {
    //     // console.log(
    //     //         //     checked[check],
    //     //         //     checked[index],
    //     //         //     "check",
    //     //         //     check,
    //     //         //     "index",
    //     //         //     index
    //     //         // );
    //     //         return checked[check] === index
    //     //             ? !checked[check]
    //     //             : checked[check];
    //     //     }
    //     // };

    //     Object.keys(checked).map((k) => {
    //         // console.log(
    //         //     k,
    //         //     checked[k],
    //         //     idx,
    //         //     k === idx,
    //         //     newVal,
    //         //     Object.keys(checked)[idx]
    //         // );
    //         if (k === idx) {
    //             newVal[k] = !checked[k];
    //         }
    //         _checked = { ..._checked, ...newVal };
    //         // console.log("_checked", _checked);
    //     });

    //     setChecked(_checked);
    // };

    // const { keyboardData } = props.settingsData;
    // const { keyboardData } = props.settingsData;

    let i = 0;

    return (
        <React.Fragment>
            {" "}
            <Grid
                container
                // direction="column"
                className={className}
                meta-name="settings"
                justifyContent="space-around"
                alignItems={"center"}
            >
                {" "}
                {keyboardData.keyboards.map((keyboardObject, index) => {
                    makeSettingsComponent(keyboardObject.index);
                    // console.log( checked);
                    // console.log(
                    //     "props.settingsData[key]",
                    //     props.settingsData[key],
                    //     "key",
                    //     key,
                    //     "index",
                    //     index
                    // );
                    // keyboard.num = { i };
                    // console.log(checked, index);
                })}
            </Grid>
        </React.Fragment>
    );
};
export default Settings;
