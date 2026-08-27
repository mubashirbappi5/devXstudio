import type { Metadata } from "next";
import { Inter_Tight } from "next/font/google";
import "./globals.css";

const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-inter-tight",
});

export const metadata: Metadata = { title: "DevXStudio — Wix Studio Design & Development Agency", description: "Premium Wix Studio design, Velo development and conversion-focused digital experiences for businesses worldwide.", icons: { icon: "/devx-symbol.png", shortcut: "/devx-symbol.png" } };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body className={interTight.variable}>{children}</body></html>; }
