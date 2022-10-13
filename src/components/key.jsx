import React from "react";
import { Button } from "@mui/material";
import { Typography, Box } from "@mui/material";

const Key = React.forwardRef((props, ref) => {
    const setKeyClasses = (keyObj) => {
        let classes = "btn btn-lg";
        const numClass = "btn-primary";
        const funcClass = "btn-secondary";
        const thmClass = "btn-theme";
        const thmTypeClass = "btn-theme-type";
        const picTypeClass = "btn-pic-type";
        const errClass = "btn-error";
        const useMeClass = "btn-use-me";
        const specialClass = keyObj.specialClass ? keyObj.specialClass : "";
        const errState = props.keyErr ? props.keyErr : "";
        const selected = keyObj.selected ? "selected" : "";

        if (keyObj.type === "num") {
            classes += " " + numClass;
        } else if (keyObj.type === "func") {
            classes += " " + funcClass;
        } else if (keyObj.type === "thm") {
            classes += " " + thmClass;
        } else if (keyObj.type === "thype") {
            classes += " " + thmTypeClass;
        } else if (keyObj.type === "picTypeChs") {
            classes += " " + picTypeClass;
        }
        if (specialClass) {
            classes += " " + specialClass;
        }
        if (selected) {
            classes += " " + selected;
        }
        if (errState) {
            if (keyObj.value !== "a") {
                classes += " " + errClass;
            } else {
                classes += " " + useMeClass;
            }
        }

        return classes;
    };
    let title;
    if (props.kObj.showTitle) {
        title = (
            <Typography className="sidebar_btn_title">
                {props.kObj.title}
            </Typography>
        );
    } else {
        title = "";
    }

    return (
        <React.Fragment>
            <Box className="sidebar_btn_wrapper">
                {title}
                <Button
                    ref={ref.id}
                    id={props.kObj.id}
                    className={setKeyClasses(props.kObj)}
                    onClick={(e) => props.handleClick(e)}
                    size="large"
                    title={props.kObj.title}
                    variant={"outlined"}
                >
                    {props.kObj.uniChar ? props.kObj.uniChar : props.kObj.value}
                </Button>
            </Box>
        </React.Fragment>
    );
});
export default Key;
