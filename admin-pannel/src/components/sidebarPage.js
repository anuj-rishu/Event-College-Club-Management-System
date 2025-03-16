import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiMenu, FiX, FiHome, FiUsers, FiSettings, FiMail, FiCamera, FiFileText, FiLogOut } from 'react-icons/fi';
import LogoutButton from './LogoutButton';

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  // Close sidebar when route changes on mobile
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location]);

  const menuItems = [
    { path: '/Userdisplay', name: 'Dashboard', icon: <FiHome /> },
    { path: '/scan', name: 'Scan Data', icon: <FiCamera /> },
    { path: '/genarateTicket', name: 'Generate Ticket', icon: <FiFileText /> },
    { path: '/ticketstats', name: 'Ticket Stats', icon: <FiFileText /> },
    { path: '/admin-control', name: 'Manage Admin', icon: <FiUsers /> },
    { path: '/scanner', name: 'Scanner', icon: <FiCamera /> },
    { path: '/interview', name: 'Interview Panel', icon: <FiUsers /> },
    { path: '/user-message', name: 'Messages', icon: <FiMail /> },
    { path: '/profile', name: 'Profile', icon: <FiSettings /> },
    { path: '/formlist', name: 'Create Form', icon: <FiFileText /> },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white shadow-sm z-20 px-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img 
            src="https://res.cloudinary.com/dtberehdy/image/upload/v1734848280/1643628920226_kw4wl4.jpg" 
            alt="E-Cell Logo" 
            className="h-8 w-8 rounded-lg"
          />
          <h1 className="text-lg font-bold text-gray-800">E-Cell Console</h1>
        </div>
        <button
          className="p-2 rounded-md hover:bg-gray-100"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-white shadow-xl transition-all duration-300 ease-in-out 
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          w-[280px] z-40 lg:z-30 overflow-y-auto pb-20 lg:pb-0`}
      >
        {/* Desktop Logo */}
        <div className="hidden lg:block p-6 border-b">
          <div className="flex items-center space-x-3">
            <img 
              src="https://res.cloudinary.com/dtberehdy/image/upload/v1734848280/1643628920226_kw4wl4.jpg" 
              alt="E-Cell Logo" 
              className="h-10 w-10 rounded-lg"
            />
            <h1 className="text-xl font-bold text-gray-800">E-Cell Console</h1>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="mt-6 px-4">
          <div className="space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-3 text-gray-600 transition-colors rounded-lg hover:bg-indigo-50 hover:text-indigo-600 
                  ${location.pathname === item.path ? 'bg-indigo-50 text-indigo-600 font-medium' : ''}
                  active:bg-indigo-100 touch-manipulation`}
                onClick={() => setIsSidebarOpen(false)}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="ml-3">{item.name}</span>
              </Link>
            ))}
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-white">
            <LogoutButton className="w-full flex items-center px-4 py-3 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors active:bg-red-100">
              <FiLogOut className="text-lg" />
              <span className="ml-3">Logout</span>
            </LogoutButton>
          </div>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;