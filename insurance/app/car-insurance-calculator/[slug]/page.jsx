import React from "react";
import BlogDetailClient from "@/app/blog/[slug]/BlogDetailClient";
import { API_BASE_URL } from "@/lib/config";

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;
  if (!slug || slug === "undefined") {
    return { title: "Article | Car Insurance Calculator" };
  }
  try {
    const res = await fetch(`${API_BASE_URL}/api/blog/posts/${slug}/`, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const post = await res.json();
    return {
      title: `${post.title || slug} | Car Insurance Calculator`,
      description: post.summary || `Read ${slug} in calculator.`,
      openGraph: { title: post.title || slug, description: post.summary || "", images: post.feature_image ? [{ url: post.feature_image }] : [] },
    };
  } catch {
    return { title: `${slug} | Car Insurance Calculator` };
  }
}

export default function CalculatorDetail({ params }) {
  return <BlogDetailClient params={params} backHref="/car-insurance-calculator" backLabel="Back to Calculator" />;
}