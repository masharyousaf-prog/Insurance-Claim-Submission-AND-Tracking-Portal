import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../features/authSlice';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-sm h-16 flex items-center justify-between px-6 border-b">
      <h2 className="text-xl font-semibold text-gray-800">Insurance Portal</h2>
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">
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