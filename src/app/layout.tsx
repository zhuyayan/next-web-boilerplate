import './globals.css'
import { Inter } from 'next/font/google'
import React from "react";
import {Metadata} from "next";

const inter = Inter({ subsets: ['latin'] })

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
      <body className={inter.className}>{children}</body>
    </html>
  )
}
