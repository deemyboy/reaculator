import React, { Component } from "react";
import "./calculator.scss";
import Display from "./components/display";

class Calculator extends Component {
  displayRef = React.createRef();
  state = {};

  render = () => {
    return (
      <div className="container">
        <div className="row">
          <div className="calculator">
            <div className="title">Calculator</div>
            <div className="body">
              <Display />
            </div>
          </div>
        </div>
      </div>
    );
  };
}

export default Calculator;
