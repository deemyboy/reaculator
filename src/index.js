import React from "react";
import Calculator from "./calculator";
import { createRoot } from "react-dom/client";
// import animation from "./components/animation";
const container = document.getElementById("calculator");
const root = createRoot(container);
root.render(<Calculator />);
