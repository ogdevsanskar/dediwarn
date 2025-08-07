import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, AlertTriangle, Shield, Zap, Filter, Search, RefreshCw, Wifi, WifiOff } from 'lucide-react';
import SatelliteMap from '../components/SatelliteMap';
import { DisasterEvent } from '../services/disasterService';
import { disasterService } from '../services/disasterService';
import { API_CONFIG, checkApiConfiguration } from '../config/apiConfig';

export const Map: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<DisasterEvent | null>(null);
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isNavigating, setIsNavigating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [apiStatus, setApiStatus] = useState<'connected' | 'disconnected' | 'checking'>('checking');
  
  // Real disaster events from APIs
  const [disasterEvents, setDisasterEvents] = useState<DisasterEvent[]>([]);

  // Load real disaster data
  const loadDisasterData = async () => {
    setIsLoading(true);
    setApiStatus('checking');
    
    try {
      // Check API configuration
      const configCheck = checkApiConfiguration();
      
      // Get disaster events from real APIs
      const events = await disasterService.getAllDisasterEvents({
        includeEarthquakes: true,
        includeWeather: configCheck.isValid,
        cities: API_CONFIG.DEFAULT_CITIES,
        earthquakeMinMagnitude: API_CONFIG.EARTHQUAKE_CONFIG.MIN_MAGNITUDE,
        weatherApiKey: API_CONFIG.OPENWEATHER_API_KEY
      });
      
      setDisasterEvents(events);
      setLastUpdated(new Date());
      setApiStatus(events.length > 0 ? 'connected' : 'disconnected');
      
      if (!configCheck.isValid) {
        console.warn('API Configuration issues:', configCheck.issues);
      }
    } catch (error) {
      console.error('Failed to load disaster data:', error);
      setApiStatus('disconnected');
      
      // Fallback to mock data if APIs fail
      setDisasterEvents([
        {
          id: 'fallback-1',
          type: 'earthquake',
          severity: 'high',
          title: 'API Unavailable - Using Demo Data',
          location: {
            lat: 40.7128,
            lng: -74.0060,
            address: 'Demo Location'
          },
          timestamp: new Date().toISOString(),
          affectedArea: 50,
          evacuationRequired: false,
          description: 'Real-time data unavailable. Please check your internet connection and API configuration.'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Load data on component mount and set up auto-refresh
  useEffect(() => {
    loadDisasterData();
    
    // Auto-refresh every 5 minutes
    const interval = setInterval(loadDisasterData, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

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
            🛰️ Live Satellite Disaster Map
          </h1>
          <p className="text-gray-400 text-base">
            Real-time monitoring with satellite imagery and navigation for disaster events worldwide
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map Section */}
          <div className="lg:col-span-2">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white flex items-center">
                  <Navigation className="h-5 w-5 mr-2 text-blue-400" />
                  🛰️ Satellite Map View
                </h2>
                {isNavigating && (
                  <div className="flex items-center text-blue-400 animate-pulse">
                    <Zap className="h-4 w-4 mr-1" />
                    Navigating...
                  </div>
                )}
              </div>
              
              {/* Enhanced Satellite Map Component */}
              <div className="relative h-96 bg-slate-900 rounded-lg overflow-hidden">
                <SatelliteMap 
                  events={filteredEvents}
                  selectedEvent={selectedEvent}
                  onEventSelect={setSelectedEvent}
                  className="w-full h-full"
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
                  title="Filter by severity level"
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
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-white">Live Statistics</h3>
                <button
                  onClick={loadDisasterData}
                  disabled={isLoading}
                  className="flex items-center space-x-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:opacity-50 rounded-lg text-sm text-white transition-colors"
                  title="Refresh data"
                >
                  <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                  <span>{isLoading ? 'Loading...' : 'Refresh'}</span>
                </button>
              </div>
              
              {/* API Status Indicator */}
              <div className="flex justify-between items-center mb-3 pb-3 border-b border-slate-600">
                <span className="text-gray-400">Data Source:</span>
                <div className="flex items-center space-x-2">
                  {apiStatus === 'connected' ? (
                    <Wifi className="h-4 w-4 text-green-400" />
                  ) : apiStatus === 'disconnected' ? (
                    <WifiOff className="h-4 w-4 text-red-400" />
                  ) : (
                    <RefreshCw className="h-4 w-4 text-yellow-400 animate-spin" />
                  )}
                  <span className={`text-sm font-medium ${
                    apiStatus === 'connected' ? 'text-green-400' : 
                    apiStatus === 'disconnected' ? 'text-red-400' : 'text-yellow-400'
                  }`}>
                    {apiStatus === 'connected' ? 'Live APIs' : 
                     apiStatus === 'disconnected' ? 'Offline' : 'Connecting...'}
                  </span>
                </div>
              </div>

              {/* Last Updated */}
              {lastUpdated && (
                <div className="flex justify-between items-center mb-3 text-xs">
                  <span className="text-gray-500">Last updated:</span>
                  <span className="text-gray-400">
                    {lastUpdated.toLocaleTimeString()}
                  </span>
                </div>
              )}
              
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
