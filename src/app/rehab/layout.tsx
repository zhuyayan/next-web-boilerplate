"use client"
import React from "react";
import NavBar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";
import {ReduxProvider} from "@/redux/provider";
import {ApiProvider} from "@reduxjs/toolkit/query/react";
import {rehabApi} from "@/redux/features/rehab/rehab-slice";
import FullScreenContainer from "@/components/layout/FullScreen";

export default function RehabLayout({children}:{children:React.ReactNode}){
    return (
        <section>
            <ApiProvider api={rehabApi}>
            <ReduxProvider>
              <FullScreenContainer>
                <div className="flex flex-col sm:flex-row">
                  <div className="w-full bg-gray-100 sm:h-screen">
                    <NavBar />
                    <div>{children}</div>
                    <Footer />
                  </div>
                </div>
              </FullScreenContainer>
            </ReduxProvider>
            </ApiProvider>
        </section>
    )
}