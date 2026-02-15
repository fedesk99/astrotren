import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Music, Calendar, ShoppingBag } from 'lucide-react';
import { bandInfo, logos, shows } from '../mock/mockData';

const Home = () => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    // Generar partículas para efecto de estrellas
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      duration: Math.random() * 3 + 2,
    }));
    setParticles(newParticles);
  }, []);

  const nextShow = shows[0]?.dates[0];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section con partículas */}
      <section className="min-h-[calc(100vh-80px)] mt-20 overflow-hidden">
        {/* Fondo degradado */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-950/30 via-black to-black"></div>

        {/* Partículas de estrellas */}
        <div className="absolute inset-0">
          {particles.map((particle) => (
            <div
              key={particle.id}
              className="absolute rounded-full bg-white animate-pulse"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                animationDuration: `${particle.duration}s`,
              }}
            ></div>
          ))}
        </div>

        {/* Contenido principal */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          {/* Logo principal */}
          <div className="mb-8 animate-fade-in">
            <img
              src={logos.blanco}
              alt="Astrotrén"
              className="w-full max-w-2xl mx-auto drop-shadow-2xl"
            />
          </div>

          {/* Tagline */}
          <p className="text-xl md:text-2xl text-gray-300 mb-4 font-light tracking-wide animate-fade-in-delay">
            {bandInfo.tagline}
          </p>

          {/* Género y origen */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-12 text-purple-400 font-medium animate-fade-in-delay-2">
            <span className="uppercase tracking-widest text-sm">{bandInfo.genre}</span>
            <span className="hidden md:block text-gray-600">•</span>
            <span className="uppercase tracking-widest text-sm">{bandInfo.origin}</span>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-delay-3">
            <Link
              to="/music"
              className="group bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-full font-semibold uppercase tracking-wider text-sm transition-all hover:scale-105 flex items-center justify-center gap-2"
            >
              <Music size={20} />
              Escuchar Música
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/shows"
              className="group bg-transparent border-2 border-purple-500 hover:bg-purple-500/10 text-white px-8 py-3 rounded-full font-semibold uppercase tracking-wider text-sm transition-all hover:scale-105 flex items-center justify-center gap-2"
            >
              <Calendar size={20} />
              Próximos Shows
            </Link>
          </div>

          {/* Próximo show destacado */}
          {nextShow && (
            <div className="mt-16 p-6 border border-purple-900/50 rounded-lg bg-black/50 backdrop-blur-sm animate-fade-in-delay-4">
              <p className="text-sm uppercase tracking-widest text-purple-400 mb-2">Próximo Show</p>
              <p className="text-2xl font-bold text-white mb-1">{nextShow.date}</p>
              <p className="text-lg text-gray-400">{nextShow.venue}</p>
            </div>
          )}
        </div>
      </section>

      {/* Sección de características rápidas */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Música */}
            <Link
              to="/music"
              className="group p-8 border border-gray-800 rounded-lg hover:border-purple-500 transition-all hover:scale-105 bg-black/50"
            >
              <div className="w-16 h-16 bg-purple-900/30 rounded-full flex items-center justify-center mb-4 group-hover:bg-purple-600/50 transition-colors relative overflow-hidden">
                <Music size={32} className="text-purple-400 relative z-10" />
                <img src={logos.isologo} alt="" className="absolute inset-0 w-full h-full object-contain opacity-0 group-hover:opacity-20 transition-opacity p-2" />
              </div>
              <h3 className="text-2xl font-bold mb-2 text-white">Música</h3>
              <p className="text-gray-400">
                Descubrí nuestros demos, grabaciones en vivo y versiones acústicas.
              </p>
            </Link>

            {/* Shows */}
            <Link
              to="/shows"
              className="group p-8 border border-gray-800 rounded-lg hover:border-purple-500 transition-all hover:scale-105 bg-black/50"
            >
              <div className="w-16 h-16 bg-purple-900/30 rounded-full flex items-center justify-center mb-4 group-hover:bg-purple-600/50 transition-colors relative overflow-hidden">
                <Calendar size={32} className="text-purple-400 relative z-10" />
                <img src={logos.isologo} alt="" className="absolute inset-0 w-full h-full object-contain opacity-0 group-hover:opacity-20 transition-opacity p-2" />
              </div>
              <h3 className="text-2xl font-bold mb-2 text-white">Shows</h3>
              <p className="text-gray-400">
                Mirá dónde vamos a tocar próximamente y no te pierdas ningún show.
              </p>
            </Link>

            {/* Tienda */}
            <Link
              to="/shop"
              className="group p-8 border border-gray-800 rounded-lg hover:border-purple-500 transition-all hover:scale-105 bg-black/50"
            >
              <div className="w-16 h-16 bg-purple-900/30 rounded-full flex items-center justify-center mb-4 group-hover:bg-purple-600/50 transition-colors relative overflow-hidden">
                <ShoppingBag size={32} className="text-purple-400 relative z-10" />
                <img src={logos.isologo} alt="" className="absolute inset-0 w-full h-full object-contain opacity-0 group-hover:opacity-20 transition-opacity p-2" />
              </div>
              <h3 className="text-2xl font-bold mb-2 text-white">Tienda</h3>
              <p className="text-gray-400">
                Conseguí remeras, gorras y otros productos oficiales de Astrotrén.
              </p>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
