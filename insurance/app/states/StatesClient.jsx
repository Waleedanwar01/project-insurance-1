"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { API_BASE_URL } from "@/lib/config";

// --- Heroicons for better UX ---
// Note: Ensure you have installed this package: npm install @heroicons/react
import { PlusIcon, MinusIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';

const StatesClient = () => {
  const [states, setStates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // Track expanded states and per-state blogs with pagination
  const [expandedStates, setExpandedStates] = useState([]); // array of state slugs
  const [stateBlogData, setStateBlogData] = useState({}); // { [slug]: { page, count, results, loading, error } }

  // --- BRANDING COLORS (Tailwind Classes for customization) ---
  const BRAND_COLOR_PRIMARY = "red-600";
  const BRAND_COLOR_ACCENT = "red-700";
  const BRAND_COLOR_HOVER = "red-700";
  const BRAND_COLOR_LIGHT = "red-50";

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch states
        const statesRes = await fetch(`${API_BASE_URL}/api/blog/api/states/`);
        if (!statesRes.ok) throw new Error("Failed to fetch states");
        const statesData = await statesRes.json();
        setStates(statesData);
      } catch (err) {
        console.error(err);
        setError("Unable to load state directory.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const ITEMS_PER_PAGE = 10;

  const formatDate = (dateString) => {
    if (!dateString) return "No Date Provided";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const fetchStateBlogs = async (slug, page = 1) => {
    try {
      setStateBlogData(prev => ({
        ...prev,
        [slug]: { ...(prev[slug] || {}), loading: true, error: "" }
      }));
      const offset = (page - 1) * ITEMS_PER_PAGE;
      
      // Simulating network delay for better loading state visibility
      // await new Promise(resolve => setTimeout(resolve, 300)); 
      
      const res = await fetch(`${API_BASE_URL}/api/blog/posts/?category=${slug}&limit=${ITEMS_PER_PAGE}&offset=${offset}`);
      if (!res.ok) throw new Error(`Failed to fetch ${slug} articles (${res.status})`);
      const data = await res.json();
      const results = Array.isArray(data) ? data : data.results || [];
      const count = data.count || (Array.isArray(data) ? data.length : (data.results?.length || 0));
      
      setStateBlogData(prev => ({
        ...prev,
        [slug]: { page, count, results, loading: false, error: "" }
      }));
    } catch (e) {
      console.error("Blog Fetch Error:", e);
      setStateBlogData(prev => ({
        ...prev,
        [slug]: { ...(prev[slug] || {}), loading: false, error: e.message || "Failed to load articles." }
      }));
    }
  };

  const toggleState = (slug) => {
    setExpandedStates(prev => {
      const isOpen = prev.includes(slug);
      const next = isOpen ? prev.filter(s => s !== slug) : [...prev, slug];
      
      // Load content only if expanding for the first time
      if (!isOpen && !stateBlogData[slug]) {
        fetchStateBlogs(slug, 1);
      }
      return next;
    });
  };

  const changePage = (slug, page, totalPages) => {
    if (page < 1 || page > totalPages) return;
    fetchStateBlogs(slug, page);
    
    // Smooth scroll to the top of the content area for optimal UX
    if (typeof window !== "undefined") {
      const el = document.getElementById(`state-section-${slug}`);
      if (el) {
        // Scroll to the content area inside the state section
        const contentEl = el.querySelector('.state-content-container') || el;
        contentEl.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
      }
    }
  };

  // --- RENDERING: LOADING, ERROR, AND MAIN CONTENT ---

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className={`animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-${BRAND_COLOR_PRIMARY} mx-auto mb-4`}></div>
          <p className="text-gray-700 font-semibold">Loading state directory...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center text-red-500 p-8 border border-red-200 rounded-lg shadow-xl">
          <p className="text-2xl font-bold mb-2">🚨 Data Loading Error</p>
          <p className="text-lg">{error}</p>
          <p className="text-sm mt-4 text-gray-500">The main state directory could not be loaded. Please check API connectivity.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      
      {/* --- HERO SECTION --- (Kept for necessary context/title) */}
      <div className={`bg-gradient-to-r from-${BRAND_COLOR_PRIMARY} to-${BRAND_COLOR_ACCENT} text-white py-20 shadow-xl`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
            State Auto Insurance Guides
          </h1>
          <p className="text-xl text-red-100 max-w-3xl opacity-95">
            Find the latest articles and information specific to your state's auto insurance market.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* --- 1. PER-STATE EXPANDABLE BLOG SECTIONS --- (Now the main focus) */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 border-b-4 border-gray-200 pb-2">
            Browse Latest Articles by State 📑
          </h2>
          <p className="text-gray-600 mb-6">Expand a state to dynamically load its latest 10 articles. Use the pagination controls to explore more content.</p>

          <div className="divide-y divide-gray-200 border border-gray-200 rounded-xl bg-white shadow-xl">
            {states.map((state) => {
              const slug = state.slug;
              const data = stateBlogData[slug] || { page: 1, count: 0, results: [], loading: false, error: "" };
              const totalPages = data.count ? Math.ceil(data.count / ITEMS_PER_PAGE) : 1;
              const isOpen = expandedStates.includes(slug);
              
              return (
                <div key={slug} id={`state-section-${slug}`} className="transition-all duration-300">
                  {/* State Toggle Button (Accordion Header) */}
                  <button
                    onClick={() => toggleState(slug)}
                    className={`w-full flex items-center justify-between px-4 sm:px-6 py-5 ${isOpen ? `bg-${BRAND_COLOR_LIGHT}` : 'hover:bg-gray-50'} transition-colors duration-200`}
                    aria-expanded={isOpen}
                  >
                    <span className="text-xl sm:text-2xl font-extrabold text-gray-900">{state.name}</span>
                    <span className={`ml-4 inline-flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200 ${isOpen ? `bg-${BRAND_COLOR_PRIMARY} text-white shadow-md` : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                      {isOpen ? <MinusIcon className="w-5 h-5" /> : <PlusIcon className="w-5 h-5" />}
                    </span>
                  </button>

                  {/* Collapsible Content Area */}
                  {isOpen && (
                    <div className="state-content-container px-4 sm:px-6 pb-6 pt-4 border-t border-gray-100 bg-white">
                      
                      {/* Loading State */}
                      {data.loading && (
                        <div className="py-8 text-center text-gray-600">
                          <div className={`animate-spin rounded-full h-8 w-8 border-b-2 border-${BRAND_COLOR_PRIMARY} mx-auto mb-3`}></div>
                          Loading latest articles for **{state.name}**...
                        </div>
                      )}
                      
                      {/* Error State */}
                      {data.error && (
                        <div className="py-8 text-center text-red-700 bg-red-100 rounded-lg p-4 font-medium border border-red-300">
                          **Error loading articles:** {data.error}
                        </div>
                      )}
                      
                      {/* Blog Posts List */}
                      {!data.loading && !data.error && (
                        <>
                          {data.count === 0 ? (
                            <div className="py-6 text-gray-600 text-center border-dashed border-2 border-gray-200 p-4 rounded-lg">No dedicated articles found for **{state.name}** yet.</div>
                          ) : (
                            <div className="space-y-6">
                              {data.results.map((post) => (
                                <div
                                  key={post.id}
                                  className={`p-6 bg-white rounded-xl shadow-lg border border-gray-100 transition duration-300 hover:shadow-2xl hover:border-${BRAND_COLOR_HOVER}`}
                                >
                                  <p className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                                    <svg className="w-4 h-4 mr-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"></path></svg>
                                    Published: {formatDate(post.published_at)}
                                  </p>
                                  <Link href={`/states/${slug}/${post.slug}`} className="block">
                                    <h3 className={`text-2xl font-bold text-gray-900 hover:text-${BRAND_COLOR_HOVER} transition duration-150`}>
                                      {post.title}
                                    </h3>
                                  </Link>
                                  <p className="mt-3 text-gray-600 leading-relaxed line-clamp-3">
                                    {post.summary || (post.description ? post.description.slice(0, 200) + "..." : "No summary available.")}
                                  </p>
                                  <Link href={`/states/${slug}/${post.slug}`} className={`mt-4 inline-block font-semibold text-${BRAND_COLOR_PRIMARY} hover:underline`}>
                                    Read Full Guide <ChevronRightIcon className="w-4 h-4 inline ml-1" />
                                  </Link>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Pagination Controls */}
                          {data.count > 0 && (
                            <div className="mt-10">
                              <div className="flex justify-center items-center space-x-2">
                                {/* Previous Button */}
                                <button
                                  onClick={() => changePage(slug, (data.page || 1) - 1, totalPages)}
                                  className={`flex items-center px-4 py-2 mx-1 rounded-full text-sm font-medium transition ${data.page === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'}`}
                                  disabled={data.page === 1}
                                >
                                  <ChevronLeftIcon className="w-4 h-4 mr-1" /> Previous
                                </button>

                                {/* Numbered Buttons */}
                                {(() => {
                                  const currentPage = data.page || 1;
                                  let startPage = Math.max(1, currentPage - 2);
                                  let endPage = Math.min(totalPages, currentPage + 2);

                                  if (endPage - startPage < 4) { startPage = Math.max(1, endPage - 4); }
                                  if (endPage - startPage < 4) { endPage = Math.min(totalPages, startPage + 4); }

                                  const pages = [];
                                  for (let i = startPage; i <= endPage; i++) { pages.push(i); }

                                  return pages.map((pageNum) => (
                                    <button
                                      key={pageNum}
                                      onClick={() => changePage(slug, pageNum, totalPages)}
                                      className={`hidden sm:inline-block px-4 py-2 mx-1 rounded-full text-sm font-bold transition-all duration-200 ${pageNum === currentPage ? `bg-${BRAND_COLOR_PRIMARY} text-white shadow-lg` : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'}`}
                                    >
                                      {pageNum}
                                    </button>
                                  ));
                                })()}

                                {/* Next Button */}
                                <button
                                  onClick={() => changePage(slug, (data.page || 1) + 1, totalPages)}
                                  className={`flex items-center px-4 py-2 mx-1 rounded-full text-sm font-medium transition ${data.page === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'}`}
                                  disabled={data.page === totalPages}
                                >
                                  Next <ChevronRightIcon className="w-4 h-4 ml-1" />
                                </button>
                              </div>
                              <div className="text-center mt-4 text-sm font-semibold text-gray-600">
                                Page **{data.page || 1}** of **{totalPages}** ({data.count} total articles)
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatesClient;
