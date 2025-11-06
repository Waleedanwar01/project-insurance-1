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
    return {
      title: `${company.name} Review | Insurance Panda`,
      description: company.description || `Read the review of ${company.name}.`,
      openGraph: {
        title: `${company.name} Review`,
        description: company.description || "",
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