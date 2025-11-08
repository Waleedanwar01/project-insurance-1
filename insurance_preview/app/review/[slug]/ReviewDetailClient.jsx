"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Image from "next/image";
import BlogDetailClient from "@/app/blog/[slug]/BlogDetailClient";
import { API_BASE_URL } from "@/lib/config";

const getImageUrl = (src) => {
  if (!src) return null;
  const isAbsolute = /^https?:\/\//i.test(src);
  return isAbsolute ? src : `${API_BASE_URL}${src}`;
};

function StarRating({ rating = 0 }) {
  const stars = new Array(5).fill(null).map((_, i) => i < rating);
  return (
    <div className="flex items-center gap-1" aria-label={`Rating: ${rating} out of 5`}>
      {stars.map((filled, idx) => (
        <svg key={idx} className={`h-5 w-5 ${filled ? "text-yellow-400" : "text-gray-300"}`} fill={filled ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.966a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.377 2.455a1 1 0 00-.364 1.118l1.286 3.966c.3.922-.755 1.688-1.54 1.118l-3.377-2.455a1 1 0 00-1.176 0l-3.377 2.455c-.784.57-1.838-.196-1.539-1.118l1.286-3.966a1 1 0 00-.364-1.118L2.049 9.393c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.966z" />
        </svg>
      ))}
      <span className="ml-2 text-sm text-gray-700">{rating}/5</span>
    </div>
  );
}

function formatDate(dateStr) {
  if (!dateStr) return null;
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
  } catch {
    return null;
  }
}

export default function ReviewDetailClient({ params }) {
  const routeParams = useParams();
  const slug = params?.slug || routeParams?.slug;
  const [mode, setMode] = useState("loading"); // 'loading' | 'blog' | 'company_review' | 'company' | 'error'
  const [company, setCompany] = useState(null);
  const [review, setReview] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      if (!slug) {
        setError("Invalid URL");
        setMode("error");
        return;
      }
      // 1) Try blog post by same slug
      try {
        const res = await fetch(`${API_BASE_URL}/api/blog/posts/${slug}/`, { cache: "no-store" });
        if (res.ok) {
          setMode("blog");
          return;
        }
      } catch (e) {
        // ignore, will fallback to company
      }
      // 2) Fetch company detail (now includes nested reviews)
      try {
        const res = await fetch(`${API_BASE_URL}/api/company/insurers/${slug}/`, { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setCompany(data);
        const list = Array.isArray(data?.reviews) ? data.reviews : [];
        if (list.length > 0) {
          setReview(list[0]);
          setMode("company_review");
        } else {
          setMode("company");
        }
      } catch (e) {
        console.error(e);
        setError("Review not found. Please try again later.");
        setMode("error");
      }
    };
    load();
  }, [slug]);

  if (mode === "loading") {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            <div className="h-4 bg-gray-200 rounded w-4/5"></div>
          </div>
        </div>
      </div>
    );
  }

  if (mode === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-6xl mb-6">📄</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Review not found</h2>
          <p className="text-gray-600 mb-8 text-lg leading-relaxed">{error}</p>
          <Link href="/insurance-company-reviews" className="inline-flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-medium text-lg">
            Back to Reviews
          </Link>
        </div>
      </div>
    );
  }

  if (mode === "blog") {
    // Reuse blog detail UI and behavior
    return <BlogDetailClient params={{ slug }} backHref="/insurance-company-reviews" backLabel="Back to Reviews" />;
  }

  if (mode === "company_review") {
    const title = review?.title || `${review?.company_name || slug} Review`;
    const author = review?.author_name || null;
    const published = formatDate(review?.published_at);
    const logoUrl = getImageUrl(company?.logo);
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-gradient-to-br from-red-500 via-red-600 to-red-700 text-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-3">{title}</h1>
            <p className="text-red-100">Coverage, features, and contact details</p>
          </div>
        </div>

        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-12">
          {/* Company header with logo and rating */}
          <div className="bg-white rounded-2xl shadow p-6 mb-8 flex items-center gap-6">
            {logoUrl && (
              <div className="relative w-20 h-20">
                <Image src={logoUrl} alt={`${company?.name} logo`} fill className="object-contain" />
              </div>
            )}
            <div className="flex-1">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <h2 className="text-2xl font-bold text-gray-900">{company?.name || review?.company_name || title}</h2>
                {typeof review?.rating === "number" && (
                  <StarRating rating={review.rating} />
                )}
              </div>
              {(author || published) && (
                <div className="mt-1 text-gray-700 text-sm">
                  {author && <span>By {author}</span>}
                  {author && published && <span> • </span>}
                  {published && <span>Published {published}</span>}
                </div>
              )}
            </div>
          </div>

          <div className="bg-gradient-to-r from-red-50 via-red-50 to-red-100 border-l-4 border-red-500 p-6 md:p-8 mb-10 md:mb-12 rounded-r-2xl shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Overview</h2>
            <p className="text-xl text-gray-800 leading-relaxed font-medium">
              {review?.summary || "Review details are currently unavailable."}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10 mb-10 md:mb-12">
            <div className="prose prose-lg prose-red max-w-none text-gray-800 leading-relaxed whitespace-pre-line">
              {review?.content || ""}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow p-6 md:p-10 mb-10 md:mb-12">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">{company?.name ? `${company.name} Contact Information` : "Contact Information"}</h3>
            <div className="text-gray-800 leading-relaxed">
              <div className="mb-2">
                <span className="font-semibold">Website:</span>{" "}
                {company?.website ? (
                  <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">{company.website}</a>
                ) : (
                  <span className="text-gray-600">Not available</span>
                )}
              </div>
              <div className="mb-2">
                <span className="font-semibold">Customer Service Phone:</span>{" "}
                {company?.phone ? (
                  <span className="font-mono">{company.phone}</span>
                ) : (
                  <span className="text-gray-600">Not available</span>
                )}
              </div>
            </div>
          </div>

          <div className="text-center mt-6">
            <Link href="/insurance-company-reviews" className="inline-flex items-center gap-2 bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 transition-colors font-medium text-lg">
              Back to Reviews
            </Link>
          </div>
        </article>
      </div>
    );
  }

  // Company review fallback in blog-like layout
  const logoUrl = getImageUrl(company?.logo);
  const title = `${company?.name} Review`;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-red-500 via-red-600 to-red-700 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">{title}</h1>
          <p className="text-red-100">Coverage, features, and contact details</p>
        </div>
      </div>

      {/* Main Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-12">
        {/* Summary-like card */}
        <div className="bg-gradient-to-r from-red-50 via-red-50 to-red-100 border-l-4 border-red-500 p-6 md:p-8 mb-10 md:mb-12 rounded-r-2xl shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Overview</h2>
          <p className="text-xl text-gray-800 leading-relaxed font-medium">
            {company?.description || "Company details are currently unavailable."}
          </p>
        </div>

        {/* Content card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10 mb-10 md:mb-12">
          {logoUrl && (
            <div className="relative w-full h-36 mb-6">
              <Image src={logoUrl} alt={`${company?.name} logo`} fill className="object-contain" />
            </div>
          )}
          <div className="prose prose-lg prose-red max-w-none text-gray-800 leading-relaxed">
            <h3>Website</h3>
            {company?.website ? (
              <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">
                {company.website}
              </a>
            ) : (
              <p className="text-gray-600">Website not available</p>
            )}

            <h3 className="mt-6">Phone</h3>
            {company?.phone ? (
              <p className="font-mono text-gray-900">{company.phone}</p>
            ) : (
              <p className="text-gray-600">Phone number not available</p>
            )}

            {company?.address && (
              <>
                <h3 className="mt-6">Address</h3>
                <p className="text-gray-700 whitespace-pre-line">{company.address}</p>
              </>
            )}
          </div>
        </div>

        {/* Back button */}
        <div className="text-center mt-6">
          <Link href="/insurance-company-reviews" className="inline-flex items-center gap-2 bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 transition-colors font-medium text-lg">
            Back to Reviews
          </Link>
        </div>
      </article>
    </div>
  );
}