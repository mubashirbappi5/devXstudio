import type { Metadata } from "next";
import { WorkView } from "@/components/work-view";
import { getBreadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Wix Studio Portfolio & Case Studies | DevXStudio",
  description:
    "Explore DevXStudio's selected Wix Studio, Velo, and custom web development case studies across e-commerce, healthcare, finance, and SaaS brands worldwide.",
  alternates: {
    canonical: "https://devxstudio.agency/work",
  },
  openGraph: {
    title: "Wix Studio Portfolio & Case Studies | DevXStudio",
    description:
      "Explore DevXStudio's selected Wix Studio, Velo, and custom web development case studies across e-commerce, healthcare, finance, and SaaS brands worldwide.",
    url: "https://devxstudio.agency/work",
    type: "website",
    images: [
      {
        url: "/devx-wordmark.png",
        width: 1200,
        height: 630,
        alt: "DevXStudio — Selected Wix Studio Portfolio & Case Studies",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Wix Studio Portfolio & Case Studies | DevXStudio",
    description:
      "Explore DevXStudio's selected Wix Studio, Velo, and custom web development case studies.",
    images: ["/devx-wordmark.png"],
  },
};

export default function WorkPage() {
  const breadcrumbs = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Our Work", url: "/work" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbs),
        }}
      />
      <WorkView />
    </>
  );
}
