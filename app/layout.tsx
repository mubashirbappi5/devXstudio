import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { CustomCursor } from "@/components/custom-cursor";
import { getOrganizationSchema, getWebsiteSchema } from "@/lib/schema";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export const viewport: Viewport = {
  themeColor: "#08090a",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://devxstudio.agency"),
  title: {
    default: "DevXStudio — Wix Studio Agency | Hire Expert Wix & Velo Developers",
    template: "%s | DevXStudio",
  },
  description:
    "DevXStudio is a premier Wix Studio agency and Wix development partner. We craft custom Wix Studio websites, advanced Velo code solutions, e-commerce stores, and high-converting website redesigns for ambitious brands worldwide.",
  applicationName: "DevXStudio",
  authors: [{ name: "DevXStudio", url: "https://devxstudio.agency" }],
  generator: "Next.js",
  keywords: [
    "Wix Agency",
    "Wix Development Agency",
    "Wix Studio Agency",
    "Wix Studio Developer",
    "Wix Velo Developer",
    "Wix Website Design",
    "Wix Website Redesign",
    "Hire Wix Developer",
    "Velo by Wix",
    "Wix Studio Partner",
    "Custom Wix Development",
    "Wix CMS",
  ],
  referrer: "origin-when-cross-origin",
  creator: "DevXStudio",
  publisher: "DevXStudio",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "https://devxstudio.agency/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://devxstudio.agency",
    siteName: "DevXStudio",
    title: "DevXStudio — Wix Studio Agency | Hire Expert Wix & Velo Developers",
    description:
      "Premier Wix Studio agency and Wix development partner. Custom Wix Studio designs, advanced Velo code, e-commerce, and high-impact website redesigns.",
    images: [
      {
        url: "/devx-wordmark.png",
        width: 1200,
        height: 630,
        alt: "DevXStudio — Wix Studio Design and Development Agency",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DevXStudio — Wix Studio Agency | Hire Expert Wix & Velo Developers",
    description:
      "Premier Wix Studio agency and Wix development partner. Custom Wix Studio designs, advanced Velo code, and website redesigns.",
    images: ["/devx-wordmark.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/devx-symbol.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/devx-symbol.png",
    apple: "/devx-symbol.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationSchema = getOrganizationSchema();
  const websiteSchema = getWebsiteSchema();

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />
      </head>
      <body className={geistSans.variable}>
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
