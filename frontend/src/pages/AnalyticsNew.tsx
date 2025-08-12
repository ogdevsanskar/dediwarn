import React, { useState } from 'react';
import { TrendingUp, MapPin, Activity, Globe, AlertTriangle, Network, Zap, Brain, Database, Wifi, CloudRain, Thermometer, Wind, Eye } from 'lucide-react';

export const Analytics: React.FC = () => {
  const [activeTab, setActiveTab] = useState('analytics');
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedMetric, setSelectedMetric] = useState('warnings');

  const tabs = [
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'network', label: 'Network Status', icon: Network },
    { id: 'prediction', label: 'Predictions', icon: Brain }
  ];

  const analyticsMetrics = [
    { id: 'warnings', label: 'Warnings Issued', value: '1,247', change: '+12%', icon: AlertTriangle },
    { id: 'responses', label: 'Response Rate', value: '94.2%', change: '+2.1%', icon: Activity },
    { id: 'coverage', label: 'Global Coverage', value: '156', change: '+8', icon: Globe },
    { id: 'efficiency', label: 'Network Efficiency', value: '99.7%', change: '+0.3%', icon: TrendingUp }
  ];

  const networkMetrics = [
    { id: 'nodes', label: 'Active Nodes', value: '2,847', change: '+5.2%', icon: Network, status: 'online' },
    { id: 'throughput', label: 'Network Throughput', value: '15.2 TPS', change: '+8.1%', icon: Zap, status: 'optimal' },
    { id: 'latency', label: 'Average Latency', value: '125ms', change: '-2.3%', icon: Wifi, status: 'good' },
    { id: 'uptime', label: 'Network Uptime', value: '99.98%', change: '+0.01%', icon: Database, status: 'excellent' }
  ];

  const predictions = [
    {
      id: '1',
      type: 'Flood',
      location: 'Mumbai, Maharashtra',
      probability: 85,
      severity: 'high',
      timeframe: '24-48 hours',
      confidence: 92,
      icon: CloudRain,
      color: 'blue'
    },
    {
      id: '2', 
      type: 'Heatwave',
      location: 'Delhi, NCR',
      probability: 78,
      severity: 'medium',
      timeframe: '3-5 days',
      confidence: 88,
      icon: Thermometer,
      color: 'orange'
    },
    {
      id: '3',
      type: 'Cyclone',
      location: 'Odisha Coast',
      probability: 65,
      severity: 'critical',
      timeframe: '5-7 days',
      confidence: 85,
      icon: Wind,
      color: 'purple'
    },
    {
      id: '4',
      type: 'Drought',
      location: 'Karnataka',
      probability: 72,
      severity: 'medium',
      timeframe: '2-3 weeks',
      confidence: 79,
      icon: Eye,
      color: 'yellow'
    }
  ];

  const renderAnalytics = () => (
    <>
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {analyticsMetrics.map((metric, index) => (
          <div
            key={metric.id}
            className={`p-6 rounded-xl border transition-all duration-300 cursor-pointer animate-fade-in-up animation-delay-${index} ${
              selectedMetric === metric.id
                ? 'bg-blue-600/20 border-blue-400'
                : 'bg-slate-800/50 border-slate-700 hover:border-blue-400'
            }`}
            onClick={() => setSelectedMetric(metric.id)}
          >
            <div className="flex items-center justify-between mb-4">
              <metric.icon className={`h-8 w-8 ${selectedMetric === metric.id ? 'text-blue-400' : 'text-slate-400'}`} />
              <span className={`text-sm font-medium ${metric.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                {metric.change}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">{metric.value}</h3>
            <p className="text-slate-400 text-sm">{metric.label}</p>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Performance Trends</h3>
          <div className="h-64 bg-slate-900/50 rounded-lg flex items-center justify-center">
            <TrendingUp className="h-16 w-16 text-slate-600" />
            <span className="ml-4 text-slate-400">Chart visualization</span>
          </div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Regional Distribution</h3>
          <div className="space-y-4">
            {[
              { region: 'Asia Pacific', percentage: 45, value: '2.1M' },
              { region: 'Europe', percentage: 28, value: '1.3M' },
              { region: 'North America', percentage: 18, value: '840K' },
              { region: 'Others', percentage: 9, value: '420K' }
            ].map((item) => (
              <div key={item.region} className="flex items-center justify-between">
                <span className="text-slate-300">{item.region}</span>
                <div className="flex items-center space-x-3">
                  <div className="w-32 bg-slate-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full progress-bar"
                      data-width={item.percentage}
                    />
                  </div>
                  <span className="text-white font-medium w-16">{item.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );

  const renderNetwork = () => (
    <>
      {/* Network Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {networkMetrics.map((metric, index) => (
          <div key={metric.id} className={`p-6 rounded-xl border bg-slate-800/50 border-slate-700 hover:border-blue-400 transition-all duration-300 animate-fade-in-up animation-delay-${index}`}>
            <div className="flex items-center justify-between mb-4">
              <metric.icon className="h-8 w-8 text-blue-400" />
              <div className={`px-2 py-1 rounded-full text-xs ${
                metric.status === 'excellent' ? 'bg-green-600/20 text-green-400' :
                metric.status === 'good' ? 'bg-blue-600/20 text-blue-400' :
                metric.status === 'optimal' ? 'bg-purple-600/20 text-purple-400' :
                'bg-orange-600/20 text-orange-400'
              }`}>
                {metric.status}
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">{metric.value}</h3>
            <p className="text-slate-400 text-sm mb-2">{metric.label}</p>
            <span className={`text-sm font-medium ${metric.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
              {metric.change}
            </span>
          </div>
        ))}
      </div>

      {/* Network Map and Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Network Topology</h3>
          <div className="h-64 bg-slate-900/50 rounded-lg flex items-center justify-center">
            <Network className="h-16 w-16 text-slate-600" />
            <span className="ml-4 text-slate-400">Network visualization</span>
          </div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Active Connections</h3>
          <div className="space-y-3">
            {[
              { node: 'Mumbai-Node-01', status: 'online', latency: '45ms', uptime: '99.9%' },
              { node: 'Delhi-Node-02', status: 'online', latency: '38ms', uptime: '99.8%' },
              { node: 'Bangalore-Node-03', status: 'maintenance', latency: '152ms', uptime: '98.2%' },
              { node: 'Chennai-Node-04', status: 'online', latency: '62ms', uptime: '99.7%' }
            ].map((node) => (
              <div key={node.node} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${node.status === 'online' ? 'bg-green-400' : 'bg-orange-400'}`} />
                  <span className="text-white font-medium">{node.node}</span>
                </div>
                <div className="flex items-center space-x-4 text-sm text-slate-400">
                  <span>{node.latency}</span>
                  <span>{node.uptime}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );

  const renderPredictions = () => (
    <>
      {/* Predictions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {predictions.map((prediction) => (
          <div key={prediction.id} className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-blue-400 transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <prediction.icon className="h-8 w-8 text-blue-400" />
                <div>
                  <h3 className="text-lg font-semibold text-white">{prediction.type}</h3>
                  <p className="text-slate-400 text-sm flex items-center">
                    <MapPin className="h-3 w-3 mr-1" />
                    {prediction.location}
                  </p>
                </div>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs ${
                prediction.severity === 'critical' ? 'bg-red-600/20 text-red-400' :
                prediction.severity === 'high' ? 'bg-orange-600/20 text-orange-400' :
                'bg-yellow-600/20 text-yellow-400'
              }`}>
                {prediction.severity}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Probability</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-slate-700 rounded-full h-2">
                    <div 
                      className="bg-blue-400 h-2 rounded-full progress-bar"
                      data-width={prediction.probability}
                    />
                  </div>
                  <span className="text-white font-medium">{prediction.probability}%</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-400">Confidence</span>
                <span className="text-white font-medium">{prediction.confidence}%</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-400">Timeframe</span>
                <span className="text-white font-medium">{prediction.timeframe}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ML Model Performance */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4">AI Model Performance</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { metric: 'Accuracy', value: '94.7%', trend: '+2.1%' },
            { metric: 'Precision', value: '92.3%', trend: '+1.8%' },
            { metric: 'Recall', value: '96.1%', trend: '+0.9%' }
          ].map((metric) => (
            <div key={metric.metric} className="text-center">
              <div className="text-3xl font-bold text-white mb-1">{metric.value}</div>
              <div className="text-slate-400 text-sm mb-2">{metric.metric}</div>
              <div className="text-green-400 text-sm">{metric.trend}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen pt-8 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 animate-fade-in-up">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Analytics Hub</h1>
            <p className="text-slate-400">Comprehensive analytics, network monitoring, and AI predictions</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              aria-label="Select time range for analytics"
              className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
            </select>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-8 bg-slate-800/50 p-1 rounded-lg border border-slate-700">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'analytics' && renderAnalytics()}
        {activeTab === 'network' && renderNetwork()}
        {activeTab === 'prediction' && renderPredictions()}
      </div>
    </div>
  );
};
