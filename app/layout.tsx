import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { CustomCursor } from "@/components/custom-cursor";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export const metadata: Metadata = { title: "DevXStudio — Wix Studio Design & Development Agency", description: "Premium Wix Studio design, Velo development and conversion-focused digital experiences for businesses worldwide.", icons: { icon: "/devx-symbol.png", shortcut: "/devx-symbol.png" } };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body className={geistSans.variable}><CustomCursor />{children}</body></html>; }
