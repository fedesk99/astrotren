import React, { useState } from 'react';
import { lyrics, logos } from '../mock/mockData';
import { Music } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../components/ui/accordion';

const Lyrics = () => {
  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
            Letras
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-600 mx-auto mb-6"></div>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Explorá las letras de nuestras canciones y adentrarte en el universo lírico de Astrotrén.
          </p>
        </div>

        {/* Listado de letras con Accordion */}
        <div className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {lyrics.map((song) => (
              <AccordionItem
                key={song.id}
                value={`song-${song.id}`}
                className="border border-gray-800 rounded-lg bg-gradient-to-br from-gray-900 to-black overflow-hidden hover:border-purple-500 transition-colors"
              >
                <AccordionTrigger className="px-6 py-4 hover:no-underline group">
                  <div className="flex items-center gap-4 w-full">
                    <div className="w-12 h-12 bg-purple-900/30 rounded-full flex items-center justify-center group-hover:bg-purple-600/50 transition-colors flex-shrink-0 relative overflow-hidden">
                      <Music className="text-purple-400 relative z-10" size={20} />
                      <img src={logos.isologo} alt="" className="absolute inset-0 w-full h-full object-contain opacity-0 group-hover:opacity-20 transition-opacity p-2" />
                    </div>
                    <div className="text-left flex-1">
                      <h3 className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors">
                        {song.title}
                      </h3>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="border-t border-gray-800 pt-6 mt-2">
                    <div className="bg-black/50 p-6 rounded-lg border border-gray-800">
                      <pre className="whitespace-pre-wrap font-sans text-gray-300 leading-relaxed">
                        {song.lyrics}
                      </pre>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Nota */}
        <div className="mt-12 text-center">
          <p className="text-gray-500 text-sm">
            Las letras se irán agregando próximamente. Seguinos en nuestras redes para estar al tanto.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Lyrics;
