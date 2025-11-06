import React from 'react'
import PrivacyClient from './PrivacyClient'
export const metadata = {
  title: "Privacy Policy | YourAutoQuotes",
  description:
    "Read the Privacy Policy of YourAutoQuotes to understand how we collect, use, and protect your personal information. We value your privacy and ensure transparency in our data practices.",
  openGraph: {
    title: "Privacy Policy | YourAutoQuotes",
    description:
      "Learn how YourAutoQuotes protects your privacy and handles your data responsibly. Review our policy on information collection, cookies, and data security.",
    url: "https://yourautoquotes.com/privacy-policy",
    siteName: "YourAutoQuotes",
    images: [
      {
        url: "/images/privacy-policy-banner.jpg",
        width: 1200,
        height: 630,
        alt: "Privacy Policy - YourAutoQuotes",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy | YourAutoQuotes",
    description:
      "Understand how YourAutoQuotes collects and protects your personal data in compliance with modern privacy standards.",
    images: ["/images/privacy-policy-banner.jpg"],
  },
};

const PrivacyPolicy = () => {
  return (
    <div>
        <PrivacyClient />
        </div>
  )
}

export default PrivacyPolicy