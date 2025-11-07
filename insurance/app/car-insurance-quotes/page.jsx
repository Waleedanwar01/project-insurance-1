import React from "react";
import CarInsuranceQuotesClient from "./CarInsuranceQuotesClient";
import { API_BASE_URL } from "@/lib/config";
import { getCarInsuranceQuotesPage } from "@/lib/api/pages";

export async function generateMetadata() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/car-insurance-quotes/`, { next: { revalidate: 900 } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const page = await res.json();
    const title = page?.meta_title || page?.title || "Car Insurance Quotes";
    const description = page?.meta_description || "Compare car insurance quotes from multiple providers and find the best policy for your budget.";
    const keywords = page?.meta_keywords ? page.meta_keywords.split(',').map(k => k.trim()).filter(Boolean) : undefined;
    return {
      title,
      description,
      keywords,
      openGraph: {
        title,
        description,
      },
    };
  } catch {
    return { title: "Car Insurance Quotes" };
  }
}

const CarInsuranceQuotes = async () => {
  // Fetch a stable snapshot on the server to avoid hydration mismatch
  const initialData = await getCarInsuranceQuotesPage();

  return (
    <div>
      <CarInsuranceQuotesClient initialData={initialData} />
    </div>
  );
};

export default CarInsuranceQuotes;
