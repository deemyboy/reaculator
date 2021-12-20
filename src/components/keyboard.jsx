import React, { Component } from "react";
import Key from "./key";

class Keyboard extends Component {
  render = () => {
    const getClickFunction = (kys) => {
      // kys.keys.forEach((key) => {
      //   if (key.hasOwnProperty("keys")) {
      //     key.keys.forEach((ky) => {
      //       _keys.push(ky);
      //       // _keys = key;
      //       // _passClickHandler = key.onClick;
      //     });
      //   }
      return kys.onClick;
      // });
    };
    const ref = React.createRef();
    let _kbData = this.props.kbData;

    let _title = _kbData.title,
      _className = _kbData.className,
      _keyErr = _kbData.keyErr,
      _keys = [],
      _passClickHandler,
      _newKeys;

    _kbData.keys.forEach((key) => {
      if (key.hasOwnProperty("keys")) {
        key.keys.forEach((ky) => {
          ky.passClickHandler = key.onClick;
          _keys.push(ky);
        });
      } else {
        key.passClickHandler = _kbData.onClick;
        _keys.push(key);
      }
    });
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
                handleClick={ky.passClickHandler}
                keyErr={_keyErr}
              />
            );
          })}
        </div>
      </React.Fragment>
    );
    // } else {
    //   return (
    //     <React.Fragment>
    //       <div className="title">{_title}</div>
    //       <div className={`keyboard ${_className}`}>
    //         {_keys.map((ky) => {
    //           return <Key ref={ref} key={ky.id} kObj={ky} keyErr={_keyErr} />;
    //         })}
    //       </div>
    //     </React.Fragment>
    //   );
    // }
  };
}
export default Keyboard;
