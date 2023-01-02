import React from "react";
document.addEventListener("DOMContentLoaded", function (event) {});

export const Canvas = React.forwardRef((props, ref) => {
    return <canvas ref={ref} id={props.id} />;
});
