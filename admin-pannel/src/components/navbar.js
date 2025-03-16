import React from 'react';
import { Link } from 'react-router-dom';
import { FiHelpCircle } from 'react-icons/fi';

const Navbar = () => {
  return (
    <nav className="bg-transparent backdrop-blur-sm shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <img 
              src="https://res.cloudinary.com/dtberehdy/image/upload/v1734848280/1643628920226_kw4wl4.jpg" 
              alt="E-Cell Logo"
              className="h-10 w-auto rounded-lg"
            />
            <h1 className="hidden sm:block text-xl font-semibold text-gray-800">
              E-Cell Console
            </h1>
          </div>
          <Link
            to="/help"
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-500"
          >
            <FiHelpCircle className="h-5 w-5" />
            <span className="hidden sm:inline ml-2">Help</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;