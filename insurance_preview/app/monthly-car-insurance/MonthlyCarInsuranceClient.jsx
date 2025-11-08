"use client";
import React, { useEffect, useState } from "react";
import BlogCard from "@/app/components/BlogCard";
import { API_BASE_URL } from "@/lib/config";

const ITEMS_PER_PAGE = 10;

export default function MonthlyCarInsuranceClient() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalBlogs, setTotalBlogs] = useState(0);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const offset = (currentPage - 1) * ITEMS_PER_PAGE;
        const CATEGORY_SLUG = "monthly-car-insurance";
        const CATEGORY_NAME = "Monthly Car Insurance";

        const urls = [
          `${API_BASE_URL}/api/blog/posts/?category=${CATEGORY_SLUG}&limit=${ITEMS_PER_PAGE}&offset=${offset}`,
          `${API_BASE_URL}/api/blog/posts/?category__name=${encodeURIComponent(CATEGORY_NAME)}&limit=${ITEMS_PER_PAGE}&offset=${offset}`,
        ];

        let list = [];
        let count = 0;
        for (const url of urls) {
          const res = await fetch(url, { cache: "no-store" });
          if (!res.ok) continue;
          const data = await res.json();
          list = Array.isArray(data) ? data : data.results || [];
          count = data.count || list.length || 0;
          if (count > 0) break;
        }

        setBlogs(list);
        setTotalBlogs(count);
      } catch (err) {
        console.error(err);
        setError("Unable to load Monthly Car Insurance blogs.");
        setBlogs([]);
        setTotalBlogs(0);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [currentPage]);

  const totalPages = Math.ceil(totalBlogs / ITEMS_PER_PAGE) || 1;

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading monthly car insurance blogs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center text-red-500">
          <p className="text-xl font-semibold mb-2">Error Loading Content</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Monthly Car Insurance</h1>
          <p className="text-xl text-red-100 max-w-3xl">
            Explore articles focused on month-to-month auto insurance plans, pricing, and flexibility.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {blogs.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-gray-400 text-6xl mb-4">📄</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Monthly Insurance Articles Found</h3>
            <p className="text-gray-600">Check back later for new articles.</p>
          </div>
        ) : (
          <>
            <div className="space-y-6 mb-12">
              {blogs.map((blog) => (
                <div key={blog.id}>
                  <BlogCard blog={blog} />
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 mx-1 rounded-md text-sm font-medium transition duration-150 ease-in-out ${
                    currentPage === 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white text-gray-700 border border-gray-300 hover:bg-red-50"
                  }`}
                >
                  &larr; Previous
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-4 py-2 mx-1 rounded-md text-sm font-medium transition duration-150 ease-in-out ${
                      currentPage === page
                        ? "bg-red-600 text-white"
                        : "bg-white text-gray-700 border border-gray-300 hover:bg-red-50"
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 mx-1 rounded-md text-sm font-medium transition duration-150 ease-in-out ${
                    currentPage === totalPages
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white text-gray-700 border border-gray-300 hover:bg-red-50"
                  }`}
                >
                  Next &rarr;
                </button>
              </div>
            )}

            <div className="text-center mt-4 text-sm text-gray-500">
              Page {currentPage} of {totalPages}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
