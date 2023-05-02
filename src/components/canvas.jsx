import React, { useRef, useEffect, useContext } from "react";
import initFireworks from "js/animation-fireworks";
import initSlither from "js/animation-slither";

export const Canvas = ({ themeData }) => {
  const canvasRef = React.useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    console.log(
      "canvas hit",
      themeData.animation,
      canvas,
      canvas.parentNode,
      canvasRef
    );
    // const gl = canvas.getContext("webgl");
    if (
      themeData.animation === "fireworks" &&
      themeData.themeType === "animation"
    ) {
      initFireworks(canvas.parentNode);
    } else if (
      themeData.animation === "slither" &&
      themeData.themeType === "animation"
    ) {
      initSlither(canvas.parentNode);
    }
  }, [themeData]); // empty dependency array means this effect runs only once

  return <canvas ref={canvasRef} />;
};
