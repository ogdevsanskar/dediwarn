import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, LayersControl } from 'react-leaflet';
import { Icon, DivIcon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './SatelliteMap.css';
import { MapPin, Shield, Zap, Navigation2 } from 'lucide-react';

// Fix for default markers in react-leaflet
delete (Icon.Default.prototype as any)._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

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
  affectedArea: number;
  evacuationRequired: boolean;
  casualties?: number;
  description: string;
}

interface SatelliteMapProps {
  events: DisasterEvent[];
  selectedEvent: DisasterEvent | null;
  onEventSelect: (event: DisasterEvent) => void;
  className?: string;
}

export const SatelliteMap: React.FC<SatelliteMapProps> = ({
  events,
  selectedEvent,
  onEventSelect,
  className = ""
}) => {
  const [mapCenter, setMapCenter] = useState<[number, number]>([40.7128, -74.0060]);
  const [mapZoom, setMapZoom] = useState(4);

  // Update map center when selected event changes
  useEffect(() => {
    if (selectedEvent) {
      setMapCenter([selectedEvent.location.lat, selectedEvent.location.lng]);
      setMapZoom(10);
    }
  }, [selectedEvent]);

  // Create custom icons for different disaster types and severities
  const createCustomIcon = (event: DisasterEvent) => {
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

    const isSelected = selectedEvent?.id === event.id;
    
    return new DivIcon({
      className: 'custom-disaster-marker',
      html: `
        <div class="relative flex items-center justify-center">
          ${event.severity === 'critical' ? `
            <div class="absolute inset-0 w-8 h-8 rounded-full border-2 border-red-500 marker-ping"></div>
          ` : ''}
          <div class="relative w-8 h-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-sm font-bold severity-${event.severity} ${isSelected ? 'ring-4 ring-blue-400 ring-opacity-50' : ''}" >
            ${getTypeIcon(event.type)}
          </div>
          ${event.evacuationRequired ? `
            <div class="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border border-white flex items-center justify-center">
              <div class="w-1 h-1 bg-white rounded-full"></div>
            </div>
          ` : ''}
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    });
  };

  // Get affected area circle color
  const getAffectedAreaColor = (severity: string) => {
    switch (severity) {
      case 'low': return '#10B981';
      case 'medium': return '#F59E0B';
      case 'high': return '#F97316';
      case 'critical': return '#EF4444';
      default: return '#6B7280';
    }
  };

  return (
    <div className={`relative w-full h-full rounded-lg overflow-hidden ${className}`}>
      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        className="w-full h-full z-0"
        zoomControl={true}
        scrollWheelZoom={true}
        doubleClickZoom={true}
        touchZoom={true}
      >
        <LayersControl position="topright">
          {/* Satellite Layer */}
          <LayersControl.BaseLayer checked name="🛰️ Satellite View">
            <TileLayer
              attribution='&copy; <a href="https://www.esri.com/">Esri</a> &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              maxZoom={19}
            />
          </LayersControl.BaseLayer>

          {/* Street Map Layer */}
          <LayersControl.BaseLayer name="🗺️ Street Map">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              maxZoom={19}
            />
          </LayersControl.BaseLayer>

          {/* Terrain Layer */}
          <LayersControl.BaseLayer name="🏔️ Terrain">
            <TileLayer
              attribution='&copy; <a href="https://www.opentopomap.org">OpenTopoMap</a> (CC-BY-SA)'
              url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
              maxZoom={17}
            />
          </LayersControl.BaseLayer>

          {/* Dark Theme Layer */}
          <LayersControl.BaseLayer name="🌙 Dark Theme">
            <TileLayer
              attribution='&copy; <a href="https://cartodb.com/attributions">CartoDB</a>'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              maxZoom={19}
            />
          </LayersControl.BaseLayer>
        </LayersControl>

        {/* Disaster Event Markers */}
        {events.map((event) => (
          <React.Fragment key={event.id}>
            {/* Affected Area Circle */}
            <CircleMarker
              center={[event.location.lat, event.location.lng]}
              radius={Math.max(event.affectedArea / 2, 10)}
              pathOptions={{
                color: getAffectedAreaColor(event.severity),
                weight: 2,
                opacity: 0.7,
                fillColor: getAffectedAreaColor(event.severity),
                fillOpacity: 0.2,
              }}
            />
            
            {/* Event Marker */}
            <Marker
              position={[event.location.lat, event.location.lng]}
              icon={createCustomIcon(event)}
              eventHandlers={{
                click: () => {
                  onEventSelect(event);
                },
              }}
            >
              <Popup className="disaster-popup" minWidth={300}>
                <div className="p-3 bg-slate-800 text-white rounded-lg border-2 border-slate-600">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-xl">{event.type === 'earthquake' ? '🌋' : 
                                                  event.type === 'flood' ? '🌊' : 
                                                  event.type === 'fire' ? '🔥' : 
                                                  event.type === 'storm' ? '⛈️' : '🚨'}</span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        event.severity === 'low' ? 'bg-green-500 text-white' :
                        event.severity === 'medium' ? 'bg-yellow-500 text-black' :
                        event.severity === 'high' ? 'bg-orange-500 text-white' :
                        'bg-red-500 text-white'
                      }`}>
                        {event.severity.toUpperCase()}
                      </span>
                    </div>
                    {event.evacuationRequired && (
                      <div className="flex items-center text-red-400">
                        <Shield className="h-4 w-4 mr-1" />
                        <span className="text-xs font-medium">EVACUATION</span>
                      </div>
                    )}
                  </div>
                  
                  <h3 className="font-bold text-lg mb-2 text-white">{event.title}</h3>
                  <p className="text-gray-300 text-sm mb-3">{event.description}</p>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center text-gray-400">
                      <MapPin className="h-3 w-3 mr-2" />
                      <span>{event.location.address}</span>
                    </div>
                    <div className="flex items-center text-gray-400">
                      <Zap className="h-3 w-3 mr-2" />
                      <span>Affected Area: {event.affectedArea} km²</span>
                    </div>
                    {event.casualties && (
                      <div className="flex items-center text-red-400">
                        <span className="mr-2">⚕️</span>
                        <span>Casualties: {event.casualties}</span>
                      </div>
                    )}
                    <div className="text-xs text-gray-500 mt-2">
                      {new Date(event.timestamp).toLocaleString()}
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-3 border-t border-slate-600">
                    <button
                      onClick={() => {
                        // Navigation functionality
                        if (navigator.geolocation) {
                          navigator.geolocation.getCurrentPosition((position) => {
                            const { latitude, longitude } = position.coords;
                            const googleMapsUrl = `https://www.google.com/maps/dir/${latitude},${longitude}/${event.location.lat},${event.location.lng}`;
                            window.open(googleMapsUrl, '_blank');
                          });
                        } else {
                          const googleMapsUrl = `https://www.google.com/maps/search/${event.location.lat},${event.location.lng}`;
                          window.open(googleMapsUrl, '_blank');
                        }
                      }}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
                    >
                      <Navigation2 className="h-4 w-4 mr-2" />
                      Navigate to Event
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          </React.Fragment>
        ))}
      </MapContainer>

      {/* Custom Map Legend */}
      <div className="absolute bottom-4 left-4 bg-slate-800/90 backdrop-blur-sm rounded-lg p-3 text-xs text-white border border-slate-600 z-[1000]">
        <div className="font-medium mb-2">🗺️ Disaster Severity</div>
        <div className="space-y-1">
          {[
            { level: 'Critical', color: '#EF4444', icon: '🚨' },
            { level: 'High', color: '#F97316', icon: '⚠️' },
            { level: 'Medium', color: '#F59E0B', icon: '🔶' },
            { level: 'Low', color: '#10B981', icon: '🟢' }
          ].map((item) => (
            <div key={item.level} className="flex items-center space-x-2">
              <div 
                className={`w-3 h-3 rounded-full border border-white severity-${item.level.toLowerCase()}`}
              ></div>
              <span className="text-gray-300">{item.icon} {item.level}</span>
            </div>
          ))}
        </div>
        <div className="mt-3 pt-2 border-t border-slate-600">
          <div className="flex items-center space-x-2">
            <Shield className="w-3 h-3 text-red-400" />
            <span className="text-gray-300">Evacuation Required</span>
          </div>
        </div>
      </div>

      {/* Active Events Counter */}
      <div className="absolute top-4 left-4 bg-slate-800/90 backdrop-blur-sm rounded-lg p-3 border border-slate-600 z-[1000]">
        <div className="flex items-center space-x-2 text-white">
          <MapPin className="w-4 h-4 text-blue-400" />
          <span className="text-sm font-medium">
            {events.length} Active Events
          </span>
        </div>
        <div className="text-xs text-gray-400 mt-1">
          🛰️ Satellite View Active
        </div>
      </div>
    </div>
  );
};
