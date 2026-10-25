import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ children, className = '', delay = 0, hoverable = false }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: delay, ease: [0.23, 1, 0.32, 1] }} 
      className={`
        bg-white/20 dark:bg-white/5 
        backdrop-blur-3xl 
        rounded-2xl 
        border border-white/50 dark:border-white/10 
        shadow-[inset_0_1px_1px_rgba(255,255,255,0.6),0_8px_32px_rgba(0,0,0,0.05)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_8px_32px_rgba(0,0,0,0.4)]
        p-6 sm:p-8 
        text-slate-900 dark:text-white
        transition-all duration-500
        ${hoverable ? 'hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),0_12px_40px_rgba(59,130,246,0.15)] dark:hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_12px_40px_rgba(34,211,238,0.15)] hover:-translate-y-1 hover:bg-white/30 dark:hover:bg-white/10 border-white/60 dark:hover:border-white/20' : ''} 
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
};

export default Card;