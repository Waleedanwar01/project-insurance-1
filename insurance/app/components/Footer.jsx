"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link"; // ✅ Import Link for client-side navigation
import { API_BASE_URL } from '@/lib/config';

const SleekAnimatedFooter = ({ companyInfo }) => {
  const footerRef = useRef(null);
  const logoRef = useRef(null);
  const sectionsRef = useRef([]);
  const disclaimerRef = useRef(null);
  const [footerDisclaimer, setFooterDisclaimer] = useState('');
  const [gsapInstance, setGsapInstance] = useState(null);
  // Removed recent blogs/FAQs: footer now only shows Company links (admin-controlled)
  const [footerLogo, setFooterLogo] = useState('/logo/logo.png');

  // Use centralized API base URL from config

  // Company links (admin-configurable via backend; fallback to defaults)
  const [companyLinks, setCompanyLinks] = useState([
    { text: "Contact Us", href: "/contact" }
  ]);

  useEffect(() => {
    const ac = new AbortController();
    const fetchFooterPages = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/pages/footer/`, { signal: ac.signal, cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          const mapped = (Array.isArray(data) ? data : []).map(p => ({ text: (p.label || p.title), href: p.url }));
          // Ensure Contact Us is preserved if admin excludes it
          const hasContact = mapped.some(l => l.href === '/contact');
          const finalLinks = hasContact ? mapped : [...mapped, { text: 'Contact Us', href: '/contact' }];
          setCompanyLinks(finalLinks);
        }
      } catch (e) {
        // keep default links
      }
    };
    fetchFooterPages();
    return () => ac.abort();
  }, [API_BASE_URL]);

  // Recent content: blogs and FAQs for footer sections
  const [recentBlogs, setRecentBlogs] = useState([]);
  const [recentFaqs, setRecentFaqs] = useState([]);

  useEffect(() => {
    const ac = new AbortController();
    const fetchRecentContent = async () => {
      try {
        // Combined endpoint returning recent blogs and faqs
        const res = await fetch(`${API_BASE_URL}/api/faq/api/recent-content/`, { signal: ac.signal, cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          const blogs = Array.isArray(data.recent_blogs) ? data.recent_blogs : [];
          const faqs = Array.isArray(data.recent_faqs) ? data.recent_faqs : [];
          setRecentBlogs(blogs.map(b => ({ text: b.title, href: `/blog/${b.slug}`, isRecent: true })));
          setRecentFaqs(faqs.map(f => ({ text: f.question, href: `/faq/${f.slug}`, isRecent: true })));
        }
      } catch (e) {
        // Fallback: try direct blog endpoint
        try {
          const blogRes = await fetch(`${API_BASE_URL}/api/blog/posts/?limit=3`, { signal: ac.signal, cache: 'no-store' });
          if (blogRes.ok) {
            const bd = await blogRes.json();
            const list = Array.isArray(bd) ? bd : (Array.isArray(bd.results) ? bd.results : []);
            setRecentBlogs(list.map(b => ({ text: b.title, href: `/blog/${b.slug}`, isRecent: true })));
          }
        } catch {}
        // leave FAQs empty if combined fails
      }
    };
    fetchRecentContent();
    return () => ac.abort();
  }, [API_BASE_URL]);

  // Initialize from provided companyInfo, then fallback to fetch
  useEffect(() => {
    const ac = new AbortController();
    if (companyInfo) {
      const url = companyInfo.footer_logo || companyInfo.navbar_logo || null;
      if (url) {
        const absolute = /^https?:\/\//i.test(url) ? url : `${API_BASE_URL}${url}`;
        setFooterLogo(absolute);
      }
      if (companyInfo.footer_disclaimer) {
        setFooterDisclaimer(companyInfo.footer_disclaimer);
      }
    }
    const fetchCompany = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/company/`, { signal: ac.signal });
        if (res.ok) {
          const data = await res.json();
          const url = data.footer_logo || data.navbar_logo || null;
          if (url) {
            const absolute = url.startsWith('http') ? url : `${API_BASE_URL}${url}`;
            setFooterLogo(absolute);
          }
          if (data.footer_disclaimer) {
            setFooterDisclaimer(data.footer_disclaimer);
          }
        }
      } catch (e) {
        // silent fallback
      }
    };
    if (!companyInfo) fetchCompany();
    return () => ac.abort();
  }, [API_BASE_URL, companyInfo]);

  // GSAP scroll-based subtle zoom on footer logo
  useEffect(() => {
    const gsap = gsapInstance || (typeof window !== 'undefined' ? window.gsap : null);
    const onScroll = () => {
      if (!gsap || !logoRef.current) return;
      const scrolled = window.scrollY > 10;
      gsap.to(logoRef.current, {
        scale: scrolled ? 1.06 : 1.0,
        duration: 0.25,
        ease: 'power2.out'
      });
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [gsapInstance]);

  // Create dynamic footer data
  const getFooterData = () => {
    const company = companyLinks && companyLinks.length
      ? companyLinks
      : [{ text: "Contact Us", href: "/contact" }];
    const blogs = recentBlogs && recentBlogs.length
      ? [...recentBlogs, { text: "View All", href: "/blog", isViewAll: true }]
      : [{ text: "View All", href: "/blog", isViewAll: true }];
    const faqs = recentFaqs && recentFaqs.length
      ? [...recentFaqs, { text: "View All", href: "/faqs", isViewAll: true }]
      : [{ text: "View All", href: "/faqs", isViewAll: true }];
    return [
      { title: "Company", links: company },
      { title: "Recent Blog Posts", links: blogs },
      { title: "Popular FAQs", links: faqs },
    ];
  };

  useEffect(() => {
    if (window.gsap) {
      setGsapInstance(window.gsap);
    }
  }, []);

  useEffect(() => {
    if (!gsapInstance || !footerRef.current) return;
    const gsap = gsapInstance;

    const ctx = gsap.context(() => {
      gsap.from(".footer-header-element", {
        y: 20,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.1,
      });
      gsap.from(sectionsRef.current, {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.2,
        delay: 0.3,
      });
      gsap.from(disclaimerRef.current, {
        y: 10,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        delay: 0.6,
      });
    }, footerRef);

    return () => ctx.revert();
  }, [gsapInstance]);

  // Social Icons
  const FacebookIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
    </svg>
  );

  const InstagramIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" x2="17.5" y1="6.5" y2="6.5"/>
    </svg>
  );

  const LinkedinIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 0-6 6v7h4v-7a2 2 0 0 1 2-2 2 2 0 0 1 2 2v7h4v-7a6 6 0 0 0-6-6z"/>
      <rect width="4" height="12" x="2" y="9"/>
      <circle cx="4" cy="4" r="2"/>
    </svg>
  );

  const TwitterIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83"/>
    </svg>
  );

  // ✅ Replace <a> with Next.js <Link>
  const LinkItem = ({ text, href, isViewAll, isRecent }) => (
    <li className="mb-2">
      <Link
        href={href}
        className={`
          transition duration-300 text-sm tracking-wide block
          ${isViewAll 
            ? 'text-red-600 hover:text-red-700 font-semibold bg-red-50 hover:bg-red-100 px-3 py-2 rounded-lg border border-red-200 hover:border-red-300' 
            : isRecent 
              ? 'text-gray-700 hover:text-red-600 hover:translate-x-1 pl-2 border-l-2 border-transparent hover:border-red-400'
              : 'text-gray-600 hover:text-red-500'
          }
        `}
      >
        {text}
      </Link>
    </li>
  );

  // Collapsible GSAP effect removed to restore original multi-column footer

  return (
    <footer
      ref={footerRef}
      className="bg-gray-100 text-gray-700 pt-8 pb-4 font-sans border-t border-gray-200 shadow-lg"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* === Header Section === */}
        <div className="flex flex-col md:flex-row justify-between items-center pb-6 border-b border-gray-200 mb-6">
          <div className="footer-header-element flex flex-col items-center md:items-start mb-4 md:mb-0">
            <div className="h-8 w-48 flex items-center justify-center mb-1">
              <Link href="/" ref={logoRef} className="transition-transform duration-300">
                <Image
                  width={140}
                  height={40}
                  alt={
                    companyInfo
                      ? (companyInfo.footer_logo_alt || companyInfo.navbar_logo_alt || `${companyInfo.company_name || 'Insurance Panda'} Logo`)
                      : 'Insurance Panda Logo'
                  }
                  src={footerLogo}
                  unoptimized
                  className="cursor-pointer h-8 w-auto"
                />
              </Link>
            </div>
          </div>

          {/* Social Icons (only show those admin filled) */}
          <div className="footer-header-element flex space-x-5 py-2">
            {companyInfo?.facebook_url && (
              <Link href={companyInfo.facebook_url} aria-label="Facebook" className="text-gray-500 hover:text-red-500 transition">
                <FacebookIcon className="w-6 h-6" />
              </Link>
            )}
            {companyInfo?.twitter_url && (
              <Link href={companyInfo.twitter_url} aria-label="Twitter" className="text-gray-500 hover:text-red-500 transition">
                <TwitterIcon className="w-6 h-6" />
              </Link>
            )}
            {companyInfo?.instagram_url && (
              <Link href={companyInfo.instagram_url} aria-label="Instagram" className="text-gray-500 hover:text-red-500 transition">
                <InstagramIcon className="w-6 h-6" />
              </Link>
            )}
            {companyInfo?.linkedin_url && (
              <Link href={companyInfo.linkedin_url} aria-label="LinkedIn" className="text-gray-500 hover:text-red-500 transition">
                <LinkedinIcon className="w-6 h-6" />
              </Link>
            )}
          </div>
        </div>

        {/* === Main Columns === */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-10 lg:gap-14 mb-8">
          {getFooterData().map((section, index) => (
            <div
              key={index}
              ref={(el) => (sectionsRef.current[index] = el)}
              className="flex flex-col items-start text-left"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-3 pb-1 border-b-2 border-red-500/50">
                {section.title}
              </h3>
              <ul className="list-none p-0 w-full space-y-1">
                {section.links.map((link, linkIndex) => (
                  <LinkItem 
                    key={linkIndex} 
                    text={link.text} 
                    href={link.href}
                    isViewAll={link.isViewAll}
                    isRecent={link.isRecent}
                  />
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* === Disclaimer === */}
        <div className="pt-4 border-t border-gray-200">
          <div ref={disclaimerRef} className="text-center">
            <p className="text-[0.68rem] sm:text-xs text-gray-500 mb-4 leading-relaxed">
              {footerDisclaimer ? (
                <span dangerouslySetInnerHTML={{ __html: footerDisclaimer }} />
              ) : (
                <>
                  <strong className="text-red-500">Disclaimer:</strong> Insurance Panda strives to provide the most up-to-date info on saving on car insurance. Keep in mind, quotes may vary from individual insurance companies. Verify details directly with them for the most accurate rates.
                </>
              )}
            </p>
            <p className="text-[0.65rem] text-gray-500 mb-1">
              {companyInfo?.address || ""} {companyInfo?.address ? "|" : ""} {" "}
              {companyInfo?.phone && (
                <Link href={`tel:${companyInfo.phone.replace(/[^\d+]/g, "")}`} className="hover:text-red-500 transition">
                  {companyInfo.phone}
                </Link>
              )}
              {companyInfo?.email && (
                <> {companyInfo?.address || companyInfo?.phone ? "|" : ""} {" "}
                  <Link href={`mailto:${companyInfo.email}`} className="hover:text-red-500 transition">
                    {companyInfo.email}
                  </Link>
                </>
              )}
            </p>
            <p className="text-[0.65rem] text-gray-500">
              Copyright © 2025 {companyInfo?.company_name || 'Insurance Panda'}. All Rights Reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default SleekAnimatedFooter;
