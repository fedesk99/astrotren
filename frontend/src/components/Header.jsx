import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { logos } from '../mock/mockData';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Blur al hacer scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Bloquear scroll cuando el menú está abierto
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [isMobileMenuOpen]);

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
      {/* Overlay */}
      <div
        onClick={() => setIsMobileMenuOpen(false)}
        className={`fixed inset-0 bg-black/80 backdrop-blur-md z-40 lg:hidden 
        transition-opacity duration-250 ease-out
        ${isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside
        id="mobile-navigation"
        aria-label="Menú de navegación móvil"
        className={`fixed top-0 right-0 h-full w-80 bg-black/95 backdrop-blur-xl 
        z-50 transform transition-all duration-300 ease-out lg:hidden
        ${isMobileMenuOpen
          ? 'translate-x-0 shadow-[-10px_0_40px_rgba(168,85,247,0.35)]'
          : 'translate-x-full shadow-none'
        }`}
      >
        {/* Header del Drawer */}
        <div className="flex justify-between items-center p-6 border-b border-gray-800">
          <span className="text-purple-400 font-bold tracking-wider uppercase">
            Astrotrén
          </span>

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Cerrar menú"
            className="text-white hover:text-purple-400 transition-colors"
          >
            <X
              size={26}
              aria-hidden="true"
            />
          </button>
        </div>

        {/* Links */}
        <nav
          className="flex flex-col gap-8 p-8"
          aria-label="Navegación móvil"
        >
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`text-lg uppercase tracking-wider transition-all duration-300 ${
                location.pathname === link.path
                  ? 'text-purple-400'
                  : 'text-gray-300 hover:text-white hover:translate-x-2'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Header normal */}
      <header
        className={`fixed top-0 left-0 right-0 z-30 transition-all duration-300 ${
          isScrolled
            ? 'bg-black/95 backdrop-blur-sm shadow-lg shadow-purple-900/20'
            : 'bg-transparent'
        }`}
      >
        <nav
          className="container mx-auto px-4 py-4"
          aria-label="Navegación principal"
        >
          <div className="flex items-center justify-between">

            <Link
              to="/"
              className="flex items-center"
              aria-label="Ir al inicio de Astrotrén"
            >
              <img
                src={logos.isologo}
                alt="Astrotrén"
                className="h-10 w-10 md:h-12 md:w-12 transition-transform hover:scale-110"
              />
            </Link>

            {/* Desktop */}
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
                </Link>
              ))}
            </div>

            {/* Botón mobile */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden text-white p-2 hover:text-purple-400 transition-colors"
              aria-label={isMobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-navigation"
            >
              <Menu
                size={26}
                aria-hidden="true"
              />
            </button>

          </div>
        </nav>
      </header>
    </>
  );
};

export default Header;
