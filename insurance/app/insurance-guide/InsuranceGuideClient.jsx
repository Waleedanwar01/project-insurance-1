"use client"
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import BlogCard from '@/app/components/BlogCard';
import { API_BASE_URL } from '@/lib/config';

const ITEMS_PER_PAGE = 10;

const InsuranceGuideClient = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalBlogs, setTotalBlogs] = useState(0);

  useEffect(() => {
    fetchBlogs();
  }, [currentPage]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const offset = (currentPage - 1) * ITEMS_PER_PAGE;
      // Filter by category name "Insurance Guide"
      const res = await fetch(
        `${API_BASE_URL}/api/blog/posts/?category__name=Insurance Guide&limit=${ITEMS_PER_PAGE}&offset=${offset}`
      );

      if (!res.ok) throw new Error('Failed to fetch blogs');

      const data = await res.json();
      const blogList = Array.isArray(data) ? data : data.results || [];

      setBlogs(blogList);
      setTotalBlogs(data.count || blogList.length);
    } catch (err) {
      console.error(err);
      setError('Unable to load Insurance Guide blogs');
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(totalBlogs / ITEMS_PER_PAGE);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading insurance guide blogs...</p>
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
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Insurance Guide</h1>
          <p className="text-xl text-red-100 max-w-3xl">
            Explore our comprehensive insurance guides to understand coverage options and make smart, money-saving decisions.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {blogs.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-gray-400 text-6xl mb-4">📄</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Insurance Guide Blogs Found</h3>
            <p className="text-gray-600">Check back later for new articles in our insurance guide.</p>
          </div>
        ) : (
          <>
            {/* Blog List - Vertical Layout */}
            <div className="space-y-6 mb-12">
              {blogs.map((blog) => (
                <div key={blog.id}>
                  <BlogCard blog={blog} />
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-4 py-2 text-sm font-medium rounded-md ${
                      currentPage === page
                        ? 'bg-red-600 text-white'
                        : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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

export default InsuranceGuideClient;
