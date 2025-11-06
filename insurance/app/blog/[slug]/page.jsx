// app/blog/[slug]/page.jsx
import React from "react";
import BlogDetailClient from "./BlogDetailClient";
import { API_BASE_URL } from "@/lib/config";

// Dynamic Metadata with API fetch
export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;

  if (!slug || slug === 'undefined') {
    return {
      title: `Blog Post | Insurance Blog`,
      description: `Read the latest article on Insurance Blog.`,
    };
  }

  try {
    // Fetch blog post data from API
    const res = await fetch(`${API_BASE_URL}/api/blog/posts/${slug}/`, { 
      next: { revalidate: 3600 },
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (!res.ok) {
      console.warn(`Failed to fetch blog metadata for slug: ${slug}, status: ${res.status}`);
      throw new Error(`HTTP ${res.status}`);
    }
    
    const post = await res.json();
    
    // Use the actual blog title from API
    return {
      title: `${post.title || slug} | Insurance Blog`,
      description: post.summary || `Read ${slug} on Insurance Blog.`,
      openGraph: {
        title: post.title || slug,
        description: post.summary || `Read ${slug} on Insurance Blog.`,
        images: post.feature_image ? [{ url: post.feature_image }] : [],
      },
    };
  } catch (error) {
    console.warn("Error fetching blog metadata:", error.message);
    // fallback metadata - don't throw error to prevent page crash
    return {
      title: `${slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} | Insurance Blog`,
      description: `Read about ${slug.replace(/-/g, ' ')} on Insurance Blog.`,
    };
  }
}

const BlogDetail = ({ params }) => {
  return <BlogDetailClient params={params} />;
};

export default BlogDetail;