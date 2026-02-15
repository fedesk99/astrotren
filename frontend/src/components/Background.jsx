import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const Background = () => {
  const [particles, setParticles] = useState([]);
  const location = useLocation();
  const [scrollY, setScrollY] = useState(0);

  // Generar partículas
  useEffect(() => {
    const newParticles = Array.from({ length: 80 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      // Rango de velocidad más amplio
      speed: Math.random() * 0.1 + 0.005, // 0.005 a 0.105
      float: Math.random() * 20 - 10, // movimiento vertical leve
    }));
    setParticles(newParticles);
  }, [location.pathname]);

  // Capturar scroll para efecto parallax
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Degradado base */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1a0022] via-[#020005] to-black"></div>

      {/* Estrellas */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full bg-white opacity-80"
          style={{
            width: `${p.size}px`,
            height: `${p.size}px`,
            left: `${p.x}%`,
            top: `calc(${p.y}% - ${scrollY * p.speed}px + ${p.float}px)`,
            transition: "top 0.1s linear",
          }}
        />
      ))}
    </div>
  );
};

export default Background;
