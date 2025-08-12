import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Menu, X } from 'lucide-react';
import { WalletConnect } from './WalletConnect';

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const mainNavItems = [
    { name: 'Dashboard', path: '/', icon: '🏠' },
    { name: 'Global Hub', path: '/enhanced-dashboard', icon: '🌍' },
    { name: 'Collaboration', path: '/collaboration', icon: '🤝' },
    { name: 'Contracts', path: '/contracts', icon: '📄' },
    { name: 'Analytics Hub', path: '/analytics', icon: '📊' },
    { name: 'Emergency Center', path: '/emergency-communication', icon: '🚨' },
    { name: 'Donations', path: '/donations', icon: '💖' },
    { name: 'Education', path: '/education', icon: '🎓' },
  ];

  return (
    <header className="bg-slate-900/95 backdrop-blur-md border-b border-slate-700/50 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-3 group flex-shrink-0">
            <div className="relative">
              <Shield className="h-7 w-7 text-blue-500 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
              <div className="absolute inset-0 bg-blue-500 opacity-20 rounded-full blur-lg group-hover:opacity-40 transition-opacity" />
            </div>
            <span className="text-xl font-bold text-white bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-200">
              DeDiWARN
            </span>
          </Link>

          <nav className="hidden lg:flex items-center justify-center space-x-1 flex-1 mx-6">
            <div className="flex items-center justify-center space-x-1 bg-slate-800/50 rounded-xl p-2 backdrop-blur-sm border border-slate-700/30">
              {mainNavItems.map((item, index) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`relative px-4 py-2.5 text-sm rounded-lg transition-all duration-300 group whitespace-nowrap flex items-center space-x-2 font-medium ${
                    location.pathname === item.path
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-600/25 scale-105'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/70 hover:scale-105'
                  }`}
                  style={{ animationDelay: `${index * 75}ms` }}
                >
                  <span className="text-base">{item.icon}</span>
                  <span>{item.name}</span>
                  {location.pathname === item.path && (
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-lg blur-xl" />
                  )}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-500 group-hover:w-full transition-all duration-500" />
                </Link>
              ))}
            </div>
          </nav>

          <div className="flex items-center space-x-4 flex-shrink-0">
            <WalletConnect />
            
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2.5 rounded-xl hover:bg-slate-700/70 transition-all duration-200 border border-slate-600/30 hover:border-slate-500/50"
            >
              {isMenuOpen ? 
                <X className="h-6 w-6 text-white" /> : 
                <Menu className="h-6 w-6 text-white" />
              }
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="lg:hidden bg-slate-900/98 backdrop-blur-md border-t border-slate-700/50 animate-slide-down shadow-2xl">
          <div className="px-4 py-4 space-y-1 max-h-96 overflow-y-auto">
            {mainNavItems.map((item, index) => (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center space-x-3 py-3 px-4 rounded-xl transition-all duration-200 ${
                  location.pathname === item.path
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-600/25'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/70 active:scale-95'
                }`}
                onClick={() => setIsMenuOpen(false)}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="font-medium">{item.name}</span>
                {location.pathname === item.path && (
                  <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse" />
                )}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};