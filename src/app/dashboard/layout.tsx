import React from "react";
import AppBar from "@/components/layout/AppBar";
import Sidebar from "@/components/layout/SideBar";
import {Provider} from "react-redux";
import store from "@/store/store";
export default function DashboardLayout({children}:{children:React.ReactNode}){
  return (
      <section>
        <Provider store={store}>
          <AppBar />
          <Sidebar />
          {children}
        </Provider>
      </section>
  )
}