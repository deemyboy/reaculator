import React from "react";
import { Paper } from "@mui/material";

const Line = (props) => {
    return <Paper className={props.className}>{props.value}</Paper>;
};
export default Line;
