import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Thunder Do - Modern Task Management",
  description: "A powerful and intuitive task management app built with Next.js and Tailwind CSS",
  keywords: "todo, task management, productivity, next.js, tailwind css",
  authors: [{ name: "Thunder Do Team" }]
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900">{children}</body>
    </html>
  )
}
