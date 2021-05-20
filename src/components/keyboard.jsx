import React, { Component } from "react";
import "./keyboard.scss";
import Key from "./key";

class Keyboard extends Component {
  render = () => {
    console.log(this.props);
    return (
      <div className="col">
        <p className="bob">
          {this.props.keys.map((ky) => {
            return (
              <Key
                key={ky.id}
                kObj={ky}
                handleKeyClick={(e) => this.props.passClickHandler(e)}
              />
            );
          })}
        </p>
      </div>
    );
  };
}
export default Keyboard;
