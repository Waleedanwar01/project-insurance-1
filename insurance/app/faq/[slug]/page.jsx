import React from "react";
import { API_BASE_URL } from "@/lib/config";
import FaqDetailClient from "./FaqDetailClient";
export const dynamic = "force-dynamic";

async function fetchFaq(slug) {
  // Try primary endpoint with trailing slash, then fallback without
  try {
    const primary = await fetch(`${API_BASE_URL}/api/faq/api/faqs/${slug}/`, {
      cache: "no-store",
    });
    if (primary.ok) return primary.json();

    const fallback = await fetch(`${API_BASE_URL}/api/faq/api/faqs/${slug}`, {
      cache: "no-store",
    });
    if (fallback.ok) return fallback.json();

    return null;
  } catch (e) {
    return null;
  }
}

export default function Page() {
  return <FaqDetailClient />;
}

export async function generateMetadata({ params }) {
  const slug = params?.slug;
  if (!slug) return { title: "FAQ | Insurance Panda" };
  const faq = await fetchFaq(slug);
  if (!faq) return { title: "FAQ | Insurance Panda" };
  return {
    title: `${faq.question} | Insurance Panda`,
    description: faq.short_answer || "Detailed answer from Insurance Panda FAQs",
  };
}