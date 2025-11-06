'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Calendar, 
  User, 
  Share2, 
  ChevronLeft,
  ThumbsUp,
  ThumbsDown,
  Clock,
  Tag,
  Play,
  Image as ImageIcon
} from 'lucide-react';
import { API_BASE_URL } from '@/lib/config';
import ThankYouBack from '@/app/components/ThankYouBack';

const BlogDetailClient = ({ params, backHref = '/blog', backLabel = 'Back to Blog' }) => {
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [slug, setSlug] = useState(null);
  const [feedback, setFeedback] = useState({ helpful: null, submitted: false });

  // Derived state for feedback counts
  const helpfulCount = post?.helpful_count || 0;
  const notHelpfulCount = post?.not_helpful_count || 0;

  // Handle params Promise in Next.js 15
  useEffect(() => {
    const resolveParams = async () => {
      try {
        const resolvedParams = await params;
        setSlug(resolvedParams?.slug);
      } catch (error) {
        console.error('Error resolving params:', error);
        setError('Invalid page parameters');
        setLoading(false);
      }
    };
    
    resolveParams();
  }, [params]);

  useEffect(() => {
    if (slug && slug !== 'undefined') {
      fetchPost();
      fetchRelatedPosts();
    } else if (slug === 'undefined') {
      setError('Invalid blog post URL');
      setLoading(false);
    }
  }, [slug]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/blog/posts/${slug}/`);
      // Handle 404 gracefully without throwing to console
      if (res.status === 404) {
        setError('Article not found');
        setPost(null);
        return;
      }
      if (!res.ok) {
        try {
          const body = await res.text();
          console.error('Failed to fetch article:', res.status, body);
        } catch {}
        setError('Unable to load article. Please try again later.');
        setPost(null);
        return;
      }
      const data = await res.json();
      setPost(data);
      
      // Increment view count (legacy path)
      try {
        await fetch(`${API_BASE_URL}/api/blog/posts/${slug}/increment-views/`, {
          method: 'POST',
        });
      } catch (viewError) {
        console.error('Error incrementing views:', viewError);
      }
    } catch (err) {
      console.error(err);
      setError('Unable to load article. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedPosts = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/blog/posts/?limit=3`);
      if (res.ok) {
        const data = await res.json();
        setRelatedPosts(data.results || data);
      }
    } catch (err) {
      console.error('Error fetching related posts:', err);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getReadingTime = (content) => {
    if (!content) return '1 min read';
    const wordsPerMinute = 200;
    const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
  };

  const handleShare = (platform) => {
    const url = window.location.href;
    const title = post?.title || 'Blog Post';
    const text = post?.summary || `Check out this article: ${title}`;
    
    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    };
    
    if (platform === 'copy') {
      navigator.clipboard.writeText(url).then(() => {
        // Show success message
        const button = document.querySelector('[data-copy-button]');
        if (button) {
          const originalText = button.textContent;
          button.textContent = 'Copied!';
          setTimeout(() => {
            button.textContent = originalText;
          }, 2000);
        }
      });
    } else {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
    setShowShareMenu(false);
  };

  const handleFeedback = async (isHelpful) => {
    if (feedback.submitted) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/blog/posts/${slug}/feedback/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_helpful: isHelpful, comment: '' }),
      });
      
      if (response.ok) {
        setFeedback({ helpful: isHelpful, submitted: true });
        // Update post data to reflect new counts
        const updatedPost = { ...post };
        if (isHelpful) {
          updatedPost.helpful_count = (updatedPost.helpful_count || 0) + 1;
        } else {
          updatedPost.not_helpful_count = (updatedPost.not_helpful_count || 0) + 1;
        }
        setPost(updatedPost);
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };

  const createSlug = (title) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  };

  const renderContent = (content) => {
    if (!content) return '<p>No content available for this post.</p>';
    
    // Enhanced content rendering with better typography and spacing
    let processedContent = content;
    
    // Add proper heading styles with better spacing
    processedContent = processedContent.replace(
      /<h1([^>]*)>/g, 
      '<h1$1 class="text-4xl font-bold text-gray-900 mt-12 mb-6 leading-tight border-b-2 border-red-100 pb-4">'
    );
    
    processedContent = processedContent.replace(
      /<h2([^>]*)>/g, 
      '<h2$1 class="text-3xl font-bold text-gray-900 mt-10 mb-5 leading-tight">'
    );
    
    processedContent = processedContent.replace(
      /<h3([^>]*)>/g, 
      '<h3$1 class="text-2xl font-semibold text-gray-900 mt-8 mb-4 leading-tight">'
    );
    
    processedContent = processedContent.replace(
      /<h4([^>]*)>/g, 
      '<h4$1 class="text-xl font-semibold text-gray-900 mt-6 mb-3 leading-tight">'
    );
    
    processedContent = processedContent.replace(
      /<h5([^>]*)>/g, 
      '<h5$1 class="text-lg font-semibold text-gray-900 mt-6 mb-3 leading-tight">'
    );
    
    processedContent = processedContent.replace(
      /<h6([^>]*)>/g, 
      '<h6$1 class="text-base font-semibold text-gray-900 mt-4 mb-2 leading-tight">'
    );
    
    // Add better paragraph spacing
    processedContent = processedContent.replace(
      /<p([^>]*)>/g, 
      '<p$1 class="mb-6 leading-relaxed text-gray-800">'
    );
    
    // Add responsive classes to images with better spacing
    processedContent = processedContent.replace(
      /<img([^>]*)>/g, 
      '<div class="my-8"><img$1 class="w-full h-auto rounded-xl shadow-lg max-w-full mx-auto" loading="lazy"></div>'
    );
    
    // Add responsive classes to videos with better spacing
    processedContent = processedContent.replace(
      /<video([^>]*)>/g,
      '<div class="relative w-full my-8 rounded-xl overflow-hidden shadow-lg"><video$1 class="w-full h-auto" controls></video></div>'
    );
    
    // Add responsive classes to iframes (for embedded videos) with better spacing
    processedContent = processedContent.replace(
      /<iframe([^>]*)>/g,
      '<div class="relative w-full aspect-video my-8 rounded-xl overflow-hidden shadow-lg"><iframe$1 class="absolute inset-0 w-full h-full"></iframe></div>'
    );
    
    // Style lists better
    processedContent = processedContent.replace(
      /<ul([^>]*)>/g, 
      '<ul$1 class="mb-6 pl-6 space-y-2">'
    );
    
    processedContent = processedContent.replace(
      /<ol([^>]*)>/g, 
      '<ol$1 class="mb-6 pl-6 space-y-2">'
    );
    
    processedContent = processedContent.replace(
      /<li([^>]*)>/g, 
      '<li$1 class="text-gray-800 leading-relaxed">'
    );
    
    // Style blockquotes
    processedContent = processedContent.replace(
      /<blockquote([^>]*)>/g, 
      '<blockquote$1 class="border-l-4 border-red-500 pl-6 py-4 my-8 bg-gray-50 rounded-r-lg italic text-gray-700">'
    );

    // Style links to be clean blue
    processedContent = processedContent.replace(
      /<a([^>]*)>/g,
      '<a$1 class="text-blue-600 hover:text-blue-700 underline underline-offset-2">'
    );
    
    // Style tables
    processedContent = processedContent.replace(
      /<table([^>]*)>/g, 
      '<div class="overflow-x-auto my-8"><table$1 class="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">'
    );
    
    processedContent = processedContent.replace(
      /<th([^>]*)>/g, 
      '<th$1 class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">'
    );
    
    processedContent = processedContent.replace(
      /<td([^>]*)>/g, 
      '<td$1 class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-b">'
    );
    
    // Close table wrapper div
    processedContent = processedContent.replace(
      /<\/table>/g, 
      '</table></div>'
    );
    
    // Style code blocks
    processedContent = processedContent.replace(
      /<pre([^>]*)>/g, 
      '<pre$1 class="bg-gray-900 text-gray-100 p-6 rounded-lg overflow-x-auto my-8 text-sm">'
    );
    
    processedContent = processedContent.replace(
      /<code([^>]*)>/g, 
      '<code$1 class="bg-gray-100 text-red-600 px-2 py-1 rounded text-sm font-mono">'
    );
    
    return processedContent;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading article...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-6xl mb-6">📄</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Article not found</h2>
          <p className="text-gray-600 mb-8 text-lg leading-relaxed">{error || 'The article you are looking for does not exist.'}</p>
          <Link
            href={backHref}
            className="inline-flex items-center gap-2 bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 transition-colors font-medium text-lg"
          >
            <ChevronLeft className="w-5 h-5" />
            {backLabel}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-red-500 via-red-600 to-red-700 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
          {/* Breadcrumb */}
          <div className="mb-8">
            <Link
              href={backHref}
              className="inline-flex items-center gap-2 text-red-100 hover:text-white font-medium transition-all duration-200 hover:translate-x-1"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              {backLabel}
            </Link>
          </div>
          
          <div className="text-center">
            {/* Category Badge */}
            {post.category && (
              <div className="mb-6">
                <span className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-full text-sm font-semibold border border-white/30">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
                  </svg>
                  {post.category.name}
                </span>
              </div>
            )}

            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight tracking-tight">
              {post.title}
            </h1>
            
            {/* Meta Information */}
            <div className="flex flex-wrap justify-center items-center gap-8 text-red-100 mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-full">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="font-medium">{post.author?.name || post.author?.username || 'Admin'}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-full">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                </div>
                <span>{formatDate(post.created_at || post.published_at)}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-full">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                </div>
                <span>{getReadingTime(post.content)}</span>
              </div>
              {post.views && (
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-full">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span>{post.views} views</span>
                </div>
              )}
            </div>


          </div>
        </div>
      </div>

      {/* Main Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Summary */}
        {post.summary && (
          <div className="bg-gradient-to-r from-red-50 via-red-50 to-red-100 border-l-4 border-red-500 p-8 mb-12 rounded-r-2xl shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <div className="p-2 bg-red-500 text-white rounded-lg">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              Summary
            </h2>
            <p className="text-xl text-gray-800 leading-relaxed font-medium">
              {post.summary}
            </p>
          </div>
        )}

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-12 mb-12">
          <div
            className="prose prose-lg prose-red max-w-none text-gray-800 leading-relaxed"
            style={{
              fontSize: '18px',
              lineHeight: '1.8',
              fontFamily: 'system-ui, -apple-system, sans-serif'
            }}
            dangerouslySetInnerHTML={{
              __html: renderContent(post.content),
            }}
          />
        </div>

        {/* Feedback Section */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 mb-12">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Was this article helpful?</h3>
            <div className="text-sm text-gray-600">
              <span className="mr-4">👍 {helpfulCount}</span>
              <span>👎 {notHelpfulCount}</span>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => handleFeedback(true)}
              disabled={feedback.submitted}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border transition ${feedback.submitted ? 'bg-gray-100 text-gray-400 border-gray-200' : 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'}`}
            >
              <ThumbsUp className="w-4 h-4" /> Helpful
            </button>
            <button
              onClick={() => handleFeedback(false)}
              disabled={feedback.submitted}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border transition ${feedback.submitted ? 'bg-gray-100 text-gray-400 border-gray-200' : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'}`}
            >
              <ThumbsDown className="w-4 h-4" /> Not helpful
            </button>
            {feedback.submitted && (
              <span className="ml-3 text-sm text-gray-600">Thanks for your feedback!</span>
            )}
          </div>
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-12 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-red-500 text-white rounded-lg">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Related Tags</h3>
            </div>
            <div className="flex flex-wrap gap-3">
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-50 to-red-100 text-red-700 rounded-full text-sm font-semibold border border-red-200 hover:from-red-100 hover:to-red-200 hover:border-red-300 transition-all duration-200 hover:scale-105 cursor-pointer shadow-sm hover:shadow-md"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
                  </svg>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </article>

      {/* Thank you + Back */}
      <ThankYouBack message="Thank you for reading!" />

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <div className="bg-white border-t">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedPosts.slice(0, 3).map((relatedPost) => (
                <Link
                  key={relatedPost.id}
                  href={`/blog/${relatedPost.slug || createSlug(relatedPost.title)}`}
                  className="group block bg-gray-50 rounded-xl p-6 hover:bg-white hover:shadow-lg transition-all duration-300 border border-gray-100"
                >
                  <div className="flex items-start gap-4">
                    <div className="text-red-600 text-2xl flex-shrink-0 group-hover:scale-110 transition-transform">
                      📄
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-red-600 transition-colors text-lg leading-tight">
                        {relatedPost.title}
                      </h3>
                      <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed mb-4">
                        {relatedPost.summary}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span className="bg-gray-200 px-2 py-1 rounded">{relatedPost.category?.name}</span>
                        {/* Views removed as requested */}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default BlogDetailClient;
