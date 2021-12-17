import React, { Component } from "react";
import Key from "./key";

class Keyboard extends Component {
  render = () => {
    const ref = React.createRef();
    let _kbData = this.props.kbData;

    let _title = _kbData.title,
      _className = _kbData.className,
      _keys = _kbData.keys,
      _keyErr = _kbData.keyErr,
      _passClickHandler = _kbData.onClick;

    return (
      <React.Fragment>
        <div className="title">{_title}</div>
        <div className={`keyboard ${_className}`}>
          {_keys.map((ky) => {
            return (
              <Key
                ref={ref}
                key={ky.id}
                kObj={ky}
                handleClick={(e) => _passClickHandler(e)}
                keyErr={_keyErr}
              />
            );
          })}
        </div>
      </React.Fragment>
    );
  };
}
export default Keyboard;
