import React, { useRef, useEffect } from "react";

interface ICanvasProps extends React.HTMLProps<HTMLCanvasElement> {
  animationFunction: (canvas) => void;
}

export const Canvas = ({ animationFunction }: ICanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      animationFunction(canvas);
    }
  }, [animationFunction]);

  return <canvas ref={canvasRef} />;
};
