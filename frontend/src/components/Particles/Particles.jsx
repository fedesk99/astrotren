// src/components/Particles/Particles.jsx
import React, { useEffect, useState } from "react";
import "./Particles.css"; // CSS para la animación

const Particles = () => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    // Crear 50 partículas con posiciones, tamaño y duración aleatorias
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100, // posición horizontal %
      y: Math.random() * 100, // posición vertical %
      size: Math.random() * 2 + 1, // tamaño entre 1px y 3px
      duration: Math.random() * 3 + 2, // duración entre 2s y 5s
    }));
    setParticles(newParticles);
  }, []);

  return (
    <>
      {particles.map((p) => (
        <div
          key={p.id}
          className="particle"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </>
  );
};

export default Particles;
