import React, { useRef, useEffect, useContext, forwardRef } from "react";
import initFireworks from "js/animation-fireworks";
import initSlither from "js/animation-slither";
import { Canvas } from "./canvas";

export const FireworksCanvas = () => {
  return <Canvas animationFunction={initFireworks} />;
};
