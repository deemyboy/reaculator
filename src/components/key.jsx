import React, { useContext } from "react";
import { Button } from "@mui/material";
import { Typography, Box } from "@mui/material";
import { HandleClickContext, ErrorStateContext } from "../utils/context";

export const Key = ({ keyData }) => {
    const ERROR_CLASS = "btn-error";
    const SELECTED_CLASS = "selected";
    const CLASS_NAME_SEPARATOR = " ";
    const CLEAR_ERROR_KEY_ID = "18"; // ac key
    const { errorState } = useContext(ErrorStateContext);
    const { onClickFunctions } = useContext(HandleClickContext);

    const setKeyClasses = ({ className, selected, id }) => {
        let classNames = className;

        classNames += selected ? CLASS_NAME_SEPARATOR + SELECTED_CLASS : "";
        classNames +=
            errorState && id !== CLEAR_ERROR_KEY_ID
                ? CLASS_NAME_SEPARATOR + ERROR_CLASS
                : "";

        return classNames;
    };

    const { id, value, title, location, type } = keyData;

    const onClick =
        type === "number" || type === "function"
            ? onClickFunctions[1]
            : onClickFunctions[0];
    const { uniChar } = keyData || "";
    const { showTitle } = keyData || "";
    const { subTitle } = keyData || "";

    return (
        <Box
            className={
                location === "display"
                    ? "settings-btn-wrapper"
                    : "main-btn-wrapper"
            }
        >
            {showTitle && (
                <Typography
                    className={
                        keyData.selected
                            ? `settings-btn-title ${SELECTED_CLASS}`
                            : `settings-btn-title`
                    }
                >
                    {title}
                </Typography>
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
