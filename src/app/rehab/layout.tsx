"use client"
import React, {ReactNode} from "react";
import NavBar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";


export default function RehabLayout({children}:{children:ReactNode}){
  return (
    <section>
      <div className="flex flex-col sm:flex-row">
        <div className="w-full bg-gray-100 sm:h-screen">
          <NavBar />
          <div>{children}</div>
          <Footer style={{ position: 'fixed', bottom: 0, left: 0}} />
        </div>
      </div>
    </section>
  )
}