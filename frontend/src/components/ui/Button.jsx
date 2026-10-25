import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ children, variant = 'primary', isLoading = false, className = '', ...props }) => {
  const baseStyle = "relative px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-[#020617] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center overflow-hidden group";
  
  const variants = {
    primary: "bg-gradient-to-b from-blue-500 to-blue-600 dark:from-blue-600 dark:to-indigo-700 text-white border border-blue-600 dark:border-blue-500 shadow-[0_4px_14px_0_rgba(59,130,246,0.3),inset_0_1px_0_rgba(255,255,255,0.2)] hover:shadow-[0_6px_20px_rgba(59,130,246,0.4),inset_0_1px_0_rgba(255,255,255,0.3)] focus:ring-blue-500",
    secondary: "bg-white/50 dark:bg-white/5 backdrop-blur-md text-slate-700 dark:text-slate-200 border border-white/60 dark:border-white/10 shadow-sm hover:bg-white/80 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_8px_30px_rgba(0,0,0,0.2)] hover:border-white dark:hover:border-white/20 focus:ring-slate-400",
    danger: "bg-gradient-to-b from-red-500 to-red-600 text-white border border-red-600 dark:border-red-500 shadow-[0_4px_14px_0_rgba(239,68,68,0.3),inset_0_1px_0_rgba(255,255,255,0.2)] hover:shadow-[0_6px_20px_rgba(239,68,68,0.4),inset_0_1px_0_rgba(255,255,255,0.3)] focus:ring-red-500",
  };

  return (
    <motion.button 
      whileTap={{ scale: props.disabled || isLoading ? 1 : 0.96 }}
      className={`${baseStyle} ${variants[variant]} ${className}`} 
      disabled={isLoading || props.disabled}
      {...props}
    >
      {(variant === 'primary' || variant === 'danger') && !isLoading && !props.disabled && (
        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[150%] skew-x-[-15deg] group-hover:animate-shimmer" />
      )}
      <span className={isLoading ? 'opacity-0' : 'opacity-100 transition-opacity flex items-center gap-2 relative z-10'}>
        {children}
      </span>
    </motion.button>
  );
};

export default Button;