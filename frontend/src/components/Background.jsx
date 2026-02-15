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
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Fondo degradado */}
    </div>
  );
};

export default Background;
