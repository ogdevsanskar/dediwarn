import React, { useState } from 'react';
import { BarChart3, PieChart, TrendingUp, MapPin, Calendar, Filter, Activity, Users, Globe, AlertTriangle } from 'lucide-react';
import { LiveChart } from '../components/LiveChart';

export const Analytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedMetric, setSelectedMetric] = useState('warnings');

  const metrics = [
    { id: 'warnings', label: 'Warnings Issued', value: '1,247', change: '+12%', icon: AlertTriangle },
    { id: 'responses', label: 'Response Rate', value: '94.2%', change: '+2.1%', icon: Activity },
    { id: 'coverage', label: 'Global Coverage', value: '156', change: '+8', icon: Globe },
    { id: 'efficiency', label: 'Network Efficiency', value: '99.7%', change: '+0.3%', icon: TrendingUp }
  ];

  return (
    <div className="min-h-screen pt-8 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-12 animate-fade-in-up">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Analytics Dashboard</h1>
            <p className="text-slate-400">Deep insights into warning system performance with live blockchain data</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
            </select>
            
            <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200">
              <Filter className="h-4 w-4" />
              <span>Filter</span>
            </button>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {metrics.map((metric, index) => (
            <div
              key={metric.id}
              className={`p-6 rounded-xl border transition-all duration-300 cursor-pointer animate-fade-in-up card-hover ${
                selectedMetric === metric.id
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white border-blue-500 shadow-2xl'
                  : 'bg-slate-800/60 backdrop-blur-sm border-slate-700 hover:border-slate-600 hover:shadow-xl'
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => setSelectedMetric(metric.id)}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className={`font-medium ${selectedMetric === metric.id ? 'text-white' : 'text-slate-400'}`}>
                  {metric.label}
                </h3>
                <div className={`p-2 rounded-lg ${selectedMetric === metric.id ? 'bg-white/20' : 'bg-blue-600/20'}`}>
                  <metric.icon className={`h-5 w-5 ${selectedMetric === metric.id ? 'text-white' : 'text-blue-400'}`} />
                </div>
              </div>
              <div className="flex items-end justify-between">
                <span className={`text-2xl font-bold ${selectedMetric === metric.id ? 'text-white' : 'text-white'}`}>
                  {metric.value}
                </span>
                <span className={`text-sm ${selectedMetric === metric.id ? 'text-white opacity-80' : 'text-green-400'}`}>
                  {metric.change}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Live Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
            <LiveChart 
              type="line" 
              title="Warning Trends (Live)" 
              height={300}
            />
          </div>

          <div className="animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            <LiveChart 
              type="bar" 
              title="Severity Distribution" 
              height={300}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="animate-fade-in-up" style={{ animationDelay: '0.7s' }}>
            <LiveChart 
              type="doughnut" 
              title="Warning Status" 
              height={250}
            />
          </div>

          {/* Geographic Distribution */}
          <div className="lg:col-span-2 bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-700 shadow-lg animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">Geographic Distribution</h3>
              <MapPin className="h-5 w-5 text-blue-400" />
            </div>
            
            <div className="space-y-4">
              {[
                { region: 'North America', percentage: 35, count: '437', color: 'from-blue-500 to-cyan-500' },
                { region: 'Europe', percentage: 28, count: '349', color: 'from-purple-500 to-pink-500' },
                { region: 'Asia Pacific', percentage: 22, count: '274', color: 'from-green-500 to-emerald-500' },
                { region: 'South America', percentage: 10, count: '125', color: 'from-yellow-500 to-orange-500' },
                { region: 'Africa', percentage: 5, count: '62', color: 'from-red-500 to-pink-500' }
              ].map((region, index) => (
                <div key={region.region} className="animate-slide-in-left" style={{ animationDelay: `${0.9 + index * 0.1}s` }}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-white">{region.region}</span>
                    <span className="text-sm text-slate-400">{region.count} warnings</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
                    <div
                      className={`bg-gradient-to-r ${region.color} h-3 rounded-full transition-all duration-1000 animate-expand`}
                      style={{ 
                        width: `${region.percentage}%`,
                        animationDelay: `${1.0 + index * 0.1}s`
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Real-time Activity Feed */}
        <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-700 shadow-lg animate-fade-in-up" style={{ animationDelay: '1.0s' }}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Real-time Blockchain Activity</h3>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-sm text-slate-400">Live</span>
            </div>
          </div>
          
          <div className="space-y-4 max-h-64 overflow-y-auto">
            {[
              { time: '2 min ago', action: 'Critical warning issued', location: 'San Francisco, CA', type: 'critical', hash: '0xa1b2c3...def456' },
              { time: '5 min ago', action: 'Warning resolved', location: 'New York, NY', type: 'success', hash: '0x789abc...123def' },
              { time: '8 min ago', action: 'New node joined network', location: 'London, UK', type: 'info', hash: '0xdef123...456abc' },
              { time: '12 min ago', action: 'Smart contract deployed', location: 'Tokyo, JP', type: 'info', hash: '0x456def...789abc' },
              { time: '15 min ago', action: 'High severity alert', location: 'Berlin, DE', type: 'warning', hash: '0x123abc...def789' },
              { time: '18 min ago', action: 'Network upgrade completed', location: 'Global', type: 'success', hash: '0x789def...abc123' },
              { time: '22 min ago', action: 'Emergency protocol activated', location: 'Sydney, AU', type: 'critical', hash: '0xabc789...def456' }
            ].map((activity, index) => (
              <div
                key={index}
                className="flex items-center space-x-4 p-3 rounded-lg hover:bg-slate-700/50 transition-colors animate-slide-in-left"
                style={{ animationDelay: `${1.1 + index * 0.1}s` }}
              >
                <div className={`w-3 h-3 rounded-full animate-pulse ${
                  activity.type === 'critical' ? 'bg-red-400' :
                  activity.type === 'success' ? 'bg-green-400' :
                  activity.type === 'warning' ? 'bg-yellow-400' : 'bg-blue-400'
                }`} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">{activity.action}</p>
                  <p className="text-xs text-slate-400">{activity.location}</p>
                </div>
                <div className="text-right">
                  <code className="text-xs bg-slate-700 px-2 py-1 rounded text-blue-400 block mb-1">
                    {activity.hash}
                  </code>
                  <span className="text-xs text-slate-400">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {[
            { title: 'Average Response Time', value: '12.3s', trend: '-2.1s', icon: Activity },
            { title: 'Network Uptime', value: '99.97%', trend: '+0.02%', icon: Globe },
            { title: 'User Satisfaction', value: '4.8/5', trend: '+0.1', icon: Users }
          ].map((metric, index) => (
            <div
              key={index}
              className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-6 border border-slate-700 hover:border-slate-600 transition-all duration-300 hover:transform hover:scale-105 animate-fade-in-up"
              style={{ animationDelay: `${1.2 + index * 0.1}s` }}
            >
              <div className="flex items-center justify-between mb-4">
                <metric.icon className="h-8 w-8 text-blue-400" />
                <span className="text-green-400 text-sm font-medium">{metric.trend}</span>
              </div>
              <div className="text-2xl font-bold text-white mb-1">{metric.value}</div>
              <div className="text-slate-400 text-sm">{metric.title}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};