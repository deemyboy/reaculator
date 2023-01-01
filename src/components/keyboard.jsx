import React from "react";
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
                    Object.keys(selected).forEach((key) => {
                        console.log(
                            ky.value === selected[key],
                            ky.value,
                            selected[key]
                        );
                        if (ky.value === selected[key]) {
                            ky.selected = true;
                        } else ky.selected = false;
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
