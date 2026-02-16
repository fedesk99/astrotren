import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const Background = () => {
  const [particles, setParticles] = useState([]);
  const location = useLocation();
  const [scrollY, setScrollY] = useState(0);
  const [nebulae, setNebulae] = useState([]);


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

  useEffect(() => {
    const count = Math.floor(Math.random() * 3) + 2; 
    // Math.random() * 4 → 0 a 3.999
    // floor → 0 a 3
    // +3 → 3 a 6

    const newNebulae = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 150 + 250, // 200px a 400px
      color: [
        "rgba(90,0,130,0.12)",
        "rgba(0,60,120,0.10)",
        "rgba(120,0,80,0.10)"
      ][Math.floor(Math.random() * 3)]
    }));

  setNebulae(newNebulae);
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

      {/* Nebulosas pequeñas y sutiles */}
      {nebulae.map((n) => (
        <div
          key={n.id}
          className="absolute rounded-full"
          style={{
            width: `${n.size}px`,
            height: `${n.size}px`,
            left: `${n.x}%`,
            top: `${n.y}%`,
            background: `radial-gradient(circle, ${n.color} 0%, transparent 70%)`,
            transform: "translate(-50%, -50%)",
            pointerEvents: "none",
          }}
        />
      ))}

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
