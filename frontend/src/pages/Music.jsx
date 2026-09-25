import React, { useState } from 'react';
import { logos } from '../mock/mockData';
import { useSupabaseContent } from '../hooks/useSupabaseContent';
import { Play, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';

const getYouTubeEmbedUrl = (playlist) => {
  const url = playlist.url || '';
  const embedId = playlist.embed_id || '';

  // 1. Si es una URL de playlist de YouTube
  const playlistMatch = url.match(/[?&]list=([^&]+)/);

  if (playlistMatch) {
    return `https://www.youtube.com/embed/videoseries?list=${playlistMatch[1]}`;
  }

  // 2. URL de video: youtube.com/watch?v=XXXXXXXX
  const watchMatch = url.match(/[?&]v=([^&]+)/);

  if (watchMatch) {
    return `https://www.youtube.com/embed/${watchMatch[1]}`;
  }

  // 3. URL corta: youtu.be/XXXXXXXX
  const shortMatch = url.match(/youtu\.be\/([^?&/]+)/);

  if (shortMatch) {
    return `https://www.youtube.com/embed/${shortMatch[1]}`;
  }

  // 4. Si embed_id contiene un formato de playlist
  if (embedId.startsWith('videoseries?list=')) {
    return `https://www.youtube.com/embed/${embedId}`;
  }

  // 5. Si embed_id parece ser un ID de video de YouTube
  if (/^[A-Za-z0-9_-]{11}$/.test(embedId)) {
    return `https://www.youtube.com/embed/${embedId}`;
  }

  // 6. Si no pudimos detectar ningún formato
  return null;
};

const Music = () => {
  const [expandedPlaylist, setExpandedPlaylist] = useState(null);

  const {
    items: playlists,
    loading,
    error,
  } = useSupabaseContent('playlists');

  return (
    <div className="min-h-screen text-white pt-24 pb-16">
      <div className="container mx-auto px-4">

        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-lg md:text-7xl font-black tracking-wider text-[#3b1d5c] page-title">
            Música
          </h1>

          <div className="w-28 h-2 bg-gradient-to-r from-purple-500 via-purple-600 to-pink-600 mx-auto mt-4 rounded-full shadow-lg shadow-purple-900/50"></div>

          <p className="text-gray-400 text-lg max-w-2xl mx-auto mt-8">
            Explorá nuestra música en YouTube. Demos, grabaciones en vivo y versiones acústicas.
          </p>
        </div>

        {loading && (
          <p className="mb-6 text-center text-sm text-gray-500">
            Cargando música…
          </p>
        )}

        {error && (
          <p className="mb-6 text-center text-sm text-red-400">
            No se pudo cargar la música.
          </p>
        )}

        {/* Playlists */}
        <div className="max-w-4xl mx-auto space-y-6">
          {playlists.map((playlist, index) => {
            const embedUrl = getYouTubeEmbedUrl(playlist);

            return (
              <div key={playlist.id || index} className="group">

                {/* Playlist Header */}
                <div className="border border-gray-800 rounded-lg bg-gradient-to-br from-gray-900 to-black hover:border-purple-500 transition-all">

                  <div
                    className="p-6 flex items-center justify-between cursor-pointer"
                    onClick={() =>
                      setExpandedPlaylist(
                        expandedPlaylist === index ? null : index
                      )
                    }
                  >

                    <div className="flex items-center gap-4 flex-1">

                      <div className="w-12 h-12 bg-purple-900/30 rounded-full flex items-center justify-center group-hover:bg-purple-600/50 transition-colors relative overflow-hidden">

                        <Play
                          className="text-purple-400 relative z-10"
                          size={20}
                        />

                        <img
                          src={logos.isologo}
                          alt=""
                          className="absolute inset-0 w-full h-full object-contain opacity-0 group-hover:opacity-20 transition-opacity p-2"
                        />

                      </div>

                      <div>
                        <h2 className="text-2xl font-bold text-white group-hover:text-purple-400 transition-colors">
                          {playlist.title}
                        </h2>

                        <p className="text-sm text-gray-500">
                          Click para expandir
                        </p>
                      </div>

                    </div>

                    <div className="flex items-center gap-4">

                      <a
                        href={playlist.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors text-sm px-4 py-2 border border-purple-500/30 rounded-full hover:border-purple-500 hover:bg-purple-500/10"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span className="hidden sm:inline">
                          Ver en YouTube
                        </span>

                        <ExternalLink size={16} />
                      </a>

                      {expandedPlaylist === index ? (
                        <ChevronUp
                          className="text-purple-400"
                          size={24}
                        />
                      ) : (
                        <ChevronDown
                          className="text-purple-400"
                          size={24}
                        />
                      )}

                    </div>
                  </div>

                  {/* Reproductor embebido */}
                  {expandedPlaylist === index && (
                    <div className="border-t border-gray-800">

                      <div className="p-4">

                        <div className="aspect-video rounded overflow-hidden">

                          {embedUrl ? (
                            <iframe
                              src={embedUrl}
                              title={playlist.title}
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              className="w-full h-full"
                            ></iframe>
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-black text-gray-500">
                              No se pudo generar el reproductor de YouTube.
                            </div>
                          )}

                        </div>

                      </div>

                    </div>
                  )}

                </div>

              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};

export default Music;