import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../features/authSlice';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const closeMenu = () => setIsOpen(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const linkClass = ({ isActive }) =>
    `relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300 group overflow-hidden ${
      isActive
        ? 'text-blue-700 dark:text-white bg-white/60 dark:bg-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] border border-white/80 dark:border-white/10'
        : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/40 dark:hover:bg-white/5'
    }`;

  const initials = user?.name?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) || '?';

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-slate-900/20 dark:bg-slate-900/60 backdrop-blur-sm z-20 md:hidden transition-all" onClick={closeMenu} />
      )}
      
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-72 bg-white/20 dark:bg-white/5 backdrop-blur-3xl text-slate-900 dark:text-white flex flex-col md:relative md:translate-x-0 md:m-4 md:rounded-3xl border border-white/50 dark:border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.6),0_8px_32px_rgba(0,0,0,0.05)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_8px_32px_rgba(0,0,0,0.4)] transition-all duration-500 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-8 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tight text-slate-900 dark:text-white transition-colors">InsureTrack</h1>
            <p className="text-xs text-blue-600 dark:text-cyan-400 font-bold tracking-widest uppercase transition-colors">Claims Portal</p>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2 overflow-y-auto mt-2">
          {/* Your existing nav links... */}
          {user?.role === 'admin' && (
            <>
              <p className="px-4 py-2 text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-4 mb-2 transition-colors">Administration</p>
              <NavLink to="/dashboard" className={linkClass} onClick={closeMenu}>
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v5a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm10 0a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zm10-3a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1v-7z" /></svg>
                Metrics Dashboard
              </NavLink>
              <NavLink to="/create-officer" className={linkClass} onClick={closeMenu}>
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
                Create Officer
              </NavLink>
            </>
          )}

          <p className="px-4 py-2 text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-6 mb-2 transition-colors">Workflow</p>
          <NavLink to="/claims" end className={linkClass} onClick={closeMenu}>
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            {user?.role === 'policyholder' ? 'My Claims History' : 'Claims Queue'}
          </NavLink>

          {user?.role === 'policyholder' && (
            <NavLink to="/claims/new" end className={linkClass} onClick={closeMenu}>
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              Submit New Claim
            </NavLink>
          )}
        </nav>

        <div className="p-4 m-4 bg-white/40 dark:bg-white/5 rounded-2xl border border-white/60 dark:border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.6)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] transition-all duration-500">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-white/60 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-white text-sm font-black border border-white dark:border-slate-600 shadow-inner transition-colors">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-slate-900 dark:text-white font-bold truncate transition-colors">{user?.name}</p>
              <p className="text-xs text-blue-600 dark:text-cyan-400 font-bold capitalize transition-colors">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-bold text-slate-700 dark:text-slate-300 bg-white/50 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white rounded-xl transition-all border border-white/60 dark:border-transparent dark:hover:border-white/10 shadow-sm dark:shadow-none"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;