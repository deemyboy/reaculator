import React, { Component } from "react";
import Key from "./key";

class Keyboard extends Component {
  render = () => {
    return (
      <React.Fragment>
        {this.props.keys.map((ky) => {
          return (
            <Key
              key={ky.id}
              kObj={ky}
              handleClick={(e) => this.props.passClickHandler(e)}
            />
          );
        })}
      </React.Fragment>
    );
  };
}
export default Keyboard;
