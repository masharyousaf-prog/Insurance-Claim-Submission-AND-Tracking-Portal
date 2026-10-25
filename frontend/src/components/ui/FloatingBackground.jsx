import React, { useMemo, useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

const ICONS = [
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.423 15.621a1.575 1.575 0 00-2.196 0l-.399.399-1.378-1.379.399-.399a1.575 1.575 0 000-2.196l-.741-.741a1.575 1.575 0 00-2.196 0l-.399.399-1.379-1.378.399-.399a1.575 1.575 0 000-2.196l-.741-.741a1.575 1.575 0 00-2.196 0l-.399.399-1.378-1.379.399-.399a1.575 1.575 0 000-2.196l-.741-.741a1.575 1.575 0 00-2.196 0l-.399.399-1.379-1.378.399-.399a1.575 1.575 0 000-2.196l-.741-.741a1.575 1.575 0 00-2.196 0l-.399.399-1.378-1.379.399-.399V1.5A1.5 1.5 0 0019.5 0h-3A1.5 1.5 0 0015 1.5v2.33l-.399-.399a1.575 1.575 0 00-2.196 0l-.741.741a1.575 1.575 0 000 2.196l.399.399-1.378 1.379-.399-.399a1.575 1.575 0 00-2.196 0l-.741.741a1.575 1.575 0 000 2.196l.399.399-1.379 1.378-.399-.399a1.575 1.575 0 00-2.196 0l-.741.741a1.575 1.575 0 000 2.196l.399.399-1.378 1.379-.399-.399a1.575 1.575 0 00-2.196 0l-.741.741a1.575 1.575 0 000 2.196l.399.399-1.379 1.378-.399-.399a1.575 1.575 0 00-2.196 0l-.741.741A1.5 1.5 0 007.5 24h3A1.5 1.5 0 0012 22.5v-2.33l.399.399a1.575 1.575 0 002.196 0l.741-.741a1.575 1.575 0 000-2.196l-.399-.399 1.379-1.378.399.399a1.575 1.575 0 002.196 0l.741-.741a1.575 1.575 0 000-2.196l-.399-.399 1.378-1.379.399.399z" /></svg>,
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.25 18.75a1.5 1.5 0 01-3 0 1.5 1.5 0 013 0zM18.75 18.75a1.5 1.5 0 01-3 0 1.5 1.5 0 013 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 6.75h1.5m1.5 0h13.5m.75 0h1.5M3.75 6.75l1.096-2.193a.75.75 0 01.67-.432H6.75M20.25 6.75l-1.096-2.193a.75.75 0 00-.67-.432H17.25M6.75 4.125V1.5A1.5 1.5 0 018.25 0h7.5A1.5 1.5 0 0117.25 1.5v2.625M20.25 6.75l.75 12h-18l.75-12m16.5 0h-16.5M7.5 12h9m-9 3h9m-9 3h9" /></svg>,
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h18a2.25 2.25 0 012.25 2.25v13.5A2.25 2.25 0 0121 21H3a2.25 2.25 0 01-2.25-2.25V5.25A2.25 2.25 0 013 3z" /></svg>,
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>,
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
];

const COLORS = [
  'text-cyan-400 drop-shadow-[0_0_12px_rgba(34,211,238,0.5)]',
  'text-indigo-400 drop-shadow-[0_0_12px_rgba(129,140,248,0.5)]',
  'text-purple-400 drop-shadow-[0_0_12px_rgba(192,132,252,0.5)]',
  'text-fuchsia-400 drop-shadow-[0_0_12px_rgba(232,121,249,0.5)]',
  'text-blue-400 drop-shadow-[0_0_12px_rgba(96,165,250,0.5)]'
];

const InteractiveItem = ({ el, globalMouseX, globalMouseY, isParticle = false, isOrb = false }) => {
  const itemRef = useRef(null);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 25, damping: 12, mass: 1.5 });
  const springY = useSpring(y, { stiffness: 25, damping: 12, mass: 1.5 });

  const parallaxX = useTransform(globalMouseX, [0, typeof window !== 'undefined' ? window.innerWidth : 1000], [-el.parallaxRatio, el.parallaxRatio]);
  const parallaxY = useTransform(globalMouseY, [0, typeof window !== 'undefined' ? window.innerHeight : 1000], [-el.parallaxRatio, el.parallaxRatio]);

  useEffect(() => {
    let animationFrameId;
    
    const handleInteraction = (clientX, clientY) => {
      if (!itemRef.current || isOrb) return;
      
      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(() => {
        const rect = itemRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const distanceX = clientX - centerX;
        const distanceY = clientY - centerY;
        const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);
        
        const isMobile = window.innerWidth < 768;
        const radius = isMobile ? 110 : 250; 

        if (distance < radius) {
          const force = Math.pow((radius - distance) / radius, 1.5);
          const maxPush = isMobile ? 40 : 120; 
          
          x.set(-(distanceX / distance) * force * maxPush);
          y.set(-(distanceY / distance) * force * maxPush);
        } else {
          if (x.get() !== 0) x.set(0);
          if (y.get() !== 0) y.set(0);
        }
      });
    };

    const onMouseMove = (e) => handleInteraction(e.clientX, e.clientY);
    
    const onTouchMove = (e) => {
      if (e.touches && e.touches.length > 0) {
        handleInteraction(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchmove', onTouchMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [x, y, isOrb]);

  if (isOrb) {
    return (
      <motion.div
        className={`absolute rounded-full pointer-events-none ${el.color.split(' ')[0].replace('text-', 'bg-')} blur-3xl opacity-20`}
        style={{ width: `${el.size}px`, height: `${el.size}px`, left: `${el.left}%`, top: `${el.top}%`, x: parallaxX, y: parallaxY }}
        animate={{ 
          x: [0, el.driftX, 0], 
          y: [0, el.driftY, 0] 
        }}
        transition={{ duration: el.duration, ease: "easeInOut", repeat: Infinity }}
      />
    );
  }

  if (isParticle) {
    return (
      <motion.div
        className="absolute pointer-events-none"
        style={{ width: `${el.size}px`, height: `${el.size}px`, left: `${el.left}%`, top: `${el.top}%`, x: parallaxX, y: parallaxY }}
      >
        <motion.div style={{ x: springX, y: springY, width: '100%', height: '100%', willChange: 'transform' }} ref={itemRef}>
           <motion.div 
             className={`w-full h-full rounded-full ${el.color.split(' ')[0].replace('text-', 'bg-')} ${el.color.split(' ')[1]}`}
             animate={{ 
               opacity: [0.1, 0.8, 0.1], 
               scale: [0.8, 1.5, 0.8],
               x: [0, el.driftX, 0], 
               y: [0, el.driftY, 0] 
             }}
             transition={{ duration: el.duration, repeat: Infinity, ease: "easeInOut" }}
           />
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ width: `${el.size}px`, height: `${el.size}px`, left: `${el.left}%`, top: `${el.top}%`, x: parallaxX, y: parallaxY }}
    >
      <motion.div style={{ x: springX, y: springY, width: '100%', height: '100%', willChange: 'transform' }} ref={itemRef}>
        <motion.div
          className={`w-full h-full ${el.color}`}
          style={{ opacity: el.opacity, filter: el.blur, willChange: 'transform' }}
          animate={{ 
            rotate: 360, 
            scale: [1, 1.05, 1],
            x: [0, el.driftX, 0], 
            y: [0, el.driftY, 0]  
          }}
          transition={{ 
            rotate: { duration: el.duration * 0.5, ease: "linear", repeat: Infinity },
            scale: { duration: 6, ease: "easeInOut", repeat: Infinity },
            x: { duration: el.duration, ease: "easeInOut", repeat: Infinity },
            y: { duration: el.duration * 1.2, ease: "easeInOut", repeat: Infinity }
          }}
        >
          {el.icon}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

const FloatingBackground = () => {
  const [isMobile, setIsMobile] = useState(false);
  const mouseX = useMotionValue(typeof window !== "undefined" ? window.innerWidth / 2 : 0);
  const mouseY = useMotionValue(typeof window !== "undefined" ? window.innerHeight / 2 : 0);
  const smoothMouseX = useSpring(mouseX, { stiffness: 40, damping: 20 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 40, damping: 20 });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const updatePosition = (clientX, clientY) => {
      mouseX.set(clientX);
      mouseY.set(clientY);
    };

    const onMouseMove = (e) => updatePosition(e.clientX, e.clientY);
    const onTouchMove = (e) => {
      if (e.touches && e.touches.length > 0) {
        updatePosition(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
    };
  }, [mouseX, mouseY]);

  const createElements = (length, sizeMin, sizeMax, durMin, durMax, opac, blur, pRatio) => {
    const targetLength = isMobile ? Math.ceil(length * 0.3) : length;
    const sizeScale = isMobile ? 0.55 : 1.0;
    const driftScale = isMobile ? 0.4 : 1.0;

    return Array.from({ length: targetLength }).map((_, i) => ({
      id: `${blur}-${i}`,
      icon: ICONS[i % ICONS.length],
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      size: (Math.random() * (sizeMax - sizeMin) + sizeMin) * sizeScale,
      left: Math.random() * 100,
      top: Math.random() * 100, 
      driftX: ((Math.random() * 40) - 20) * driftScale, 
      driftY: ((Math.random() * 60) - 30) * driftScale, 
      duration: Math.random() * (durMax - durMin) + durMin,
      opacity: isMobile ? opac * 0.6 : opac,
      blur: blur,
      parallaxRatio: isMobile ? pRatio * 0.35 : pRatio
    }));
  };

  const orbs = useMemo(() => createElements(6, 200, 400, 40, 60, 0.1, 'blur(60px)', 30), [isMobile]);
  const backLayer = useMemo(() => createElements(30, 20, 35, 15, 25, 0.25, 'blur(4px)', 15), [isMobile]);
  const midLayer = useMemo(() => createElements(50, 35, 60, 10, 20, 0.45, 'blur(1.5px)', 40), [isMobile]);
  const frontLayer = useMemo(() => createElements(25, 60, 90, 12, 22, 0.75, 'none', 90), [isMobile]);
  const particles = useMemo(() => createElements(120, 1, 3, 5, 10, 0.8, 'none', 60), [isMobile]);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 bg-slate-50/5 dark:bg-[#020617] transition-colors duration-700">
      {orbs.map(el => <InteractiveItem key={`orb-${el.id}`} el={el} globalMouseX={smoothMouseX} globalMouseY={smoothMouseY} isOrb={true} />)}
      {backLayer.map(el => <InteractiveItem key={el.id} el={el} globalMouseX={smoothMouseX} globalMouseY={smoothMouseY} />)}
      {particles.map(el => <InteractiveItem key={el.id} el={el} globalMouseX={smoothMouseX} globalMouseY={smoothMouseY} isParticle={true} />)}
      {midLayer.map(el => <InteractiveItem key={el.id} el={el} globalMouseX={smoothMouseX} globalMouseY={smoothMouseY} />)}
      {frontLayer.map(el => <InteractiveItem key={el.id} el={el} globalMouseX={smoothMouseX} globalMouseY={smoothMouseY} />)}
    </div>
  );
};

export default FloatingBackground;