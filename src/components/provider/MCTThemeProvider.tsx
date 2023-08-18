'use client';
import React from "react";
import {ThemeProvider} from "styled-components";

const theme = {
  colors: {
    primary: "#0070f3",
  },
};

export default function MCTThemeProvider({children}:{children:React.ReactNode}) {
  return (
      <ThemeProvider theme={theme}>
        {children}
      </ThemeProvider>
  )
}