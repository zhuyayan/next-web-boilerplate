import React from "react";
import NavBar from "@/components/layout/NavBar";
import SideBar from "@/components/layout/SideBar";
import {ReduxProvider} from "@/redux/provider";

export default function DashboardLayout({children}:{children:React.ReactNode}){
    return (
        <section>
            <ReduxProvider>
                <div className="flex">
                    <div className="w-full">
                        <NavBar />
                        <div className="flex">
                            <SideBar />
                            <div className="flex-grow">{children}</div>
                        </div>
                    </div>
                </div>
            </ReduxProvider>
        </section>
    )
}