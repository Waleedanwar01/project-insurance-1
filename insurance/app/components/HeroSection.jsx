"use client";

import { useState, useRef, useEffect } from "react";
import { MapPin, Smartphone } from "lucide-react";

// ===================================================
// HERO SECTION COMPONENT (Fully Mobile Responsive & More Professional)
// ===================================================
const HeroSection = ({ companyInfo }) => {
  const imageUrl = "/images/hero-section.jpg"; // Local image path

  // Highlight 'Instant' / 'Instantly' (with optional punctuation) in tagline
  const highlightInstant = (text) => {
    if (!text || typeof text !== 'string') return text;
    const regex = /(instant(?:ly)?\.?)/gi;
    const parts = text.split(regex);
    return parts.map((part, idx) => (
      idx % 2 === 1 ? <span key={idx} className="text-red-500">{part}</span> : part
    ));
  };

  return (
    <section 
    id="Tohero"
      className="relative w-full h-fit min-h-[600px] max-h-[1000px] overflow-hidden font-inter flex items-center justify-center" // Centered for smaller screens
    >
      {/* Parallax Background Effect */}
      <div 
        className="absolute inset-0 parallax-bg"
        style={{ 
          backgroundImage: `url(${imageUrl})`,
        }}
        aria-hidden="true"
      >
        {/* Cinematic Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-gray-900/70 to-gray-900/40"></div>
      </div>

      {/* Content Container - Flexbox for centering, padding adjusted for mobile */}
      <div className="relative max-w-7xl mx-auto h-full flex flex-col justify-center items-start text-left px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Headline and Subtitle Block */}
        <div className="max-w-4xl lg:max-w-5xl mb-10 md:mb-12"> 
          <h1 
            className="text-white text-4xl sm:text-5xl md:text-6xl lg:text-[96px] leading-tight font-extrabold mb-3 drop-shadow-xl animate-fadeInUp headline-glow mt-10 md:mt-20"
          >
            {companyInfo?.tagline ? (
              <>{highlightInstant(companyInfo.tagline)}</>
            ) : (
              <>Secure Your Future, <span className="text-red-500">Instantly.</span></>
            )}
          </h1>
          
          <p 
            className="text-gray-100 text-lg sm:text-xl md:text-2xl font-light max-w-2xl md:max-w-3xl drop-shadow-lg animate-fadeInUp delay-200"
          >
            Compare personalized insurance quotes from over 30 top carriers in under 2 minutes. Start saving today.
            {companyInfo?.phone && (
              <span className="block mt-2 text-gray-200 font-medium">Call us: {companyInfo.phone}</span>
            )}
          </p>
        </div>

        {/* Quote Form & Call-to-Action - Layout adjusted for mobile */}
        <div 
          className="w-full max-w-xl bg-white p-6 md:p-8 rounded-2xl shadow-[0_40px_80px_rgba(0,0,0,0.8)] border-t-[10px] border-red-600 animate-fadeInUp delay-400 transform transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_50px_100px_rgba(0,0,0,0.9)]"
        >
          <p className="text-xl md:text-2xl font-black text-gray-800 mb-5 text-center md:text-left">Find Your Best Rate Now</p>
          <form className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <MapPin size={24} className="absolute left-4 top-1/2 -translate-y-1/2 text-red-600" /> {/* Icon size adjusted */}
              <input
                type="text"
                placeholder="Enter Your 5-Digit Zip Code"
                aria-label="Enter Your Zip Code"
                className="w-full py-3 md:py-4 pl-12 md:pl-16 pr-4 text-lg md:text-xl text-gray-800 border-2 border-gray-300 rounded-lg focus:border-red-600 focus:ring-4 focus:ring-red-100 transition shadow-inner placeholder:text-gray-500 font-medium"
              />
            </div>
            
            <button
              type="submit"
              className="flex items-center justify-center gap-2 py-3 md:py-4 px-6 md:px-8 bg-gradient-to-r from-red-600 to-red-800 text-white font-black text-lg md:text-xl rounded-lg hover:from-red-700 hover:to-red-900 transition duration-300 shadow-3xl shadow-red-800/70 whitespace-nowrap active:scale-[0.95] transform hover:translate-y-[-2px] transition-all"
              style={{'--tw-shadow-3xl': '0 35px 60px -15px rgba(220, 38, 38, 0.7)'}}
            >
              Compare Quotes
            </button>
          </form>
          
          {/* Secondary CTA - Made more robust for mobile stacking */}
          <div className="mt-2 pt-5 border-gray-200 flex flex-col sm:flex-row items-center justify-between text-base gap-3 sm:gap-0 text-center sm:text-left">
            
          </div>
        </div>
      </div>

      
      <style>{`
        /* CSS for the Parallax Effect */
        .parallax-bg {
          background-position: center;
          background-repeat: no-repeat;
          background-size: cover;
          background-attachment: fixed; /* This property makes the background move slower than the content */
        }
        
        /* Headline Glow Effect - More pronounced */
        .headline-glow {
            text-shadow: 0 0 18px rgba(255, 255, 255, 0.7), 0 0 35px rgba(255, 99, 71, 0.5); /* Stronger glow */
        }

        /* Animation Keyframes - More dynamic drop-in */
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(60px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards; 
          opacity: 0; 
        }
        .delay-200 { animation-delay: 0.3s; }
        .delay-400 { animation-delay: 0.6s; }
        .font-inter {
            font-family: 'Inter', sans-serif;
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
