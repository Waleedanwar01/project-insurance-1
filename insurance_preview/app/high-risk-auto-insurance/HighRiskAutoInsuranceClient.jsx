"use client";
import React, { useEffect, useState } from "react";
import BlogCard from "@/app/components/BlogCard";
import { API_BASE_URL } from "@/lib/config";

// --- Utility Constants ---
const MAX_CHARS = 160;

const ITEMS_PER_PAGE = 10;

const HighRiskAutoInsurance = () => {
  const [openCompanyId, setOpenCompanyId] = useState(null);
  const [isExpanded, setIsExpanded] = useState({});
  const [companies, setCompanies] = useState([]);
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams({
          high_risk_recommended: "true",
          ordering: "order,name",
        });
        const res = await fetch(`${API_BASE_URL}/api/company/insurers/?${params.toString()}`, {
          cache: "no-store",
        });
        if (!res.ok) throw new Error(`Failed to load companies: ${res.status}`);
        const data = await res.json();
        const list = data?.results || data || [];
        const normalized = (Array.isArray(list) ? list : []).map((c, idx) => ({
          id: idx + 1,
          name: c.name,
          slug: c.slug,
          explanation: c.high_risk_blurb || c.description || "",
          website: c.website || undefined,
          phone: c.phone || undefined,
        }));
        // Strictly fetch posts from the exact category name with pagination
        let posts = [];
        try {
          const offset = (currentPage - 1) * ITEMS_PER_PAGE;
          const r = await fetch(
            `${API_BASE_URL}/api/blog/posts/?category__name=${encodeURIComponent("High Risk Auto Insurance")}&ordering=published_at&limit=${ITEMS_PER_PAGE}&offset=${offset}`,
            { cache: "no-store" }
          );
          if (r.ok) {
            const d = await r.json();
            const list = Array.isArray(d?.results) ? d.results : (Array.isArray(d) ? d : []);
            posts = list;
            const count = d?.count ?? list.length;
            setTotalPages(Math.ceil(count / ITEMS_PER_PAGE));
          }
        } catch {}
        setBlogPosts(posts);
        setCompanies(normalized);
      } catch (err) {
        console.error("Error fetching companies:", err);
        setError(err?.message || "Failed to load content");
        setCompanies([]);
        setBlogPosts([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [currentPage]);

  const ensureCompanyDetails = async (_slug) => {
    return; // Details already included via admin-managed fields
  };

  const toggleAccordion = async (id, slug) => {
    setOpenCompanyId(openCompanyId === id ? null : id);
    setIsExpanded({});
    if (openCompanyId !== id) {
      await ensureCompanyDetails(slug);
    }
  };

  const toggleReadMore = (id) => {
    setIsExpanded((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const getDisplayExplanation = (explanation, id, needsReadMore) => {
    if (!needsReadMore) return explanation;
    return isExpanded[id]
      ? explanation
      : explanation.substring(0, MAX_CHARS).trim() + "...";
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-8 bg-gray-50 min-h-screen">
      {/* Header Section (fixed text as requested) */}
      <header className="mb-8 p-6 bg-red-800 rounded-xl shadow-2xl text-white">
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-1">
          High-Risk Auto Insurance 🚗
        </h1>
        <p className="text-xl font-light text-red-200">
          Recommended insurers for high-risk drivers with collapsible details.
        </p>
        <p className="text-xs mt-3 opacity-80">
          Admin manages each company’s overview, website, and phone.
        </p>
      </header>

      {/* High-Risk blog posts list */}
      {blogPosts.length > 0 && (
        <section className="mb-8 p-6 bg-white rounded-xl shadow-lg">
          <h2 className="text-xl font-bold text-gray-900 mb-6">High-Risk Articles</h2>
          <div className="space-y-6">
            {blogPosts.map((p) => (
              <div key={p.slug}>
                <BlogCard blog={p} />
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center items-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-2 border rounded-lg text-sm font-medium transition duration-150 ${
                    currentPage === page
                      ? "bg-red-600 text-white border-red-600"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </section>
      )}

      <div className="text-gray-700 mb-8 border-l-4 border-red-500 pl-4 py-2 bg-white rounded-lg shadow-lg">
        <p className="font-semibold text-red-700">How to use:</p>
        <p className="text-sm">
          Click a company name below to expand details, overview, and contacts.
        </p>
      </div>

      {/* Accordion List Section */}
      <div className="space-y-4">
        {loading && (
          <div className="text-center text-gray-600">Loading companies...</div>
        )}
        {error && (
          <div className="text-center text-red-600">{error}</div>
        )}
        {!loading && companies.length === 0 && !error && (
          <div className="text-center text-gray-600">No companies found.</div>
        )}
        {!loading && companies.map((company) => {
          const explanation = company.explanation || "";
          const needsReadMore = explanation.length > MAX_CHARS;
          const isCurrentExpanded = openCompanyId === company.id;
          const isTextExpanded = isExpanded[company.id];

          return (
            <div
              key={company.id}
              className={`border rounded-xl transition-all duration-300 ${
                isCurrentExpanded
                  ? "border-red-600 shadow-xl ring-2 ring-red-300"
                  : "border-gray-200 shadow-md hover:shadow-lg hover:border-red-300"
              }`}
            >
              {/* Accordion Header */}
              <div
                className={`p-4 cursor-pointer flex justify-between items-center rounded-xl transition-colors duration-200 ${
                  isCurrentExpanded
                    ? "bg-red-600 text-white font-bold"
                    : "bg-white text-gray-800 hover:bg-red-50"
                }`}
                onClick={() => toggleAccordion(company.id, company.slug)}
              >
                <h2 className="text-lg sm:text-xl flex items-center">
                  <span className="font-extrabold mr-3 w-6 text-center">
                    {company.id}.
                  </span>
                  <span>{company.name}</span>
                </h2>
                <div
                  className={`text-2xl transition-transform duration-300 ${
                    isCurrentExpanded ? "rotate-180 text-white" : "rotate-0 text-red-600"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Accordion Content */}
              {isCurrentExpanded && (
                <div className="p-5 bg-white border-t border-red-200 rounded-b-xl animate-fade-in">
                  <p className="text-gray-700 mb-4 text-sm sm:text-base leading-relaxed">
                    <strong className="text-red-700">Overview:</strong>{" "}
                    {getDisplayExplanation(
                      explanation || "Details will appear here once articles are added.",
                      company.id,
                      needsReadMore
                    )}
                    {needsReadMore && (
                      <button
                        onClick={() => toggleReadMore(company.id)}
                        className="ml-2 text-red-500 hover:text-red-700 font-semibold whitespace-nowrap text-sm focus:outline-none"
                      >
                        {isTextExpanded ? "Read Less" : "Read More"}
                      </button>
                    )}
                  </p>

                  <div className="space-y-2 text-sm sm:text-base">
                    {company.website && (
                      <div className="flex items-center">
                        <strong className="text-red-700 w-24">Website:</strong>{" "}
                        <a
                          href={company.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 underline truncate transition-colors"
                        >
                          {company.website}
                        </a>
                      </div>
                    )}

                    {company.phone && (
                      <div className="flex items-center">
                        <strong className="text-red-700 w-24">Phone:</strong>{" "}
                        <span className="font-mono text-gray-900 bg-red-100 px-2 py-0.5 rounded">
                          {company.phone}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HighRiskAutoInsurance;
