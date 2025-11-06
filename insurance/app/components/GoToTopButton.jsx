"use client";
import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

const GoToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false); // ✅ Fix hydration issue

  useEffect(() => {
    setIsMounted(true); // ✅ Ensure rendering happens only on client

    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  // ✅ Prevent mismatch by not rendering until after mount
  if (!isMounted) return null;

  return (
    <div
      className="fixed bottom-6 right-6 z-50 transition-opacity duration-300"
      style={{
        opacity: isVisible ? 1 : 0,
        pointerEvents: isVisible ? 'auto' : 'none',
      }}
    >
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Go to top"
        className="p-3 sm:p-4 bg-red-600 text-white rounded-full shadow-lg 
                   hover:bg-red-700 focus:ring-offset-2 transition duration-150"
      >
        <ArrowUp className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>
    </div>
  );
};

export default GoToTopButton;
