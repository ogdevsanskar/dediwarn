import React, { useState } from 'react';
import { Plus, AlertCircle, CheckCircle, Clock, TrendingUp, Activity, Users, Globe, Filter, Search } from 'lucide-react';

interface Warning {
  id: string;
  title: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'active' | 'resolved' | 'pending';
  timestamp: string;
  location: string;
  txHash: string;
}

export const Dashboard: React.FC = () => {
  const [warnings] = useState<Warning[]>([
    {
      id: '1',
      title: 'Severe Weather Alert',
      severity: 'high',
      status: 'active',
      timestamp: '2024-01-15 14:30',
      location: 'California, USA',
      txHash: '0x1234...abcd'
    },
    {
      id: '2',
      title: 'Traffic Disruption',
      severity: 'medium',
      status: 'resolved',
      timestamp: '2024-01-15 12:15',
      location: 'New York, USA',
      txHash: '0x5678...efgh'
    },
    {
      id: '3',
      title: 'Emergency Services Alert',
      severity: 'critical',
      status: 'active',
      timestamp: '2024-01-15 16:45',
      location: 'London, UK',
      txHash: '0x9abc...ijkl'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('all');

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <AlertCircle className="h-4 w-4 text-red-400 animate-pulse" />;
      case 'resolved': return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'pending': return <Clock className="h-4 w-4 text-yellow-400 animate-spin" />;
      default: return <Clock className="h-4 w-4 text-slate-400" />;
    }
  };

  return (
    <div className="min-h-screen pt-8 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-12 animate-fade-in-up">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Warning Dashboard</h1>
            <p className="text-slate-400">Monitor and manage blockchain-verified warnings</p>
          </div>
          <button className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-2xl">
            <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform duration-200" />
            <span>Create Warning</span>
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { title: 'Total Warnings', value: '1,247', change: '+12%', icon: TrendingUp, color: 'from-blue-500 to-cyan-500' },
            { title: 'Active Warnings', value: '23', change: '2 critical', icon: AlertCircle, color: 'from-red-500 to-pink-500' },
            { title: 'Network Nodes', value: '2,500', change: '+5%', icon: Globe, color: 'from-green-500 to-emerald-500' },
            { title: 'Response Time', value: '<15s', change: '99.9%', icon: Activity, color: 'from-purple-500 to-indigo-500' }
          ].map((stat, index) => (
            <div
              key={index}
              className="bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-700 hover:border-slate-600 shadow-lg hover:shadow-2xl transition-all duration-300 hover:transform hover:-translate-y-1 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 bg-gradient-to-r ${stat.color} rounded-lg`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <span className="text-green-400 text-sm font-medium">{stat.change}</span>
              </div>
              <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-slate-400 text-sm">{stat.title}</div>
            </div>
          ))}
        </div>

        {/* Search and Filter */}
        <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-700 mb-8 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search warnings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <select
                value={filterSeverity}
                onChange={(e) => setFilterSeverity(e.target.value)}
                className="pl-10 pr-8 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none min-w-[150px] transition-all duration-200"
              >
                <option value="all">All Severities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>
        </div>

        {/* Warnings Table */}
        <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-700 overflow-hidden animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
          <div className="px-6 py-4 border-b border-slate-700 bg-gradient-to-r from-blue-600/20 to-purple-600/20">
            <h3 className="text-lg font-semibold text-white">Recent Warnings</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-700/50">
                <tr>
                  {['Warning', 'Severity', 'Status', 'Location', 'Tx Hash', 'Timestamp'].map((header) => (
                    <th key={header} className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {warnings.map((warning, index) => (
                  <tr 
                    key={warning.id} 
                    className="hover:bg-slate-700/30 transition-colors group animate-slide-in-left"
                    style={{ animationDelay: `${0.7 + index * 0.1}s` }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-white group-hover:text-blue-400 transition-colors">
                        {warning.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${getSeverityColor(warning.severity)}`}>
                        {warning.severity}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(warning.status)}
                        <span className="text-sm text-white capitalize">{warning.status}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{warning.location}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <code className="text-xs bg-slate-700 px-2 py-1 rounded font-mono text-blue-400 border border-slate-600">
                        {warning.txHash}
                      </code>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">{warning.timestamp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};