import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { user } = useSelector((state) => state.auth);

  const linkClass = ({ isActive }) => 
    `block px-4 py-3 rounded transition-colors ${isActive ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-slate-700 hover:text-white'}`;

  // Helper to close sidebar on mobile after clicking a link
  const closeMenu = () => setIsOpen(false);

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/50 z-20 md:hidden transition-opacity"
          onClick={closeMenu}
        ></div>
      )}

      {/* Sidebar Container */}
      <aside className={`fixed inset-y-0 left-0 z-30 w-64 bg-slate-800 text-white flex flex-col transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 border-b border-slate-700 flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">InsureTrack</h1>
          {/* Close button inside sidebar for mobile */}
          <button onClick={closeMenu} className="md:hidden text-gray-400 hover:text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {user?.role === 'admin' && (
          <>
            <NavLink to="/dashboard" className={linkClass}>Admin Dashboard</NavLink>
            <NavLink to="/create-officer" className={linkClass}>Create Officer</NavLink>
          </>
        )}
        
        <NavLink to="/claims" end className={linkClass}>
          {user?.role === 'policyholder' ? 'My Claims' : 'Claims Queue'}
        </NavLink>
        
        {user?.role === 'policyholder' && (
          <NavLink to="/claims/new" end className={linkClass}>Submit New Claim</NavLink>
        )}
      </nav>
    </aside>
    </>
  );
};

export default Sidebar;