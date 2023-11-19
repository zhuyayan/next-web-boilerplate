"use client"
import React from "react";
import NavBar from "@/components/layout/NavBar";

export default function DashboardLayout({children}:{children:React.ReactNode}){
    return (
        <section>
            <div className="flex flex-col sm:flex-row">
                {/*<div className="hidden sm:block w-[210px] bg-gray-200 sm:h-screen">*/}
                {/*    <SideBar />*/}
                {/*</div>*/}
                <div className="w-full bg-gray-100 sm:h-screen">
                    <NavBar />
                    <div>{children}</div>
                </div>
            </div>
        </section>
    )
}