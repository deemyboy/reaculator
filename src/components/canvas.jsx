import React, { useRef, useEffect, useContext } from "react";
import initFireworks from "js/animation-fireworks";
import initSlither from "js/animation-slither";

export const Canvas = ({ themeData }) => {
  const canvasRef = React.useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    // console.log(
    //   "canvas hit",
    //   themeData.animation,
    //   canvas,
    //   canvas.parentNode,
    //   canvasRef
    // );
    if (themeData.animation === "fireworks") {
      initFireworks(canvas.parentNode);
    } else if (themeData.animation === "slither") {
      initSlither(canvas.parentNode);
    }
  }, [themeData]);

  return <canvas ref={canvasRef} />;
};
