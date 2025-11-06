import React from "react";
import HomeClient from "./HomeClient";
import { SITE_URL, SITE_NAME } from "@/lib/config";

// ✅ Page Metadata
export const metadata = {
  title: "Affordable Car Insurance Quotes | Insurance Panda",
  description:
    "Compare affordable car insurance quotes from top providers. Insurance Panda helps you save money by finding the best auto insurance coverage tailored to your needs.",
  keywords: [
    "car insurance quotes",
    "cheap auto insurance",
    "compare car insurance",
    "insurance panda",
    "affordable car insurance",
    "vehicle coverage",
  ],
  openGraph: {
    title: "Affordable Car Insurance Quotes | Insurance Panda",
    description:
      "Get affordable car insurance quotes instantly. Insurance Panda helps you compare policies and save on your auto insurance today.",
    url: SITE_URL ? `${SITE_URL}/` : undefined,
    siteName: SITE_NAME,
    images: [
      {
        url: "/images/home-banner.jpg", // optional – replace with your homepage image
        width: 1200,
        height: 630,
        alt: "Affordable Car Insurance Quotes",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Affordable Car Insurance Quotes | Insurance Panda",
    description:
      "Compare car insurance quotes and save with Insurance Panda — the easiest way to find affordable auto coverage online.",
    images: ["/images/home-banner.jpg"], // optional
  },
};

const HomeClientPage = () => {
  return (
    <div>
      <HomeClient />
    </div>
  );
};

export default HomeClientPage;
