import React from "react";
import { Grid } from "@mui/material";
import Typography from "@mui/material/Typography";

import Key from "./key";

export function Keyboard({ props, selected, xs, md, lg }) {
    const ref = React.createRef();

    props.keys.forEach((key) => {
        if (selected && selected === key.id) {
            key.selected = true;
        } else {
            key.selected = false;
        }
    });
    let title;
    if (props.showTitle) {
        title = (
            <Typography className="sidebar-kb-title">{props.name}</Typography>
        );
    } else {
        title = "";
    }
    return (
        <Grid
            item={true}
            xs={xs}
            md={md}
            lg={lg}
            className={`keyboard ${props.className}`}
        >
            {title}
            {props.keys.map((ky) => {
                return (
                    <Key
                        location={props.location}
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
