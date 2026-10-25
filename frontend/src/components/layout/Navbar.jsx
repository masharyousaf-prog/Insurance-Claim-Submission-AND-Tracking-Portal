import React from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext'; 

const Navbar = ({ onMenuClick }) => {
  const { user } = useSelector((state) => state.auth);
  const { isDark, toggleTheme } = useTheme(); 

  const pageTitle = {
    admin: 'Metrics Dashboard',
    officer: 'Active Caseload',
    policyholder: 'My Claims History',
  }[user?.role] ?? 'Portal';

  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      className="sticky top-0 z-10 m-4 md:mt-4 md:mx-8 rounded-2xl bg-white/20 dark:bg-white/5 backdrop-blur-3xl border border-white/50 dark:border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.6),0_8px_32px_rgba(0,0,0,0.05)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_8px_32px_rgba(0,0,0,0.4)] h-16 flex items-center justify-between px-4 md:px-6 transition-all duration-500"
    >
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 -ml-2 text-slate-500 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/10 rounded-xl transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div className="hidden sm:flex items-center gap-3 text-sm font-semibold tracking-tight">
          <span className="text-slate-500 dark:text-slate-400">InsureTrack</span>
          <span className="text-slate-300 dark:text-slate-600">/</span>
          <span className="text-slate-900 dark:text-white drop-shadow-sm dark:drop-shadow-md">{pageTitle}</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button 
          onClick={toggleTheme}
          className="w-10 h-10 rounded-xl bg-white/30 dark:bg-white/5 border border-white/60 dark:border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] flex items-center justify-center text-slate-500 dark:text-slate-300 hover:text-blue-600 dark:hover:text-cyan-400 hover:bg-white/50 dark:hover:bg-white/10 transition-all"
        >
          {isDark ? (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
          )}
        </button>

        <div className="relative group cursor-pointer">
          <div className="w-10 h-10 rounded-xl bg-white/30 dark:bg-white/5 border border-white/60 dark:border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] flex items-center justify-center text-slate-500 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/10 transition-all">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
          </div>
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-blue-500 dark:bg-cyan-400 rounded-full border-2 border-white dark:border-[#0B0F19] shadow-[0_0_8px_rgba(59,130,246,0.8)] dark:shadow-[0_0_8px_rgba(34,211,238,0.8)]"></span>
        </div>
      </div>
    </motion.header>
  );
};

export default Navbar;