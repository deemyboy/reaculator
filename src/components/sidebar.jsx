import React from "react";
import { Keyboard } from "./keyboard";
import { keyboards } from "../js/keyboards";
import { Grid } from "@mui/material";

export function Sidebar({props}) {
  let className = "sidebar";
  if (props.isOpen) {
    className += " " + "open";
  }

  // const keyboards = props.map((props.keyboardNames, i));

  
  const getKeyboard = (keyboardName) => {
    let _keyboardData = keyboards.find((keyboard) => {
      return keyboard.name === keyboardName ? keyboard : undefined;
    });

    _keyboardData.onClick = props.getKeyboardOnclick(keyboardName);
    _keyboardData.selected = props.getSelected(keyboardName);
      

      return <Keyboard
        selected={_keyboardData.selected}
        props={_keyboardData}
      />;
  };

  return (
    <Grid
      container
      direction="column"
      className={className}
      meta-name="sidebar"
      justifyContent="space-around"
      alignItems={"center"}
    >
      {props.keyboardNames.map((kbn, i) => {
        return (
        <React.Fragment key={i+567}>
            {getKeyboard(kbn)}
        </React.Fragment>
        );
      })}
    </Grid>
  );
}
