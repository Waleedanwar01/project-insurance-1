import React from "react";
import StatesClient from "./StatesClient";
import { SITE_URL, SITE_NAME } from "@/lib/config";

// ✅ Page Metadata
export const metadata = {
  title: "Car Insurance by State | Compare Auto Insurance Rates Near You",
  description:
    "Find car insurance rates, coverage laws, and top insurers in your state. Compare quotes and learn about minimum coverage requirements across the U.S.",
  keywords: [
    "car insurance by state",
    "auto insurance rates USA",
    "state insurance laws",
    "minimum car insurance requirements",
    "insurance panda states",
    "compare state insurance",
    "car insurance quotes by location",
  ],
  openGraph: {
    title: "Car Insurance by State | Compare Auto Insurance Rates Near You",
    description:
      "Discover the best car insurance options and laws in your state. Compare rates and coverage to save money on auto insurance with Insurance Panda.",
    url: SITE_URL ? `${SITE_URL}/states` : undefined,
    siteName: SITE_NAME,
    images: [
      {
        url: "/images/states-banner.jpg", // optional image
        width: 1200,
        height: 630,
        alt: "Car Insurance by State Map",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Car Insurance by State | Compare Auto Insurance Rates Near You",
    description:
      "Explore state-by-state car insurance guides. Learn about requirements, coverage options, and top providers in your region.",
    images: ["/images/states-banner.jpg"], // optional
  },
};

const StatesPage = () => {
  return (
    <div>
      <StatesClient />
    </div>
  );
};

export default StatesPage;
