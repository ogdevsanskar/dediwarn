import React, { useState } from 'react';
import { Search, Filter, AlertTriangle, MapPin, Clock, ExternalLink } from 'lucide-react';

interface Warning {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  location: string;
  timestamp: string;
  txHash: string;
  issuer: string;
}

export const WarningFeed: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState('all');
  
  const warnings: Warning[] = [
    {
      id: '1',
      title: 'Severe Thunderstorm Warning',
      description: 'Heavy rain, strong winds, and hail expected in the area. Seek indoor shelter immediately.',
      severity: 'high',
      location: 'San Francisco, CA',
      timestamp: '2024-01-15 18:30:00',
      txHash: '0x1a2b3c4d5e6f7890abcdef1234567890abcdef12',
      issuer: '0x742d35Cc6665C0532846b18b4A7b283c42c8A52f'
    },
    {
      id: '2',
      title: 'Road Construction Alert',
      description: 'Main Street will be closed for emergency repairs. Use alternate routes.',
      severity: 'medium',
      location: 'New York, NY',
      timestamp: '2024-01-15 17:45:00',
      txHash: '0x2b3c4d5e6f7890abcdef1234567890abcdef1234',
      issuer: '0x8a3e45Bb7429c1234567890abcdef1234567890'
    },
    {
      id: '3',
      title: 'Emergency Services Disruption',
      description: 'Fire department responding to major incident. Emergency response times may be delayed.',
      severity: 'critical',
      location: 'London, UK',
      timestamp: '2024-01-15 19:15:00',
      txHash: '0x3c4d5e6f7890abcdef1234567890abcdef123456',
      issuer: '0x9b4f56Cc8540d345678901bcdef234567890abcd'
    },
    {
      id: '4',
      title: 'Air Quality Advisory',
      description: 'Elevated pollution levels detected. Sensitive individuals should limit outdoor activities.',
      severity: 'low',
      location: 'Los Angeles, CA',
      timestamp: '2024-01-15 16:20:00',
      txHash: '0x4d5e6f7890abcdef1234567890abcdef12345678',
      issuer: '0xa5c67Dd9651e456789012cdef345678901bcdef2'
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'border-l-green-500 bg-green-50';
      case 'medium': return 'border-l-yellow-500 bg-yellow-50';
      case 'high': return 'border-l-orange-500 bg-orange-50';
      case 'critical': return 'border-l-red-500 bg-red-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  const getSeverityIcon = (severity: string) => {
    const baseClasses = "h-5 w-5";
    switch (severity) {
      case 'low': return <AlertTriangle className={`${baseClasses} text-green-600`} />;
      case 'medium': return <AlertTriangle className={`${baseClasses} text-yellow-600`} />;
      case 'high': return <AlertTriangle className={`${baseClasses} text-orange-600`} />;
      case 'critical': return <AlertTriangle className={`${baseClasses} text-red-600`} />;
      default: return <AlertTriangle className={`${baseClasses} text-gray-600`} />;
    }
  };

  const filteredWarnings = warnings.filter(warning => {
    const matchesSearch = warning.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         warning.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         warning.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = selectedSeverity === 'all' || warning.severity === selectedSeverity;
    return matchesSearch && matchesSeverity;
  });

  return (
    <section id="warnings" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Live Warning Feed</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Real-time warnings verified on the blockchain with complete transparency
          </p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search warnings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={selectedSeverity}
                onChange={(e) => setSelectedSeverity(e.target.value)}
                className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white min-w-[150px]"
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

        {/* Warning Cards */}
        <div className="space-y-6">
          {filteredWarnings.map((warning) => (
            <div
              key={warning.id}
              className={`bg-white rounded-xl border-l-4 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden ${getSeverityColor(warning.severity)}`}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {getSeverityIcon(warning.severity)}
                    <h3 className="text-xl font-semibold text-gray-900">{warning.title}</h3>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full uppercase ${
                      warning.severity === 'critical' ? 'bg-red-100 text-red-800' :
                      warning.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                      warning.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {warning.severity}
                    </span>
                  </div>
                  <button className="text-gray-400 hover:text-blue-600 transition-colors">
                    <ExternalLink className="h-5 w-5" />
                  </button>
                </div>

                <p className="text-gray-700 mb-4 leading-relaxed">{warning.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{warning.location}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>{new Date(warning.timestamp).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <div className="h-4 w-4 bg-blue-600 rounded-full flex items-center justify-center">
                      <div className="h-2 w-2 bg-white rounded-full"></div>
                    </div>
                    <span>Verified on blockchain</span>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Transaction Hash:</span>
                      <code className="block mt-1 text-xs bg-white px-2 py-1 rounded border font-mono break-all">
                        {warning.txHash}
                      </code>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Issued by:</span>
                      <code className="block mt-1 text-xs bg-white px-2 py-1 rounded border font-mono break-all">
                        {warning.issuer}
                      </code>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredWarnings.length === 0 && (
          <div className="text-center py-12">
            <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No warnings match your search criteria</p>
          </div>
        )}
      </div>
    </section>
  );
};