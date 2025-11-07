import React from 'react'
import InsuranceCompanyReviewsClient from './InsuranceCompanyReviewsClient'
import { API_BASE_URL } from '@/lib/config';

export async function generateMetadata() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/pages/insurance-company-reviews/`, { next: { revalidate: 600 } });
    const page = res.ok ? await res.json() : null;
    const title = page?.meta_title || page?.title || "Insurance Company Reviews 2025 | Honest Ratings & Comparisons";
    const description = page?.meta_description || "Explore unbiased reviews of top auto insurance companies in 2025. Compare customer satisfaction, pricing, coverage options, and financial strength ratings.";
    const keywords = page?.meta_keywords ? page.meta_keywords.split(',').map(k=>k.trim()) : ["insurance company reviews","auto insurance ratings","best car insurance companies 2025","insurance comparison","customer satisfaction insurance"];
    return { title, description, keywords };
  } catch (e) {
    return { title: "Insurance Company Reviews 2025 | Honest Ratings & Comparisons", description: "Explore unbiased reviews of top auto insurance companies in 2025. Compare customer satisfaction, pricing, coverage options, and financial strength ratings." };
  }
}

const InusranceCompanyReviews = () => {
  return (
    <div>

        <InsuranceCompanyReviewsClient />
    </div>
  )
}

export default InusranceCompanyReviews