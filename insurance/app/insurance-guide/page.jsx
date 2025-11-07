import React from 'react'
import InsuranceGuideClient from './InsuranceGuideClient'
import { API_BASE_URL } from '@/lib/config';

export async function generateMetadata() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/pages/insurance-guide/`, { next: { revalidate: 600 } });
    const page = res.ok ? await res.json() : null;
    const title = page?.meta_title || page?.title || "Auto Insurance Guide | Learn How Car Insurance Works";
    const description = page?.meta_description || "Understand everything about auto insurance with our complete guide. Learn about coverage types, policy options, and tips to save on your car insurance.";
    const keywords = page?.meta_keywords ? page.meta_keywords.split(',').map(k=>k.trim()) : undefined;
    return { title, description, keywords, openGraph: { title, description }, twitter: { title, description } };
  } catch (e) {
    return { title: "Auto Insurance Guide | Learn How Car Insurance Works", description: "Understand everything about auto insurance with our complete guide. Learn about coverage types, policy options, and tips to save on your car insurance." };
  }
}

const InsuranceGuide = () => {
  return (
    <div>
        <InsuranceGuideClient />
    </div>
  )
}

export default InsuranceGuide