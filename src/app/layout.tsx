import type { Metadata } from "next";
import { getFaqEnglish } from "@/lib/faq";
import "./globals.css";

const SITE_URL = "https://renoise.ai/showcase";
const TITLE = "Awesome Seedance 2.5 Prompts – The Largest AI Video Prompt Library | Renoise";
const DESCRIPTION =
  "500+ community-contributed Seedance 2.5 video generation prompts with playable previews. Covering text-to-video, image-to-video, character animation, style transfer, and more. Updated daily. Free to use.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  metadataBase: new URL("https://renoise.ai"),
  alternates: {
    canonical: SITE_URL,
  },
  keywords: [
    "Seedance 2.5",
    "Seedance prompts",
    "AI video generation",
    "AI video prompts",
    "text to video",
    "image to video",
    "video generation prompts",
    "Seedance 2.5 prompts library",
    "ByteDance Seedance",
    "AI video creator",
    "free video prompts",
    "video AI prompt examples",
    "Seedance tutorial",
    "AI filmmaking prompts",
    "Seedance 2.5 vs Nanobanana 2",
    "Nanobanana 2 Gemini 3.1 Flash",
    "Seedance 2.5 vs Kling",
    "Seedance 2.5 vs Runway",
    "Seedance 2.5 vs Sora",
    "AI video model comparison",
  ],
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: "Renoise",
    type: "website",
    locale: "en_US",
    alternateLocale: ["zh_CN", "ja_JP", "pt_BR", "es_ES"],
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Awesome Seedance 2.5 Prompts – AI Video Prompt Library by Renoise",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Awesome Seedance 2.5 Prompts – 500+ Free AI Video Prompts",
    description:
      "The most comprehensive Seedance 2.5 prompt collection. Community-contributed, daily updated, with playable video previews.",
    site: "@RenoiseAI",
    images: ["/og-image.png"],
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
};

function JsonLd() {
  const collectionPage = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Awesome Seedance 2.5 Prompts",
    description: DESCRIPTION,
    url: SITE_URL,
    publisher: {
      "@type": "Organization",
      name: "Renoise",
      url: "https://renoise.ai",
    },
    about: {
      "@type": "SoftwareApplication",
      name: "Seedance 2.5",
      applicationCategory: "MultimediaApplication",
      operatingSystem: "Web",
    },
    isPartOf: {
      "@type": "WebSite",
      name: "Renoise",
      url: "https://renoise.ai",
    },
    inLanguage: ["en", "zh-CN", "ja", "pt-BR", "es"],
    dateModified: new Date().toISOString().split("T")[0],
  };

  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: getFaqEnglish().map((item) => ({
      "@type": "Question" as const,
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer" as const,
        text: item.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPage) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPage) }}
      />
    </>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <JsonLd />
      </head>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
