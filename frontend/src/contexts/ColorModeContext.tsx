import { createContext } from "react";
import { PaletteMode } from "@mui/material";

// Define the theme context and color mode
export type ColorMode = {
  toggleColorMode: () => void;
  mode: PaletteMode;
};

export const ColorModeContext = createContext<ColorMode>({
  toggleColorMode: () => {},
  mode: "light",
});
