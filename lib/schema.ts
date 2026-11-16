import type { Project } from "./projects";

export const SITE_URL = "https://devxstudio.agency";
export const BRAND_NAME = "DevXStudio";

export function getOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "ProfessionalService"],
    "@id": `${SITE_URL}/#organization`,
    name: BRAND_NAME,
    alternateName: ["DevX Studio", "DevXStudio Wix Agency"],
    url: SITE_URL,
    logo: `${SITE_URL}/devx-symbol.png`,
    image: `${SITE_URL}/devx-wordmark.png`,
    email: "contact@devxstudio.agency",
    description:
      "DevXStudio is a premier Wix Studio agency and Wix development partner specializing in custom Wix Studio website design, advanced Velo code development, and high-converting website redesigns.",
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      addressCountry: "US",
    },
    areaServed: {
      "@type": "Country",
      name: "Worldwide",
    },
    sameAs: [
      "https://www.wix.com/studio/community/partners/devx-studio",
    ],
    knowsAbout: [
      "Wix Studio",
      "Wix Agency",
      "Wix Studio Agency",
      "Wix Development",
      "Wix Velo",
      "Velo by Wix",
      "Wix Website Design",
      "Wix Website Redesign",
      "Hire Wix Developer",
      "Wix E-commerce",
      "Wix CMS Architecture",
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Wix Agency & Development Services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Wix Studio Website Design & Development",
            description:
              "Custom, responsive Wix Studio layouts, interactions, animations, and bespoke brand experiences.",
            provider: { "@id": `${SITE_URL}/#organization` },
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Wix Velo Development & Custom APIs",
            description:
              "Advanced Velo coding, custom database collections, backend API integrations, dynamic pages, and complex business logic.",
            provider: { "@id": `${SITE_URL}/#organization` },
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Wix Website Redesign",
            description:
              "Strategic modernization of outdated Wix or external websites into modern, high-converting Wix Studio experiences.",
            provider: { "@id": `${SITE_URL}/#organization` },
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Hire Wix Developer / Wix Studio Team",
            description:
              "Dedicated senior Wix Studio and Velo developers for design agencies, startups, and growing enterprises.",
            provider: { "@id": `${SITE_URL}/#organization` },
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Wix E-commerce Development",
            description:
              "Scalable e-commerce stores with custom checkout flows, payment gateways, product variations, and inventory integrations.",
            provider: { "@id": `${SITE_URL}/#organization` },
          },
        },
      ],
    },
  };
}

export function getWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: BRAND_NAME,
    description:
      "DevXStudio is an elite Wix Studio agency and Wix development partner crafting responsive digital experiences and custom Velo web applications.",
    publisher: {
      "@id": `${SITE_URL}/#organization`,
    },
    inLanguage: "en-US",
  };
}

export function getBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${SITE_URL}${item.url}`,
    })),
  };
}

export function getProjectCaseStudySchema(project: Project) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "@id": `${SITE_URL}/work/${project.slug}/#case-study`,
    url: `${SITE_URL}/work/${project.slug}`,
    name: `${project.name} — Wix Studio Case Study`,
    headline: project.headline,
    description: project.desc,
    image: project.screenshot ? `${SITE_URL}${project.screenshot}` : undefined,
    author: {
      "@id": `${SITE_URL}/#organization`,
    },
    creator: {
      "@id": `${SITE_URL}/#organization`,
    },
    publisher: {
      "@id": `${SITE_URL}/#organization`,
    },
    genre: project.type,
    keywords: [
      project.type,
      "Wix Studio",
      "Wix Website Design",
      "Wix Development",
      "Case Study",
      project.tag,
    ].join(", "),
    about: {
      "@type": "Thing",
      name: project.name,
      description: project.overview,
    },
  };
}

