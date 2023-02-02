import React, { useContext, useEffect } from "react";
import { Grid } from "@mui/material";
import Typography from "@mui/material/Typography";

import { Key } from "./key";
import * as Types from "../types/types";
import { keyboardKeysMap } from "ts/keys";
import { keyboardMap } from "ts/keyboards";

const Keyboard = ({ keyboardName }): React.ReactElement => {
    const { name, className, showTitle, keyboardKeys, location } =
        keyboardMap.get(keyboardName)!;
    const keys: Types.TKey[] = keyboardKeysMap.get(keyboardKeys)!;
    return (
        <React.Fragment>
            {showTitle && (
                <Typography
                    className={
                        location === "display" ? "settings-keyboard-title" : ""
                    }
                >
                    {name.toUpperCase()}
                </Typography>
            )}{" "}
            <>
                <Grid item={true} className={`keyboard ${className}`}>
                    {keys.map((key) => {
                        return <Key key={key.id} keyData={key} />;
                    })}
                </Grid>
            </>
        </React.Fragment>
    );
};
export default Keyboard;
