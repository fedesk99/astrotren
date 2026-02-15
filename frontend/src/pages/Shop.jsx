import React, { useState } from 'react';
import { merchandise, logos } from '../mock/mockData';
import { ShoppingBag, ExternalLink } from 'lucide-react';

const Shop = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);

  return (
    <div className="min-h-screen text-white pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-7xl font-black tracking-wider text-[#3b1d5c] page-title">
            Tienda
          </h1>
          <div className="w-28 h-2 bg-gradient-to-r from-purple-500 via-purple-600 to-pink-600 mx-auto mt-4 rounded-full shadow-lg shadow-purple-900/50"></div>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto mt-8">
            Conseguí productos oficiales de Astrotrén. Remeras, gorras y más.
          </p>
        </div>

        {/* Grid de productos */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {merchandise.map((product) => (
              <div
                key={product.id}
                className="group border border-gray-800 rounded-lg overflow-hidden bg-gradient-to-br from-gray-900 to-black hover:border-purple-500 transition-all hover:scale-[1.02]"
              >
                {/* Marco gótico superior */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10"></div>

                  <div className="aspect-square bg-gray-900 relative overflow-hidden">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>

                {/* Información del producto */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors">
                      {product.name}
                    </h3>
                    <div className="w-10 h-10 bg-purple-900/30 rounded-full flex items-center justify-center flex-shrink-0 ml-2 relative overflow-hidden">
                      <ShoppingBag className="text-purple-400 relative z-10" size={20} />
                      <img src={logos.isologo} alt="" className="absolute inset-0 w-full h-full object-contain opacity-0 group-hover:opacity-20 transition-opacity p-2" />
                    </div>
                  </div>
                  
                  <p className="text-gray-400 text-sm mb-4">{product.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <p className="text-2xl font-bold text-purple-400">{product.price}</p>
                    {product.images.length > 1 && (
                      <button
                        onClick={() => setSelectedProduct(product)}
                        className="text-sm text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1"
                      >
                        Ver más
                        <ExternalLink size={14} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Nota de contacto */}
        <div className="mt-16 text-center">
          <div className="border border-purple-900/50 rounded-lg p-8 max-w-2xl mx-auto bg-gradient-to-br from-purple-900/10 to-black">
            <p className="text-xl text-gray-300 mb-4">
              ¿Querés comprar algún producto?
            </p>
            <p className="text-gray-400 mb-6">
              Contactanos por WhatsApp, Instagram o email para realizar tu pedido.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a
                href="https://api.whatsapp.com/send/?phone=5491155710860"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full font-semibold uppercase tracking-wider text-sm transition-all hover:scale-105"
              >
                WhatsApp
              </a>
              <a
                href="https://www.instagram.com/astrotren.gdln/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-full font-semibold uppercase tracking-wider text-sm transition-all hover:scale-105"
              >
                Instagram
              </a>
              <a
                href="mailto:astrotrengdln@gmail.com"
                className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-full font-semibold uppercase tracking-wider text-sm transition-all hover:scale-105"
              >
                Email
              </a>
            </div>
          </div>
        </div>

        {/* Modal de producto (para ver más imágenes) */}
        {selectedProduct && (
          <div
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedProduct(null)}
          >
            <div
              className="bg-gray-900 rounded-lg max-w-4xl w-full p-6 border border-purple-500"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Imágenes */}
                <div className="space-y-4">
                  {selectedProduct.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`${selectedProduct.name} ${idx + 1}`}
                      className="w-full rounded-lg border border-gray-800"
                    />
                  ))}
                </div>
                
                {/* Info */}
                <div>
                  <h2 className="text-3xl font-bold text-white mb-4">{selectedProduct.name}</h2>
                  <p className="text-gray-400 mb-6">{selectedProduct.description}</p>
                  <p className="text-4xl font-bold text-purple-400 mb-6">{selectedProduct.price}</p>
                  <button
                    onClick={() => setSelectedProduct(null)}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-full font-semibold uppercase tracking-wider text-sm transition-all"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;
