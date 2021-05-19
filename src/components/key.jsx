import React, { Component } from "react";
import React from "react";
import "./key.scss";


class Key extends Component {
  render = () => {
  return (
        <button className={props.keyClass} value={props.value}>{props.key}</button>
  );
};
}
export default Key;
