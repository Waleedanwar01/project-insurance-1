import React from "react";
import Link from "next/link";
import { API_BASE_URL } from "@/lib/config";

const ITEMS_PER_PAGE = 10;

async function getBlogsByCategory(categorySlug, page = 1) {
  try {
    const offset = (page - 1) * ITEMS_PER_PAGE;
    const res = await fetch(
      `${API_BASE_URL}/api/blog/posts/?category=${categorySlug}&limit=${ITEMS_PER_PAGE}&offset=${offset}`,
      { cache: "no-store" }
    );
    if (!res.ok) {
      throw new Error(`Failed to fetch blogs (${res.status})`);
    }
    const data = await res.json();
    return {
      results: Array.isArray(data) ? data : data.results || [],
      count: data.count || (Array.isArray(data) ? data.length : (data.results?.length || 0)),
    };
  } catch (err) {
    console.error("Fetch Error:", err);
    return { error: err.message };
  }
}

const StateBlogsPage = async ({ params, searchParams }) => {
  const { state } = params;
  const currentPage = parseInt(searchParams.page || "1");

  const data = await getBlogsByCategory(state, currentPage);

  if (data.error) {
    return (
      <div className="text-center py-20 text-red-500">
        Error loading blogs for {state}: {data.error}
      </div>
    );
  }

  if (!data.results.length) {
    return (
      <p className="text-center py-20 text-gray-600 text-lg">
        No blogs found for <strong>{state}</strong>
      </p>
    );
  }

  const totalPages = Math.ceil(data.count / ITEMS_PER_PAGE);
  const currentPosts = data.results;

  const formatDate = (dateString) => {
    if (!dateString) return "No Date Provided";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
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
        <Link
          key={i}
          href={`/states/${state}?page=${i}`}
          className={`px-4 py-2 mx-1 rounded-md text-sm font-medium transition duration-150 ease-in-out ${
            i === currentPage
              ? "bg-red-600 text-white shadow-lg"
              : "bg-white text-gray-700 border border-gray-300 hover:bg-red-50"
          }`}
        >
          {i}
        </Link>
      );
    }
    return pages;
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-6 border-b-4 border-red-500 pb-3">
          {state} Auto Insurance Blogs
        </h1>
        <p className="text-lg text-gray-600 mb-10">
          Explore the latest articles regarding auto insurance in {state}. Learn
          how to save, get discounts, and discover industry updates.
        </p>

        <div className="space-y-8">
          {currentPosts.map((post) => (
            <div
              key={post.id}
              className={`p-6 bg-white rounded-xl shadow-lg border border-gray-100 transition duration-300 hover:bg-red-50`}
            >
              <p className="text-sm font-medium text-gray-500 mb-2">
                {formatDate(post.published_at)}
              </p>

              <Link
                href={`/states/${state}/${post.slug}`}
                className="block"
              >
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
                href={`/states/${state}/${post.slug}`}
                className={`mt-4 inline-block font-semibold text-red-600 hover:underline`}
              >
                Read More &rarr;
              </Link>
            </div>
          ))}
        </div>

        {data.results.length > 0 && (
          <>
            <div className="flex justify-center items-center mt-12 space-x-2">
              <Link
                href={`/states/${state}?page=${currentPage - 1}`}
                className={`px-4 py-2 mx-1 rounded-md text-sm font-medium transition duration-150 ease-in-out ${
                  currentPage === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-red-50"
                }`}
                aria-disabled={currentPage === 1}
              >
                &larr; Previous
              </Link>

              {renderPaginationButtons()}

              <Link
                href={`/states/${state}?page=${currentPage + 1}`}
                className={`px-4 py-2 mx-1 rounded-md text-sm font-medium transition duration-150 ease-in-out ${
                  currentPage === totalPages
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-red-50"
                }`}
                aria-disabled={currentPage === totalPages}
              >
                Next &rarr;
              </Link>
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

export default StateBlogsPage;
