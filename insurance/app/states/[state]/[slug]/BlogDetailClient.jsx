"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Calendar, User, ArrowLeft, Share2, Facebook, Twitter, Linkedin, ChevronRight, ChevronLeft } from "lucide-react";
import { API_BASE_URL } from "@/lib/config";
import ThankYouBack from '@/app/components/ThankYouBack';

// Match main blog: clock icon used in meta row
const ClockIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
  </svg>
);

// Match main blog: content transformer with headings/paragraphs/media styling
const renderContent = (content) => {
  if (!content) return '<p>No content available for this post.</p>';

  let processedContent = content;

  // Headings
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

  // Paragraphs
  processedContent = processedContent.replace(
    /<p([^>]*)>/g,
    '<p$1 class="mb-6 leading-relaxed text-gray-800">'
  );

  // Images
  processedContent = processedContent.replace(
    /<img([^>]*)>/g,
    '<div class="my-8"><img$1 class="w-full h-auto rounded-xl shadow-lg max-w-full mx-auto" loading="lazy"></div>'
  );

  // Video
  processedContent = processedContent.replace(
    /<video([^>]*)>/g,
    '<div class="relative w-full my-8 rounded-xl overflow-hidden shadow-lg"><video$1 class="w-full h-auto" controls></video></div>'
  );

  // Iframes
  processedContent = processedContent.replace(
    /<iframe([^>]*)>/g,
    '<div class="relative w-full aspect-video my-8 rounded-xl overflow-hidden shadow-lg"><iframe$1 class="absolute inset-0 w-full h-full"></iframe></div>'
  );

  // Lists
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

  // Blockquotes
  processedContent = processedContent.replace(
    /<blockquote([^>]*)>/g,
    '<blockquote$1 class="border-l-4 border-red-500 pl-6 py-4 my-8 bg-gray-50 rounded-r-lg italic text-gray-700">'
  );

  // Tables
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
  processedContent = processedContent.replace(
    /<\/table>/g,
    '</table></div>'
  );

  // Code blocks
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

const BlogDetailClient = ({ state, slug }) => {
  const [post, setPost] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/blog/posts/${slug}/`);
        if (!res.ok) throw new Error("Unable to fetch blog");
        const data = await res.json();
        setPost(data);
        // Increment view count (best-effort)
        try {
          await fetch(`${API_BASE_URL}/api/blog/posts/${slug}/increment_view/`, { method: "POST" });
        } catch {}
        // Fetch related by category/state
        if (data?.category?.slug) {
          fetchRelated(data.category.slug, data.id);
        }
      } catch (err) {
        console.error(err);
        setError("Unable to load blog post. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [slug]);

  const fetchRelated = async (categorySlug, currentId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/blog/posts/?category=${categorySlug}&limit=6`);
      if (!res.ok) return;
      const data = await res.json();
      const list = Array.isArray(data) ? data : data.results || [];
      setRelated(list.filter((b) => b.id !== currentId).slice(0, 3));
    } catch (e) {
      // ignore
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "No Date Provided";
    const d = new Date(dateString);
    return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  };

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareTitle = post?.title || "";
  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
  };

  const getReadingTime = (content) => {
    if (!content) return "1 min read";
    const wordsPerMinute = 200;
    const words = content.replace(/<[^>]*>/g, "").split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-500"></div>
      </div>
    );
  }
  if (error || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Post Not Found</h1>
          <p className="text-gray-600 mb-6">The article you're looking for doesn't exist.</p>
          <Link href={`/states/${state}`} className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors">Back to {state} Blogs</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section (matches blog layout) */}
      <div className="bg-gradient-to-br from-red-500 via-red-600 to-red-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
          {/* Breadcrumb */}
          <div className="mb-8">
            <Link
              href={`/states/${state}`}
              className="inline-flex items-center gap-2 text-red-100 hover:text-white font-medium transition-all duration-200 hover:translate-x-1"
            >
              <ChevronLeft className="w-5 h-5" />
              Back to {state} Blogs
            </Link>
          </div>

          <div className="text-center">
            {/* Category Badge */}
            {post.category && (
              <div className="mb-6">
                <span className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-full text-sm font-semibold border border-white/30">
                  {post.category.name}
                </span>
              </div>
            )}

            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight tracking-tight">
              {post.title}
            </h1>

            {/* Meta */}
            <div className="flex flex-wrap justify-center items-center gap-8 text-red-100 mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-full">
                  <User className="w-5 h-5" />
                </div>
                <span className="font-medium">{post.author?.name || post.author?.username || "Admin"}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-full">
                  <Calendar className="w-5 h-5" />
                </div>
                <span>{formatDate(post.created_at || post.published_at)}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-full">
                  <ClockIcon />
                </div>
                <span>{getReadingTime(post.content)}</span>
              </div>
              {/* Views removed as requested */}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Summary */}
        {post.summary && (
          <div className="bg-gradient-to-r from-red-50 via-red-50 to-red-100 border-l-4 border-red-500 p-8 mb-12 rounded-r-2xl shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Summary</h2>
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
              __html: renderContent(post.content || "")
            }}
          />
        </div>

        {/* Attachments */}
        {post.attachments && (
          <div className="mt-8 p-6 bg-red-50 rounded-xl border border-red-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Download</h3>
            <a href={post.attachments} download className="text-red-500 hover:text-red-600 underline">Download Attachment</a>
          </div>
        )}
      </article>

      {/* Thank you + Back */}
      <ThankYouBack message={`Thank you for reading ${state} blog!`} />

      {/* Related Articles */}
      {related.length > 0 && (
        <div className="bg-white border-t">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Related {state} Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {related.slice(0,3).map((r) => (
                <Link
                  key={r.id}
                  href={`/states/${state}/${r.slug}`}
                  className="group block bg-gray-50 rounded-xl p-6 hover:bg-white hover:shadow-lg transition-all duration-300 border border-gray-100"
                >
                  <div className="flex items-start gap-4">
                    <div className="text-red-600 text-2xl flex-shrink-0 group-hover:scale-110 transition-transform">
                      📄
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-red-600 transition-colors text-lg leading-tight">
                        {r.title}
                      </h3>
                      <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed mb-4">
                        {r.summary}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span className="bg-gray-200 px-2 py-1 rounded">{r.category?.name}</span>
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

// --- Helpers: content normalization and media styling ---
const ContentRenderer = ({ html }) => {
  const normalized = enhanceMediaClasses(normalizeContentHtmlSimple(html));
  return (
    <div
      className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-blue-600 hover:prose-a:text-blue-700 prose-a:underline hover:prose-a:no-underline prose-strong:text-gray-900 prose-ul:text-gray-700 prose-ol:text-gray-700"
      dangerouslySetInnerHTML={{ __html: normalized }}
    />
  );
};

// Minimal normalization: keep original HTML if structured; otherwise convert to clean paragraphs
function normalizeContentHtmlSimple(html) {
  if (!html || typeof html !== "string") return "";
  const hasStructure = /<(p|h[1-6]|ul|ol|table|img|figure|iframe|video|blockquote)/i.test(html);
  if (hasStructure) return html;
  const text = html
    .replace(/<br\s*\/?>(?=\s*<br\s*\/?)/gi, "\n\n")
    .replace(/<br\s*\/?/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .trim();
  const paras = text.split(/\n{2,}/).map(p => p.trim()).filter(Boolean);
  const blocks = paras.map(p => {
    const safe = escapeHtml(p);
    const withBreaks = safe.replace(/\n/g, "<br />");
    return `<p>${withBreaks}</p>`;
  });
  return blocks.join("\n");
}

function normalizeContentHtml(html) {
  if (!html || typeof html !== "string") return "";
  const hasStructure = /<(p|h[1-6]|ul|ol|table|img|figure|iframe|video|blockquote)/i.test(html);
  // If already structured, return as-is
  if (hasStructure) return html;

  // Convert <br> runs to newlines then split into lines
  const text = html
    .replace(/<br\s*\/>/gi, "\n")
    .replace(/<br\s*>/gi, "\n")
    .replace(/<[^>]+>/g, "") // strip any stray tags
    .trim();

  const lines = text.split(/\n+/).map(l => l.trim()).filter(Boolean);

  const blocks = [];
  for (const line of lines) {
    const isHeading = /[:]$/.test(line) || (line.length <= 70 && /^[A-Z][A-Za-z0-9\s,&-]+$/.test(line));
    if (isHeading) {
      blocks.push(`<h2>${escapeHtml(line.replace(/:$/,''))}</h2>`);
    } else {
      // Split long lines into sentences
      const sentences = line.split(/(?<=[\.\!\?])\s+/);
      let buf = "";
      for (const s of sentences) {
        if ((buf + " " + s).trim().length > 260) {
          blocks.push(`<p>${escapeHtml(buf.trim())}</p>`);
          buf = s;
        } else {
          buf = (buf ? buf + " " : "") + s;
        }
      }
      if (buf.trim()) blocks.push(`<p>${escapeHtml(buf.trim())}</p>`);
    }
  }
  return blocks.join("\n");
}

function enhanceMediaClasses(html) {
  if (!html) return html;
  let out = html;
  // IMG: add classes
  out = out.replace(/<img([^>]*?)class="([^"]*)"([^>]*)>/gi, (m, pre, cls, post) => {
    const extra = " w-full h-auto rounded-lg my-6";
    return `<img${pre}class="${(cls + extra).trim()}"${post}>`;
  });
  out = out.replace(/<img(?![^>]*class=)([^>]*)>/gi, (m, rest) => `<img class="w-full h-auto rounded-lg my-6"${rest}>`);

  // IFRAME: add classes and aspect video
  out = out.replace(/<iframe([^>]*?)class="([^"]*)"([^>]*)>/gi, (m, pre, cls, post) => {
    const extra = " w-full rounded-lg my-8";
    return `<iframe${pre}class="${(cls + extra).trim()}"${post}>`;
  });
  out = out.replace(/<iframe(?![^>]*class=)([^>]*)>/gi, (m, rest) => `<iframe class="w-full rounded-lg my-8"${rest}>`);

  // TABLE: add classes and make horizontally scrollable
  out = out.replace(/<table([^>]*?)class="([^"]*)"([^>]*)>/gi, (m, pre, cls, post) => {
    const extra = " w-full text-left border-collapse my-6";
    return `<div class="overflow-x-auto"><table${pre}class="${(cls + extra).trim()}"${post}></table></div>`;
  });
  out = out.replace(/<table(?![^>]*class=)([^>]*)>/gi, (m, rest) => `<div class="overflow-x-auto"><table class="w-full text-left border-collapse my-6"${rest}></table></div>`);

  // FIGURE: spacing
  out = out.replace(/<figure([^>]*?)class="([^"]*)"([^>]*)>/gi, (m, pre, cls, post) => {
    const extra = " my-6";
    return `<figure${pre}class="${(cls + extra).trim()}"${post}>`;
  });
  out = out.replace(/<figure(?![^>]*class=)([^>]*)>/gi, (m, rest) => `<figure class="my-6"${rest}>`);

  return out;
}

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}