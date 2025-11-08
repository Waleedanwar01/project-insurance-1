import React from 'react'
import AutoInsuranceTypeClient from './AutoInsuranceTypeClient';
import { API_BASE_URL } from '@/lib/config';

export async function generateMetadata() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/pages/auto-insurance-types/`, { next: { revalidate: 600 } });
    const page = res.ok ? await res.json() : null;
    const title = page?.meta_title || page?.title || "Types of Auto Insurance Coverage";
    const description = page?.meta_description || "Explore the different types of auto insurance coverage including liability, collision, comprehensive, uninsured motorist, and more. Learn how each coverage type protects you and your vehicle.";
    const keywords = page?.meta_keywords ? page.meta_keywords.split(',').map(k=>k.trim()) : undefined;
    return { title, description, keywords, openGraph: { title, description }, twitter: { title, description } };
  } catch (e) {
    return { title: "Types of Auto Insurance Coverage", description: "Explore the different types of auto insurance coverage including liability, collision, comprehensive, uninsured motorist, and more. Learn how each coverage type protects you and your vehicle." };
  }
}

const AutoInsuranceTypes = () => {
  return (
    <div>
        
        <AutoInsuranceTypeClient />
        
        </div>
  )
}

export default AutoInsuranceTypes