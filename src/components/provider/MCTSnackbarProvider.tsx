'use client';
import React from "react";
import {SnackbarProvider} from "notistack";

export default function MCTSnackbarProvider({children}:{children:React.ReactNode}){
  return(
      <SnackbarProvider>
        {children}
      </SnackbarProvider>
  )
}