import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Sidebar = () => {
  const { user } = useSelector((state) => state.auth);

  const linkClass = ({ isActive }) => 
    `block px-4 py-3 rounded transition-colors ${isActive ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-slate-700 hover:text-white'}`;

  return (
    <aside className="w-64 bg-slate-800 text-white flex flex-col">
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-2xl font-bold tracking-tight">InsureTrack</h1>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {user?.role === 'admin' && (
          <NavLink to="/dashboard" className={linkClass}>Admin Dashboard</NavLink>
        )}
        
        <NavLink to="/claims" className={linkClass}>
          {user?.role === 'policyholder' ? 'My Claims' : 'Claims Queue'}
        </NavLink>
        
        {user?.role === 'policyholder' && (
          <NavLink to="/claims/new" className={linkClass}>Submit New Claim</NavLink>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;