import React from "react";
import { Grid } from "@mui/material";

import Key from "./key";

function Keyboard({ props, selected, xs, md, lg }) {
    const ref = React.createRef();

    props.keys.forEach((key) => {
        if (selected && selected === key.id) {
            key.selected = true;
        } else {
            key.selected = false;
        }
    });
    return (
        <Grid
            item={true}
            xs={xs}
            md={md}
            lg={lg}
            className={`keyboard ${props.className}`}
        >
            {props.keys.map((ky) => {
                return (
                    <Key
                        ref={ref}
                        key={ky.id}
                        kObj={ky}
                        handleClick={props.onClick}
                        keyErr={props.keyErr}
                    />
                );
            })}
        </Grid>
    );
}
export default Keyboard;
