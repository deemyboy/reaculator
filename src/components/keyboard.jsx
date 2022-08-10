import { Grid } from "@mui/material";
import { pink } from "@mui/material/colors";
import React from "react";
import Key from "./key";

export function Keyboard({props, selected}) {
  const ref = React.createRef();
  let _className = props.className,
    _keyErr = props.keyErr,
    _keys = [];

  props.keys.forEach((key) => {
    if (selected && selected === key.id) {
      key.selected = true;
    } else {
      key.selected = false;
    }
    key.passClickHandler = props.onClick;
    _keys.push(key);
  });
  return (
      <div
        xs={props.xs}
        md={props.md}
        lg={props.lg}
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
      </div>
  );
}
