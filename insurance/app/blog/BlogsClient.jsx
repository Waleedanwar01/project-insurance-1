"use client";
import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link"; // ✅ real Next.js Link import
import { API_BASE_URL } from "@/lib/config";

const PRIMARY_HIGHLIGHT_TEXT = "text-red-600";
const PRIMARY_BG_HOVER = "hover:bg-red-50";

const ITEMS_PER_PAGE = 10;

const BlogsClient = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState("");

  const formatDate = (dateString) => {
    if (!dateString) return "No Date Provided";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE_URL}/api/blog/posts/`);
        if (!res.ok) throw new Error("Failed to fetch blogs");

        const data = await res.json();
        const blogList = Array.isArray(data) ? data : data.results || [];
        setBlogs(blogList);
      } catch (err) {
        console.error(err);
        setError("Unable to load blog posts. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const totalPages = Math.ceil(blogs.length / ITEMS_PER_PAGE);

  const currentPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return blogs.slice(startIndex, endIndex);
  }, [blogs, currentPage]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const renderPaginationButtons = () => {
    const pages = [];
    const maxButtons = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxButtons - 1);

    if (endPage - startPage + 1 < maxButtons) {
      startPage = Math.max(1, endPage - maxButtons + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-4 py-2 mx-1 rounded-md text-sm font-medium transition duration-150 ease-in-out ${
            i === currentPage
              ? "bg-red-600 text-white shadow-lg"
              : "bg-white text-gray-700 border border-gray-300 hover:bg-red-50"
          }`}
        >
          {i}
        </button>
      );
    }
    return pages;
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-6 border-b-4 border-red-500 pb-3">
          Blog Posts
        </h1>
        <p className="text-lg text-gray-600 mb-10">
          Explore the latest articles regarding auto insurance. Learn how to
          save, get discounts, and discover industry updates.
        </p>

        {loading && (
          <div className="text-center text-gray-500 text-lg py-10 animate-pulse">
            Loading blogs...
          </div>
        )}

        {error && <p className="text-center text-red-500">{error}</p>}

        <div className="space-y-8">
          {!loading &&
            !error &&
            currentPosts.map((post) => (
              <div
                key={post.id}
                className={`p-6 bg-white rounded-xl shadow-lg border border-gray-100 transition duration-300 ${PRIMARY_BG_HOVER}`}
              >
                <p className="text-sm font-medium text-gray-500 mb-2">
                  {formatDate(post.published_at)}
                </p>

                <Link href={`/blog/${post.slug}`} className="block">
                  <h2 className="text-2xl font-bold text-gray-900 hover:text-red-700 transition duration-150 cursor-pointer">
                    {post.title}
                  </h2>
                </Link>

                <p className="mt-3 text-gray-600 leading-relaxed">
                  {post.summary ||
                    (post.description
                      ? post.description.slice(0, 200) + "..."
                      : "")}
                </p>

                <Link
                  href={`/blog/${post.slug}`}
                  className={`mt-4 inline-block font-semibold ${PRIMARY_HIGHLIGHT_TEXT} hover:underline`}
                >
                  Read More &rarr;
                </Link>
              </div>
            ))}
        </div>

        {!loading && blogs.length > 0 && (
          <>
            <div className="flex justify-center items-center mt-12 space-x-2">
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

              {renderPaginationButtons()}

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

            <div className="text-center mt-4 text-sm text-gray-500">
              Page {currentPage} of {totalPages}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default BlogsClient;
