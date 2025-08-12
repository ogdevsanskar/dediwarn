import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Menu, X } from 'lucide-react';
import { WalletConnect } from './WalletConnect';

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const mainNavItems = [
    { name: 'Dashboard', path: '/' },
    { name: 'Global Hub', path: '/enhanced-dashboard' },
    { name: 'Original Home', path: '/home' },
    { name: 'Map', path: '/map' },
    { name: 'Contracts', path: '/contracts' },
    { name: 'Analytics', path: '/analytics' },
    { name: 'Network', path: '/network' },
    { name: 'Donations', path: '/donations' },
    { name: 'Volunteers', path: '/volunteers' },
    { name: 'Prediction', path: '/prediction' },
  ];

  const secondaryNavItems = [
    { name: 'Collaboration', path: '/collaboration' },
    { name: 'Reporting', path: '/reporting' },
    { name: 'Education', path: '/education' },
    { name: 'Admin Panel', path: '/admin' },
    { name: 'Emergency', path: '/emergency-communication' },
    { name: 'Device Tools', path: '/device-capabilities' },
    { name: 'Live Stream', path: '/live-streaming' },
  ];

  return (
    <header className="bg-slate-800/95 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20 py-2">
          <Link to="/" className="flex items-center space-x-2 group flex-shrink-0">
            <div className="relative">
              <Shield className="h-6 w-6 text-blue-500 group-hover:scale-110 transition-transform duration-200" />
              <div className="absolute inset-0 bg-blue-500 opacity-20 rounded-full blur-lg group-hover:opacity-40 transition-opacity" />
            </div>
            <span className="text-lg font-bold text-white bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              DeDiWARN
            </span>
          </Link>          <nav className="hidden lg:flex flex-col items-center space-y-1 flex-1 mx-4">
            {/* First row of navigation */}
            <div className="flex items-center justify-center space-x-1 flex-wrap">
              {mainNavItems.map((item, index) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`relative px-2 py-1 text-sm rounded-lg transition-all duration-200 group whitespace-nowrap ${
                    location.pathname === item.path
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700'
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {item.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 group-hover:w-full transition-all duration-300" />
                </Link>
              ))}
            </div>
            
            {/* Second row of navigation */}
            <div className="flex items-center justify-center space-x-1 flex-wrap">
              {secondaryNavItems.map((item, index) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`relative px-2 py-1 text-sm rounded-lg transition-all duration-200 group whitespace-nowrap ${
                    location.pathname === item.path
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700'
                  }`}
                  style={{ animationDelay: `${(index + mainNavItems.length) * 50}ms` }}
                >
                  {item.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 group-hover:w-full transition-all duration-300" />
                </Link>
              ))}
            </div>
          </nav>

          <div className="flex items-center space-x-3 flex-shrink-0">
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
            {[...mainNavItems, ...secondaryNavItems].map((item) => (
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