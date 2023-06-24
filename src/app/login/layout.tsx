import React from "react";
import {ReduxProvider} from "@/redux/provider";
export default function LoginLayout(
    {
      children
    }:{
      children:React.ReactNode
    }){
  return (
      <section>
          <ReduxProvider>
              {children}
          </ReduxProvider>
      </section>
  )
}