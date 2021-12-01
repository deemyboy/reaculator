import React, { useRef } from "react";

const Canvas = (canvasRef) => {
    console.log(canvasRef);

//   const canvasRef = useRef(null)
  const canvas = canvasRef.current
  const context = canvas.getContext('2d')

  return <Canvas ref={canvasRef} {...props} />;
};
export default Canvas;
