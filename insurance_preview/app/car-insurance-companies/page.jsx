import React from 'react'
import CarInsuranceCompaniesClient from './CarInsuranceCompaniesClient';
import { API_BASE_URL } from '@/lib/config';

export async function generateMetadata() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/pages/car-insurance-companies/`, { next: { revalidate: 600 } });
    const page = res.ok ? await res.json() : null;
    const title = page?.meta_title || page?.title || "Top Car Insurance Companies in the USA | Compare Auto Insurers";
    const description = page?.meta_description || "Explore the best car insurance companies in the USA. Compare coverage, customer reviews, and rates from top auto insurance providers to find the best policy for you.";
    const keywords = page?.meta_keywords ? page.meta_keywords.split(',').map(k=>k.trim()) : undefined;
    return { title, description, keywords, openGraph: { title, description }, twitter: { title, description } };
  } catch (e) {
    return { title: "Top Car Insurance Companies in the USA | Compare Auto Insurers", description: "Explore the best car insurance companies in the USA. Compare coverage, customer reviews, and rates from top auto insurance providers to find the best policy for you." };
  }
}

const CarInsuranceCompanies = () => {
  return (
    <div>
        <CarInsuranceCompaniesClient />
        </div>
  )
}

export default CarInsuranceCompanies