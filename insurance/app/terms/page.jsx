import React from 'react'
import TermsClient from './TermsClient';
export const metadata = {
  title: "Terms and Conditions | YourAutoQuotes",
  description:
    "Review the Terms and Conditions of YourAutoQuotes to understand your rights, obligations, and our policies regarding the use of our services and website.",
  openGraph: {
    title: "Terms and Conditions | YourAutoQuotes",
    description:
      "Read the Terms and Conditions of YourAutoQuotes to learn about user responsibilities, service usage, and legal disclaimers.",
    url: "https://yourautoquotes.com/terms-and-conditions",
    siteName: "YourAutoQuotes",
    images: [
      {
        url: "/images/terms-conditions-banner.jpg",
        width: 1200,
        height: 630,
        alt: "Terms and Conditions - YourAutoQuotes",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms and Conditions | YourAutoQuotes",
    description:
      "Understand the rules and policies for using YourAutoQuotes services by reviewing our Terms and Conditions.",
    images: ["/images/terms-conditions-banner.jpg"],
  },
};

const TermsPage = () => {
  return (
    <div>
        
        <TermsClient />
        </div>
  )
}

export default TermsPage