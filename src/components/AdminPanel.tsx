import React, { useState } from 'react';
import { Shield, BarChart3 } from 'lucide-react';
import AnalyticsDashboard from '../components/AnalyticsDashboard';
import AdminDashboard from '../components/AdminDashboard';

const AdminPanel: React.FC = () => {
  const [activeView, setActiveView] = useState<'admin' | 'analytics'>('admin');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Shield className="w-8 h-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-bold text-gray-900">Authority Control Panel</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setActiveView('admin')}
                className={`flex items-center px-6 py-2 rounded-lg font-medium transition-all ${
                  activeView === 'admin' 
                    ? 'bg-blue-600 text-white shadow-lg' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Shield className="w-4 h-4 mr-2" />
                Admin Dashboard
              </button>
              
              <button
                onClick={() => setActiveView('analytics')}
                className={`flex items-center px-6 py-2 rounded-lg font-medium transition-all ${
                  activeView === 'analytics' 
                    ? 'bg-blue-600 text-white shadow-lg' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Analytics Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="transition-all duration-300">
        {activeView === 'admin' && <AdminDashboard />}
        {activeView === 'analytics' && <AnalyticsDashboard />}
      </div>
    </div>
  );
};

export default AdminPanel;
