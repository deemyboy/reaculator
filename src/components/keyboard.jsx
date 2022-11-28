import React, { useContext, useState } from "react";
import { Grid, Collapse, Slide, SlideProps } from "@mui/material";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { TransitionProps } from "@mui/material/transitions";

import Key from "./key";

const SlideTransition = (SlideProps) => {
    return <Slide {...SlideProps} direction="left" />;
};

const Keyboard = ({ props, selected, errorState }) => {
    // const [checked, setChecked] = useState({ 0: false, 1: false });

    // const toggleSlide = (kbId) => {
    //     console.log(kbId);
    //     setChecked((checked[kbId] = !checked[kbId]));
    // };

    // console.log("Keyboard");
    const { title, className, keys, location, id } = props;
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
    if (location === "sidebar") {
        return (
            // <SlideTransition>
            // <Slide direction="up" in={checked} mountOnEnter unmountOnExit>
            <React.Fragment>
                {/* <ExpandMoreIcon
                    // sx={{ transform: "rotate(90deg)" }}
                    onClick={() => toggleSlide(id)}
                />
                <Collapse
                    in={checked[id]}
                    // orientation="horizontal"
                    // collapsedSize={1000}
                    sx={{
                        height: "100%",
                        width: "auto",
                        top: "0",
                        position: "relative",
                        left: "-6%",
                    }}
                > */}
                <Grid
                    item={true}
                    xs={xs}
                    md={md}
                    lg={lg}
                    className={`keyboard ${className}`}
                >
                    {_title}
                    {keys.map((ky) => {
                        return (
                            <Key
                                key={ky.id}
                                _key={ky}
                                errorState={errorState}
                            />
                        );
                    })}
                </Grid>
                {/* </Collapse> */}
            </React.Fragment>
            // </Slide>
            // </SlideTransition>
        );
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
                return <Key key={ky.id} _key={ky} errorState={errorState} />;
            })}
        </Grid>
    );
};
export default Keyboard;
