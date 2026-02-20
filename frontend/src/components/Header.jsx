import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { logos } from '../mock/mockData';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Inicio', path: '/' },
    { name: 'Sobre Nosotros', path: '/about' },
    { name: 'Música', path: '/music' },
    { name: 'Shows', path: '/shows' },
    { name: 'Letras', path: '/lyrics' },
    { name: 'Galería', path: '/gallery' },
    { name: 'Tienda', path: '/shop' },
    { name: 'Contacto', path: '/contact' },
  ];

  return (
    <>
      {/* OVERLAY MOBILE */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-black/95 backdrop-blur-sm shadow-lg shadow-purple-900/20'
            : 'bg-transparent'
        }`}
      >
        <nav className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <img
                src={logos.isologo}
                alt="Astrotrén"
                className="h-10 w-10 md:h-12 md:w-12 transition-transform hover:scale-110"
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-medium tracking-wider uppercase transition-colors relative group ${
                    location.pathname === link.path
                      ? 'text-purple-400'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  {link.name}
                  <span
                    className={`absolute -bottom-1 left-0 h-0.5 bg-purple-500 transition-all ${
                      location.pathname === link.path
                        ? 'w-full'
                        : 'w-0 group-hover:w-full'
                    }`}
                  ></span>
                </Link>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden text-white p-2 hover:text-purple-400 transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="lg:hidden mt-4 pb-4 border-t border-gray-800 bg-black/90 rounded-lg">
              <div className="flex flex-col gap-4 mt-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`text-sm font-medium tracking-wider uppercase transition-colors ${
                      location.pathname === link.path
                        ? 'text-purple-400'
                        : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </nav>
      </header>
    </>
  );
};

export default Header;