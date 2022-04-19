import React from "react";
import { Circle } from "./circle";
import { Keyboard } from "./keyboard";
import { keyboards } from "../js/keyboards";
import Grid from "@mui/material/Grid";

export function Sidebar(propsIn) {
  const { ...props } = propsIn.props;
  console.log(props);
  let className = "sidebar ";
  if (props.isOpen) {
    className += "open";
  }

  const components = props.components;
  let circleProps = {
    onclick: props.circleOnClick,
  };

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
        circleProps.isOpen = component.isOpen;
        return (
          <Grid
            key={i}
            item={true}
            sm={6}
            md={6}
            display={"flex"}
            flexBasis={"10%!important"}
            alignItems="center"
          >
            <Circle
              key={i}
              id={"circle" + (i + 1)}
              isOpen={component.isOpen}
              props={circleProps}
            />
            <Keyboard
              key={i + 10}
              selected={component.selected}
              props={component.keyboard}
            />
          </Grid>
        );
      })}
    </Grid>
  );
}
