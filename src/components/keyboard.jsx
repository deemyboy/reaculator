import React, { Component } from "react";
import Key from "./key";

class Keyboard extends Component {
  render = () => {
    const ref = React.createRef();
    return (
      <React.Fragment>
        <div className="title">{this.props.label}</div>
        <div className={`keyboard ${this.props.className}`}>
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
      </React.Fragment>
    );
  };
}
export default Keyboard;
