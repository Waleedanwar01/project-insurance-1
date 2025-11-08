"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { API_BASE_URL } from "@/lib/config";

const ITEMS_PER_PAGE = 12;

const getImageUrl = (src) => {
  if (!src) return null;
  // If backend returns "/media/..." or relative path, prefix API_BASE_URL
  const isAbsolute = /^https?:\/\//i.test(src);
  return isAbsolute ? src : `${API_BASE_URL}${src}`;
};

const truncate = (text, max = 160) => {
  if (!text) return "";
  return text.length > max ? text.slice(0, max).trim() + "…" : text;
};

const InsuranceCompanyReviewsClient = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: String(currentPage),
        page_size: String(ITEMS_PER_PAGE),
        ordering: "order,name",
      });
      const res = await fetch(`${API_BASE_URL}/api/company/insurers/?${params.toString()}`, { cache: "no-store" });
      if (!res.ok) throw new Error(`Failed to load companies: ${res.status}`);
      const data = await res.json();
      const list = data.results || data || [];
      setCompanies(list);
      const count = data.count || list.length || 0;
      setTotalPages(Math.max(1, Math.ceil(count / ITEMS_PER_PAGE)));
    } catch (e) {
      console.error("Error fetching companies:", e);
      setError("Companies load nahi ho rahe. Thori dair baad koshish karein.");
      setCompanies([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Companies load ho rahe hain…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center text-red-600">
          <p className="text-xl font-semibold mb-2">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Insurance Company Reviews</h1>
          <p className="text-xl text-red-100 max-w-3xl">Jitni bhi companies available hain, un sab ke reviews yahan.</p>
        </div>
      </div>

      {/* List */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {companies.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-gray-400 text-6xl mb-4">📄</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Koi company nahi mili</h3>
            <p className="text-gray-600">Baad mein dobara check karein.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {companies.map((c) => {
                const logoUrl = getImageUrl(c.logo);
                return (
                  <div key={c.slug} className="border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition p-4 bg-white">
                    {logoUrl && (
                      <div className="relative w-full h-28 mb-3">
                        <Image src={logoUrl} alt={`${c.name} logo`} fill className="object-contain" sizes="(max-width: 768px) 100vw, 33vw" />
                      </div>
                    )}
                    <h2 className="text-lg font-bold text-gray-900 mb-2">{c.name}</h2>
                    <p className="text-gray-700 text-sm mb-3">{truncate(c.description)}</p>
                    <div className="flex items-center justify-between">
                      {c.website ? (
                        <a href={c.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline text-sm">
                          Visit Website
                        </a>
                      ) : (
                        <span className="text-gray-400 text-sm">No website</span>
                      )}
                      <Link href={`/review/${c.slug}`} className="text-red-600 hover:text-red-800 font-semibold text-sm">
                        Read Review →
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => handlePageChange(i + 1)}
                    className={`px-3 py-2 border rounded-lg text-sm ${currentPage === i + 1 ? "bg-red-600 text-white border-red-600" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"}`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default InsuranceCompanyReviewsClient;
