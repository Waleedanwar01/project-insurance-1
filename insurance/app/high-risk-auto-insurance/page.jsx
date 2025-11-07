import React from 'react'
import HighRiskAutoInsuranceClient from './HighRiskAutoInsuranceClient';
import { API_BASE_URL } from '@/lib/config';

export async function generateMetadata() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/pages/high-risk-auto-insurance/`, {
      next: { revalidate: 600 },
    });
    const page = res.ok ? await res.json() : null;
    const title = page?.meta_title || page?.title || "High-Risk Auto Insurance | Find the Best Coverage for High-Risk Drivers";
    const description = page?.meta_description || "Compare the best high-risk auto insurance companies for drivers with accidents, DUIs, or violations. Learn how to lower your premiums and get affordable coverage today.";
    const keywords = page?.meta_keywords ? page.meta_keywords.split(',').map(k=>k.trim()) : [
      "high-risk auto insurance",
      "SR-22 insurance",
      "car insurance for bad drivers",
      "cheap high-risk car insurance",
      "auto insurance after DUI",
      "insurance for new drivers",
      "high-risk driver insurance quotes",
    ];
    return { title, description, keywords, openGraph: { title, description }, twitter: { title, description } };
  } catch (e) {
    return { title: "High-Risk Auto Insurance | Find the Best Coverage for High-Risk Drivers", description: "Compare the best high-risk auto insurance companies for drivers with accidents, DUIs, or violations. Learn how to lower your premiums and get affordable coverage today." };
  }
}

const HighRiskAutoInsurance = () => {
  return (
    <div>
        
        <HighRiskAutoInsuranceClient />
        </div>
  )
}

export default HighRiskAutoInsurance