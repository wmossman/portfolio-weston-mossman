'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';

const navItems = {
  '/devblog': {
    name: 'Devblog',
  },
  '/projects': {
    name: 'Projects',
  },
  '/resume': {
    name: 'Resume',
  },
};

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        buttonRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close menu when pressing Escape
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsMobileMenuOpen(false);
      }
    }

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  return (
    <aside className="mb-8 tracking-tight max-w-full">
      <div className="lg:sticky lg:top-20">
        <nav className="flex flex-row items-center justify-between relative px-0 pb-0 fade w-full" id="nav">
          {/* Logo/icon as a link to home - flexes to take available space */}
          <Link
            href="/"
            className="hover:opacity-80 transition flex-1 mr-4 min-w-0 max-h-16"
            style={{
              display: 'flex',
              alignItems: 'center',
              height: 'fit-content',
            }}
          >
            <svg
              height="55px"
              width="128px"
              viewBox="0 0 128 55"
              className="w-full h-auto max-h-full max-w-[128px] min-w-[80px]"
              style={{
                maxHeight: '55px',
                objectFit: 'contain',
              }}
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M 5.8355481,25.919736 H 21.304356 c 2.42648,0 4.530358,0.823841 6.311636,2.471523 l 3.755466,3.473807 c 2.184569,2.020725 3.201618,1.989978 5.365091,0.02319 l 4.622881,-4.202619 c 1.795448,-1.632227 3.551064,-1.59045 5.266844,0.12533 l 3.951958,3.951959 c 2.04398,2.04398 3.131047,2.066963 5.266845,0.12533 l 4.62288,-4.202619 c 1.795449,-1.632227 3.551065,-3.30623 5.266845,-5.02201 l 3.951958,-3.951959 c 1.71578,-1.71578 3.471395,-1.757557 5.266844,-0.12533 l 4.622881,4.202619 c 2.14001,1.945463 3.183364,1.958151 5.266845,-0.12533 l 3.951958,-3.951959 c 1.71578,-1.71578 3.441364,-1.725696 5.176751,-0.02975 l 4.803064,4.693906 c 1.735387,1.695948 3.816317,2.543921 6.242797,2.543921 h 17.28867 c 2.26866,-0.02565 4.20947,1.624052 4.54966,3.867203 h -4.54966 -17.28867 c -2.42648,0 -4.53744,-0.816114 -6.332888,-2.448341 l -4.62288,-4.202618 c -2.239524,-2.035931 -3.060624,-2.08089 -5.266844,0.12533 l -3.951958,3.951958 c -1.71578,1.71578 -3.471396,1.757557 -5.266845,0.12533 L 74.953604,23.13598 c -2.161529,-1.965026 -3.163828,-1.977686 -5.266844,0.12533 l -3.951958,3.951958 c -1.71578,1.71578 -3.471396,3.389784 -5.266845,5.022011 l -4.62288,4.202618 c -1.79545,1.632227 -3.551065,1.590451 -5.266845,-0.12533 l -3.951958,-3.951958 c -2.083482,-2.083481 -3.076211,-2.116815 -5.266844,-0.12533 l -4.622881,4.202618 c -1.795449,1.632227 -3.551064,1.590451 -5.266844,-0.12533 l -3.951959,-3.951958 c -1.71578,-1.715781 -3.78691,-2.57367 -6.21339,-2.57367 H 5.8355481 C 3.5668955,29.81259 1.6260733,28.162887 1.2858986,25.919736 h 4.5496495 9.5542639"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.45589"
              />
            </svg>
          </Link>

          {/* Desktop navigation - hidden on mobile */}
          <div className="hidden md:flex flex-row space-x-0">
            {Object.entries(navItems).map(([path, { name }]) => {
              return (
                <Link
                  key={path}
                  href={path}
                  className="transition-all text-text-link hover:text-accent-secondary flex align-middle relative py-1 px-2 m-1 text-lg font-medium"
                >
                  {name}
                </Link>
              );
            })}
          </div>

          {/* Mobile burger menu button */}
          <button
            ref={buttonRef}
            className="md:hidden flex flex-col justify-center items-center w-8 h-8 relative focus:outline-none focus:ring-2 focus:ring-neutral-500 rounded cursor-pointer"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={isMobileMenuOpen}
          >
            <div
              className={`w-6 h-0.5 bg-current transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}
            />
            <div
              className={`w-6 h-0.5 bg-current transition-all duration-300 mt-1 ${isMobileMenuOpen ? 'opacity-0' : ''}`}
            />
            <div
              className={`w-6 h-0.5 bg-current transition-all duration-300 mt-1 ${isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}
            />
          </button>

          {/* Mobile dropdown menu */}
          {isMobileMenuOpen && (
            <div
              ref={menuRef}
              className="md:hidden absolute top-full right-0 mt-2 bg-background-content rounded-lg shadow-lg z-50 min-w-[150px]"
            >
              {Object.entries(navItems).map(([path, { name }]) => {
                return (
                  <Link
                    key={path}
                    href={path}
                    className="block px-4 py-3 text-lg font-medium text-text-link hover:text-accent-secondary transition-colors hover:bg-accent-decorative/10 first:rounded-t-lg last:rounded-b-lg"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {name}
                  </Link>
                );
              })}
            </div>
          )}
        </nav>
      </div>
    </aside>
  );
}
