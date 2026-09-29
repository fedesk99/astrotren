import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

const Background = () => {
  const [particles, setParticles] = useState([]);
  const [activeFlare, setActiveFlare] = useState(null);
  const location = useLocation();

  const [nebulae, setNebulae] = useState([]);

  const particleRefs = useRef([]);
  const scrollYRef = useRef(0);
  const animationFrameRef = useRef(null);
  const flareTimeoutRef = useRef(null);

  useEffect(() => {
    const newParticles = Array.from({ length: 80 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      speed: Math.random() * 0.1 + 0.005,
      float: Math.random() * 20 - 10,

      // Algunas estrellas tienen un titileo suave
      twinkle: Math.random() < 0.18,

      twinkleDuration: Math.random() * 3 + 3,
      twinkleDelay: Math.random() * 12,
    }));

    setParticles(newParticles);
  }, [location.pathname]);

  useEffect(() => {
    const count = Math.floor(Math.random() * 3) + 2;

    const newNebulae = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 150 + 250,
      color: [
        "rgba(90,0,130,0.12)",
        "rgba(0,60,120,0.10)",
        "rgba(120,0,80,0.10)",
      ][Math.floor(Math.random() * 3)],
    }));

    setNebulae(newNebulae);
  }, [location.pathname]);

  /*
   * Destellos:
   *
   * Un único destello a la vez.
   * Cada 5–10 segundos se selecciona
   * aleatoriamente una estrella diferente.
   */
  useEffect(() => {
    if (particles.length === 0) return;

    let cancelled = false;

    const scheduleNextFlare = () => {
      if (cancelled) return;

      const delay = Math.random() * 4000 + 4000;

      flareTimeoutRef.current = setTimeout(() => {
        if (cancelled) return;

        let nextIndex;

        do {
          nextIndex = Math.floor(Math.random() * particles.length);
        } while (
          particles.length > 1 &&
          nextIndex === activeFlare
        );

        setActiveFlare(nextIndex);

        /*
         * El destello dura aproximadamente 1.5 segundos.
         * Después desaparece y comienza nuevamente
         * la espera de 5–10 segundos.
         */
        flareTimeoutRef.current = setTimeout(() => {
          if (cancelled) return;

          setActiveFlare(null);
          scheduleNextFlare();
        }, 1500);
      }, delay);
    };

    scheduleNextFlare();

    return () => {
      cancelled = true;

      if (flareTimeoutRef.current) {
        clearTimeout(flareTimeoutRef.current);
        flareTimeoutRef.current = null;
      }

      setActiveFlare(null);
    };
  }, [particles, location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      scrollYRef.current = window.scrollY;

      if (!animationFrameRef.current) {
        animationFrameRef.current = requestAnimationFrame(() => {
          const currentScrollY = scrollYRef.current;

          particleRefs.current.forEach((element, index) => {
            const particle = particles[index];

            if (!element || !particle) return;

            const offset =
              currentScrollY * particle.speed - particle.float;

            element.style.transform = `translate3d(0, ${-offset}px, 0)`;
          });

          animationFrameRef.current = null;
        });
      }
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [particles]);

  return (
    <div
      className="fixed inset-0 z-0 overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-[#1a0022] via-[#020005] to-black"></div>

      {nebulae.map((n) => (
        <div
          key={n.id}
          className="absolute rounded-full blur-3xl"
          style={{
            width: `${n.size}px`,
            height: `${n.size}px`,
            left: `${n.x}%`,
            top: `${n.y}%`,
            background: n.color,
          }}
        />
      ))}

      {particles.map((p, index) => (
        <div
          key={p.id}
          ref={(element) => {
            particleRefs.current[index] = element;
          }}
          className={`absolute rounded-full bg-white opacity-80 ${
            p.twinkle ? "star-twinkle" : ""
          } ${activeFlare === index ? "star-flare" : ""}`}
          style={{
            width: `${p.size}px`,
            height: `${p.size}px`,
            left: `${p.x}%`,
            top: `${p.y}%`,

            transform: `translate3d(0, ${p.float}px, 0)`,

            "--twinkle-duration": `${p.twinkleDuration}s`,
            "--twinkle-delay": `${p.twinkleDelay}s`,
          }}
        />
      ))}
    </div>
  );
};

export default Background;
