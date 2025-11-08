'use client';
import { useState, useEffect } from 'react';
import { API_BASE_URL } from '@/lib/config';
import Link from 'next/link';
import { Search, ChevronRight, HelpCircle, Clock, Filter, Star, MessageCircle } from 'lucide-react';

export default function FaqsClient() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [filteredFaqs, setFilteredFaqs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [categories, setCategories] = useState([]);
  const ITEMS_PER_PAGE = 12;

  const slugify = (text) =>
    String(text || '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

  const getSafeSlug = (faq) => faq?.slug || slugify(faq?.question);

  useEffect(() => {
    fetchFaqs();
    fetchCategories();
  }, []);

  useEffect(() => {
    filterFaqs();
  }, [faqs, searchTerm, selectedCategory, currentPage]);

  const fetchFaqs = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/faq/api/faqs/?page=${currentPage}&page_size=${ITEMS_PER_PAGE}`);
      const data = await response.json();
      setFaqs(data.results || data);
      setTotalPages(Math.ceil((data.count || data.length) / ITEMS_PER_PAGE));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/faq/api/categories/`);
      const data = await response.json();
      setCategories(data.results || data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const filterFaqs = () => {
    let filtered = faqs;

    if (searchTerm) {
      filtered = filtered.filter(faq =>
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.summary?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(faq => faq.category?.slug === selectedCategory);
    }

    setFilteredFaqs(filtered);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Slug comes from backend; avoid generating client slugs to prevent mismatches

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading FAQs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-red-600 to-red-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <HelpCircle className="w-16 h-16 mx-auto mb-4 text-red-100" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-xl md:text-2xl text-red-100 max-w-3xl mx-auto">
              Find answers to common questions about insurance policies, claims, and coverage
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search FAQs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>

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

      {/* FAQ Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {filteredFaqs.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">❓</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No FAQs found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFaqs.map((faq) => (
                <div key={faq.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                  {/* Header */}
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <HelpCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        {faq.priority && (
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(faq.priority)}`}>
                            {faq.priority}
                          </span>
                        )}
                      </div>
                      {faq.category && (
                        <span className="bg-red-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                          {faq.category.name}
                        </span>
                      )}
                    </div>

                    {/* Question */}
                    <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 hover:text-red-600 transition-colors">
                      <Link href={`/faq/${getSafeSlug(faq)}`}>
                        {faq.question}
                      </Link>
                    </h3>

                    {/* Summary/Preview */}
                    <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                      {faq.short_answer || faq.answer?.substring(0, 120) + '...'}
                    </p>
                  </div>

                  {/* Footer */}
                  <div className="p-4 bg-gray-50">
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{formatDate(faq.created_at)}</span>
                        </div>
                        {/* Views removed as requested */}
                      </div>
                      {faq.rating && (
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span>{faq.rating}</span>
                        </div>
                      )}
                    </div>

                    {/* Read More Link */}
                    <Link
                      href={`/faq/${getSafeSlug(faq)}`}
                      className="inline-flex items-center gap-2 text-red-600 font-medium hover:text-red-700 transition-colors text-sm"
                    >
                      Read Answer
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-12 gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-4 py-2 border rounded-lg text-sm font-medium transition duration-150 ${
                      currentPage === page 
                        ? 'bg-red-600 text-white border-red-600 shadow-md' 
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {page}
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

      {/* Help Section */}
      <div className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <MessageCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Still have questions?
            </h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Can't find the answer you're looking for? Our support team is here to help you with any insurance-related questions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Contact Support
              </Link>
              <Link
                href="/blog"
                className="border border-red-600 text-red-600 px-6 py-3 rounded-lg hover:bg-red-50 transition-colors font-medium"
              >
                Browse Articles
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}