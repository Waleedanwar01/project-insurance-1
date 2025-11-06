import React from "react";
import AboutClient from "./AboutClient"; // Adjust path as needed
import { SITE_URL, SITE_NAME } from "@/lib/config";

// ✅ Page Metadata
export const metadata = {
  title: "About Us | Insurance Panda",
  description:
    "Learn more about Insurance Panda — our mission, values, and how we help customers find affordable auto insurance quotes quickly and easily.",
  keywords: [
    "about insurance panda",
    "insurance company information",
    "auto insurance help",
    "car insurance guide",
    "affordable car insurance",
  ],
  openGraph: {
    title: "About Insurance Panda",
    description:
      "Discover who we are and how Insurance Panda helps you compare and save on car insurance quotes across top providers.",
    url: SITE_URL ? `${SITE_URL}/about` : undefined,
    siteName: SITE_NAME,
    images: [
      {
        url: "/images/about-banner.jpg", // Optional - update path to your actual image
        width: 1200,
        height: 630,
        alt: "About Insurance Panda",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

const About = () => {
  return (
    <div>
      <AboutClient />
    </div>
  );
};

export default About;
