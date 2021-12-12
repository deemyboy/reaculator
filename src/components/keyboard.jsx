import React, { Component } from "react";
import Key from "./key";

class Keyboard extends Component {
  render = () => {
    const ref = React.createRef();
    return (
      <div className={`keyboard ${this.props.className}`}>
        <div className="title">{this.props.label}</div>
        {this.props.keys.map((ky) => {
          return (
            <Key
              ref={ref}
              key={ky.id}
              kObj={ky}
              handleClick={(e) => this.props.passClickHandler(e)}
              keyErr={this.props.keyErr}
            />
          );
        })}
      </div>
    );
  };
}
export default Keyboard;
