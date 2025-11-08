"use client"
import React, { useState, useMemo, useEffect } from "react";
import { API_BASE_URL } from "@/lib/config";

// --- Utility Constants ---
// Maximum characters before the 'Read More' button appears
const MAX_CHARS = 160;

// --- Dynamic Data (from backend company API) ---
// Companies are admin-managed records exposed via /api/company/insurers/

// --- Component Section ---
const App = () => {
  const [openCompanyId, setOpenCompanyId] = useState(null);
  const [isExpanded, setIsExpanded] = useState({});
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams({ ordering: 'order,name' });
        const res = await fetch(`${API_BASE_URL}/api/company/insurers/?${params.toString()}`, { cache: 'no-store' });
        if (!res.ok) throw new Error(`Failed to load companies: ${res.status}`);
        const data = await res.json();
        const list = data.results || data;
        const filtered = (list || []).filter((c) => !c.is_high_risk_recommended);
        // Assign incremental ids for display while keeping backend slug/fields
        const normalized = (filtered || []).map((c, idx) => ({
          id: idx + 1,
          name: c.name,
          slug: c.slug,
          explanation: c.description || '',
          website: c.website || undefined,
          phone: c.phone || undefined,
        }));
        setCompanies(normalized);
      } catch (err) {
        console.error('Error fetching companies:', err);
        setCompanies([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  const ensureCompanyDetails = async (_slug) => {
    // Details already included from admin-managed API
    return;
  };

  const toggleAccordion = async (id, slug) => {
    // Closes the current one if clicked again, otherwise opens the new one
    setOpenCompanyId(openCompanyId === id ? null : id);
    // Reset individual text expansion when accordion changes
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
      {/* Header Section */}
      <header className="mb-8 p-6 bg-red-800 rounded-xl shadow-2xl text-white">
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-1">
          Top Auto Insurers 🚗
        </h1>
        <p className="text-xl font-light text-red-200">
          Detailed overview of leading U.S. car insurance providers.
        </p>
        <p className="text-xs mt-3 opacity-80">
          Data Last Updated: October 2025 (Sample Data)
        </p>
      </header>

      <div className="text-gray-700 mb-8 border-l-4 border-red-500 pl-4 py-2 bg-white rounded-lg shadow-lg">
        <p className="font-semibold text-red-700">How to use:</p>
        <p className="text-sm">
          Select any company name below to view a detailed overview, contact
          information, and website link.
        </p>
      </div>

      {/* Accordion List Section */}
      <div className="space-y-4">
        {loading && (
          <div className="text-center text-gray-600">Loading companies...</div>
        )}
        {!loading && companies.length === 0 && (
          <div className="text-center text-gray-600">No companies found.</div>
        )}
        {!loading && companies.map((company) => {
          const explanation = company.explanation || '';
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
                  {/* Custom Chevron Icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
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
      
      {/* Animation styles moved to global CSS to avoid styled-jsx hydration mismatches */}
    </div>
  );
};

export default App;
