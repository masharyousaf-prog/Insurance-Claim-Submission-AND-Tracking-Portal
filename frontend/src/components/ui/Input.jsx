import React, { forwardRef } from 'react';

const Input = forwardRef(({ label, error, className = '', ...props }, ref) => {
  return (
    <div className={`flex flex-col ${className}`}>
      {label && (
        <label className="mb-2 text-sm font-bold text-slate-700 dark:text-slate-300 tracking-tight transition-colors">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={`px-4 py-3 text-sm bg-white/50 dark:bg-black/20 border border-white/60 dark:border-white/10 backdrop-blur-sm rounded-xl transition-all duration-300 focus:outline-none focus:bg-white/80 dark:focus:bg-black/40 focus:ring-2 focus:ring-offset-0 ${
          error 
            ? 'border-red-400 dark:border-red-500/50 focus:ring-red-500/30 focus:border-red-500 text-red-900 dark:text-red-200 placeholder-red-400 dark:placeholder-red-500/50' 
            : 'focus:ring-blue-500/30 dark:focus:ring-cyan-500/30 focus:border-blue-500 dark:focus:border-cyan-500 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 hover:border-white dark:hover:border-white/20'
        }`}
        {...props}
      />
    </div>
  );
});

Input.displayName = 'Input';
export default Input;