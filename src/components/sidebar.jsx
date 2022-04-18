import React from "react";
import { Circle } from "./circle";
import { Keyboard } from "./keyboard";
import { keyboards } from "../js/keyboards";
import Grid from "@mui/material/Grid";

export function Sidebar(propsIn) {
  // console.log(propsIn);
  const { ...props } = propsIn.props;
  let className = "sidebar ";
  if (props.isOpen) {
    className += "open";
  }

  const components = props.components;
  const getKeyboard = (keyboardName) => {
    return keyboards.find((keyboard) => {
      return keyboard.name === keyboardName ? keyboard : undefined;
    });
  };
  let circleProps = {
    onclick: props.circleOnClick,
  };

  return (
    <Grid
      container
      direction="column"
      className={className}
      meta-name="sidebar"
      sm={4}
      md={4}
      justifyContent="space-evenly"
    >
      {components.map((component, i) => {
        circleProps.isOpen = component.isOpen;
        console.log(circleProps, component.isOpen);
        return (
          <Grid
            item={true}
            sm={6}
            md={6}
            display={"flex"}
            justifyContent={"center"}
            alignItems="center"
          >
            <Circle
              key={i}
              id={"circle" + (i + 1)}
              isOpen={component.isOpen}
              props={circleProps}
            />
            <Keyboard key={i + 10} props={getKeyboard(component.keyboard)} />
          </Grid>
        );
      })}
    </Grid>
  );
}
