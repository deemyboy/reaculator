import React, { useContext } from "react";
import { Button } from "@mui/material";
import { Typography, Box } from "@mui/material";
import HandleClickContext from "../js/context";

import {
    numberKeys,
    functionKeys,
    utilityKeys,
    themeTypeKeys,
    themeKeys,
    animKeys,
    pictureKeys,
} from "../js/keys";

const Key = (props) => {
    const handleClick = useContext(HandleClickContext);
    const setKeyClasses = (keyObj) => {
        let classNames = "btn btn-lg";

        const classStack = {
            numClass: "btn-primary",
            funcClass: "btn-secondary",
            thmClass: "btn-theme",
            thmTypeClass: "btn-theme-type",
            picTypeClass: "btn-pic-type",
            errClass: "btn-error",
            useMeClass: "btn-use-me",
        };
        const specialClass = keyObj.specialClass ? keyObj.specialClass : "";
        const errState = props.keyErr ? props.keyErr : "";
        const selected = keyObj.selected ? "selected" : "";

        if (keyObj.type === "num") {
            classNames += " " + classStack.numClass;
        } else if (keyObj.type === "func") {
            classNames += " " + classStack.funcClass;
        } else if (keyObj.type === "thm") {
            classNames += " " + classStack.thmClass;
        } else if (keyObj.type === "thype") {
            classNames += " " + classStack.thmTypeClass;
        } else if (keyObj.type === "picTypeChs") {
            classNames += " " + classStack.picTypeClass;
        }
        if (specialClass) {
            classNames += " " + specialClass;
        }
        if (selected) {
            classNames += " " + selected;
        }
        if (errState) {
            if (keyObj.value !== "a") {
                classNames += " " + errClass;
            } else {
                classNames += " " + useMeClass;
            }
        }

        return classNames;
    };
    const keys = [
        ...numberKeys,
        ...functionKeys,
        ...utilityKeys,
        ...themeTypeKeys,
        ...themeKeys,
        ...animKeys,
        ...pictureKeys,
    ];
    let _title, _subTitle;

    const _key = keys.find((key) => {
        return key.id === props.id;
    });

    const { id, value, title, keycode, code, type, location } = _key;

    const { uniChar } = _key || "";
    const { specialClass } = _key || "";
    const { showTitle } = _key || "";
    const { calculationDisplayChar } = _key || "";
    const { subTitle } = _key || "";

    if (showTitle) {
        _title = <Typography className="sidebar-btn-title">{title}</Typography>;
    } else {
        _title = "";
    }
    if (subTitle) {
        _subTitle = (
            <Typography className="btn-subtitle">{subTitle}</Typography>
        );
    } else {
        _subTitle = "";
    }

    let boxClassName;
    if (location === "sidebar") {
        boxClassName = "sidebar-btn-wrapper";
    } else if (location === "main") {
        boxClassName = "main-btn-wrapper";
    }

    return (
        <React.Fragment>
            <Box className={boxClassName}>
                {_title}
                <Button
                    id={id}
                    className={setKeyClasses(_key)}
                    onClick={(e) => handleClick(e)}
                    size="large"
                    title={title}
                    variant={"outlined"}
                >
                    {uniChar ? uniChar : value}
                </Button>
                {_subTitle}
            </Box>
        </React.Fragment>
    );
};
export default Key;
