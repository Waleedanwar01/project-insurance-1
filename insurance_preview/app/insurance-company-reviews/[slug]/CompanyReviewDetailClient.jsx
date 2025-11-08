"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { API_BASE_URL } from "@/lib/config";

const getImageUrl = (src) => {
  if (!src) return null;
  const isAbsolute = /^https?:\/\//i.test(src);
  return isAbsolute ? src : `${API_BASE_URL}${src}`;
};

export default function CompanyReviewDetailClient({ params }) {
  const slug = params?.slug;
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE_URL}/api/company/insurers/${slug}/`, { cache: "no-store" });
        if (!res.ok) throw new Error(`Failed to load company: ${res.status}`);
        const data = await res.json();
        setCompany(data);
      } catch (e) {
        console.error(e);
        setError("Failed to load company details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchCompany();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading review…</p>
        </div>
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center text-red-600">
          <p className="text-xl font-semibold mb-2">Error</p>
          <p>{error || "Company not found."}</p>
          <Link href="/insurance-company-reviews" className="text-red-600 hover:text-red-800 underline mt-3 inline-block">
            Back to Reviews
          </Link>
        </div>
      </div>
    );
  }

  const logoUrl = getImageUrl(company.logo);

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white py-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold">{company.name} Review</h1>
          <p className="text-red-100 mt-2">Coverage, features, and contact details</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-6">
          <Link href="/insurance-company-reviews" className="text-red-600 hover:text-red-800 font-semibold">
            ← Back to Reviews
          </Link>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
          <div className="p-6">
            {logoUrl && (
              <div className="relative w-full h-32 mb-4">
                <Image src={logoUrl} alt={`${company.name} logo`} fill className="object-contain" sizes="(max-width: 768px) 100vw, 50vw" />
              </div>
            )}

            <h2 className="text-2xl font-bold text-gray-900 mb-3">Overview</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              {company.description || "Company details are currently unavailable."}
            </p>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4">
                <h3 className="text-lg font-semibold text-red-700 mb-2">Website</h3>
                {company.website ? (
                  <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                    {company.website}
                  </a>
                ) : (
                  <p className="text-gray-500">Website available nahi</p>
                )}
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="text-lg font-semibold text-red-700 mb-2">Phone</h3>
                {company.phone ? (
                  <p className="font-mono text-gray-900">{company.phone}</p>
                ) : (
                  <p className="text-gray-500">Phone number available nahi</p>
                )}
              </div>
            </div>

            {company.address && (
              <div className="border rounded-lg p-4 mt-4">
                <h3 className="text-lg font-semibold text-red-700 mb-2">Address</h3>
                <p className="text-gray-700 whitespace-pre-line">{company.address}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}