import React from "react";
document.addEventListener("DOMContentLoaded", function (event) {
});

const Canvas = React.forwardRef((props, ref) => {
  return <canvas ref={ref} id={props.id} />;
});
export default Canvas;
