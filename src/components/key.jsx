import React, { useContext } from "react";
import { Button } from "@mui/material";
import { Typography, Box } from "@mui/material";
import { HandleClickContext, ErrorStateContext } from "../utils/context";

export const Key = ({ keyData }) => {
    const ERROR_CLASS = "btn-error";
    const SELECTED_CLASS = "selected";
    const CLASS_NAME_SEPERATOR = " ";
    const CLEAR_ERROR_KEY_ID = "18"; // ac key
    const { errorState } = useContext(ErrorStateContext);
    const { onClickFunctions } = useContext(HandleClickContext);

    const setKeyClasses = ({ className, selected, id }) => {
        let classNames = className;

        classNames += selected ? CLASS_NAME_SEPERATOR + SELECTED_CLASS : "";
        classNames +=
            errorState && id !== CLEAR_ERROR_KEY_ID
                ? CLASS_NAME_SEPERATOR + ERROR_CLASS
                : "";

        return classNames;
    };

    const { id, value, title, location, type } = keyData;

    const onClick =
        type === "num" || type === "func"
            ? onClickFunctions[1]
            : onClickFunctions[0];
    const { uniChar } = keyData || "";
    const { showTitle } = keyData || "";
    const { subTitle } = keyData || "";

    let btnWrapperClassName;
    if (location === "display") {
        btnWrapperClassName = "settings-btn-wrapper";
    } else if (location === "main") {
        btnWrapperClassName = "main-btn-wrapper";
    }

    return (
        <Box className={btnWrapperClassName}>
            {showTitle && (
                <Typography className="settings-btn-title">{title}</Typography>
            )}
            <Button
                id={id}
                className={setKeyClasses(keyData)}
                onClick={(e) => onClick(e)}
                size="large"
                title={title}
                variant={"outlined"}
                disabled={
                    errorState && id !== CLEAR_ERROR_KEY_ID ? errorState : false
                }
            >
                {uniChar ? uniChar : value}
            </Button>
            {subTitle && (
                <Typography className="btn-subtitle">{subTitle}</Typography>
            )}
        </Box>
    );
};
