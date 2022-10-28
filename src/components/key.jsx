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
    let title, subTitle;
    if (props.kObj.showTitle) {
        title = (
            <Typography className="sidebar-btn-title">
                {props.kObj.title}
            </Typography>
        );
    } else {
        title = "";
    }
    if (props.kObj.subTitle) {
        subTitle = (
            <Typography className="btn-subtitle">
                {props.kObj.subTitle}
            </Typography>
        );
    } else {
        subTitle = "";
    }

    let boxClassName;
    if (props.location === "sidebar") {
        boxClassName = "sidebar-btn-wrapper";
    } else if (props.location === "main") {
        boxClassName = "main-btn-wrapper";
    }

    return (
        <React.Fragment>
            <Box className={boxClassName}>
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
                {subTitle}
            </Box>
        </React.Fragment>
    );
});
export default Key;
