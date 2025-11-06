import React from 'react'
import InsuranceGuideClient from './InsuranceGuideClient'
export const metadata = {
  title: "Auto Insurance Guide | Learn How Car Insurance Works",
  description:
    "Understand everything about auto insurance with our complete guide. Learn about coverage types, policy options, and tips to save on your car insurance.",
  openGraph: {
    title: "Auto Insurance Guide | Learn How Car Insurance Works",
    description:
      "Explore our comprehensive auto insurance guide. Learn about liability, collision, comprehensive coverage, and how to choose the right car insurance policy.",
    url: "https://yourautoquotes.com/insurance-guide",
    siteName: "YourAutoQuotes",
    images: [
      {
        url: "/images/insurance-guide-cover.jpg",
        width: 1200,
        height: 630,
        alt: "Auto Insurance Guide - YourAutoQuotes",
      },
    ],
    locale: "en_US",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Auto Insurance Guide | Learn How Car Insurance Works",
    description:
      "Get expert insights into car insurance. Our guide explains coverage options, terms, and how to find affordable auto insurance.",
    images: ["/images/insurance-guide-cover.jpg"],
  },
};

const InsuranceGuide = () => {
  return (
    <div>
        <InsuranceGuideClient />
    </div>
  )
}

export default InsuranceGuide