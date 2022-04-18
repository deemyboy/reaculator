import { Grid } from "@mui/material";
import React from "react";
import Key from "./key";

export function Keyboard(propsIn) {
  const { ...props } = propsIn.props;
  const ref = React.createRef();

  let _className = props.className,
    _keyErr = props.keyErr,
    _keys = [];

  props.keys.forEach((key) => {
    key.passClickHandler = props.onClick;
    _keys.push(key);
  });
  return (
    <React.Fragment>
      <Grid item className={`keyboard ${_className}`}>
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
