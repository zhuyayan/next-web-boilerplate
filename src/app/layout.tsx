import './globals.css'
import React from "react";
import {Metadata} from "next";
import {ReduxProvider} from "@/redux/provider";
import MCTThemeProvider from "@/components/provider/MCTThemeProvider";
import MCTApiProvider from "@/components/provider/MCTApiProvider";
import MCTSnackbarProvider from "@/components/provider/MCTSnackbarProvider";

export const metadata: Metadata = {
  title: '卒中康复',
  description: '卒中康复系统',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
      <ReduxProvider>
        <MCTThemeProvider>
          <MCTApiProvider>
              <MCTSnackbarProvider>
                {children}
              </MCTSnackbarProvider>
          </MCTApiProvider>
        </MCTThemeProvider>
      </ReduxProvider>
      </body>
    </html>
  )
}
