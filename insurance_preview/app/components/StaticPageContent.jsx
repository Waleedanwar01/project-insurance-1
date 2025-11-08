'use client';

import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '@/lib/config';
import { useRef } from 'react';

export default function StaticPageContent({ pageType, fallbackTitle }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [gsapInstance, setGsapInstance] = useState(null);
  const contentRef = useRef(null);
  const [toc, setToc] = useState([]);
  const [activeId, setActiveId] = useState(null);

  useEffect(() => {
    const ac = new AbortController();
    const fetchPage = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE_URL}/api/pages/${pageType}/`, { signal: ac.signal, cache: 'no-store' });
        if (!res.ok) throw new Error(`Failed to load ${pageType}`);
        const json = await res.json();
        setData(json);
      } catch (e) {
        // Ignore abort errors (e.g., React Strict Mode double-invoke or route change)
        const isAbort = e?.name === 'AbortError' || (typeof e?.message === 'string' && e.message.toLowerCase().includes('aborted'));
        if (isAbort) {
          // Do not surface aborts as user-visible errors
          return;
        }
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPage();
    return () => ac.abort();
  }, [pageType]);

  const title = data?.title || fallbackTitle || 'Page';
  const updated = data?.updated_at ? new Date(data.updated_at).toLocaleDateString() : null;

  useEffect(() => {
    if (typeof window !== 'undefined' && window.gsap) {
      setGsapInstance(window.gsap);
    }
  }, []);

  useEffect(() => {
    if (!gsapInstance || !contentRef.current) return;
    const gsap = gsapInstance;
    const ctx = gsap.context(() => {
      gsap.from(contentRef.current, { opacity: 0, y: 16, duration: 0.6, ease: 'power2.out' });

      // Enhance <details> toggles with smooth animation
      const detailsEls = contentRef.current.querySelectorAll('details');
      detailsEls.forEach((det) => {
        const summary = det.querySelector('summary');
        if (!summary) return;
        summary.addEventListener('click', () => {
          const content = Array.from(det.children).find((c) => c.tagName.toLowerCase() !== 'summary');
          if (!content) return;
          const isOpen = det.hasAttribute('open');
          gsap.to(content, {
            height: isOpen ? 0 : 'auto',
            opacity: isOpen ? 0 : 1,
            duration: 0.35,
            ease: 'power2.out',
          });
        });
      });
    }, contentRef);
    return () => ctx.revert();
  }, [gsapInstance, data]);

  // Build table of contents and insert subtle section breaks
  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const headings = Array.from(el.querySelectorAll('h2, h3'));
    const items = [];
    let firstH2Passed = false;
    headings.forEach((h) => {
      const level = h.tagName.toLowerCase();
      const text = h.textContent?.trim() || '';
      const slug = text
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
      if (!h.id) h.id = slug || `${level}-${items.length}`;
      items.push({ id: h.id, text, level });

      if (h.tagName.toLowerCase() === 'h2') {
        if (firstH2Passed) {
          const hr = document.createElement('hr');
          hr.className = 'section-break';
          h.parentNode?.insertBefore(hr, h);
        }
        firstH2Passed = true;
      }

      // Append small anchor link to headings for easy copy/linking
      if (!h.querySelector('.heading-copy-anchor')) {
        const a = document.createElement('a');
        a.href = `#${h.id}`;
        a.className = 'heading-copy-anchor';
        a.textContent = '#';
        a.addEventListener('click', (evt) => {
          evt.preventDefault();
          const target = document.getElementById(h.id);
          if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            if (typeof window !== 'undefined') {
              history.replaceState(null, '', `#${h.id}`);
            }
          }
        });
        h.appendChild(a);
      }
    });
    setToc(items);

    // Observe headings to highlight active TOC item
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: '-40% 0px -55% 0px',
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    );
    headings.forEach((h) => observer.observe(h));
    return () => observer.disconnect();
  }, [data]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-red-600 via-red-500 to-red-400 text-white py-14 sm:py-16 border-b border-red-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3 sm:mb-4">{title}</h1>
            {updated && (
              <p className="text-xs sm:text-sm text-red-100">Last updated: {updated}</p>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-4 xl:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border border-red-100">
              <div className="border-l-4 border-red-500 p-4">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900">On this page</h2>
                <p className="text-xs text-gray-500 mt-1">Quick sections & links</p>
              </div>
              <nav className="px-4 pb-4">
                {toc?.length ? (
                  <ul className="space-y-2">
                    {toc.map((item) => (
                      <li key={item.id}>
                        <a
                          href={`#${item.id}`}
                          onClick={(e) => {
                            e.preventDefault();
                            const el = document.getElementById(item.id);
                            if (el) {
                              el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                              if (typeof window !== 'undefined') {
                                history.replaceState(null, '', `#${item.id}`);
                              }
                            }
                          }}
                          className={`block text-sm transition-colors ${
                            item.id === activeId
                              ? 'text-red-600'
                              : item.level === 'h2'
                                ? 'font-medium text-gray-800 hover:text-red-600'
                                : 'text-gray-600 pl-3 hover:text-red-600'
                          }`}
                          aria-current={item.id === activeId ? 'true' : undefined}
                        >
                          {item.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-sm text-gray-600">Sections will appear here</div>
                )}
              </nav>
            </div>

            <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-4">
                <h3 className="text-sm font-semibold text-gray-900">Need help?</h3>
                <p className="text-sm text-gray-600 mt-1">Have questions about this page?</p>
                <a
                  href="/contact"
                  className="mt-3 inline-flex items-center rounded-md bg-red-500 px-3 py-2 text-sm font-medium text-white shadow hover:bg-red-600"
                >
                  Contact Us
                </a>
              </div>
            </div>
          </aside>

          {/* Content */}
          <div className="lg:col-span-8 xl:col-span-9">
            <div ref={contentRef} className="bg-white rounded-lg shadow-md p-5 sm:p-7 lg:p-8 border border-gray-100">
              {loading && (
                <div className="text-center text-gray-600">Loading content...</div>
              )}
              {error && (
                <div className="text-center text-red-600">{error}</div>
              )}
              {!loading && !error && (
                <div className="prose prose-lg max-w-none">
                  {data?.content ? (
                    <div dangerouslySetInnerHTML={{ __html: data.content }} />
                  ) : (
                    <p className="text-gray-700">No content available.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}