import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Menu, X, ChevronDown } from 'lucide-react';
import { WalletConnect } from './WalletConnect';

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation();

  const mainNavItems = [
    { name: 'Dashboard', path: '/' },
    { name: 'Map', path: '/map' },
    { name: 'Contracts', path: '/contracts' },
    { name: 'Network', path: '/network' },
    { name: 'Emergency', path: '/emergency-communication' },
  ];

  const additionalNavItems = [
    { name: 'Original Home', path: '/home' },
    { name: 'Analytics', path: '/analytics' },
    { name: 'Admin Panel', path: '/admin' },
    { name: 'Donations', path: '/donations' },
    { name: 'Volunteers', path: '/volunteers' },
    { name: 'Prediction', path: '/prediction' },
    { name: 'Device Tools', path: '/device-capabilities' },
    { name: 'Live Stream', path: '/live-streaming' },
  ];

  return (
    <header className="bg-slate-800/95 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="relative">
              <Shield className="h-6 w-6 text-blue-500 group-hover:scale-110 transition-transform duration-200" />
              <div className="absolute inset-0 bg-blue-500 opacity-20 rounded-full blur-lg group-hover:opacity-40 transition-opacity" />
            </div>
            <span className="text-lg font-bold text-white bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              DeDiWARN
            </span>
          </Link>          <nav className="hidden lg:flex items-center space-x-1">
            {mainNavItems.map((item, index) => (
              <Link
                key={item.name}
                to={item.path}
                className={`relative px-4 py-2 rounded-lg transition-all duration-200 group ${
                  location.pathname === item.path
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700'
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
            
            {/* More dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`flex items-center space-x-1 px-4 py-2 rounded-lg transition-all duration-200 group ${
                  additionalNavItems.some(item => location.pathname === item.path)
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700'
                }`}
              >
                <span>More</span>
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isDropdownOpen && (
                <div className="absolute top-full mt-2 right-0 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl py-2 min-w-[160px] animate-scale-in">
                  {additionalNavItems.map((item) => (
                    <Link
                      key={item.name}
                      to={item.path}
                      className={`block px-4 py-2 text-sm transition-colors ${
                        location.pathname === item.path
                          ? 'bg-blue-600 text-white'
                          : 'text-slate-300 hover:text-white hover:bg-slate-700'
                      }`}
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          <div className="flex items-center space-x-3">
            <WalletConnect />
            
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-slate-700 transition-colors"
            >
              {isMenuOpen ? <X className="h-6 w-6 text-white" /> : <Menu className="h-6 w-6 text-white" />}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="lg:hidden bg-slate-800 border-t border-slate-700 animate-slide-down">
          <div className="px-4 py-2 space-y-2">
            {[...mainNavItems, ...additionalNavItems].map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`block py-2 px-3 rounded-lg transition-colors ${
                  location.pathname === item.path
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};