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

  // const loadingScreen = document.getElementById("preloader");
  //  loadingScreen.style.opacity = 0;
  //  loadingScreen.style.display = "none";
  //  import anim from "./anim";
});

const Canvas = React.forwardRef((props, ref) => {
  // const Display = React.forwardRef((props, ref) => {
  console.log("Canvas",ref, props);

  // // const canvasRef = useRef(null)
  // const canvas = ref.current;
  // const context = canvas.getContext("2d");

  // return (

    // <React.Fragment>
    console.log(<canvas ref={ref} id={props.canId} />);
    return  <canvas ref={ref} id={props.canId} />
    {/* </React.Fragment> */}
  // );
});
export default Canvas;
