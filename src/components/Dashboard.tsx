import React, { useState } from 'react';
import { Plus, AlertCircle, CheckCircle, Clock, TrendingUp, Activity, Users, Globe } from 'lucide-react';
import { StatsCard } from './StatsCard';

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

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-success bg-opacity-10 text-success border-success border-opacity-30';
      case 'medium': return 'bg-warning bg-opacity-10 text-warning border-warning border-opacity-30';
      case 'high': return 'bg-accent bg-opacity-10 text-accent border-accent border-opacity-30';
      case 'critical': return 'bg-error bg-opacity-10 text-error border-error border-opacity-30';
      default: return 'bg-textSecondary bg-opacity-10 text-textSecondary border-textSecondary border-opacity-30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <AlertCircle className="h-4 w-4 text-error animate-pulse" />;
      case 'resolved': return <CheckCircle className="h-4 w-4 text-success" />;
      case 'pending': return <Clock className="h-4 w-4 text-warning animate-spin" />;
      default: return <Clock className="h-4 w-4 text-textSecondary" />;
    }
  };

  return (
    <section id="dashboard" className="py-20 bg-background relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-12 animate-fade-in-up">
          <div>
            <h2 className="text-4xl font-bold text-text mb-2">Warning Dashboard</h2>
            <p className="text-textSecondary">Monitor and manage blockchain-verified warnings</p>
          </div>
          <button className="group bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-opacity-90 transform hover:scale-105 transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-2xl">
            <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform duration-200" />
            <span>Create Warning</span>
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <StatsCard
              title="Total Warnings"
              value="1,247"
              change="+12% from last month"
              changeType="positive"
              icon={TrendingUp}
            />
          </div>
          
          <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <StatsCard
              title="Active Warnings"
              value="23"
              change="2 critical alerts"
              changeType="negative"
              icon={AlertCircle}
              gradient
            />
          </div>
          
          <div className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <StatsCard
              title="Network Nodes"
              value="2,500"
              change="+5% uptime"
              changeType="positive"
              icon={Globe}
            />
          </div>
          
          <div className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <StatsCard
              title="Response Time"
              value="<15s"
              change="99.9% reliability"
              changeType="positive"
              icon={Activity}
            />
          </div>
        </div>

        {/* Warnings Table */}
        <div className="bg-surface rounded-2xl shadow-xl border border-border overflow-hidden animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
          <div className="px-6 py-4 border-b border-border bg-gradient-to-r from-primary to-secondary">
            <h3 className="text-lg font-semibold text-white">Recent Warnings</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-background">
                <tr>
                  {['Warning', 'Severity', 'Status', 'Location', 'Tx Hash', 'Timestamp'].map((header) => (
                    <th key={header} className="px-6 py-4 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {warnings.map((warning, index) => (
                  <tr 
                    key={warning.id} 
                    className="hover:bg-background transition-colors group animate-slide-in-left"
                    style={{ animationDelay: `${0.6 + index * 0.1}s` }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-text group-hover:text-primary transition-colors">
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
                        <span className="text-sm text-text capitalize">{warning.status}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text">{warning.location}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <code className="text-xs bg-background px-2 py-1 rounded font-mono text-primary border border-border">
                        {warning.txHash}
                      </code>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-textSecondary">{warning.timestamp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};