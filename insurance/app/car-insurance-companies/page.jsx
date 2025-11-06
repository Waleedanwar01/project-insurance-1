import React from 'react'
import CarInsuranceCompaniesClient from './CarInsuranceCompaniesClient';
export const metadata = {
  title: "Top Car Insurance Companies in the USA | Compare Auto Insurers",
  description:
    "Explore the best car insurance companies in the USA. Compare coverage, customer reviews, and rates from top auto insurance providers to find the best policy for you.",
  openGraph: {
    title: "Top Car Insurance Companies in the USA | Compare Auto Insurers",
    description:
      "Discover and compare the leading car insurance companies across the USA. Learn about customer satisfaction, pricing, and available coverage options.",
    url: "https://yourautoquotes.com/car-insurance-companies",
    siteName: "YourAutoQuotes",
    images: [
      {
        url: "/images/car-insurance-companies.jpg",
        width: 1200,
        height: 630,
        alt: "Top Car Insurance Companies - YourAutoQuotes",
      },
    ],
    locale: "en_US",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Top Car Insurance Companies in the USA | Compare Auto Insurers",
    description:
      "Compare the best car insurance providers in America. Find the right company for your budget and coverage needs.",
    images: ["/images/car-insurance-companies.jpg"],
  },
};

const CarInsuranceCompanies = () => {
  return (
    <div>
        <CarInsuranceCompaniesClient />
        </div>
  )
}

export default CarInsuranceCompanies