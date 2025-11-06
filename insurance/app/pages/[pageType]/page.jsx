import React from "react";
import StaticPageContent from "@/app/components/StaticPageContent";
import { API_BASE_URL } from "@/lib/config";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const pageType = params?.pageType;
  if (!pageType) return { title: "Page" };
  try {
    const res = await fetch(`${API_BASE_URL}/api/pages/${pageType}/`, { next: { revalidate: 600 } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const page = await res.json();
    return {
      title: page?.title || pageType,
      description: page?.meta_description || undefined,
    };
  } catch {
    return { title: pageType };
  }
}

export default function Page({ params }) {
  const pageType = params?.pageType;
  return <StaticPageContent pageType={pageType} fallbackTitle={pageType} />;
}