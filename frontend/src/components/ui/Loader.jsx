import React from 'react';
import { motion } from 'framer-motion';

const Loader = ({ fullScreen = false, text = "Loading..." }) => {
  const content = (
    <div className="flex flex-col items-center justify-center space-y-4">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="h-8 w-8 border-4 border-slate-200 border-t-blue-600 rounded-full shadow-lg shadow-blue-500/20"
      />
      {text && <p className="text-slate-500 font-bold text-sm tracking-wide animate-pulse">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/60 backdrop-blur-md flex items-center justify-center z-50">
        {content}
      </div>
    );
  }

  return <div className="p-12 flex justify-center w-full">{content}</div>;
};

export default Loader;