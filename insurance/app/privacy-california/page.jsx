import React from 'react'
import CaliforniaClient from './CaliforniaClient'
export const metadata = {
  title: "California Auto Insurance Privacy | YourAutoQuotes",
  description:
    "Compare affordable auto insurance quotes in California. Find top-rated providers, explore coverage options, and save money with YourAutoQuotes today.",
  openGraph: {
    title: "California Auto Insurance Quotes | YourAutoQuotes",
    description:
      "Get the best car insurance rates in California. Compare quotes from trusted insurers and find affordable coverage that fits your needs.",
    url: "https://yourautoquotes.com/california-auto-insurance",
    siteName: "YourAutoQuotes",
    images: [
      {
        url: "/images/california-auto-insurance.jpg",
        width: 1200,
        height: 630,
        alt: "California Auto Insurance - YourAutoQuotes",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "California Auto Insurance Quotes | YourAutoQuotes",
    description:
      "Find affordable car insurance in California with YourAutoQuotes. Compare rates and save on your next policy today.",
    images: ["/images/california-auto-insurance.jpg"],
  },
};

const CaliforniaPage = () => {
  return (
    <div>
        <CaliforniaClient />
        </div>
  )
}

export default CaliforniaPage