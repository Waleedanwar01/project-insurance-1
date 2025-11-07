import React from "react";
import CompanyReviewDetailClient from "./CompanyReviewDetailClient";
import { API_BASE_URL } from "@/lib/config";

export async function generateMetadata({ params }) {
  const slug = params?.slug;
  if (!slug) return { title: "Company Review" };
  try {
    const res = await fetch(`${API_BASE_URL}/api/company/insurers/${slug}/`, { next: { revalidate: 1800 } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const company = await res.json();
    const review = company.reviews?.[0];
    const baseTitle = company.name ? `${company.name} Review` : (review?.title || slug);
    const title = (review?.meta_title || baseTitle) + " | Insurance Panda";
    const description = review?.meta_description || company.description || `Read the review of ${company.name}.`;
    const keywords = review?.meta_keywords ? review.meta_keywords.split(',').map(k => k.trim()).filter(Boolean) : undefined;
    return {
      title,
      description,
      keywords,
      openGraph: {
        title: baseTitle,
        description,
        images: company.logo ? [{ url: company.logo }] : [],
      },
    };
  } catch {
    return { title: `${slug} Review | Insurance Panda` };
  }
}

export default function CompanyReviewDetail({ params }) {
  return <CompanyReviewDetailClient params={params} />;
}