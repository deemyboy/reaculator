import React from "react";
import initSlither from "js/animation-slither";
import { Canvas } from "./canvas";

export const SlitherCanvas = () => {
  return <Canvas animationFunction={initSlither} />;
};
