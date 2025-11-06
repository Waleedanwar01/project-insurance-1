'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { API_BASE_URL } from '@/lib/config';
import { ArrowLeft, Calendar } from 'lucide-react';
import ThankYouBack from '@/app/components/ThankYouBack';

// Match blog detail: clock icon for reading time
const ClockIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
  </svg>
);

export default function FaqDetailClient() {
  const { slug } = useParams();
  const [faq, setFaq] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processedHtml, setProcessedHtml] = useState('');
  const [tocHeadings, setTocHeadings] = useState([]);
  const [feedback, setFeedback] = useState({ helpful: null, submitted: false });

  const formatDate = (dateString) => {
    if (!dateString) return null;
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
      });
    } catch {
      return null;
    }
  };

  // Reading time removed for a cleaner UI
  const getReadingTime = (content) => {
    if (!content) return '1 min read';
    const wordsPerMinute = 200;
    const plain = String(content).replace(/<[^>]*>/g, '');
    const words = plain.split(/\s+/).filter(Boolean).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!slug) return;
        const primary = await fetch(`${API_BASE_URL}/api/faq/api/faqs/${slug}/`, { cache: 'no-store' });
        if (primary.ok) {
          setFaq(await primary.json());
          return;
        }
        const fallback = await fetch(`${API_BASE_URL}/api/faq/api/faqs/${slug}`, { cache: 'no-store' });
        if (fallback.ok) {
          setFaq(await fallback.json());
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug]);

  const handleFeedback = async (isHelpful) => {
    if (feedback.submitted) return;
    try {
      const response = await fetch(`${API_BASE_URL}/api/faq/api/faqs/${slug}/feedback/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_helpful: isHelpful, comment: '' }),
      });
      if (response.ok) {
        setFeedback({ helpful: isHelpful, submitted: true });
        const updated = { ...faq };
        if (isHelpful) {
          updated.helpful_count = (updated.helpful_count || 0) + 1;
        } else {
          updated.not_helpful_count = (updated.not_helpful_count || 0) + 1;
        }
        setFaq(updated);
      }
    } catch (e) {
      console.error('Error submitting FAQ feedback:', e);
    }
  };

  const slugify = (text) => String(text || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

  const isPlainText = (val) => {
    if (!val) return true;
    const s = String(val).trim();
    // If it contains any HTML tag-like characters, treat as HTML
    return !/[<][a-zA-Z!/]/.test(s);
  };

  const isMostlyTextHtml = (html) => {
    try {
      const el = document.createElement('div');
      el.innerHTML = String(html || '');
      const hasBlocks = el.querySelector('p, ul, ol, table, pre, blockquote, h1, h2, h3, h4, h5, h6');
      const brCount = el.querySelectorAll('br').length;
      const textLen = (el.textContent || '').trim().length;
      return !hasBlocks && (brCount > 0 || textLen > 400);
    } catch {
      return false;
    }
  };

  const splitIntoParagraphs = (text) => {
    const sentences = String(text || '').match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [String(text || '')];
    const paragraphs = [];
    let buf = '';
    let count = 0;
    for (let i = 0; i < sentences.length; i++) {
      buf += sentences[i].trim() + ' ';
      count++;
      if (count >= 2 || buf.length > 260) {
        paragraphs.push(buf.trim());
        buf = '';
        count = 0;
      }
    }
    if (buf.trim()) paragraphs.push(buf.trim());
    return paragraphs;
  };

  const formatPlainTextToHtml = (text) => {
    const rawText = String(text || '');
    const lines = rawText.replace(/\r\n?/g, '\n').split('\n');
    let html = '';
    let inUl = false;
    let inOl = false;

    const closeLists = () => {
      if (inUl) { html += '</ul>'; inUl = false; }
      if (inOl) { html += '</ol>'; inOl = false; }
    };

    const isBullet = (l) => /^\s*(?:[-*•])\s+/.test(l);
    const isNumbered = (l) => /^\s*\d+\.\s+/.test(l);
    const isHeadingLike = (l) => {
      const t = l.trim();
      if (!t) return false;
      if (/[.:]$/.test(t) && t.length <= 100) return true;
      const words = t.split(/\s+/);
      const allCaps = words.length <= 8 && words.every(w => w === w.toUpperCase() && /[A-Z]/.test(w));
      if (allCaps && t.length <= 80) return true;
      if (t.length <= 60 && !/[.!?]$/.test(t)) return true;
      return false;
    };

    // If content has very few line breaks, segment by sentences to avoid a single long flow
    const newlineCount = (rawText.match(/\n/g) || []).length;
    if (newlineCount < 2) {
      const sentences = rawText.match(/[^.!?]+[.!?]+/g) || [rawText];
      const paragraphs = [];
      let buf = '';
      let count = 0;
      for (let i = 0; i < sentences.length; i++) {
        buf += sentences[i].trim() + ' ';
        count++;
        if (count >= 2 || buf.length > 240) {
          paragraphs.push(buf.trim());
          buf = '';
          count = 0;
        }
      }
      if (buf.trim()) paragraphs.push(buf.trim());

      // Promote the first short paragraph ending with ':' as a section heading
      if (paragraphs.length && /:\s*$/.test(paragraphs[0]) && paragraphs[0].length <= 80) {
        html += `<h2>${paragraphs[0].replace(/:\s*$/, '')}</h2>`;
        paragraphs.shift();
      }
      html += paragraphs.map(p => `<p>${p}</p>`).join('');
      return html;
    }

    for (let i = 0; i < lines.length; i++) {
      const raw = lines[i];
      const line = raw.trim();
      if (!line) {
        // Blank line: close lists and add paragraph break
        closeLists();
        html += '<p class="mb-4">&nbsp;</p>';
        continue;
      }

      if (isBullet(line)) {
        if (!inUl) { closeLists(); html += '<ul class="list-disc pl-6 mb-4">'; inUl = true; }
        html += `<li>${line.replace(/^\s*[-*•]\s+/, '')}</li>`;
        continue;
      }

      if (isNumbered(line)) {
        if (!inOl) { closeLists(); html += '<ol class="list-decimal pl-6 mb-4">'; inOl = true; }
        html += `<li>${line.replace(/^\s*\d+\.\s+/, '')}</li>`;
        continue;
      }

      // Regular text: close lists and decide heading vs paragraph
      closeLists();
      if (isHeadingLike(line)) {
        // Use h2 for stronger headings when ending with ':' otherwise h3
        if (/:$/.test(line)) {
          html += `<h2>${line.replace(/:$/, '')}</h2>`;
        } else {
          html += `<h3>${line}</h3>`;
        }
      } else {
        html += `<p>${line}</p>`;
      }
    }

    // Close any open lists
    closeLists();
    return html;
  };

  useEffect(() => {
    if (!faq?.answer) {
      setProcessedHtml('');
      setTocHeadings([]);
      return;
    }
    const container = document.createElement('div');
    let sourceHtml = '';
    if (isPlainText(faq.answer)) {
      sourceHtml = formatPlainTextToHtml(faq.answer);
    } else {
      // If HTML is mostly text with <br>, normalize to sections with headings and paragraphs
      const rawHtml = String(faq.answer || '');
      if (isMostlyTextHtml(rawHtml)) {
        const text = rawHtml
          .replace(/<br\s*\/?>/gi, '\n')
          .replace(/<[^>]*>/g, '')
          .trim();
        sourceHtml = formatPlainTextToHtml(text);
      } else {
        sourceHtml = rawHtml;
      }
    }
    container.innerHTML = sourceHtml;
    const headings = Array.from(container.querySelectorAll('h2, h3'));
    headings.forEach((h, idx) => {
      const text = (h.textContent || '').trim();
      if (!text) return;
      let id = slugify(text);
      if (container.querySelector(`#${CSS.escape(id)}`)) {
        id = `${id}-${idx}`;
      }
      h.id = id;
    });
    setProcessedHtml(container.innerHTML);
    setTocHeadings(headings.map(h => ({ id: h.id, text: h.textContent || '', level: h.tagName.toLowerCase() })));
  }, [faq]);

  if (loading) {
    return (
      <div className="w-full bg-white font-inter py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-5 w-40 bg-gray-200 rounded mb-4" />
            <div className="h-10 w-3/4 bg-gray-200 rounded mb-6" />
            <div className="h-24 w-full bg-gray-200 rounded mb-6" />
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded" />
              <div className="h-4 bg-gray-200 rounded" />
              <div className="h-4 bg-gray-200 rounded w-5/6" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!faq) {
    return (
      <div className="w-full bg-white font-inter py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <Link href="/faqs" className="inline-flex items-center text-red-600 hover:text-red-700">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to FAQs
            </Link>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">FAQ not found</h1>
          <p className="text-gray-600 mt-2">The requested question could not be found.</p>
          <div className="mt-4 p-4 bg-gray-50 rounded border text-sm text-gray-700">
            <p><strong>Debug info:</strong></p>
            <p>Slug: <code>{slug}</code></p>
            <p>API base: <code>{API_BASE_URL}</code></p>
            <p>Tried:
              <code className="block">{`${API_BASE_URL}/api/faq/api/faqs/${slug}/`}</code>
              <code className="block">{`${API_BASE_URL}/api/faq/api/faqs/${slug}`}</code>
            </p>
            <p>If this persists, ensure the backend is running and the slug exists.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-inter">
      {/* Hero Section (match blogs style) */}
      <div className="bg-gradient-to-br from-red-500 via-red-600 to-red-700 text-white relative overflow-hidden py-16">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {faq.category?.name && (
              <div className="mb-3">
                <span className="inline-block px-3 py-1 bg-red-100 text-red-700 text-sm font-medium rounded-full">
                  {faq.category.name}
                </span>
              </div>
            )}
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              {faq.question}
            </h1>
            {/* Meta row: date + reading time + views */}
            <div className="flex flex-wrap justify-center items-center gap-6 text-red-100 mt-6">
              {faq.created_at && (
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-full">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <span>{formatDate(faq.created_at)}</span>
                </div>
              )}
              {faq.answer && (
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-full">
                    <ClockIcon />
                  </div>
                  <span>{getReadingTime(faq.answer)}</span>
                </div>
              )}
              {/* Views removed as requested */}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-8">
          <div>
            <div className="mb-6">
              <Link href="/faqs" className="inline-flex items-center text-red-600 hover:text-red-700">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to FAQs
              </Link>
            </div>

            {/* Content Card (match blogs tone) */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-8 md:p-10">
                {/* Short Answer Callout */}
                {faq.short_answer && (
                  <div className="mb-8 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
                    <p className="text-gray-800">{faq.short_answer}</p>
                  </div>
                )}

                {/* Main Content */}
                <div
                  className="prose prose-lg prose-red max-w-none text-gray-800 leading-relaxed rich-content"
                  style={{
                    fontSize: '18px',
                    lineHeight: '1.8',
                    fontFamily: 'system-ui, -apple-system, sans-serif'
                  }}
                  dangerouslySetInnerHTML={{ __html: renderContent(processedHtml || faq.answer) }}
                />
              </div>
            </div>

            {/* Feedback Section */}
            <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Was this answer helpful?</h3>
                <div className="flex items-center gap-3 flex-wrap">
                  <button
                    onClick={() => handleFeedback(true)}
                    disabled={feedback.submitted}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${feedback.submitted && feedback.helpful === true ? 'bg-green-600 text-white border-green-600' : 'text-green-700 border-green-200 hover:bg-green-50'}`}
                    aria-label="Mark FAQ as helpful"
                  >
                    <span>👍</span>
                    <span>Helpful ({faq?.helpful_count || 0})</span>
                  </button>
                  <button
                    onClick={() => handleFeedback(false)}
                    disabled={feedback.submitted}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${feedback.submitted && feedback.helpful === false ? 'bg-red-600 text-white border-red-600' : 'text-red-700 border-red-200 hover:bg-red-50'}`}
                    aria-label="Mark FAQ as not helpful"
                  >
                    <span>👎</span>
                    <span>Not helpful ({faq?.not_helpful_count || 0})</span>
                  </button>
                </div>
                {feedback.submitted && (
                  <p className="mt-3 text-sm text-gray-600">Thanks! Your feedback has been recorded.</p>
                )}
              </div>
            </div>

            <div className="mt-10">
              <Link href="/faqs" className="inline-flex items-center gap-2 text-red-600 hover:text-red-700">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to FAQs
              </Link>
            </div>
          </div>
          {/* TOC Sidebar */}
          {tocHeadings.length > 0 && (
            <aside className="hidden lg:block">
              <div className="sticky top-20 border border-gray-200 rounded-lg p-4 bg-gray-50">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">On this page</h3>
                <nav className="space-y-2">
                  {tocHeadings.map((h) => (
                    <a
                      key={h.id}
                      href={`#${h.id}`}
                      className={`block text-sm hover:text-red-600 transition-colors ${h.level === 'h3' ? 'pl-3 text-gray-600' : 'text-gray-800'}`}
                    >
                      {h.text}
                    </a>
                  ))}
                </nav>
              </div>
            </aside>
          )}
        </div>
      </div>

      {/* Thank you + Back */}
      <ThankYouBack message="Thank you for reading this FAQ!" />

      <style jsx>{`
        .rich-content img {
          max-width: 100%;
          height: auto;
          border-radius: 0.5rem;
          margin: 1rem 0;
        }
        .rich-content figure { margin: 1rem 0; }
        .rich-content figcaption {
          color: #6b7280; /* gray-500 */
          font-size: 0.875rem;
          text-align: center;
          margin-top: 0.5rem;
        }
        .rich-content video {
          width: 100%;
          height: auto;
          border-radius: 0.5rem;
          margin: 1rem 0;
          background: #000;
        }
        .rich-content iframe {
          width: 100%;
          aspect-ratio: 16/9;
          border: 0;
          border-radius: 0.5rem;
          margin: 1rem 0;
        }
        .rich-content table {
          display: block;
          width: 100%;
          overflow-x: auto;
          border-collapse: collapse;
          margin: 1rem 0;
        }
        .rich-content table th,
        .rich-content table td {
          border: 1px solid #e5e7eb; /* gray-200 */
          padding: 0.75rem;
          text-align: left;
        }
        .rich-content pre {
          overflow: auto;
          padding: 1rem;
          border-radius: 0.5rem;
          background: #0f172a; /* slate-900 */
          color: #e2e8f0; /* slate-200 */
        }
        .rich-content blockquote {
          border-left: 4px solid #ef4444; /* red-500 */
          padding-left: 1rem;
          color: #374151; /* gray-700 */
          background: #fff7f7;
          border-radius: 0.25rem;
        }
        .rich-content h2 {
          margin-top: 2rem;
          margin-bottom: 0.75rem;
          line-height: 1.3;
          font-weight: 700;
          color: #ef4444; /* red-500 */
          border-bottom: 1px solid #fee2e2; /* red-100 */
          padding-bottom: 0.25rem;
        }
        .rich-content h3 {
          margin-top: 1.5rem;
          margin-bottom: 0.5rem;
          line-height: 1.35;
          font-weight: 600;
          color: #ef4444; /* red-500 */
        }
        .rich-content p { margin: 1rem 0 1.25rem; line-height: 1.85; }
        .rich-content ul, .rich-content ol { margin: 1rem 0 1.25rem 1.5rem; }
        .rich-content li { margin: 0.5rem 0; line-height: 1.75; }
        .rich-content p, .rich-content li { max-width: 75ch; }
        .rich-content ul li::marker { color: #ef4444; }
        .rich-content ol li::marker { color: #ef4444; }
        .rich-content hr { margin: 2rem 0; border-color: #e5e7eb; }
        .rich-content a { color: #2563eb; text-decoration: none; }
        .rich-content a:hover { color: #1d4ed8; text-decoration: underline; }
      `}</style>
    </div>
  );
}

// Mirror blog detail: transform content tags for consistent styling
const renderContent = (content) => {
  if (!content) return '<p>No content available for this FAQ.</p>';
  let processedContent = content;

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

  processedContent = processedContent.replace(
    /<p([^>]*)>/g,
    '<p$1 class="mb-6 leading-relaxed text-gray-800">'
  );

  processedContent = processedContent.replace(
    /<img([^>]*)>/g,
    '<div class="my-8"><img$1 class="w-full h-auto rounded-xl shadow-lg max-w-full mx-auto" loading="lazy"></div>'
  );
  processedContent = processedContent.replace(
    /<video([^>]*)>/g,
    '<div class="relative w-full my-8 rounded-xl overflow-hidden shadow-lg"><video$1 class="w-full h-auto" controls></video></div>'
  );
  processedContent = processedContent.replace(
    /<iframe([^>]*)>/g,
    '<div class="relative w-full aspect-video my-8 rounded-xl overflow-hidden shadow-lg"><iframe$1 class="absolute inset-0 w-full h-full"></iframe></div>'
  );

  // Style links to be clean blue
  processedContent = processedContent.replace(
    /<a([^>]*)>/g,
    '<a$1 class="text-blue-600 hover:text-blue-700 underline underline-offset-2">'
  );

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

  processedContent = processedContent.replace(
    /<blockquote([^>]*)>/g,
    '<blockquote$1 class="border-l-4 border-red-500 pl-6 py-4 my-8 bg-gray-50 rounded-r-lg italic text-gray-700">'
  );

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