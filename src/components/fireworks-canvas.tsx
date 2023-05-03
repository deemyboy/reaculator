import React from "react";
import initFireworks from "js/animation-fireworks";
import { Canvas } from "./canvas";

export const FireworksCanvas = () => {
  return <Canvas animationFunction={initFireworks} />;
};
