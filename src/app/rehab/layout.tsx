"use client"
import React, {ReactNode} from "react";
import NavBar from "@/components/layout/NavBar";
import {ReduxProvider} from "@/redux/provider";
import {ApiProvider} from "@reduxjs/toolkit/query/react";
import {rehabApi} from "@/redux/features/rehab/rehab-slice";
import {SnackbarProvider} from "notistack";

export default function RehabLayout({children}:{children:ReactNode}){
    return (
        <section>
            <ApiProvider api={rehabApi}>
              <ReduxProvider>
                <SnackbarProvider>
                  <div className="flex flex-col sm:flex-row">
                    <div className="w-full bg-gray-100 sm:h-screen">
                      <NavBar />
                      <div>{children}</div>
                      {/*<Footer />*/}
                    </div>
                  </div>
                </SnackbarProvider>
              </ReduxProvider>
            </ApiProvider>
        </section>
    )
}