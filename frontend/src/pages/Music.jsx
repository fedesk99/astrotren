import React, { useState } from 'react';
import { useSupabaseContent } from '../hooks/useSupabaseContent';
import { ExternalLink, Play, ChevronDown } from 'lucide-react';
import SEO from '../components/SEO';

const Music = () => {
  const [expandedPlaylist, setExpandedPlaylist] = useState(null);
  const {
    items: playlists,
    loading,
    error,
  } = useSupabaseContent('playlists');

  const togglePlaylist = (index) => {
    setExpandedPlaylist(
      expandedPlaylist === index ? null : index
    );
  };

  return (
    <div className="min-h-screen text-white pt-24 pb-16">
      <SEO
        title="Música - Astrotrén"
        description="Escuchá la música de Astrotrén, banda de Heavy Metal, Hard Rock y Punk de Argentina. Encontrá demos, grabaciones en vivo, versiones acústicas y nuestras producciones musicales."
        url="https://astrotren.vercel.app/music"
      />

      <div className="container mx-auto px-4">

        {/* Header */}
        <header className="text-center mb-16">
          <h1
            id="music-title"
            className="text-lg md:text-7xl font-black tracking-wider text-[#3b1d5c] page-title"
          >
            Música
          </h1>

          <div
            className="w-28 h-2 bg-gradient-to-r from-purple-500 via-purple-600 to-pink-600 mx-auto mt-4 rounded-full shadow-lg shadow-purple-900/50"
            aria-hidden="true"
          ></div>

          <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto mt-8">
            Explorá nuestra música en YouTube. Demos, grabaciones en vivo y versiones acústicas.
          </p>
        </header>

        {loading && (
          <p
            className="mb-6 text-center text-sm text-gray-500"
            role="status"
          >
            Cargando música…
          </p>
        )}

        {error && (
          <p
            className="mb-6 text-center text-sm text-red-400"
            role="alert"
          >
            No se pudo cargar la música.
          </p>
        )}

        {/* Playlists */}
        <section
          className="max-w-4xl mx-auto space-y-6"
          aria-labelledby="music-title"
        >
          {playlists.map((playlist, index) => {
            const isExpanded = expandedPlaylist === index;
            const contentId = `playlist-content-${playlist.id || index}`;
            const buttonId = `playlist-button-${playlist.id || index}`;

            return (
              <article
                key={playlist.id || index}
                className="group"
              >
                <div className="border border-gray-800 rounded-lg bg-gradient-to-br from-gray-900 to-black hover:border-purple-500 transition-all">

                  {/* Playlist header */}
                  <div className="p-4 md:p-6 flex items-center justify-between gap-3">

                    {/* Área completa para expandir */}
                    <button
                      type="button"
                      onClick={() => togglePlaylist(index)}
                      aria-expanded={isExpanded}
                      aria-controls={contentId}
                      id={buttonId}
                      className="flex items-center gap-3 md:gap-4 flex-1 min-w-0 text-left rounded-lg focus:outline-none"                    >

                      <div
                        className="w-10 h-10 md:w-12 md:h-12 bg-purple-900/30 rounded-full flex items-center justify-center group-hover:bg-purple-600/50 transition-colors relative overflow-hidden flex-shrink-0"
                        aria-hidden="true"
                      >

                        <Play
                          className="text-purple-400 relative z-10"
                          size={20}
                          fill="currentColor"
                        />

                        {playlist.thumbnail && (
                          <img
                            src={playlist.thumbnail}
                            alt=""
                            className="absolute inset-0 w-full h-full object-contain opacity-0 group-hover:opacity-20 transition-opacity p-2"
                          />
                        )}

                      </div>

                      <div className="min-w-0">
                        <h2 className="text-lg md:text-2xl font-bold text-white group-hover:text-purple-400 transition-colors truncate">
                          {playlist.title}
                        </h2>

                        <p className="text-sm text-gray-500">
                          Click para expandir
                        </p>
                      </div>

                      <ChevronDown
                        size={20}
                        className={`text-gray-500 transition-transform ml-auto flex-shrink-0 ${
                          isExpanded ? 'rotate-180' : ''
                        }`}
                        aria-hidden="true"
                      />

                    </button>

                    {/* YouTube */}
                    <a
                      href={playlist.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Ver ${playlist.title} en YouTube`}
                      className="flex items-center gap-1.5 md:gap-2 text-purple-400 hover:text-purple-300 transition-colors text-sm px-3 py-1.5 md:px-4 md:py-2 border border-purple-500/30 rounded-full hover:border-purple-500 hover:bg-purple-500/10 flex-shrink-0"
                    >
                      <span className="hidden sm:inline">
                        Ver en YouTube
                      </span>

                      <ExternalLink
                        size={16}
                        aria-hidden="true"
                      />
                    </a>

                  </div>

                  {/* Embedded player */}
                  {isExpanded && (
                    <div
                      id={contentId}
                      className="border-t border-gray-800"
                      aria-labelledby={buttonId}
                    >
                      <div className="p-4">
                        <div className="aspect-video rounded overflow-hidden">

                          <iframe
                            src={`https://www.youtube.com/embed/${playlist.embed_id}`}
                            title={`Reproductor de la playlist ${playlist.title} de Astrotrén`}
                            className="w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          ></iframe>

                        </div>
                      </div>
                    </div>
                  )}

                </div>
              </article>
            );
          })}
        </section>

      </div>
    </div>
  );
};

export default Music;
