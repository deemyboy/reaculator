import React, { useRef } from "react";
document.addEventListener("DOMContentLoaded", function(event) { 
  
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
  // const Display = React.forwardRef((props, ref) => {

  // // const canvasRef = useRef(null)
  // const canvas = ref.current;
  // const context = canvas.getContext("2d");


    return  <canvas ref={ref} id={props.canId} />
});
export default Canvas;
