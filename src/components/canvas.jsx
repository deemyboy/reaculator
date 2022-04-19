import React, { useRef } from "react";
document.addEventListener("DOMContentLoaded", function (event) {
  // ReactDOM.render(
  //   <React.StrictMode>
  //     <Provider store={store}>
  //   <BrowserRouter>
  //     <DashApp />
  //   </BrowserRouter>
  //   </Provider>
  //   </React.StrictMode>,
  //   document.getElementById("root")
  // );
});

const Canvas = React.forwardRef((props, ref) => {
  return <canvas ref={ref} id={props.canvasId} />;
});
export default Canvas;
