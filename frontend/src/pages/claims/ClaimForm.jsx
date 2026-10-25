import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axiosInstance from '../../api/axiosInstance';

const CLAIM_TYPES = [
  { value: 'medical', label: 'Medical', icon: '🏥' },
  { value: 'vehicle', label: 'Auto', icon: '🚗' },
  { value: 'property', label: 'Property', icon: '🏠' },
  { value: 'general', label: 'General', icon: '📋' },
];

const ClaimForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ title: '', type: 'medical', description: '', documentFile: null });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, documentFile: e.target.files[0] });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const submitData = new FormData();
    submitData.append('title', formData.title);
    submitData.append('type', formData.type);
    submitData.append('description', formData.description);
    
    if (formData.documentFile) {
      submitData.append('document', formData.documentFile);
    }

    try {
      await axiosInstance.post('/claims', submitData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Claim and document submitted successfully!');
      navigate('/claims');
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Submission failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-4 px-4 relative z-10">
      
      {/* 📋 PAGE HEADER - DYNAMIC CONTRAST LIGHT / DARK */}
      <div className="mb-8 pl-2">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight drop-shadow-sm dark:drop-shadow-md transition-colors duration-300">
          File a New Claim
        </h1>
        <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mt-2 leading-relaxed transition-colors duration-300">
          Please provide accurate details regarding your incident. Attach any supporting documentation (like a police report or photo) below.
        </p>
      </div>

      {/* 💎 PREMIUM SIDEBAR GLASS TEMPLATE CHASSIS */}
      <div className="rounded-3xl bg-white/20 dark:bg-white/5 backdrop-blur-3xl border border-white/50 dark:border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.6),0_8px_32px_rgba(0,0,0,0.05)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_8px_32px_rgba(0,0,0,0.4)] transition-all duration-500 ease-in-out overflow-hidden">
        
        <form onSubmit={handleSubmit}>
          <div className="p-6 sm:p-10 space-y-10">
            
            {/* CLAIM TITLE ACCORDION FIELD */}
            <div>
              <label className="block mb-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Claim Title (Brief Summary)
              </label>
              <input 
                type="text" 
                name="title" 
                required 
                placeholder="e.g. Rear-end collision on Main St." 
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-white/60 dark:border-white/10 bg-white/40 dark:bg-black/20 text-slate-900 dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)] dark:shadow-[inset_0_1px_2px_rgba(0,0,0,0.2)]"
              />
            </div>

            {/* CATEGORY SELECTOR CARDS */}
            <div>
              <label className="block mb-3 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Category of Claim
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {CLAIM_TYPES.map((t) => (
                  <label
                    key={t.value}
                    className={`flex flex-col items-center justify-center gap-3 p-5 rounded-2xl border-2 cursor-pointer text-center transition-all duration-300 ${
                      formData.type === t.value
                        ? 'border-blue-600 dark:border-cyan-400 bg-blue-500/10 dark:bg-cyan-500/20 text-blue-700 dark:text-white shadow-md shadow-blue-500/10 scale-[1.02]'
                        : 'border-white/60 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/30 text-slate-500 dark:text-slate-400 bg-white/30 dark:bg-black/20 hover:bg-white/50 dark:hover:bg-white/5'
                    }`}
                  >
                    <input type="radio" name="type" value={t.value} className="sr-only" onChange={handleChange} defaultChecked={t.value === 'medical'} />
                    <span className="text-3xl filter drop-shadow-sm">{t.icon}</span>
                    <span className="text-xs font-black uppercase tracking-wider">{t.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* DETAILED INCIDENT TEXTAREA DESCRIPTION */}
            <div>
              <label className="block mb-3 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Detailed Incident Description
              </label>
              <textarea 
                name="description" 
                required 
                rows={6} 
                placeholder="Describe exactly what happened, including dates, times, and any third parties involved..." 
                onChange={handleChange} 
                className="w-full px-5 py-4 text-sm font-medium bg-white/40 dark:bg-black/20 border border-white/60 dark:border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white transition-all resize-none placeholder-slate-400 dark:placeholder-slate-500 shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)]" 
              />
            </div>

            {/* SUPPORTING DOCUMENTATION DASH CONTAINER */}
            <div>
              <label className="block mb-3 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Supporting Documentation
              </label>
              <div className="mt-2 flex justify-center rounded-2xl border-2 border-dashed border-slate-300 dark:border-white/20 px-6 py-10 bg-white/30 dark:bg-black/20 hover:bg-white/50 dark:hover:bg-white/5 transition-all duration-300">
                <div className="text-center">
                  <svg className="mx-auto h-12 w-12 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                  <div className="mt-4 flex text-sm leading-6 justify-center text-slate-600 dark:text-slate-400">
                    <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-extrabold text-blue-600 dark:text-cyan-400 focus-within:outline-none hover:text-blue-700 dark:hover:text-cyan-300 hover:underline">
                      <span>Select a file</span>
                      <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png" />
                    </label>
                    <p className="pl-1 font-bold text-slate-400 dark:text-slate-500">from your computer</p>
                  </div>
                  <p className="text-xs font-bold text-slate-400 dark:text-slate-500 mt-2">PDF, PNG, or JPG up to 5MB</p>
                  
                  {formData.documentFile && (
                    <div className="mt-5 inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 dark:bg-cyan-500/20 text-blue-700 dark:text-cyan-300 rounded-xl text-sm font-black border border-blue-500/20 dark:border-cyan-500/30 shadow-sm">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      {formData.documentFile.name}
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>

          {/* 🔘 BOTTOM ACTION PANEL */}
          <div className="px-6 py-6 bg-white/30 dark:bg-white/5 border-t border-white/60 dark:border-white/10 flex items-center justify-between">
            <button 
              type="button" 
              onClick={() => navigate('/claims')} 
              className="text-sm font-extrabold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors px-4 py-2"
            >
              Cancel Draft
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className={`px-8 py-3 bg-gradient-to-tr from-blue-600 to-indigo-500 hover:from-blue-700 hover:to-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 text-sm transition-all duration-200 flex items-center justify-center ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer transform active:scale-[0.98]'}`}
            >
              {isSubmitting ? (
                <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                'Submit Claim for Review'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClaimForm;