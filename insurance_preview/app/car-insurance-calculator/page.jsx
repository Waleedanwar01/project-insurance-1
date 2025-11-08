import React from "react";
import CarInsuranceCalculatorClient from "./CarInsuranceCalculatorClient";
import { API_BASE_URL } from "@/lib/config";

export async function generateMetadata() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/pages/car-insurance-calculator/`, { next: { revalidate: 600 } });
    const page = res.ok ? await res.json() : null;
    const title = page?.meta_title || page?.title || "Car Insurance Calculator | Insurance Blog";
    const description = page?.meta_description || "Articles and guides about car insurance calculators.";
    const keywords = page?.meta_keywords ? page.meta_keywords.split(',').map(k=>k.trim()) : undefined;
    return { title, description, keywords, openGraph: { title, description } };
  } catch (e) {
    return { title: "Car Insurance Calculator | Insurance Blog", description: "Articles and guides about car insurance calculators." };
  }
}

export default function CarInsuranceCalculatorPage() {
  return <CarInsuranceCalculatorClient />;
}
