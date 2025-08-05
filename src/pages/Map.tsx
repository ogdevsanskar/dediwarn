import React, { useState } from 'react';
import { MapPin, Navigation, AlertTriangle, Shield, Zap, Filter, Search } from 'lucide-react';
import { RealTimeMap } from '../components/RealTimeMap';

interface DisasterEvent {
  id: string;
  type: 'earthquake' | 'flood' | 'fire' | 'storm' | 'emergency';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  timestamp: string;
  affectedArea: number; // in km
  evacuationRequired: boolean;
  casualties?: number;
  description: string;
}

export const Map: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<DisasterEvent | null>(null);
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isNavigating, setIsNavigating] = useState(false);

  // Mock disaster events data
  const [disasterEvents] = useState<DisasterEvent[]>([
    {
      id: '1',
      type: 'earthquake',
      severity: 'high',
      title: 'Earthquake Alert - Magnitude 6.2',
      location: {
        lat: 40.7128,
        lng: -74.0060,
        address: 'New York, NY, USA'
      },
      timestamp: '2024-01-15T14:30:00Z',
      affectedArea: 50,
      evacuationRequired: true,
      casualties: 12,
      description: 'Strong earthquake detected. Immediate evacuation recommended for buildings over 10 stories.'
    },
    {
      id: '2',
      type: 'flood',
      severity: 'critical',
      title: 'Flash Flood Warning',
      location: {
        lat: 34.0522,
        lng: -118.2437,
        address: 'Los Angeles, CA, USA'
      },
      timestamp: '2024-01-15T12:15:00Z',
      affectedArea: 25,
      evacuationRequired: true,
      casualties: 5,
      description: 'Severe flooding in downtown area. All low-lying areas should evacuate immediately.'
    },
    {
      id: '3',
      type: 'fire',
      severity: 'medium',
      title: 'Wildfire Containment',
      location: {
        lat: 37.7749,
        lng: -122.4194,
        address: 'San Francisco, CA, USA'
      },
      timestamp: '2024-01-15T10:45:00Z',
      affectedArea: 15,
      evacuationRequired: false,
      description: 'Wildfire contained but smoke advisory in effect for surrounding areas.'
    }
  ]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'high': return 'text-orange-400 bg-orange-500/20 border-orange-500/30';
      case 'critical': return 'text-red-400 bg-red-500/20 border-red-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'earthquake': return '🌋';
      case 'flood': return '🌊';
      case 'fire': return '🔥';
      case 'storm': return '⛈️';
      case 'emergency': return '🚨';
      default: return '⚠️';
    }
  };

  const filteredEvents = disasterEvents.filter(event => {
    const matchesSeverity = filterSeverity === 'all' || event.severity === filterSeverity;
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.location.address.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSeverity && matchesSearch;
  });

  const handleNavigateToEvent = (event: DisasterEvent) => {
    setIsNavigating(true);
    setSelectedEvent(event);
    // Simulate navigation
    setTimeout(() => {
      setIsNavigating(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen pt-8 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-4 flex items-center">
            <MapPin className="h-7 w-7 mr-3 text-blue-400" />
            Live Disaster Map
          </h1>
          <p className="text-gray-400 text-base">
            Real-time monitoring and navigation for disaster events worldwide
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map Section */}
          <div className="lg:col-span-2">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white flex items-center">
                  <Navigation className="h-5 w-5 mr-2 text-blue-400" />
                  Interactive Map
                </h2>
                {isNavigating && (
                  <div className="flex items-center text-blue-400 animate-pulse">
                    <Zap className="h-4 w-4 mr-1" />
                    Navigating...
                  </div>
                )}
              </div>
              
              {/* Real-time Map Component */}
              <div className="relative h-96 bg-slate-900 rounded-lg overflow-hidden">
                <RealTimeMap 
                  events={filteredEvents}
                  selectedEvent={selectedEvent}
                  onEventSelect={setSelectedEvent}
                />
              </div>
            </div>
          </div>

          {/* Sidebar - Events List */}
          <div className="space-y-6">
            {/* Filters */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Filter className="h-5 w-5 mr-2 text-blue-400" />
                Filters
              </h3>
              
              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Severity Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Severity Level</label>
                <select
                  value={filterSeverity}
                  onChange={(e) => setFilterSeverity(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="all">All Levels</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
            </div>

            {/* Events List */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2 text-blue-400" />
                Active Events ({filteredEvents.length})
              </h3>
              
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredEvents.map((event) => (
                  <div
                    key={event.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 hover:scale-105 ${
                      selectedEvent?.id === event.id 
                        ? 'bg-blue-500/20 border-blue-500/50' 
                        : 'bg-slate-700/50 border-slate-600 hover:border-slate-500'
                    }`}
                    onClick={() => setSelectedEvent(event)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center">
                        <span className="text-lg mr-2">{getTypeIcon(event.type)}</span>
                        <span className={`px-2 py-1 rounded text-xs font-medium border ${getSeverityColor(event.severity)}`}>
                          {event.severity.toUpperCase()}
                        </span>
                      </div>
                      {event.evacuationRequired && (
                        <Shield className="h-4 w-4 text-red-400" />
                      )}
                    </div>
                    
                    <h4 className="font-medium text-white mb-1">{event.title}</h4>
                    <p className="text-gray-400 text-sm mb-2">{event.location.address}</p>
                    <p className="text-gray-500 text-xs">{new Date(event.timestamp).toLocaleString()}</p>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNavigateToEvent(event);
                      }}
                      className="mt-2 w-full px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors duration-200 flex items-center justify-center"
                    >
                      <Navigation className="h-3 w-3 mr-1" />
                      Navigate
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Live Statistics</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Active Events:</span>
                  <span className="text-white font-medium">{disasterEvents.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Critical Alerts:</span>
                  <span className="text-red-400 font-medium">
                    {disasterEvents.filter(e => e.severity === 'critical').length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Evacuation Zones:</span>
                  <span className="text-orange-400 font-medium">
                    {disasterEvents.filter(e => e.evacuationRequired).length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Affected Areas:</span>
                  <span className="text-blue-400 font-medium">
                    {disasterEvents.reduce((sum, e) => sum + e.affectedArea, 0)} km²
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
