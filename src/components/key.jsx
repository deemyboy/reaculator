import React, { useContext } from "react";
import { Button } from "@mui/material";
import { Typography, Box } from "@mui/material";
import { HandleClickContext } from "../js/context";

const Key = ({ errorState, _key }) => {
    const handleClick = useContext(HandleClickContext);
    const _disabled = errorState && _key.id !== 18;
    const errorClass = "btn-error";

    const setKeyClasses = (keyObj) => {
        let classNames = keyObj.className;

        if (keyObj.selected) {
            classNames += " selected";
        } else {
            // console.log(classNames);
            // console.log(
            //     keyObj.className.includes("selected"),
            //     keyObj.className
            // );
            if (document.getElementById(keyObj.id)) {
                // console.log(document.getElementById(keyObj.id).classList);
            }
            if (keyObj.className.includes("selected")) {
                // console.log(
                //     keyObj.value === selected[key],
                //     keyObj.value,
                //     selected[key]
                // );
                // keyObj.className = keyObj.className.replace("selected", "");
            }
        }
        if (_disabled) {
            if (keyObj.value !== "a") {
                classNames += " " + errorClass;
            }
        }

        return classNames;
    };

    let _title, _subTitle;

    const { id, value, title, location } = _key;

    const { uniChar } = _key || "";
    const { showTitle } = _key || "";
    const { subTitle } = _key || "";

    if (showTitle) {
        _title = (
            <Typography className="settings-btn-title">{title}</Typography>
        );
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
    if (location === "display") {
        boxClassName = "settings-btn-wrapper";
    } else if (location === "main") {
        boxClassName = "main-btn-wrapper";
    }

    return (
        <Box className={boxClassName}>
            {_title}
            <Button
                id={id}
                className={setKeyClasses(_key)}
                onClick={(e) => handleClick(e)}
                size="large"
                title={title}
                variant={"outlined"}
                disabled={_disabled}
            >
                {uniChar ? uniChar : value}
            </Button>
            {_subTitle}
        </Box>
    );
};
export default Key;
