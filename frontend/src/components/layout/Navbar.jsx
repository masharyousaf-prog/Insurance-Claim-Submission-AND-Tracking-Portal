import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../features/authSlice';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ onMenuClick }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-sm h-16 flex items-center justify-between px-4 md:px-6 border-b">
      <div className="flex items-center gap-3">
        {/* Hamburger Button (Mobile Only) */}
        <button 
          onClick={onMenuClick} 
          className="md:hidden p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded focus:outline-none"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h2 className="text-xl font-semibold text-gray-800 hidden sm:block">Insurance Portal</h2>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600 hidden sm:inline-block">
          Welcome, <strong>{user?.name}</strong> ({user?.role})
        </span>
        <button 
          onClick={handleLogout}
          className="text-sm bg-red-50 text-red-600 px-3 py-1 rounded hover:bg-red-100 transition"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;