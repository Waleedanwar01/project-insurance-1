import React from 'react'
import AutoInsuranceTypeClient from './AutoInsuranceTypeClient';
export const metadata = {
  title: "Types of Auto Insurance Coverage | YourAutoQuotes",
  description:
    "Explore the different types of auto insurance coverage including liability, collision, comprehensive, uninsured motorist, and more. Learn how each coverage type protects you and your vehicle.",
  openGraph: {
    title: "Types of Auto Insurance Coverage | YourAutoQuotes",
    description:
      "Understand the various auto insurance coverage types such as liability, collision, and comprehensive insurance. Find out which protection suits your driving needs best.",
    url: "https://yourautoquotes.com/auto-insurance-types",
    siteName: "YourAutoQuotes",
    images: [
      {
        url: "/images/auto-insurance-types.jpg",
        width: 1200,
        height: 630,
        alt: "Types of Auto Insurance Coverage",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Types of Auto Insurance Coverage | YourAutoQuotes",
    description:
      "Learn about the different auto insurance coverage types and how they protect you financially.",
    images: ["/images/auto-insurance-types.jpg"],
  },
};

const AutoInsuranceTypes = () => {
  return (
    <div>
        
        <AutoInsuranceTypeClient />
        
        </div>
  )
}

export default AutoInsuranceTypes