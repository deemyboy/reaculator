import React from "react";
import Calculator from "./calculator";
import { createRoot } from "react-dom/client";
import { CookiesProvider } from "react-cookie";

const container = document.getElementById("calculator");
const root = createRoot(container);
root.render(
    <CookiesProvider>
        <Calculator />
    </CookiesProvider>
);
