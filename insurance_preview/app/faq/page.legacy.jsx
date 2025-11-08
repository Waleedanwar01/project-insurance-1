'use client';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Search, ChevronDown, ChevronUp, Filter, HelpCircle, Star, TrendingUp, Clock } from 'lucide-react';
import { API_BASE_URL } from '@/lib/config';

export default function FAQPage() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('');
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [categories, setCategories] = useState([]);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    fetchFAQs();
    fetchCategories();
  }, [currentPage, searchTerm, selectedCategory, selectedPriority]);

  const fetchFAQs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        page_size: itemsPerPage.toString(),
        ...(searchTerm && { search: searchTerm }),
        ...(selectedCategory && { category: selectedCategory }),
        ...(selectedPriority && { priority: selectedPriority })
      });
      
      const response = await fetch(`${API_BASE_URL}/api/faq/api/faqs/?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch FAQs');
      }
      const data = await response.json();
      setFaqs(data.results || data);
      setTotalPages(Math.ceil((data.count || data.length) / itemsPerPage));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/faq/api/categories/`);
      if (response.ok) {
        const data = await response.json();
        // Ensure categories is always an array (supports paginated and non-paginated responses)
        const list = Array.isArray(data) ? data : data.results || [];
        setCategories(list);
      }
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleCategoryFilter = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handlePriorityFilter = (priority) => {
    setSelectedPriority(priority);
    setCurrentPage(1);
  };

  const toggleFaq = (faqId) => {
    setExpandedFaq(expandedFaq === faqId ? null : faqId);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Pagination helper functions
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading FAQs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Frequently Asked Questions - Insurance FAQ</title>
        <meta name="description" content="Find answers to common questions about our insurance services and policies." />
      </Head>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-red-600 to-red-800 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <HelpCircle className="h-16 w-16 mx-auto mb-6 opacity-90" />
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-red-100 mb-8 max-w-2xl mx-auto">
            Get instant answers to common questions about our insurance services, policies, and claims process.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search FAQs..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full pl-12 pr-4 py-4 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-300 text-lg"
            />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filters:</span>
            </div>
            
            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => handleCategoryFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>

            {/* Priority Filter */}
            <select
              value={selectedPriority}
              onChange={(e) => handlePriorityFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="">All Priorities</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>

            {/* Clear Filters */}
            {(selectedCategory || selectedPriority || searchTerm) && (
              <button
                onClick={() => {
                  setSelectedCategory('');
                  setSelectedPriority('');
                  setSearchTerm('');
                  setCurrentPage(1);
                }}
                className="text-red-600 hover:text-red-800 text-sm font-medium"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* FAQ Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {faqs.length === 0 ? (
          <div className="text-center py-12">
            <HelpCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No FAQs Found</h3>
            <p className="text-gray-600">
              {searchTerm || selectedCategory || selectedPriority
                ? "Try adjusting your search or filters to find what you're looking for."
                : "No FAQs are available at the moment."}
            </p>
          </div>
        ) : (
          <>
            {/* Results Count */}
            <div className="mb-6">
              <p className="text-gray-600">
                Showing {faqs.length} of {totalPages * itemsPerPage} FAQs
                {searchTerm && ` for "${searchTerm}"`}
              </p>
            </div>

            {/* FAQ List - Vertical Layout */}
            <div className="space-y-4">
              {faqs.map((faq) => (
                <div
                  key={faq.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
                >
                  <div
                    className="p-6 cursor-pointer"
                    onClick={() => toggleFaq(faq.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 pr-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3 leading-relaxed">
                          {faq.question}
                        </h3>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(faq.priority)}`}>
                            {faq.priority}
                          </span>
                          <div className="flex items-center space-x-1">
                            <TrendingUp className="h-4 w-4" />
                            <span>{faq.views} views</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>{formatDate(faq.created_at)}</span>
                          </div>
                        </div>

                        {faq.short_answer && (
                          <p className="text-gray-600 line-clamp-2 mb-3 leading-relaxed">
                            {faq.short_answer}
                          </p>
                        )}

                        {faq.tags_list && faq.tags_list.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {faq.tags_list.map((tag, index) => (
                              <span
                                key={index}
                                className="bg-red-50 text-red-700 text-xs px-2 py-1 rounded-full border border-red-200"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-shrink-0">
                        {expandedFaq === faq.id ? (
                          <ChevronUp className="h-6 w-6 text-gray-400" />
                        ) : (
                          <ChevronDown className="h-6 w-6 text-gray-400" />
                        )}
                      </div>
                    </div>
                  </div>

                  {expandedFaq === faq.id && (
                    <div className="px-6 pb-6 border-t bg-gray-50">
                      <div 
                        className="prose max-w-none mt-4 text-gray-700 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: faq.answer }}
                      />
                      
                      <div className="flex items-center justify-between mt-6 pt-4 border-t">
                        <div className="flex items-center space-x-4">
                          <span className="text-sm text-gray-600 font-medium">Was this helpful?</span>
                          <div className="flex space-x-3">
                            <button className="flex items-center space-x-1 text-green-600 hover:text-green-700 hover:bg-green-50 px-3 py-1 rounded-lg transition-colors text-sm font-medium">
                              <span>👍</span>
                              <span>Yes ({faq.helpful_count || 0})</span>
                            </button>
                            <button className="flex items-center space-x-1 text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-1 rounded-lg transition-colors text-sm font-medium">
                              <span>👎</span>
                              <span>No ({faq.not_helpful_count || 0})</span>
                            </button>
                          </div>
                        </div>
                        
                        <Link
                          href={`/faq/${faq.slug}`}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-1 rounded-lg transition-colors text-sm font-medium"
                        >
                          View Details →
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center">
                <nav className="flex items-center space-x-2">
                  {/* Previous Button */}
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      currentPage === 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                    }`}
                  >
                    Previous
                  </button>

                  {/* Page Numbers */}
                  {getPageNumbers().map((page, index) => (
                    <button
                      key={index}
                      onClick={() => typeof page === 'number' && handlePageChange(page)}
                      disabled={page === '...'}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        page === currentPage
                          ? 'bg-red-600 text-white'
                          : page === '...'
                          ? 'bg-transparent text-gray-400 cursor-default'
                          : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  {/* Next Button */}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      currentPage === totalPages
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                    }`}
                  >
                    Next
                  </button>
                </nav>
              </div>
            )}

          </>
        )}
      </div>

      {/* Contact Section */}
      <div className="bg-gray-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Still Have Questions?</h2>
          <p className="text-gray-300 mb-8 text-lg">
            Can't find what you're looking for? Our support team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium"
            >
              Contact Support
            </Link>
            <Link
              href="/blog"
              className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-white hover:text-gray-900 transition-colors duration-200 font-medium"
            >
              Read Our Blog
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}