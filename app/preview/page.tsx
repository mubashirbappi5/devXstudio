import type { Metadata } from "next";
import { SitePage } from "../page";

export const metadata: Metadata = {
  title: "Preview Mode | DevXStudio",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function PreviewPage() {
  return <SitePage preview />;
}
