import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";


const Background = () => {
  const [particles, setParticles] = useState([]);
  const location = useLocation();

    useEffect(() => {
        const newParticles = Array.from({ length: 50 }, (_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 2 + 1,
            duration: Math.random() * 3 + 2,
        }));

        setParticles(newParticles);
    }, [location.pathname]);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Fondo degradado */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-950/30 via-black to-black"></div>

      {/* Partículas */}
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
