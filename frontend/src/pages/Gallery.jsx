import React, { useState } from 'react';
import { useSupabaseContent } from '../hooks/useSupabaseContent';
import { X } from 'lucide-react';
import SEO from '../components/SEO';

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const { items: gallery, loading, error } = useSupabaseContent('gallery');

  return (
    <div className="min-h-screen text-white pt-24 pb-16">
      <SEO
        title="Galería - Astrotrén"
        description="Galería de fotos de Astrotrén: presentaciones en vivo, escenarios y momentos de la banda dentro y fuera del escenario."
        url="https://astrotren.vercel.app/gallery"
      />

      <div className="container mx-auto px-4">

        {/* Header */}
        <header className="text-center mb-16">
          <h1
            id="gallery-title"
            className="text-lg md:text-7xl font-black tracking-wider text-[#3b1d5c] page-title"
          >
            Galería
          </h1>

          <div
            className="w-28 h-2 bg-gradient-to-r from-purple-500 via-purple-600 to-pink-600 mx-auto mt-4 rounded-full shadow-lg shadow-purple-900/50"
            aria-hidden="true"
          ></div>

          <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto mt-8">
            Momentos capturados en el escenario y detrás de él. La esencia visual de Astrotrén.
          </p>
        </header>

        {loading && (
          <p
            className="mb-6 text-center text-sm text-gray-500"
            role="status"
          >
            Cargando galería…
          </p>
        )}

        {error && (
          <p
            className="mb-6 text-center text-sm text-red-400"
            role="alert"
          >
            No se pudo cargar la galería.
          </p>
        )}

        {/* Grid de imágenes */}
        <section
          className="max-w-7xl mx-auto"
          aria-labelledby="gallery-title"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">

            {gallery.map((image) => (
              <article key={image.id}>
                <button
                  type="button"
                  onClick={() => setSelectedImage(image)}
                  aria-label={`Abrir imagen ${image.caption || 'de Astrotrén'}`}
                  className="group relative block w-full aspect-square overflow-hidden rounded-lg border border-gray-800 hover:border-purple-500 transition-all cursor-pointer text-left p-0"
                >

                  {/* Marco gótico decorativo */}
                  <div
                    className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    aria-hidden="true"
                  ></div>

                  <div
                    className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    aria-hidden="true"
                  ></div>

                  {/* Imagen */}
                  <img
                    src={image.image_url}
                    alt={image.caption || ''}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />

                  {/* Overlay */}
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-hidden="true"
                  >
                    <div className="absolute bottom-4 left-4 right-4">
                      <p className="text-white font-semibold">
                        {image.caption || ''}
                      </p>
                    </div>
                  </div>

                </button>
              </article>
            ))}

          </div>
        </section>

        {/* Modal de imagen ampliada */}
        {selectedImage && (
          <div
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-label={`Imagen ampliada ${selectedImage.caption || 'de Astrotrén'}`}
            onClick={() => setSelectedImage(null)}
          >
            <button
              type="button"
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 text-white hover:text-purple-400 transition-colors"
              aria-label="Cerrar imagen ampliada"
            >
              <X size={32} aria-hidden="true" />
            </button>

            <img
              src={selectedImage.image_url}
              alt={selectedImage.caption || ''}
              className="max-w-full max-h-full object-contain rounded-lg border-2 border-purple-500"
            />
          </div>
        )}

      </div>
    </div>
  );
};

export default Gallery;
