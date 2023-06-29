"use client"
import React from "react";
import NavBar from "@/components/layout/NavBar";
import {ReduxProvider} from "@/redux/provider";

export default function RehabLayout({children}:{children:React.ReactNode}){
    return (
        <section>
            <ReduxProvider>
                <div className="flex flex-col sm:flex-row">
                    <div className="w-full bg-gray-100 sm:h-screen">
                        <NavBar />
                        <div>{children}</div>
                    </div>
                </div>
            </ReduxProvider>
        </section>
    )
}