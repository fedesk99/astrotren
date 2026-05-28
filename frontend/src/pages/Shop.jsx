import React, { useCallback, useEffect, useState } from 'react';
import { merchandise, logos } from '../mock/mockData';
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  RotateCcw,
  ShoppingBag,
  X,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';

const Shop = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);

  const openProductModal = (product) => {
    setSelectedProduct(product);
    setSelectedImageIndex(0);
    setZoomLevel(1);
  };

  const closeProductModal = useCallback(() => {
    setSelectedProduct(null);
    setSelectedImageIndex(0);
    setZoomLevel(1);
  }, []);

  const showImage = useCallback((index) => {
    if (!selectedProduct) {
      return;
    }

    const imageCount = selectedProduct.images.length;
    setSelectedImageIndex((index + imageCount) % imageCount);
    setZoomLevel(1);
  }, [selectedProduct]);

  const zoomIn = () => setZoomLevel((level) => Math.min(level + 0.5, 3));
  const zoomOut = () => setZoomLevel((level) => Math.max(level - 0.5, 1));

  useEffect(() => {
    if (!selectedProduct) {
      return undefined;
    }

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        closeProductModal();
      }

      if (event.key === 'ArrowLeft' && selectedProduct.images.length > 1) {
        showImage(selectedImageIndex - 1);
      }

      if (event.key === 'ArrowRight' && selectedProduct.images.length > 1) {
        showImage(selectedImageIndex + 1);
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [closeProductModal, selectedProduct, selectedImageIndex, showImage]);

  return (
    <div className="min-h-screen text-white pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-lg md:text-7xl font-black tracking-wider text-[#3b1d5c] page-title">
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
                className="group relative border border-gray-800 rounded-lg overflow-hidden bg-gradient-to-br from-gray-900 to-black hover:border-purple-500 transition-all hover:scale-[1.02]"
              >
                {/* Marco gotico superior */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10"></div>

                <button
                  type="button"
                  onClick={() => openProductModal(product)}
                  className="aspect-square bg-gray-900 relative overflow-hidden w-full block focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-black"
                  aria-label={`Ver ${product.name} ampliado`}
                >
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className={`w-full h-full object-contain p-4 transition-all duration-500 ${
                      product.images.length > 1
                        ? 'group-hover:opacity-0 group-hover:scale-105'
                        : 'group-hover:scale-110'
                    }`}
                  />
                  {product.images.length > 1 && (
                    <img
                      src={product.images[1]}
                      alt={`${product.name} dorso`}
                      className="absolute inset-0 w-full h-full object-contain p-4 opacity-0 scale-95 transition-all duration-500 group-hover:opacity-100 group-hover:scale-105"
                    />
                  )}
                  <span className="absolute bottom-3 right-3 inline-flex items-center gap-2 rounded-full bg-black/75 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-purple-200 border border-purple-500/50 opacity-0 group-hover:opacity-100 transition-opacity">
                    Ampliar
                    <ExternalLink size={14} />
                  </span>
                </button>

                {/* Informacion del producto */}
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
                    <button
                      type="button"
                      onClick={() => openProductModal(product)}
                      className="text-sm text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1"
                    >
                      Ver más
                      <ExternalLink size={14} />
                    </button>
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

        {/* Modal de producto */}
        {selectedProduct && (
          <div
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-3 md:p-6"
            onClick={closeProductModal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="product-modal-title"
          >
            <div
              className="bg-gray-950 rounded-lg max-w-6xl w-full max-h-[92vh] overflow-hidden border border-purple-500 shadow-2xl shadow-purple-950/70"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-4 border-b border-gray-800 px-4 py-3 md:px-6">
                <div>
                  <h2 id="product-modal-title" className="text-2xl md:text-3xl font-bold text-white">
                    {selectedProduct.name}
                  </h2>
                  <p className="text-sm text-gray-400">
                    {selectedProduct.imageLabels?.[selectedImageIndex] || `Foto ${selectedImageIndex + 1}`} de {selectedProduct.images.length}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={closeProductModal}
                  className="w-11 h-11 rounded-full border border-gray-700 bg-black/60 text-white flex items-center justify-center hover:border-purple-400 hover:text-purple-300"
                  aria-label="Cerrar"
                >
                  <X size={22} />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] max-h-[calc(92vh-76px)] overflow-y-auto">
                <div className="relative bg-black min-h-[360px] md:min-h-[560px] flex items-center justify-center overflow-auto">
                  <img
                    src={selectedProduct.images[selectedImageIndex]}
                    alt={`${selectedProduct.name} ${selectedProduct.imageLabels?.[selectedImageIndex] || selectedImageIndex + 1}`}
                    className="object-contain p-4 transition-all duration-200"
                    style={{
                      width: `${Math.min(zoomLevel * 100, 300)}%`,
                      height: `${Math.min(zoomLevel * 100, 300)}%`,
                      maxWidth: zoomLevel === 1 ? '100%' : 'none',
                      maxHeight: zoomLevel === 1 ? '72vh' : 'none',
                    }}
                  />

                  {selectedProduct.images.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={() => showImage(selectedImageIndex - 1)}
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full border border-purple-500/70 bg-black/75 text-white flex items-center justify-center hover:bg-purple-700"
                        aria-label="Ver imagen anterior"
                      >
                        <ChevronLeft size={26} />
                      </button>
                      <button
                        type="button"
                        onClick={() => showImage(selectedImageIndex + 1)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full border border-purple-500/70 bg-black/75 text-white flex items-center justify-center hover:bg-purple-700"
                        aria-label="Ver imagen siguiente"
                      >
                        <ChevronRight size={26} />
                      </button>
                    </>
                  )}

                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 rounded-full border border-gray-700 bg-black/80 p-2">
                    <button
                      type="button"
                      onClick={zoomOut}
                      disabled={zoomLevel === 1}
                      className="w-10 h-10 rounded-full text-white flex items-center justify-center hover:bg-purple-700 disabled:opacity-40 disabled:hover:bg-transparent"
                      aria-label="Alejar"
                    >
                      <ZoomOut size={19} />
                    </button>
                    <span className="min-w-14 text-center text-sm font-semibold text-gray-200">
                      {Math.round(zoomLevel * 100)}%
                    </span>
                    <button
                      type="button"
                      onClick={zoomIn}
                      disabled={zoomLevel === 3}
                      className="w-10 h-10 rounded-full text-white flex items-center justify-center hover:bg-purple-700 disabled:opacity-40 disabled:hover:bg-transparent"
                      aria-label="Acercar"
                    >
                      <ZoomIn size={19} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setZoomLevel(1)}
                      className="w-10 h-10 rounded-full text-white flex items-center justify-center hover:bg-purple-700"
                      aria-label="Restablecer zoom"
                    >
                      <RotateCcw size={18} />
                    </button>
                  </div>
                </div>

                <div className="border-t lg:border-l lg:border-t-0 border-gray-800 p-4 md:p-6 bg-gradient-to-br from-gray-950 to-black">
                  <p className="text-gray-400 mb-5">{selectedProduct.description}</p>
                  <p className="text-3xl font-bold text-purple-400 mb-6">{selectedProduct.price}</p>

                  {selectedProduct.images.length > 1 && (
                    <div className="mb-6">
                      <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-3">Fotos</p>
                      <div className="grid grid-cols-2 gap-3">
                        {selectedProduct.images.map((img, idx) => (
                          <button
                            key={img}
                            type="button"
                            onClick={() => showImage(idx)}
                            className={`rounded-lg border p-2 bg-gray-900 hover:border-purple-400 ${
                              selectedImageIndex === idx ? 'border-purple-400' : 'border-gray-800'
                            }`}
                            aria-label={`Ver ${selectedProduct.imageLabels?.[idx] || `foto ${idx + 1}`}`}
                          >
                            <img
                              src={img}
                              alt=""
                              className="aspect-square w-full object-contain"
                            />
                            <span className="mt-2 block text-xs text-gray-300">
                              {selectedProduct.imageLabels?.[idx] || `Foto ${idx + 1}`}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <button
                    onClick={closeProductModal}
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
