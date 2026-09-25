jsx
import React from 'react';
import { logos } from '../mock/mockData';
import { useSupabaseContent } from '../hooks/useSupabaseContent';
import { Calendar, MapPin } from 'lucide-react';

const Shows = () => {
  const { items: showItems, loading, error } = useSupabaseContent('shows');

  const groupedShows = showItems.reduce((groups, show) => {
    const year = String(show.date).slice(0, 4);

    if (!groups[year]) {
      groups[year] = [];
    }

    groups[year].push(show);

    return groups;
  }, {});

Object.values(groupedShows).forEach((shows) => {
  shows.sort((a, b) => {
    return new Date(a.date) - new Date(b.date);
  });
});
  const years = Object.keys(groupedShows).sort(
    (a, b) => Number(a) - Number(b)
  );

  return (
    <div className="min-h-screen text-white pt-24 pb-16">
      <div className="container mx-auto px-4">

        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-lg md:text-7xl font-black tracking-wider text-[#3b1d5c] page-title">
            Shows
          </h1>

          <div className="w-28 h-2 bg-gradient-to-r from-purple-500 via-purple-600 to-pink-600 mx-auto mt-4 rounded-full shadow-lg shadow-purple-900/50"></div>

          <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto mt-8">
            No te pierdas nuestras próximas presentaciones en vivo. ¡Nos vemos en el escenario!
          </p>
        </div>

        {loading && (
          <p className="mb-6 text-center text-sm text-gray-500">
            Cargando shows…
          </p>
        )}

        {error && (
          <p className="mb-6 text-center text-sm text-red-400">
            No se pudieron cargar los shows.
          </p>
        )}

        {/* Shows por año */}
        <div className="max-w-4xl mx-auto space-y-12">

          {years.map((year) => (
            <div key={year}>

              {/* Año */}
              <div className="mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-purple-400 mb-2">
                  {year}
                </h2>

                <div className="h-1 w-20 bg-gradient-to-r from-purple-500 to-pink-600"></div>
              </div>

              {/* Fechas */}
              {groupedShows[year].length > 0 ? (
                <div className="space-y-4">

                  {groupedShows[year].map((show) => (
                    <div
                      key={show.id}
                      className="group relative border border-gray-800 rounded-lg p-4 md:p-6 bg-gradient-to-br from-gray-900 to-black hover:border-purple-500 transition-all hover:scale-[1.02]"
                    >

                      {/* Marco gótico superior */}
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

                        {/* Fecha */}
                        <div className="flex items-center gap-3 md:gap-4">

                          <div className="w-11 h-11 md:w-14 md:h-14 bg-purple-900/30 rounded-lg flex items-center justify-center group-hover:bg-purple-600/50 transition-colors relative overflow-hidden">

                            <Calendar
                              className="text-purple-400 relative z-10"
                              size={28}
                            />

                            <img
                              src={logos.isologo}
                              alt=""
                              className="absolute inset-0 w-full h-full object-contain opacity-0 group-hover:opacity-20 transition-opacity p-2"
                            />

                          </div>

                          <div>
                            <p className="text-lg md:text-2xl font-bold text-white">
                              {new Date(
                                `${show.date}T00:00:00`
                              ).toLocaleDateString('es-AR', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                              })}
                            </p>

                            <p className="text-sm text-gray-400 uppercase tracking-wider">
                              {new Date(
                                `${show.date}T00:00:00`
                              ).toLocaleDateString('es-AR', {
                                weekday: 'long',
                              })}

                              {show.time && ` - ${show.time}`}
                            </p>
                          </div>

                        </div>

                        {/* Venue */}
                        <div className="flex items-start gap-3 text-gray-300">

                          <MapPin
                            className="text-purple-400 mt-1 flex-shrink-0"
                            size={24}
                          />

                          <div>
                            <p className="text-base md:text-xl font-semibold">
                              {show.venue}
                            </p>

                            {show.address && (
                              <p className="text-sm md:text-base text-gray-400 mt-1">
                                {show.address}
                              </p>
                            )}
                          </div>

                        </div>

                      </div>
                    </div>
                  ))}

                </div>
              ) : (
                <div className="border border-gray-800 rounded-lg p-12 bg-gradient-to-br from-gray-900 to-black text-center">
                  <p className="text-gray-500 text-lg">
                    Próximamente anunciaremos nuevas fechas para {year}
                  </p>
                </div>
              )}

            </div>
          ))}

        </div>

        {/* Call to action */}
        <div className="mt-16 text-center">
          <div className="border border-purple-900/50 rounded-lg p-8 max-w-2xl mx-auto bg-gradient-to-br from-purple-900/10 to-black">

            <p className="text-xl text-gray-300 mb-4">
              ¿Querés que toquemos en tu evento?
            </p>

            <a
              href="mailto:astrotrengdln@gmail.com"
              className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-full font-semibold uppercase tracking-wider text-sm transition-all hover:scale-105"
            >
              Contactanos
            </a>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Shows;
