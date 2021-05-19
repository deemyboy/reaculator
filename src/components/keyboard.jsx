import React from "react";
import "./keyboard.scss";

const Keyboard = React.forwardRef((props, ref) => {
  makeKeyboard = () => {
console.log('making keyboard');
  }
  return (
    <div className="col">
        <p className={props.keybClass}>{this.makeKeyboard}</p>
    </div>
  );
});
export default Keyboard;
