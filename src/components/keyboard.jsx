import React, { Component } from "react";
// import ".//scss/keyboard.scss";
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
              handleKeyClick={(e) => this.props.passClickHandler(e)}
            />
          );
        })}
      </React.Fragment>
    );
  };
}
export default Keyboard;
