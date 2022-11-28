import React, { useRef, useState, useEffect } from "react";
import { Grid, Collapse, Slide, SlideProps } from "@mui/material";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import keyboards from "../js/keyboards";

const Sidebar = (props) => {
    let className = "sidebar",
        { keyboardNames, keyboardData } = props.sidebarData;
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

    const getKeyboards = () => {
        let keyboards = [];
        for (let item in Object.keys(keyboardData)) {
            keyboards.push(keyboardData[item].keyboard);
        }
        return keyboards;
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

    // const { keyboardData } = props.sidebarData;
    // const { keyboardData } = props.sidebarData;

    let i = 0;

    return (
        <React.Fragment>
            {" "}
            <Grid
                container
                direction="column"
                className={className}
                meta-name="sidebar"
                justifyContent="space-around"
                alignItems={"center"}
            >
                {" "}
                {getKeyboards().map((keyboard, index) => {
                    console.log(keyboardNames, keyboardData, checked);
                    // console.log(
                    //     "props.sidebarData[key]",
                    //     props.sidebarData[key],
                    //     "key",
                    //     key,
                    //     "index",
                    //     index
                    // );
                    // keyboard.num = { i };
                    // console.log(checked, index);
                    i++;
                    return (
                        <React.Fragment key={i}>
                            {/* <ExpandMoreIcon
                                // sx={{ transform: "rotate(90deg)" }}
                                data-index={keyboardNames[index]}
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
                            > */}
                            {keyboard}
                            {/* </Collapse> */}
                        </React.Fragment>
                    );
                })}
            </Grid>
        </React.Fragment>
    );
};
export default Sidebar;
