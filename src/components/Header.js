import React from 'react';
import { NavLink } from 'react-router-dom';

function Header() {
  const activeLinkStyle = {
    color: '#f97316',
    borderBottom: '2px solid #f97316'
  };

  return (
    <header className="w-full bg-white/70 backdrop-blur-sm shadow-md p-4 flex justify-between items-center sticky top-0 z-10">
      <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
        SpeakGenie
      </h1>
      <nav className="flex gap-6 text-lg font-semibold text-gray-600">
        <NavLink to="/" style={({ isActive }) => isActive ? activeLinkStyle : undefined} className="hover:text-orange-500 transition-colors pb-1">
          Chat
        </NavLink>
        <NavLink to="/guide" style={({ isActive }) => isActive ? activeLinkStyle : undefined} className="hover:text-orange-500 transition-colors pb-1">
          Guide
        </NavLink>
      </nav>
    </header>
  );
}

export default Header;