'use client';
import React from "react";
import {rehabApi} from "@/redux/features/rehab/rehab-slice";
import {ApiProvider} from "@reduxjs/toolkit/query/react";

export default function MCTApiProvider({children}:{children:React.ReactNode}){
    return(
        <ApiProvider api={rehabApi}>
            {children}
        </ApiProvider>
    )
}