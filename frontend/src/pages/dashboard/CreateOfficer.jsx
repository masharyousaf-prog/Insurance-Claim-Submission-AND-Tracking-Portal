import React, { useState } from 'react';
import axiosInstance from '../../api/axiosInstance';
import toast from 'react-hot-toast';

const CreateOfficer = () => {
  const [officerData, setOfficerData] = useState({ name: '', email: '', password: '' });
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateOfficer = async (e) => {
    e.preventDefault();
    setIsCreating(true);

    try {
      await axiosInstance.post('/admin/officer', officerData);
      toast.success('Officer account created securely!');
      setOfficerData({ name: '', email: '', password: '' }); 
    } catch (error) {
      toast.error(error.response?.data?.msg || "Failed to create officer.");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-4 p-6 relative z-10">
      
      {/* 💎 EXACT SIDEBAR GLASS CLONE */}
      {/* Copied directly from your Sidebar's background, blur, border, and shadow properties */}
      <div className="rounded-3xl p-8 bg-white/20 dark:bg-white/5 backdrop-blur-3xl border border-white/50 dark:border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.6),0_8px_32px_rgba(0,0,0,0.05)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_8px_32px_rgba(0,0,0,0.4)] transition-all duration-500 ease-in-out">
        
        {/* HEADER AREA */}
        <div className="mb-6 border-b border-white/30 dark:border-white/10 pb-6">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
            Create Claims Officer
          </h2>
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400 leading-relaxed">
            Generate credentials for new staff members. They will use this email and temporary password to access the Officer Queue.
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleCreateOfficer} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                Full Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Jane Smith"
                value={officerData.name}
                onChange={(e) => setOfficerData({ ...officerData, name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-white/60 dark:border-white/10 bg-white/40 dark:bg-black/20 text-slate-900 dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)] dark:shadow-[inset_0_1px_2px_rgba(0,0,0,0.2)]"
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                Email Address
              </label>
              <input
                type="email"
                required
                placeholder="officer@insurance.com"
                value={officerData.email}
                onChange={(e) => setOfficerData({ ...officerData, email: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-white/60 dark:border-white/10 bg-white/40 dark:bg-black/20 text-slate-900 dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)] dark:shadow-[inset_0_1px_2px_rgba(0,0,0,0.2)]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Temporary Password
            </label>
            <input
              type="password"
              required
              placeholder="Min. 8 characters"
              value={officerData.password}
              onChange={(e) => setOfficerData({ ...officerData, password: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-white/60 dark:border-white/10 bg-white/40 dark:bg-black/20 text-slate-900 dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)] dark:shadow-[inset_0_1px_2px_rgba(0,0,0,0.2)]"
            />
          </div>

          <div className="pt-4 flex justify-end">
            <button 
              type="submit" 
              disabled={isCreating}
              className={`w-full sm:w-auto px-8 py-3 bg-gradient-to-tr from-blue-600 to-indigo-500 hover:from-blue-700 hover:to-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 transition-all duration-200 flex items-center justify-center ${isCreating ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer transform active:scale-[0.98]'}`}
            >
              {isCreating ? (
                <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                'Create Officer Account'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateOfficer;