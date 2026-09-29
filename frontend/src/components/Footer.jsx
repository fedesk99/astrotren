import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Music2, Mail } from 'lucide-react';
import { socialLinks, logos } from '../mock/mockData';

const Footer = () => {
  return (
    <footer className="bg-black border-t border-gray-900">
      <div className="container mx-auto px-4 py-12">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">

          {/* Logo y descripción */}
          <section
            aria-labelledby="footer-band-title"
            className="flex flex-col items-center md:items-start"
          >
            <img
              src={logos.isologo}
              alt="Astrotrén"
              className="h-16 w-16 mb-4"
            />

            <h2
              id="footer-band-title"
              className="text-white font-bold text-lg mb-2"
            >
              ASTROTRÉN
            </h2>

            <p className="text-gray-400 text-sm text-center md:text-left">
              Heavy Metal
              <br />
              Buenos Aires, Argentina
            </p>
          </section>

          {/* Enlaces rápidos */}
          <nav
            aria-label="Enlaces rápidos"
            className="flex flex-col items-center"
          >
            <h2 className="text-white font-semibold mb-4 uppercase tracking-wider text-sm">
              Enlaces
            </h2>

            <div className="flex flex-col gap-2 text-center">
              <Link
                to="/about"
                className="text-gray-400 hover:text-purple-400 transition-colors text-sm"
              >
                Sobre Nosotros
              </Link>

              <Link
                to="/music"
                className="text-gray-400 hover:text-purple-400 transition-colors text-sm"
              >
                Música
              </Link>

              <Link
                to="/shows"
                className="text-gray-400 hover:text-purple-400 transition-colors text-sm"
              >
                Shows
              </Link>

              <Link
                to="/shop"
                className="text-gray-400 hover:text-purple-400 transition-colors text-sm"
              >
                Tienda
              </Link>
            </div>
          </nav>

          {/* Redes sociales */}
          <section
            aria-labelledby="footer-social-title"
            className="flex flex-col items-center md:items-end"
          >
            <h2
              id="footer-social-title"
              className="text-white font-semibold mb-4 uppercase tracking-wider text-sm"
            >
              Redes Sociales
            </h2>

            <div className="flex gap-4">
              <a
                href={socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-purple-400 transition-all hover:scale-110"
                aria-label="Instagram"
              >
                <Instagram size={24} aria-hidden="true" />
              </a>

              <a
                href={socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-purple-400 transition-all hover:scale-110"
                aria-label="Facebook"
              >
                <Facebook size={24} aria-hidden="true" />
              </a>

              <a
                href={socialLinks.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-purple-400 transition-all hover:scale-110"
                aria-label="TikTok"
              >
                <Music2 size={24} aria-hidden="true" />
              </a>

              <a
                href={`mailto:${socialLinks.email}`}
                className="text-gray-400 hover:text-purple-400 transition-all hover:scale-110"
                aria-label="Email"
              >
                <Mail size={24} aria-hidden="true" />
              </a>
            </div>

            <a
              href={socialLinks.linktree}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 text-purple-400 hover:text-purple-300 text-sm transition-colors"
            >
              🔗 Todos los enlaces
            </a>
          </section>

        </div>

        {/* Copyright */}
        <div className="border-t border-gray-900 pt-8 text-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Astrotrén. Todos los derechos reservados.
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
