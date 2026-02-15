import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const Background = () => {
  const [particles, setParticles] = useState([]);
  const location = useLocation();

  useEffect(() => {
    const newParticles = Array.from({ length: 80 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      duration: Math.random() * 3 + 2,
    }));

    setParticles(newParticles);
  }, [location.pathname]); // 🔥 Se randomiza al cambiar de pestaña

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      
      {/* Degradado base */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1a0022] via-[#080010] to-black"></div>

      {/* Estrellas */}
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
          />
        ))}
      </div>
    </div>
  );
};

export default Background;
