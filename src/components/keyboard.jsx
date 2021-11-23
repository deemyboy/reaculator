import React, { Component } from "react";
import Key from "./key";

class Keyboard extends Component {
  render = () => {
    const ref = React.createRef();
    console.log(this.props);
    return (
      <React.Fragment>
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
      </React.Fragment>
    );
  };
}
export default Keyboard;
