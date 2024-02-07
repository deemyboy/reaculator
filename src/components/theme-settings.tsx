import React, { useContext } from "react";
import { Grid } from "@mui/material";
import { Setting } from "./setting";
import { SettingsDataContext, useSettings } from "../utils/context";
import {
  SETTINGS_CLASS_NAME,
  SETTINGS_ID,
  SETTINGS_META_NAME,
} from "constants/constants";

const ThemeSettings = () => {
  const { keyboardsData: keyboardData } = useSettings();

  return (
    <Grid
      id={SETTINGS_ID}
      container
      className={SETTINGS_CLASS_NAME}
      meta-name={SETTINGS_META_NAME}
    >
      {keyboardData.map((keyboardName: string, index: number) => {
        return <Setting key={index} keyboardName={keyboardName} />;
      })}
    </Grid>
  );
};
export default ThemeSettings;
