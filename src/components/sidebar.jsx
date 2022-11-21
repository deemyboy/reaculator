import React from "react";
import { Grid } from "@mui/material";

const Sidebar = (props) => {
    let className = "sidebar";

    const { keyboards } = props.sidebarData;

    let i = 0;

    return (
        <Grid
            container
            direction="column"
            className={className}
            meta-name="sidebar"
            justifyContent="space-around"
            alignItems={"center"}
        >
            {keyboards.map((keyboard) => {
                i++;
                return <React.Fragment key={i}>{keyboard}</React.Fragment>;
            })}
        </Grid>
    );
};
export default Sidebar;
