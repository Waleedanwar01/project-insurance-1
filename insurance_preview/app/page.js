import React from "react";
import HomeClient from "./HomeClient";
import { API_BASE_URL } from "@/lib/config";
import { getCompanyInfo, getStaticPage } from "@/lib/api/pages";

export async function generateMetadata() {
  // Try admin-configured StaticPage first
  try {
    const res = await fetch(`${API_BASE_URL}/api/pages/home/`, { next: { revalidate: 600 } });
    const page = res.ok ? await res.json() : null;
    if (page) {
      const title = page?.meta_title || page?.title || undefined;
      const description = page?.meta_description || undefined;
      const keywords = page?.meta_keywords ? page.meta_keywords.split(',').map(k => k.trim()).filter(Boolean) : undefined;
      if (title || description || keywords) {
        return {
          title,
          description,
          keywords,
          openGraph: { title, description },
          twitter: { title, description },
        };
      }
    }
  } catch (e) {
    // fall through to brand-based defaults
  }

  // Fallback to brand-based defaults if admin page is not set
  const companyInfo = await getCompanyInfo().catch(() => null);
  const brand = companyInfo?.company_name || "Insurance Panda";
  const title = `Affordable Car Insurance Quotes | ${brand}`;
  const description = `Compare affordable car insurance quotes from top providers. ${brand} helps you save money by finding the best auto insurance coverage tailored to your needs.`;
  const imageUrl = "/images/home-banner.jpg";
  return {
    title,
    description,
    keywords: [
      "car insurance quotes",
      "cheap auto insurance",
      "compare car insurance",
      brand.toLowerCase(),
      "affordable car insurance",
      "vehicle coverage",
    ],
    openGraph: {
      title,
      description,
      images: [{ url: imageUrl, width: 1200, height: 630, alt: "Affordable Car Insurance Quotes" }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function HomeClientPage() {
  const companyInfo = await getCompanyInfo().catch(() => null);
  const aboutPage = await getStaticPage("about").catch(() => null);
  const aboutHtml = aboutPage?.content || null;
  return (
    <div>
      <HomeClient companyInfo={companyInfo} aboutHtml={aboutHtml} />
    </div>
  );
}
