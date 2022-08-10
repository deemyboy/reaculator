import React from "react";
import { Keyboard } from "./keyboard";
import { keyboards } from "../js/keyboards";
import Grid from "@mui/material/Grid";

export function Sidebar({props}) {
  let className = "sidebar";
  if (props.isOpen) {
    className += " " + "open";
  }

  const components = props.components;


  return (
    <Grid
      container
      direction="column"
      className={className}
      meta-name="sidebar"
      xs={6}
      sm={6}
      md={6}
      justifyContent="space-around"
      alignItems={"center"}
    >
      {components.map((component, i) => {
        return (
        <React.Fragment key={i+567}>
            {component}
        </React.Fragment>
        );
      })}
    </Grid>
  );
}
