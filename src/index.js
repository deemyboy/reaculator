import React from "react";
import Calculator from "./calculator";
import { createRoot } from "react-dom/client";
// import anim from "./components/anim";
const container = document.getElementById("calculator");
const root = createRoot(container);
root.render(<Calculator />);
