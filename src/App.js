import React, { Component } from "react";
import "./App.scss";
import Calculator from "./components/calculator";

class App extends Component {
  displayRef = React.createRef();
  state = {};

  render = () => {
    return (
      <div className="container">
        <div className="row">
          <Calculator />
        </div>
      </div>
    );
  };
}
export default App;
