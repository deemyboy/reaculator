import React, { useState, useEffect } from "react";
import { Grid } from "@mui/material";
import { motion } from "framer-motion";
import Keyboard from "./keyboard";

export const Setting = (keyboardData) => {
    console.log(keyboardData);

    return (
        <motion.div
            className="setting-wrapper"
            initial={{ y: -500, opacity: 0.25, height: 0 }}
            animate={{ height: "auto", opacity: 1, y: 0 }}
            transition={{
                type: "spring",
                duration: 0.5,
                delay: 0.1,
            }}
        >
            <Keyboard {...keyboardData} />
        </motion.div>
    );
};
