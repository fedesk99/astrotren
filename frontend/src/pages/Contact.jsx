import React from 'react';
import { socialLinks, logos } from '../mock/mockData';
import { Instagram, Facebook, Music2, Mail, Phone, ExternalLink } from 'lucide-react';

const Contact = () => {
  return (
    <div className="min-h-screen text-white pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-black tracking-wider text-[#3b1d5c] page-title">
            Contacto
          </h1>
          <div className="w-28 h-2 bg-gradient-to-r from-purple-500 via-purple-600 to-pink-600 mx-auto mt-4 rounded-full shadow-lg shadow-purple-900/50"></div>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto mt-8">
            Conectate con nosotros. Seguinos en redes sociales o envianos un mensaje.
          </p>
        </div>

        {/* Redes sociales y contacto */}
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Instagram */}
            <a
              href={socialLinks.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="group border border-gray-800 rounded-lg p-8 bg-gradient-to-br from-gray-900 to-black hover:border-purple-500 transition-all hover:scale-[1.02]"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-purple-900/30 rounded-full flex items-center justify-center group-hover:bg-purple-600/50 transition-colors relative overflow-hidden">
                  <Instagram className="text-purple-400 relative z-10" size={32} />
                  <img src={logos.isologo} alt="" className="absolute inset-0 w-full h-full object-contain opacity-0 group-hover:opacity-20 transition-opacity p-3" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white group-hover:text-purple-400 transition-colors">
                    Instagram
                  </h3>
                  <p className="text-gray-400 text-sm">@astrotren.gdln</p>
                </div>
              </div>
              <p className="text-gray-400 flex items-center gap-2">
                Seguinos en Instagram
                <ExternalLink size={16} className="group-hover:translate-x-1 transition-transform" />
              </p>
            </a>

            {/* Facebook */}
            <a
              href={socialLinks.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="group border border-gray-800 rounded-lg p-8 bg-gradient-to-br from-gray-900 to-black hover:border-purple-500 transition-all hover:scale-[1.02]"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-purple-900/30 rounded-full flex items-center justify-center group-hover:bg-purple-600/50 transition-colors relative overflow-hidden">
                  <Facebook className="text-purple-400 relative z-10" size={32} />
                  <img src={logos.isologo} alt="" className="absolute inset-0 w-full h-full object-contain opacity-0 group-hover:opacity-20 transition-opacity p-3" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white group-hover:text-purple-400 transition-colors">
                    Facebook
                  </h3>
                  <p className="text-gray-400 text-sm">Astrotrén</p>
                </div>
              </div>
              <p className="text-gray-400 flex items-center gap-2">
                Seguinos en Facebook
                <ExternalLink size={16} className="group-hover:translate-x-1 transition-transform" />
              </p>
            </a>

            {/* TikTok */}
            <a
              href={socialLinks.tiktok}
              target="_blank"
              rel="noopener noreferrer"
              className="group border border-gray-800 rounded-lg p-8 bg-gradient-to-br from-gray-900 to-black hover:border-purple-500 transition-all hover:scale-[1.02]"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-purple-900/30 rounded-full flex items-center justify-center group-hover:bg-purple-600/50 transition-colors relative overflow-hidden">
                  <Music2 className="text-purple-400 relative z-10" size={32} />
                  <img src={logos.isologo} alt="" className="absolute inset-0 w-full h-full object-contain opacity-0 group-hover:opacity-20 transition-opacity p-3" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white group-hover:text-purple-400 transition-colors">
                    TikTok
                  </h3>
                  <p className="text-gray-400 text-sm">@astrotren.gdln</p>
                </div>
              </div>
              <p className="text-gray-400 flex items-center gap-2">
                Seguinos en TikTok
                <ExternalLink size={16} className="group-hover:translate-x-1 transition-transform" />
              </p>
            </a>

            {/* WhatsApp */}
            <a
              href={socialLinks.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="group border border-gray-800 rounded-lg p-8 bg-gradient-to-br from-gray-900 to-black hover:border-purple-500 transition-all hover:scale-[1.02]"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-purple-900/30 rounded-full flex items-center justify-center group-hover:bg-purple-600/50 transition-colors relative overflow-hidden">
                  <Phone className="text-purple-400 relative z-10" size={32} />
                  <img src={logos.isologo} alt="" className="absolute inset-0 w-full h-full object-contain opacity-0 group-hover:opacity-20 transition-opacity p-3" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white group-hover:text-purple-400 transition-colors">
                    WhatsApp
                  </h3>
                  <p className="text-gray-400 text-sm">Envianos un mensaje</p>
                </div>
              </div>
              <p className="text-gray-400 flex items-center gap-2">
                Contactanos por WhatsApp
                <ExternalLink size={16} className="group-hover:translate-x-1 transition-transform" />
              </p>
            </a>

            {/* Email */}
            <a
              href={`mailto:${socialLinks.email}`}
              className="group border border-gray-800 rounded-lg p-8 bg-gradient-to-br from-gray-900 to-black hover:border-purple-500 transition-all hover:scale-[1.02]"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-purple-900/30 rounded-full flex items-center justify-center group-hover:bg-purple-600/50 transition-colors relative overflow-hidden">
                  <Mail className="text-purple-400 relative z-10" size={32} />
                  <img src={logos.isologo} alt="" className="absolute inset-0 w-full h-full object-contain opacity-0 group-hover:opacity-20 transition-opacity p-3" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white group-hover:text-purple-400 transition-colors">
                    Email
                  </h3>
                  <p className="text-gray-400 text-sm">{socialLinks.email}</p>
                </div>
              </div>
              <p className="text-gray-400 flex items-center gap-2">
                Envianos un correo
                <ExternalLink size={16} className="group-hover:translate-x-1 transition-transform" />
              </p>
            </a>

            {/* Linktree */}
            <a
              href={socialLinks.linktree}
              target="_blank"
              rel="noopener noreferrer"
              className="group border border-gray-800 rounded-lg p-8 bg-gradient-to-br from-gray-900 to-black hover:border-purple-500 transition-all hover:scale-[1.02]"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-purple-900/30 rounded-full flex items-center justify-center group-hover:bg-purple-600/50 transition-colors relative overflow-hidden">
                  <ExternalLink className="text-purple-400 relative z-10" size={32} />
                  <img src={logos.isologo} alt="" className="absolute inset-0 w-full h-full object-contain opacity-0 group-hover:opacity-20 transition-opacity p-3" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white group-hover:text-purple-400 transition-colors">
                    Linktree
                  </h3>
                  <p className="text-gray-400 text-sm">Todos nuestros enlaces</p>
                </div>
              </div>
              <p className="text-gray-400 flex items-center gap-2">
                Ver todos los enlaces
                <ExternalLink size={16} className="group-hover:translate-x-1 transition-transform" />
              </p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
