import type { Metadata } from "next";
import { InnerHeader } from "@/components/inner-header";
import { SiteFooter } from "@/components/site-footer";
import { CalculatorWizard } from "@/components/calculator/calculator-wizard";
import { getCalculatorConfig } from "@/lib/calculator/storage";

export const metadata: Metadata = {
  title: "Wix Website Cost Calculator | Estimate Your Project Price – DevX Agency",
  description:
    "Calculate realistic website development costs for Wix Studio, Wix Editor, and mobile apps. Get instant dynamic pricing estimates based on pages, custom features, and design complexity.",
  alternates: {
    canonical: "https://devxstudio.agency/website-cost-calculator",
  },
  openGraph: {
    title: "Wix Website Cost Calculator | DevX Agency",
    description:
      "Estimate your Wix Studio & Velo website development budget in seconds. Real-time pricing calculator for modern businesses.",
    url: "https://devxstudio.agency/website-cost-calculator",
    siteName: "DevXStudio",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "https://devxstudio.agency/devx-opengraph.png",
        width: 1200,
        height: 630,
        alt: "DevX Agency Wix Website Cost Calculator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Wix Website Cost Calculator | DevX Agency",
    description:
      "Calculate your Wix website development investment dynamically. Transparent pricing based on official partner baseline rates.",
    images: ["https://devxstudio.agency/devx-opengraph.png"],
  },
};

export default async function WebsiteCostCalculatorPage() {
  const { services, features, settings } = await getCalculatorConfig();

  const calculatorSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://devxstudio.agency/website-cost-calculator#webpage",
        url: "https://devxstudio.agency/website-cost-calculator",
        name: "Wix Website Cost Calculator | DevX Agency",
        description:
          "Calculate realistic website development costs for Wix Studio, Wix Editor, and mobile apps.",
        isPartOf: {
          "@type": "WebSite",
          "@id": "https://devxstudio.agency/#website",
          name: "DevXStudio",
          url: "https://devxstudio.agency/",
        },
        inLanguage: "en-US",
      },
      {
        "@type": "SoftwareApplication",
        "@id": "https://devxstudio.agency/website-cost-calculator#app",
        name: "DevXStudio Wix Website Cost Calculator",
        applicationCategory: "BusinessApplication",
        operatingSystem: "All",
        url: "https://devxstudio.agency/website-cost-calculator",
        offers: {
          "@type": "AggregateOffer",
          priceCurrency: "USD",
          lowPrice: "150",
          highPrice: "5000",
          offerCount: "5",
        },
        provider: {
          "@type": "Organization",
          "@id": "https://devxstudio.agency/#organization",
          name: "DevXStudio",
          url: "https://devxstudio.agency/",
        },
      },
    ],
  };

  return (
    <div className="calc-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(calculatorSchema) }}
      />

      <InnerHeader />

      <section className="calc-hero">
        <span className="kicker">Dynamic Project Estimator</span>
        <h1>
          Calculate Your Wix Project <em>Investment</em>
        </h1>
        <p>
          Receive transparent, real-time pricing estimates tailored to your page count, design preference, technical complexity, and custom Velo integrations.
        </p>
      </section>

      <main>
        <CalculatorWizard
          initialServices={services}
          initialFeatures={features}
          pricingSettings={settings}
        />
      </main>

      <div style={{ marginTop: "80px" }}>
        <SiteFooter />
      </div>
    </div>
  );
}
