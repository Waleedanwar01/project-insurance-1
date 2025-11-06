import React from "react";
import BlogDetailClient from "./BlogDetailClient";
import { API_BASE_URL } from "@/lib/config";

export async function generateMetadata({ params }) {
  const resolved = await params;
  const slug = resolved?.slug;

  if (!slug) {
    return {
      title: `State Blog | Insurance Blog`,
      description: `Read the latest article on Insurance Blog.`,
    };
  }

  try {
    const res = await fetch(`${API_BASE_URL}/api/blog/posts/${slug}/`, {
      next: { revalidate: 3600 },
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const post = await res.json();
    return {
      title: `${post.title || slug} | Insurance Blog`,
      description: post.summary || `Read ${slug} on Insurance Blog.`,
      openGraph: {
        title: post.title || slug,
        description: post.summary || `Read ${slug} on Insurance Blog.`,
        images: post.feature_image ? [{ url: post.feature_image }] : [],
      },
    };
  } catch {
    return {
      title: `${slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())} | Insurance Blog`,
      description: `Read about ${slug.replace(/-/g, " ")} on Insurance Blog.`,
    };
  }
}

const StateBlogDetailPage = async ({ params }) => {
  const resolved = await params;
  const state = resolved?.state;
  const slug = resolved?.slug;
  return <BlogDetailClient state={state} slug={slug} />;
};

export default StateBlogDetailPage;
