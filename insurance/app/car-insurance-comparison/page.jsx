import React from "react";
import CarInsuranceComparisonClient from "./CarInsuranceComparisonClient";
import { API_BASE_URL } from "@/lib/config";

export async function generateMetadata() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/pages/car-insurance-comparison/`, { next: { revalidate: 600 } });
    const page = res.ok ? await res.json() : null;
    const title = page?.meta_title || page?.title || "Car Insurance Comparison | Insurance Blog";
    const description = page?.meta_description || "Compare car insurance articles and guides.";
    const keywords = page?.meta_keywords ? page.meta_keywords.split(',').map(k=>k.trim()) : undefined;
    return { title, description, keywords, openGraph: { title, description } };
  } catch (e) {
    return { title: "Car Insurance Comparison | Insurance Blog", description: "Compare car insurance articles and guides." };
  }
}

export default function CarInsuranceComparisonPage() {
  return <CarInsuranceComparisonClient />;
}
