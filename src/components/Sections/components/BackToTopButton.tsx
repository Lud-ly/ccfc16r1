"use client";

import React, { useEffect, useState } from 'react';

const BackToTopButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  const handleScroll = () => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <button
      onClick={scrollToTop}
      className={`fixed top-4 right-4 p-3 rounded-full text-white shadow-lg transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      style={{ display: isVisible ? 'block' : 'none', width: '56px', height: '56px', backgroundColor: "rgb(9, 87, 159)" }}
      aria-label="Back to top"
    >
      ↑
    </button>
  );
};

export default BackToTopButton;
