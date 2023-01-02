import React, { useContext, useEffect } from "react";
import { Grid } from "@mui/material";
import Typography from "@mui/material/Typography";

import Key from "./key";

const Keyboard = ({
    className,
    errorState,
    id,
    keys,
    location,
    name,
    showTitle,
    selected,
}) => {
    const keyboardClassName =
        location === "display" ? "settings-keyboard-title" : "";
    const _title = showTitle ? (
        <Typography className={keyboardClassName}>
            {name.toUpperCase()}
        </Typography>
    ) : (
        ""
    );
    return (
        <React.Fragment>
            {_title}
            <Grid item={true} className={`keyboard ${className}`}>
                {keys.map((ky) => {
                    ky.selected = false;
                    Object.keys(selected).forEach((key) => {
                        if (ky.value === selected[key]) {
                            ky.selected = true;
                        }
                    });
                    return (
                        <Key key={ky.id} _key={ky} errorState={errorState} />
                    );
                })}
            </Grid>
        </React.Fragment>
    );
};
export default Keyboard;
