"use client";

import { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import {
  Menu,
  X,
  ChevronDown,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from "lucide-react";
import Image from "next/image";
import { API_BASE_URL } from "@/lib/config";
import Link from "next/link";
// Removed GSAP; using simple CSS transitions instead

// ================== MOBILE MENU ==================
const MobileMenu = ({ isOpen, toggleMenu, companyInfo }) => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const mobileMenuRef = useRef(null);
  const overlayRef = useRef(null);
  const [companyLogoMobile, setCompanyLogoMobile] = useState("/logo/logo.png");
  const [socialLinks, setSocialLinks] = useState({
    facebook_url: null,
    twitter_url: null,
    instagram_url: null,
    linkedin_url: null,
  });

  const staticNavItems = [
    { name: "Home", href: "/" },
    { name: "Car Insurance Quotes", href: "/car-insurance-quotes" },
    {
      name: "Insurance Guide",
      href: "/insurance-guide",
      hasDropdown: true,
      dropdownItems: [
        { name: "Car Insurance Companies", href: "/car-insurance-companies" },
        { name: "High Risk Auto Insurance", href: "/high-risk-auto-insurance" },
        { name: "Car Insurance Comparison", href: "/car-insurance-comparison" },
        { name: "Car Insurance Calculator", href: "/car-insurance-calculator" },
        { name: "Insurance Company Reviews", href: "/insurance-company-reviews" },
        { name: "Monthly Car Insurance", href: "/monthly-car-insurance" },
      ],
    },
    { name: "Blog", href: "/blog" },
    { name: "Insurance Types", href: "/auto-insurance-types" },
    { name: "States", href: "/states" },
    { name: "FAQs", href: "/faqs" },
  ];

  const [extraNavPages, setExtraNavPages] = useState([]);
  const [navGroupName, setNavGroupName] = useState('Company');

  // Fetch admin-configured navbar pages from backend
  useEffect(() => {
    const ac = new AbortController();
    const fetchNavPages = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/pages/nav/`, { signal: ac.signal, cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          const mapped = (Array.isArray(data) ? data : []).map(p => ({ name: (p.label || p.title), href: p.url, group: p.group || 'Company' }));
          setExtraNavPages(mapped);
          const g = mapped.length ? (mapped[0].group || 'Company') : 'Company';
          setNavGroupName(g);
        }
      } catch (e) {
        // silent fallback
      }
    };
    fetchNavPages();
    return () => ac.abort();
  }, []);

  // Initialize from provided companyInfo, then fallback to fetch
  useEffect(() => {
    if (companyInfo) {
      const url = companyInfo.navbar_logo || companyInfo.footer_logo || null;
      if (url) {
        const absolute = /^https?:\/\//i.test(url) ? url : `${API_BASE_URL}${url}`;
        setCompanyLogoMobile(absolute);
      }
      setSocialLinks({
        facebook_url: companyInfo.facebook_url || null,
        twitter_url: companyInfo.twitter_url || null,
        instagram_url: companyInfo.instagram_url || null,
        linkedin_url: companyInfo.linkedin_url || null,
      });
    }
    const ac = new AbortController();
    const fetchCompany = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/company/`, { signal: ac.signal });
        if (res.ok) {
          const data = await res.json();
          const url = data.navbar_logo || null;
          if (url) {
            const absolute = url.startsWith('http') ? url : `${API_BASE_URL}${url}`;
            setCompanyLogoMobile(absolute);
          }
          setSocialLinks({
            facebook_url: data.facebook_url || null,
            twitter_url: data.twitter_url || null,
            instagram_url: data.instagram_url || null,
            linkedin_url: data.linkedin_url || null,
          });
        }
      } catch (e) {
        // silent fail, keep default logo
      }
    };
    if (!companyInfo) fetchCompany();
    return () => ac.abort();
  }, [companyInfo]);

  return (
    <>
      {/* Overlay */}
      <div
        ref={overlayRef}
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={toggleMenu}
      />

      {/* Mobile Menu */}
      <div
        ref={mobileMenuRef}
        className={`fixed top-0 right-0 inset-y-0 w-full max-w-sm sm:max-w-md md:w-80 h-full bg-white shadow-2xl z-[1000] lg:hidden overflow-y-auto transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ 
          touchAction: 'manipulation'
        }}
      >
        <div className="p-5">
          {/* Header */}
          <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-4">
            <Image
              width={124}
              height={34}
              alt={
                companyInfo
                  ? (companyInfo.navbar_logo_alt || companyInfo.footer_logo_alt || `${companyInfo.company_name || 'Insurance Panda'} Logo`)
                  : 'Insurance Panda Logo'
              }
              src={companyLogoMobile}
              unoptimized
              className="h-8 w-auto"
            />
            <button
              onClick={toggleMenu}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <X size={22} className="text-gray-600" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="space-y-2 overflow-visible">
            {(() => {
              const companyDropdown = extraNavPages.length > 0 ? {
                name: navGroupName,
                href: '#',
                hasDropdown: true,
                dropdownItems: extraNavPages.map(p => ({ name: p.name, href: p.href }))
              } : null;
              const base = [...staticNavItems];
              if (companyDropdown) {
                base.splice(3, 0, companyDropdown);
              }
              return base.map((item, index) => (
                <div key={item.name} className="menu-item opacity-100 visible">
                  <div className="flex items-center justify-between">
                    <Link
                      href={item.href}
                      onClick={!item.hasDropdown ? toggleMenu : undefined}
                    className="flex-1 py-4 px-4 text-base text-gray-700 hover:text-red-600 hover:bg-gray-50 rounded-lg font-medium transition-all block cursor-pointer touch-manipulation"
                    style={{ 
                      WebkitTapHighlightColor: 'transparent',
                      userSelect: 'none',
                      minHeight: '52px',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    {item.name}
                  </Link>
                  {item.hasDropdown && (
                    <button
                      onClick={() =>
                        setOpenDropdown(
                          openDropdown === item.name ? null : item.name
                        )
                      }
                      className="p-3 hover:bg-gray-50 rounded-lg transition-colors touch-manipulation"
                      style={{ minHeight: '52px', minWidth: '52px' }}
                    >
                      <ChevronDown
                        size={20}
                        className={`text-gray-500 transition-transform duration-200 ${
                          openDropdown === item.name ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  )}
                </div>

                {/* Dropdown */}
                {item.hasDropdown && (
                  <div
                    className={`ml-4 overflow-hidden transition-all duration-300 ${
                      openDropdown === item.name
                        ? "max-h-96 opacity-100 visible"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="py-2 space-y-1">
                      {item.dropdownItems.map((sub) => (
                        <Link
                          key={sub.name}
                          href={sub.href}
                          onClick={toggleMenu}
                          className="block py-3 px-4 text-sm text-gray-600 hover:text-red-600 hover:bg-gray-50 rounded-md transition-all cursor-pointer touch-manipulation opacity-100 visible"
                          style={{ 
                            WebkitTapHighlightColor: 'transparent',
                            userSelect: 'none',
                            minHeight: '48px',
                            display: 'flex',
                            alignItems: 'center'
                          }}
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              ));
            })()}
          </nav>

          {/* Social Icons (only show those with URLs) */}
          <div className="pt-6 border-t border-gray-200 mt-6 text-gray-700">
            <p className="text-sm text-gray-500 mb-3 font-medium">Follow Us</p>
            <div className="flex space-x-3">
              {socialLinks.facebook_url && (
                <a
                  href={socialLinks.facebook_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="p-3 bg-gray-100 hover:bg-red-50 hover:text-red-600 rounded-full transition-all"
                >
                  <Facebook size={18} />
                </a>
              )}
              {socialLinks.twitter_url && (
                <a
                  href={socialLinks.twitter_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter"
                  className="p-3 bg-gray-100 hover:bg-red-50 hover:text-red-600 rounded-full transition-all"
                >
                  <Twitter size={18} />
                </a>
              )}
              {socialLinks.instagram_url && (
                <a
                  href={socialLinks.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="p-3 bg-gray-100 hover:bg-red-50 hover:text-red-600 rounded-full transition-all"
                >
                  <Instagram size={18} />
                </a>
              )}
              {socialLinks.linkedin_url && (
                <a
                  href={socialLinks.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="p-3 bg-gray-100 hover:bg-red-50 hover:text-red-600 rounded-full transition-all"
                >
                  <Linkedin size={18} />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// ================== MAIN HEADER ==================
export default function Header({ companyInfo }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const headerRef = useRef(null);
  const logoRef = useRef(null);
  const navRef = useRef(null);
  const [companyLogo, setCompanyLogo] = useState("/logo/logo.png");
  const [socialLinks, setSocialLinks] = useState({
    facebook_url: null,
    twitter_url: null,
    instagram_url: null,
    linkedin_url: null,
  });
  // Logo-only GSAP mount animation
  useEffect(() => {
    if (!logoRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(logoRef.current, {
        opacity: 0,
        y: 6,
        duration: 0.6,
        ease: "power2.out",
      });
    }, logoRef);

    return () => ctx.revert();
  }, []);

  // Initialize from provided companyInfo, then fallback to fetch
  useEffect(() => {
    const ac = new AbortController();
    if (companyInfo) {
      const url = companyInfo.navbar_logo || companyInfo.footer_logo || null;
      if (url) {
        const absolute = /^https?:\/\//i.test(url) ? url : `${API_BASE_URL}${url}`;
        setCompanyLogo(absolute);
      }
      setSocialLinks({
        facebook_url: companyInfo.facebook_url || null,
        twitter_url: companyInfo.twitter_url || null,
        instagram_url: companyInfo.instagram_url || null,
        linkedin_url: companyInfo.linkedin_url || null,
      });
    }
    const fetchCompany = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/company/`, { signal: ac.signal });
        if (res.ok) {
          const data = await res.json();
          const url = data.navbar_logo || data.footer_logo || null;
          if (url) {
            const absolute = url.startsWith('http') ? url : `${API_BASE_URL}${url}`;
            setCompanyLogo(absolute);
          }
          setSocialLinks({
            facebook_url: data.facebook_url || null,
            twitter_url: data.twitter_url || null,
            instagram_url: data.instagram_url || null,
            linkedin_url: data.linkedin_url || null,
          });
        }
      } catch (e) {
        // keep default
      }
    };
    if (!companyInfo) fetchCompany();
    return () => ac.abort();
  }, [companyInfo]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const staticNavItems = [
    { name: "Home", href: "/" },
    { name: "Car Insurance Quotes", href: "/car-insurance-quotes" },
    {
      name: "Insurance Guide",
      href: "/insurance-guide",
      hasDropdown: true,
      dropdownItems: [
        { name: "Car Insurance Companies", href: "/car-insurance-companies" },
        { name: "High Risk Auto Insurance", href: "/high-risk-auto-insurance" },
        { name: "Car Insurance Comparison", href: "/car-insurance-comparison" },
        { name: "Car Insurance Calculator", href: "/car-insurance-calculator" },
        { name: "Insurance Company Reviews", href: "/insurance-company-reviews" },
        { name: "Monthly Car Insurance", href: "/monthly-car-insurance" },
      ],
    },
    { name: "Blog", href: "/blog" },
    { name: "Insurance Types", href: "/auto-insurance-types" },
    { name: "States", href: "/states" },
    { name: "FAQs", href: "/faqs" },
  ];

  const [extraNavPagesDesktop, setExtraNavPagesDesktop] = useState([]);
  const [navGroupNameDesktop, setNavGroupNameDesktop] = useState('Company');

  useEffect(() => {
    const ac = new AbortController();
    const fetchNavPages = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/pages/nav/`, { signal: ac.signal, cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          const mapped = (Array.isArray(data) ? data : []).map(p => ({ name: (p.label || p.title), href: p.url, group: p.group || 'Company' }));
          setExtraNavPagesDesktop(mapped);
          const g = mapped.length ? (mapped[0].group || 'Company') : 'Company';
          setNavGroupNameDesktop(g);
        }
      } catch (e) {
        // silent fallback
      }
    };
    fetchNavPages();
    return () => ac.abort();
  }, []);

  // Scroll handler with slightly stronger GSAP zoom on logo
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 10;
      setIsScrolled(scrolled);
      if (logoRef.current) {
        gsap.to(logoRef.current, {
          scale: scrolled ? 1.08 : 1.0,
          duration: 0.25,
          ease: "power2.out",
        });
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      ref={headerRef}
      className={`fixed top-0 left-0 right-0 z-[900] transition-all duration-300 ${
        isScrolled ? "bg-white/95 shadow-lg" : "bg-white"
      }`}
    >
      <div className="navbar-lightline" />

      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" ref={logoRef} className="flex items-center transition-transform duration-300">
            <Image
              width={140}
              height={42}
              alt={
                companyInfo
                  ? (companyInfo.navbar_logo_alt || companyInfo.footer_logo_alt || `${companyInfo.company_name || 'Insurance Panda'} Logo`)
                  : 'Insurance Panda Logo'
              }
              src={companyLogo}
              unoptimized
              className="h-10 w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav ref={navRef} className="hidden lg:flex items-center space-x-8">
            {(() => {
              const companyDropdown = extraNavPagesDesktop.length > 0 ? {
                name: navGroupNameDesktop,
                href: '#',
                hasDropdown: true,
                dropdownItems: extraNavPagesDesktop.map(p => ({ name: p.name, href: p.href }))
              } : null;
              const base = [...staticNavItems];
              if (companyDropdown) {
                base.splice(3, 0, companyDropdown);
              }
              return base.map((item) => (
                <div
                  key={item.name}
                  className="relative group"
                  onMouseEnter={() => item.hasDropdown && setActiveDropdown(item.name)}
                  onMouseLeave={() => item.hasDropdown && setActiveDropdown(null)}
                >
                  <Link
                    href={item.href}
                    className="relative py-2 px-1 text-gray-700 hover:text-red-600 font-medium transition-all group"
                  >
                    {item.name}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full"></span>
                  </Link>

                  {item.hasDropdown && (
                    <div
                      className={`absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-2 transition-all duration-200 ease-out ${
                        activeDropdown === item.name
                          ? "opacity-100 visible translate-y-0"
                          : "opacity-0 invisible translate-y-2"
                      }`}
                    >
                      {item.dropdownItems.map((sub) => (
                        <Link
                          key={sub.name}
                          href={sub.href}
                          className="block px-4 py-3 text-sm text-gray-600 hover:text-red-600 hover:bg-gray-50"
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ));
            })()}
          </nav>

          {/* Desktop Social Icons (visible on lg screens, only with URLs) */}
          <div className="hidden lg:flex items-center space-x-3">
            {socialLinks.facebook_url && (
              <a
                href={socialLinks.facebook_url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="p-3 bg-gray-100 hover:bg-red-50 hover:text-red-600 rounded-full transition-all"
              >
                <Facebook size={18} />
              </a>
            )}
            {socialLinks.twitter_url && (
              <a
                href={socialLinks.twitter_url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="p-3 bg-gray-100 hover:bg-red-50 hover:text-red-600 rounded-full transition-all"
              >
                <Twitter size={18} />
              </a>
            )}
            {socialLinks.instagram_url && (
              <a
                href={socialLinks.instagram_url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="p-3 bg-gray-100 hover:bg-red-50 hover:text-red-600 rounded-full transition-all"
              >
                <Instagram size={18} />
              </a>
            )}
            {socialLinks.linkedin_url && (
              <a
                href={socialLinks.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="p-3 bg-gray-100 hover:bg-red-50 hover:text-red-600 rounded-full transition-all"
              >
                <Linkedin size={18} />
              </a>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="lg:hidden p-3 rounded-lg text-gray-700 hover:text-red-600 hover:bg-gray-100 border border-gray-200"
          >
            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <MobileMenu isOpen={isMenuOpen} toggleMenu={toggleMenu} companyInfo={companyInfo} />
    </header>
  );
}
