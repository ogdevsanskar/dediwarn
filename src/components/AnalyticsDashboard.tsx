import React, { useState } from 'react';
import { BarChart3, PieChart, TrendingUp, MapPin, Calendar, Filter } from 'lucide-react';

export const AnalyticsDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedMetric, setSelectedMetric] = useState('warnings');

  const metrics = [
    { id: 'warnings', label: 'Warnings Issued', value: '1,247', change: '+12%' },
    { id: 'responses', label: 'Response Rate', value: '94.2%', change: '+2.1%' },
    { id: 'coverage', label: 'Global Coverage', value: '156', change: '+8' },
    { id: 'efficiency', label: 'Network Efficiency', value: '99.7%', change: '+0.3%' }
  ];

  return (
    <section id="analytics" className="py-20 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-12 animate-fade-in-up">
          <div>
            <h2 className="text-4xl font-bold text-text mb-2">Analytics Dashboard</h2>
            <p className="text-textSecondary">Deep insights into warning system performance</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 bg-background border border-border rounded-lg text-text focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
            </select>
            
            <button className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 transition-colors">
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
              className={`p-6 rounded-xl border transition-all duration-300 cursor-pointer animate-fade-in-up ${
                selectedMetric === metric.id
                  ? 'bg-primary text-white border-primary shadow-lg'
                  : 'bg-background border-border hover:border-primary hover:shadow-lg'
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => setSelectedMetric(metric.id)}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className={`font-medium ${selectedMetric === metric.id ? 'text-white' : 'text-textSecondary'}`}>
                  {metric.label}
                </h3>
                <TrendingUp className={`h-5 w-5 ${selectedMetric === metric.id ? 'text-white' : 'text-primary'}`} />
              </div>
              <div className="flex items-end justify-between">
                <span className={`text-2xl font-bold ${selectedMetric === metric.id ? 'text-white' : 'text-text'}`}>
                  {metric.value}
                </span>
                <span className={`text-sm ${selectedMetric === metric.id ? 'text-white opacity-80' : 'text-success'}`}>
                  {metric.change}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Warning Trends Chart */}
          <div className="bg-background rounded-2xl p-6 border border-border shadow-lg animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-text">Warning Trends</h3>
              <BarChart3 className="h-5 w-5 text-primary" />
            </div>
            
            <div className="h-64 flex items-end justify-between space-x-2">
              {[65, 45, 78, 52, 89, 67, 94, 73, 85, 91, 76, 88].map((height, index) => (
                <div
                  key={index}
                  className="flex-1 bg-gradient-to-t from-primary to-secondary rounded-t opacity-80 hover:opacity-100 transition-opacity cursor-pointer animate-grow"
                  style={{ 
                    height: `${height}%`,
                    animationDelay: `${0.6 + index * 0.05}s`
                  }}
                />
              ))}
            </div>
            
            <div className="flex justify-between mt-4 text-xs text-textSecondary">
              {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(month => (
                <span key={month}>{month}</span>
              ))}
            </div>
          </div>

          {/* Geographic Distribution */}
          <div className="bg-background rounded-2xl p-6 border border-border shadow-lg animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-text">Geographic Distribution</h3>
              <MapPin className="h-5 w-5 text-primary" />
            </div>
            
            <div className="space-y-4">
              {[
                { region: 'North America', percentage: 35, count: '437' },
                { region: 'Europe', percentage: 28, count: '349' },
                { region: 'Asia Pacific', percentage: 22, count: '274' },
                { region: 'South America', percentage: 10, count: '125' },
                { region: 'Africa', percentage: 5, count: '62' }
              ].map((region, index) => (
                <div key={region.region} className="animate-slide-in-left" style={{ animationDelay: `${0.7 + index * 0.1}s` }}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-text">{region.region}</span>
                    <span className="text-sm text-textSecondary">{region.count} warnings</span>
                  </div>
                  <div className="w-full bg-border rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-1000 animate-expand"
                      style={{ 
                        width: `${region.percentage}%`,
                        animationDelay: `${0.8 + index * 0.1}s`
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Real-time Activity Feed */}
        <div className="bg-background rounded-2xl p-6 border border-border shadow-lg animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-text">Real-time Activity</h3>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
              <span className="text-sm text-textSecondary">Live</span>
            </div>
          </div>
          
          <div className="space-y-4 max-h-64 overflow-y-auto">
            {[
              { time: '2 min ago', action: 'Critical warning issued', location: 'San Francisco, CA', type: 'critical' },
              { time: '5 min ago', action: 'Warning resolved', location: 'New York, NY', type: 'success' },
              { time: '8 min ago', action: 'New node joined network', location: 'London, UK', type: 'info' },
              { time: '12 min ago', action: 'Smart contract deployed', location: 'Tokyo, JP', type: 'info' },
              { time: '15 min ago', action: 'High severity alert', location: 'Berlin, DE', type: 'warning' }
            ].map((activity, index) => (
              <div
                key={index}
                className="flex items-center space-x-4 p-3 rounded-lg hover:bg-surface transition-colors animate-slide-in-left"
                style={{ animationDelay: `${0.9 + index * 0.1}s` }}
              >
                <div className={`w-3 h-3 rounded-full ${
                  activity.type === 'critical' ? 'bg-error' :
                  activity.type === 'success' ? 'bg-success' :
                  activity.type === 'warning' ? 'bg-warning' : 'bg-primary'
                } animate-pulse`} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-text">{activity.action}</p>
                  <p className="text-xs text-textSecondary">{activity.location}</p>
                </div>
                <span className="text-xs text-textSecondary">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};