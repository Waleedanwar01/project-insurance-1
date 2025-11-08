import { useState, useEffect } from 'react';
import { API_BASE_URL } from '@/lib/config';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, User, ArrowLeft, Share2, Facebook, Twitter, Linkedin, ChevronRight } from 'lucide-react';
import ThankYouBack from '@/app/components/ThankYouBack';

export default function BlogDetail() {
  const router = useRouter();
  const { slug } = router.query;
  const [blog, setBlog] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (slug) {
      fetchBlog();
    }
  }, [slug]);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/blog/posts/${slug}/`);
      
      if (!response.ok) {
        throw new Error('Blog not found');
      }
      
      const data = await response.json();
      setBlog(data);
      
      // Increment view count
      await fetch(`${API_BASE_URL}/api/blog/posts/${slug}/increment_view/`, {
        method: 'POST',
      });
      
      // Fetch related blogs
      if (data.category) {
        fetchRelatedBlogs(data.category.slug, data.id);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching blog:', error);
      setError(error.message);
      setLoading(false);
    }
  };

  const fetchRelatedBlogs = async (categorySlug, currentBlogId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/blog/posts/?category=${categorySlug}`);
      const data = await response.json();
      const related = (data.results || data)
        .filter(blog => blog.id !== currentBlogId)
        .slice(0, 3);
      setRelatedBlogs(related);
    } catch (error) {
      console.error('Error fetching related blogs:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareTitle = blog?.title || '';

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😞</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Blog Not Found</h1>
          <p className="text-gray-600 mb-6">The article you're looking for doesn't exist.</p>
          <Link
            href="/blog"
            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors duration-200"
          >
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{blog.title} - Insurance Blog</title>
        <meta name="description" content={blog.summary} />
        <meta property="og:title" content={blog.title} />
        <meta property="og:description" content={blog.summary} />
        <meta property="og:image" content={blog.feature_image} />
        <meta property="og:url" content={shareUrl} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Back Button */}
        <div className="bg-white border-b">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Link
              href="/blog"
              className="inline-flex items-center text-red-600 hover:text-red-800 transition-colors duration-200"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Link>
          </div>
        </div>

        {/* Article Header */}
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Featured Image */}
            {blog.feature_image && (
              <div className="relative h-64 md:h-96">
                <Image
                  src={blog.feature_image}
                  alt={blog.title}
                  fill
                  className="object-cover"
                />
                {blog.category && (
                  <div className="absolute top-6 left-6">
                    <span className="bg-red-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                      {blog.category.name}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Article Content */}
            <div className="p-6 md:p-8">
              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                {blog.title}
              </h1>

              {/* Meta Information */}
              <div className="flex flex-wrap items-center text-sm text-gray-500 mb-6 pb-6 border-b">
                <div className="flex items-center mr-6 mb-2">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>{formatDate(blog.published_at)}</span>
                </div>
                {blog.author && (
                  <div className="flex items-center mr-6 mb-2">
                    <User className="h-4 w-4 mr-2" />
                    <span>{blog.author}</span>
                  </div>
                )}
                {/* Views removed as requested */}
                
                {/* Share Buttons */}
                <div className="flex items-center space-x-2 ml-auto">
                  <Share2 className="h-4 w-4 text-gray-400" />
                  <a
                    href={shareLinks.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                  >
                    <Facebook className="h-5 w-5" />
                  </a>
                  <a
                    href={shareLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-600 transition-colors duration-200"
                  >
                    <Twitter className="h-5 w-5" />
                  </a>
                  <a
                    href={shareLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-700 hover:text-blue-900 transition-colors duration-200"
                  >
                    <Linkedin className="h-5 w-5" />
                  </a>
                </div>
              </div>

              {/* Summary */}
              {blog.summary && (
                <div className="bg-gray-50 p-6 rounded-lg mb-8">
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">Summary</h2>
                  <p className="text-gray-700 leading-relaxed">{blog.summary}</p>
                </div>
              )}

              {/* Content */}
              <div 
                className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-red-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900 prose-ul:text-gray-700 prose-ol:text-gray-700"
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />

              {/* Video */}
              {blog.video_url && (
                <div className="mt-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Related Video</h3>
                  <div className="aspect-video">
                    <iframe
                      src={blog.video_url}
                      className="w-full h-full rounded-lg"
                      allowFullScreen
                    />
                  </div>
                </div>
              )}

              {/* Additional Images */}
              {blog.additional_images && blog.additional_images.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Gallery</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {blog.additional_images.map((image) => (
                      <div key={image.id} className="relative h-64 rounded-lg overflow-hidden">
                        <Image
                          src={image.image}
                          alt={image.caption || 'Gallery image'}
                          fill
                          className="object-cover"
                        />
                        {image.caption && (
                          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2">
                            <p className="text-sm">{image.caption}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Attachments */}
              {blog.attachments && (
                <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Download</h3>
                  <a
                    href={blog.attachments}
                    download
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    Download Attachment
                  </a>
                </div>
              )}
            </div>
          </div>
        </article>

        {/* Thank you + Back */}
        <ThankYouBack message="Thank you for reading!" />

        {/* Related Articles */}
        {relatedBlogs.length > 0 && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedBlogs.map((relatedBlog) => (
                <div key={relatedBlog.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className="relative h-32 bg-gray-200">
                    {relatedBlog.feature_image ? (
                      <Image
                        src={relatedBlog.feature_image}
                        alt={relatedBlog.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full bg-gradient-to-br from-red-100 to-red-200">
                        <div className="text-red-400 text-2xl">📄</div>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {relatedBlog.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {relatedBlog.summary}
                    </p>
                    <Link
                      href={`/blog/${relatedBlog.slug}`}
                      className="inline-flex items-center text-red-600 hover:text-red-800 text-sm font-medium transition-colors duration-200"
                    >
                      Read More
                      <ChevronRight className="h-3 w-3 ml-1" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}