import React, { useContext } from "react";
import { Grid } from "@mui/material";
import Typography from "@mui/material/Typography";

import Key from "./key";

const Keyboard = ({ props, selected }) => {
    const { title, className, keys } = props;

    const { xs } = props || "";
    const { md } = props || "";
    const { lg } = props || "";
    const { showTitle } = props || "";

    let _title;
    if (showTitle) {
        _title = <Typography className="sidebar-kb-title">{title}</Typography>;
    } else {
        _title = "";
    }
    return (
        <Grid
            item={true}
            xs={xs}
            md={md}
            lg={lg}
            className={`keyboard ${className}`}
        >
            {_title}
            {keys.map((ky) => {
                return <Key key={ky.id} id={ky.id} />;
            })}
        </Grid>
    );
};
export default Keyboard;
