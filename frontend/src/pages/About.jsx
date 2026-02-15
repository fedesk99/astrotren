import React from 'react';
import { bandInfo, members, logos } from '../mock/mockData';
import { Users } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen text-white pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-black tracking-wider text-[#3b1d5c] page-title">
            Sobre Nosotros
          </h1>
          <div className="w-28 h-2 bg-gradient-to-r from-purple-500 via-purple-600 to-pink-600 mx-auto mt-4 rounded-full shadow-lg shadow-purple-900/50"></div>
        </div>

        {/* Descripción */}
        <div className="max-w-4xl mx-auto mb-20">
          <div className="border border-gray-800 rounded-lg p-8 md:p-12 bg-gradient-to-br from-gray-900 to-black relative overflow-hidden">
            {/* Marco gótico decorativo */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
            <div className="absolute bottom-[-18px] left-0 w-full h-2 bg-gradient-to-r from-transparent via-purple-500 to-transparent rounded-full"></div>
            
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-shrink-0">
                <img
                  src={logos.isologo}
                  alt="Astrotrén Logo"
                  className="w-32 h-32 md:w-48 md:h-48" />

              </div>
              <div>
                <h2 className="text-3xl font-bold mb-4 text-purple-400">{bandInfo.name}</h2>
                <p className="text-xl text-gray-300 leading-relaxed mb-4">
                  {bandInfo.tagline}
                </p>
                <div className="flex flex-wrap gap-4 text-sm">
                  <span className="px-4 py-2 bg-purple-900/30 rounded-full border border-purple-500/30 text-purple-300">
                    {bandInfo.genre}
                  </span>
                  <span className="px-4 py-2 bg-purple-900/30 rounded-full border border-purple-500/30 text-purple-300">
                    {bandInfo.origin}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Miembros */}
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-12">
            <div className="w-10 h-10 bg-purple-900/30 rounded-full flex items-center justify-center">
              <img src={logos.isologo} alt="" className="w-6 h-6 opacity-70" />
            </div>
            <h2 className="text-4xl font-bold text-center text-white">Miembros</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {members.map((member, index) =>
            <div
              key={index}
              className="group relative border border-gray-800 rounded-lg p-6 bg-gradient-to-br from-gray-900 to-black hover:border-purple-500 transition-all duration-300">

                {/* Marco gótico superior */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-12 h-12 bg-black border border-gray-800 group-hover:border-purple-500 rounded-full flex items-center justify-center transition-colors">
                    <img src={logos.isologo} alt="" className="w-6 h-6 opacity-50 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>

                <div className="text-center mt-4">
                  <p className="text-purple-400 uppercase tracking-widest text-xs font-semibold mb-2">
                    {member.role}
                  </p>
                  <p className="text-white text-xl font-bold">{member.name}</p>
                </div>

                {/* Decoración inferior */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>);

};

export default About;