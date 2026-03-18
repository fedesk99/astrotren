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
          <div className="flex flex-col items-center md:items-start">
            <img src={logos.isologo} alt="Astrotrén" className="h-16 w-16 mb-4" />
            <h3 className="text-white font-bold text-lg mb-2">ASTROTRÉN</h3>
            <p className="text-gray-400 text-sm text-center md:text-left">Heavy Metal

              <br />Buenos Aires, Argentina

            </p>
          </div>

          {/* Enlaces rápidos */}
          <div className="flex flex-col items-center">
            <h4 className="text-white font-semibold mb-4 uppercase tracking-wider text-sm">
              Enlaces
            </h4>
            <div className="flex flex-col gap-2 text-center">
              <Link to="/about" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">
                Sobre Nosotros
              </Link>
              <Link to="/music" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">
                Música
              </Link>
              <Link to="/shows" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">
                Shows
              </Link>
              <Link to="/shop" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">
                Tienda
              </Link>
            </div>
          </div>

          {/* Redes sociales */}
          <div className="flex flex-col items-center md:items-end">
            <h4 className="text-white font-semibold mb-4 uppercase tracking-wider text-sm">
              Redes Sociales
            </h4>
            <div className="flex gap-4">
              <a
                href={socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-purple-400 transition-all hover:scale-110"
                aria-label="Instagram">

                <Instagram size={24} />
              </a>
              <a
                href={socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-purple-400 transition-all hover:scale-110"
                aria-label="Facebook">

                <Facebook size={24} />
              </a>
              <a
                href={socialLinks.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-purple-400 transition-all hover:scale-110"
                aria-label="TikTok">

                <Music2 size={24} />
              </a>
              <a
                href={`mailto:${socialLinks.email}`}
                className="text-gray-400 hover:text-purple-400 transition-all hover:scale-110"
                aria-label="Email">

                <Mail size={24} />
              </a>
            </div>
            <a
              href={socialLinks.linktree}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 text-purple-400 hover:text-purple-300 text-sm transition-colors">

              🔗 Todos los enlaces
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-900 pt-8 text-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Astrotrén. Todos los derechos reservados.
          </p>
        </div>
      </div>

    </footer>);

};

export default Footer;