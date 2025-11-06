import React from "react";
import CarInsuranceQuotesClient from "./CarInsuranceQuotesClient";
import { SITE_URL, SITE_NAME } from "@/lib/config";

// ✅ Page Metadata
export const metadata = {
  title: "Car Insurance Quotes | Compare & Save Online",
  description:
    "Get instant car insurance quotes from top providers. Compare plans, save money, and find the best auto insurance coverage for your needs.",
  keywords: [
    "car insurance quotes",
    "auto insurance",
    "compare car insurance",
    "cheap car insurance",
    "vehicle insurance",
  ],
  openGraph: {
    title: "Car Insurance Quotes | Compare & Save Online",
    description:
      "Compare car insurance quotes from multiple providers and find the best policy for your budget.",
    url: SITE_URL ? `${SITE_URL}/car-insurance-quotes` : undefined,
    siteName: SITE_NAME,
    images: [
      {
        url: "/images/car-insurance-banner.jpg", // optional: adjust your image path
        width: 1200,
        height: 630,
        alt: "Car Insurance Comparison",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

const CarInsuranceQuotes = () => {
  return (
    <div>
      <CarInsuranceQuotesClient />
    </div>
  );
};

export default CarInsuranceQuotes;
