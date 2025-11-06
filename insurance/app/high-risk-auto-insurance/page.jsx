import React from 'react'
import HighRiskAutoInsuranceClient from './HighRiskAutoInsuranceClient';
import { SITE_URL, SITE_NAME } from '@/lib/config';
export const metadata = {
  title: "High-Risk Auto Insurance | Find the Best Coverage for High-Risk Drivers",
  description:
    "Compare the best high-risk auto insurance companies for drivers with accidents, DUIs, or violations. Learn how to lower your premiums and get affordable coverage today.",
  keywords: [
    "high-risk auto insurance",
    "SR-22 insurance",
    "car insurance for bad drivers",
    "cheap high-risk car insurance",
    "auto insurance after DUI",
    "insurance for new drivers",
    "high-risk driver insurance quotes",
  ],
  openGraph: {
    title: "High-Risk Auto Insurance | Affordable Coverage for High-Risk Drivers",
    description:
      "Get the best high-risk auto insurance quotes. Find coverage even with DUIs, traffic violations, or lapses in coverage.",
    url: SITE_URL ? `${SITE_URL}/high-risk-auto-insurance` : undefined,
    type: "website",
    images: [
      {
        url: SITE_URL ? `${SITE_URL}/images/high-risk-auto-insurance.jpg` : "/images/high-risk-auto-insurance.jpg",
        width: 1200,
        height: 630,
        alt: "High-Risk Auto Insurance",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "High-Risk Auto Insurance | Affordable Coverage for High-Risk Drivers",
    description:
      "Compare quotes and save on high-risk auto insurance. Perfect for drivers with DUIs or violations.",
    images: [SITE_URL ? `${SITE_URL}/images/high-risk-auto-insurance.jpg` : "/images/high-risk-auto-insurance.jpg"],
  },
};

const HighRiskAutoInsurance = () => {
  return (
    <div>
        
        <HighRiskAutoInsuranceClient />
        </div>
  )
}

export default HighRiskAutoInsurance