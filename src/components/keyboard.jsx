import { Grid } from "@mui/material";
import { pink } from "@mui/material/colors";
import React from "react";
import Key from "./key";

export function Keyboard(propsIn) {
  console.log(propsIn);
  const { ...props } = propsIn.props;
  const ref = React.createRef();
  let _className = props.className,
    _keyErr = props.keyErr,
    _keys = [];

  props.keys.forEach((key) => {
    if (propsIn.selected && propsIn.selected === key.id) {
      key.selected = true;
    } else {
      key.selected = false;
    }
    key.passClickHandler = props.onClick;
    _keys.push(key);
  });
  return (
    <React.Fragment>
      <Grid
        item
        xs={propsIn.xs}
        md={propsIn.md}
        lg={propsIn.lg}
        className={`keyboard ${_className}`}
      >
        {_keys.map((ky) => {
          return (
            <Key
              ref={ref}
              key={ky.id}
              kObj={ky}
              handleClick={ky.passClickHandler}
              keyErr={_keyErr}
            />
          );
        })}
      </Grid>
    </React.Fragment>
  );
}
