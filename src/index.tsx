import React from "react";
import Calculator from "./calculator.tsx";
import { createRoot } from "react-dom/client";
import { CookiesProvider } from "react-cookie";

const container = document.getElementById("calculator") as Element;
const root = createRoot(container);
root.render(
    <CookiesProvider>
        <Calculator />
    </CookiesProvider>
);
