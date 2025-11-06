'use client';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Calendar, User, ChevronRight, Filter } from 'lucide-react';
import BlogCard from '@/app/components/BlogCard';
import { API_BASE_URL, SITE_NAME } from '@/lib/config';

export default function BlogPage() {
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // Removed search term state (search bar removed)
  const [selectedCategory, setSelectedCategory] = useState('');
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    fetchBlogs();
  }, [currentPage, selectedCategory]);

  // Search removed; no debounce needed

  // Reset to first page when search or category changes to avoid empty results on higher pages
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory]);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    filterBlogs();
  }, [blogs]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      setError("");
      const params = new URLSearchParams({
        page: String(currentPage),
        page_size: String(ITEMS_PER_PAGE),
        ...(selectedCategory ? { category: selectedCategory } : {}),
      });
      const response = await fetch(`${API_BASE_URL}/api/blog/posts/?${params.toString()}`, {
        cache: 'no-store',
      });
      if (!response.ok) throw new Error(`Failed to fetch blogs: ${response.status}`);
      const data = await response.json();
      const list = data.results || data;
      setBlogs(list);
      setFilteredBlogs(list);
      setTotalPages(Math.ceil((data.count || list.length) / ITEMS_PER_PAGE));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      setError('Unable to load blogs. Please check your connection or try again later.');
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/blog/categories/`, {
        cache: 'no-store',
      });
      if (!response.ok) throw new Error(`Failed to fetch categories: ${response.status}`);
      const data = await response.json();
      setCategories(data.results || data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const filterBlogs = () => {
    // Server-side filters already applied; keep list in sync
    setFilteredBlogs(blogs);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const createSlug = (title) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading blogs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600 text-lg font-semibold mb-2">{error}</p>
          <p className="text-gray-600">If the issue persists, ensure the API server is running.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{`All Blogs${SITE_NAME ? ' | ' + SITE_NAME : ''}`}</title>
        <meta name="description" content="Stay updated with the latest insurance news, tips, and insights from our expert team at Insurance Panda." />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-red-600 to-red-800 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Insurance Blog
              </h1>
              <p className="text-xl md:text-2xl text-red-100 max-w-3xl mx-auto">
                Stay informed with the latest insurance news, expert tips, and industry insights
              </p>
            </div>
          </div>
        </div>

        {/* Filter Section */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* Category Filter */}
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-500" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.slug}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Blog Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {filteredBlogs.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No articles found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
            </div>
          ) : (
            <>
              {/* Blog Articles - Vertical Layout */}
              <div className="space-y-6">
                {filteredBlogs.map((blog) => (
                  <div key={blog.id}>
                    <BlogCard blog={blog} />
                  </div>
                ))}
              </div>

              {/* Enhanced Pagination */}
              {totalPages > 1 && (
                <div className="mt-12">
                  <div className="flex justify-center items-center gap-2 mb-4">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Previous
                    </button>
                    
                    {/* Page Numbers with Smart Display */}
                    {(() => {
                      const pages = [];
                      const showPages = 5; // Show 5 page numbers at most
                      let startPage = Math.max(1, currentPage - Math.floor(showPages / 2));
                      let endPage = Math.min(totalPages, startPage + showPages - 1);
                      
                      // Adjust start if we're near the end
                      if (endPage - startPage < showPages - 1) {
                        startPage = Math.max(1, endPage - showPages + 1);
                      }
                      
                      // First page
                      if (startPage > 1) {
                        pages.push(
                          <button
                            key={1}
                            onClick={() => handlePageChange(1)}
                            className="px-4 py-2 border rounded-lg text-sm font-medium transition duration-150 bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                          >
                            1
                          </button>
                        );
                        if (startPage > 2) {
                          pages.push(<span key="start-ellipsis" className="px-2 text-gray-500">...</span>);
                        }
                      }
                      
                      // Page numbers
                      for (let i = startPage; i <= endPage; i++) {
                        pages.push(
                          <button
                            key={i}
                            onClick={() => handlePageChange(i)}
                            className={`px-4 py-2 border rounded-lg text-sm font-medium transition duration-150 ${
                              currentPage === i 
                                ? 'bg-red-600 text-white border-red-600 shadow-md' 
                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {i}
                          </button>
                        );
                      }
                      
                      // Last page
                      if (endPage < totalPages) {
                        if (endPage < totalPages - 1) {
                          pages.push(<span key="end-ellipsis" className="px-2 text-gray-500">...</span>);
                        }
                        pages.push(
                          <button
                            key={totalPages}
                            onClick={() => handlePageChange(totalPages)}
                            className="px-4 py-2 border rounded-lg text-sm font-medium transition duration-150 bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                          >
                            {totalPages}
                          </button>
                        );
                      }
                      
                      return pages;
                    })()}
                    
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Next
                    </button>
                  </div>
                  
                  {/* Page Info */}
                  <div className="text-center text-sm text-gray-600">
                    Showing page {currentPage} of {totalPages} ({filteredBlogs.length} articles)
                  </div>
                </div>
              )}

            </>
          )}
        </div>
      </div>
    </>
  );
}