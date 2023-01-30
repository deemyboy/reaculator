import React, { useContext, useEffect } from "react";
import { Grid } from "@mui/material";
import Typography from "@mui/material/Typography";

import Key from "./key";
import * as Types from "../types/types";

// const Keyboard = ({
//     name,
//     className,
//     showTitle,
//     keys,
//     location,
//     id,
//     selected,
//     errorState,
// }): React.FC => {

const Keyboard = (props: Types.TKeyboard): JSX.Element => {
    const {
        name,
        className,
        showTitle,
        keys,
        location,
        id,
        selected,
        errorState,
        onClick,
    } = props;

    // const _title = showTitle ? (
    //     <Typography
    //         className={location === "display" ? "settings-keyboard-title" : ""}
    //     >
    //         {name.toUpperCase()}
    //     </Typography>
    // ) : (
    //     ""
    // );
    return (
        <React.Fragment>
            {/* {_title} */}
            {showTitle && (
                <Typography
                    className={
                        location === "display" ? "settings-keyboard-title" : ""
                    }
                >
                    {name.toUpperCase()}
                </Typography>
            )}{" "}
            <Grid item={true} className={`keyboard ${className}`}>
                {keys.map((ky) => {
                    // ky.selected = false;
                    // Object.keys(selected).forEach((key) => {
                    //     if (ky.value === selected[key]) {
                    //         ky.selected = true;
                    //     }
                    // });
                    return (
                        <Key
                            key={ky.id}
                            _key={ky}
                            errorState={errorState}
                            onClick={onClick}
                        />
                    );
                })}
            </Grid>
        </React.Fragment>
    );
};
export default Keyboard;
