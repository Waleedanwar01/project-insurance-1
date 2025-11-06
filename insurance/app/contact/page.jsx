import React from "react";
import ContactClient from "./ContactClient";
import { SITE_URL, SITE_NAME } from "@/lib/config";

// ✅ Page Metadata
export const metadata = {
  title: "Contact Us | Insurance Panda",
  description:
    "Have questions or need support? Contact Insurance Panda for car insurance quotes, expert advice, and customer assistance. We're here to help you save on auto insurance.",
  keywords: [
    "contact insurance panda",
    "customer support",
    "insurance quotes help",
    "auto insurance contact",
    "get in touch insurance panda",
  ],
  openGraph: {
    title: "Contact Insurance Panda",
    description:
      "Get in touch with Insurance Panda for quick insurance quotes, customer assistance, or expert advice. We're always happy to help.",
    url: SITE_URL ? `${SITE_URL}/contact` : undefined,
    siteName: SITE_NAME,
    images: [
      {
        url: "/images/contact-banner.jpg", // optional - use your actual image
        width: 1200,
        height: 630,
        alt: "Contact Insurance Panda",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Insurance Panda",
    description:
      "Need help or a quick car insurance quote? Contact Insurance Panda for expert support and personalized guidance.",
    images: ["/images/contact-banner.jpg"], // optional
  },
};

const Contact = () => {
  return (
    <div>
      <ContactClient />
    </div>
  );
};

export default Contact;
