import React, { useState, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import L from 'leaflet';
import { getRouteFromWindhoek, formatDistance, formatDuration } from '../../services/routingService';
import type { RouteData } from '../../services/routingService';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.5 0C5.6 0 0 5.6 0 12.5C0 19.4 12.5 41 12.5 41S25 19.4 25 12.5C25 5.6 19.4 0 12.5 0Z" fill="#C19A6B"/>
      <circle cx="12.5" cy="12.5" r="6" fill="white"/>
      <path d="M12.5 6.5L15.5 12.5L12.5 18.5L9.5 12.5Z" fill="#C19A6B"/>
    </svg>
  `),
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.5 0C5.6 0 0 5.6 0 12.5C0 19.4 12.5 41 12.5 41S25 19.4 25 12.5C25 5.6 19.4 0 12.5 0Z" fill="#C19A6B"/>
      <circle cx="12.5" cy="12.5" r="6" fill="white"/>
      <path d="M12.5 6.5L15.5 12.5L12.5 18.5L9.5 12.5Z" fill="#C19A6B"/>
    </svg>
  `),
  shadowUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg width="41" height="41" viewBox="0 0 41 41" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="20.5" cy="37" rx="18" ry="4" fill="rgba(0,0,0,0.3)"/>
    </svg>
  `),
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Custom Windhoek marker icon
const windhoekIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.5 0C5.6 0 0 5.6 0 12.5C0 19.4 12.5 41 12.5 41S25 19.4 25 12.5C25 5.6 19.4 0 12.5 0Z" fill="#2563eb"/>
      <circle cx="12.5" cy="12.5" r="6" fill="white"/>
      <circle cx="12.5" cy="12.5" r="3" fill="#2563eb"/>
    </svg>
  `),
  iconRetinaUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.5 0C5.6 0 0 5.6 0 12.5C0 19.4 12.5 41 12.5 41S25 19.4 25 12.5C25 5.6 19.4 0 12.5 0Z" fill="#2563eb"/>
      <circle cx="12.5" cy="12.5" r="6" fill="white"/>
      <circle cx="12.5" cy="12.5" r="3" fill="#2563eb"/>
    </svg>
  `),
  shadowUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg width="41" height="41" viewBox="0 0 41 41" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="20.5" cy="37" rx="18" ry="4" fill="rgba(0,0,0,0.3)"/>
    </svg>
  `),
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface MapZoomControllerProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
}

const MapZoomController: React.FC<MapZoomControllerProps> = ({ onZoomIn, onZoomOut }) => {
  const map = useMap();
  
  useEffect(() => {
    const handleZoomIn = () => map.zoomIn();
    const handleZoomOut = () => map.zoomOut();
    
    onZoomIn = handleZoomIn;
    onZoomOut = handleZoomOut;
  }, [map, onZoomIn, onZoomOut]);

  return null;
};

interface InteractiveMapProps {
  latitude: number;
  longitude: number;
  farmName: string;
}

const InteractiveMap: React.FC<InteractiveMapProps> = ({ latitude, longitude, farmName }) => {
  const [currentZoom, setCurrentZoom] = useState(7); // Wider zoom to show both cities
  const [mapStyle, setMapStyle] = useState<'street' | 'dark'>('dark');
  const [routeData, setRouteData] = useState<RouteData | null>(null);
  const [loadingRoute, setLoadingRoute] = useState(true);
  const mapRef = useRef<L.Map | null>(null);

  const farmPosition: [number, number] = [latitude, longitude];
  
  // Center point between Windhoek and Farm Aris for better view
  const centerPosition: [number, number] = [(-22.5609 + latitude) / 2, (17.0658 + longitude) / 2];

  // Windhoek coordinates
  const windhoekPosition: [number, number] = [-22.5609, 17.0658];

  // Different tile layer configurations
  const tileLayerConfigs = {
    street: {
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '© OpenStreetMap contributors'
    },
    dark: {
      url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
      attribution: '© CartoDB'
    }
  };

  const handleZoomIn = () => {
    if (mapRef.current) {
      mapRef.current.zoomIn();
      setCurrentZoom(prev => Math.min(18, prev + 1));
    }
  };

  const handleZoomOut = () => {
    if (mapRef.current) {
      mapRef.current.zoomOut();
      setCurrentZoom(prev => Math.max(10, prev - 1));
    }
  };

  const openInGoogleMaps = () => {
    window.open(`https://maps.google.com/?q=${latitude},${longitude}`, '_blank');
  };


  // Load route data on component mount
  useEffect(() => {
    const loadRoute = async () => {
      setLoadingRoute(true);
      const route = await getRouteFromWindhoek();
      setRouteData(route);
      setLoadingRoute(false);
    };
    
    loadRoute();
  }, []);

  const getDirections = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude: userLat, longitude: userLng } = position.coords;
        window.open(
          `https://maps.google.com/maps?saddr=${userLat},${userLng}&daddr=${latitude},${longitude}`,
          '_blank'
        );
      },
      () => {
        // Fallback if geolocation fails
        window.open(`https://maps.google.com/maps?daddr=${latitude},${longitude}`, '_blank');
      }
    );
  };

  return (
    <div className="relative w-full h-full rounded-3xl overflow-hidden">
      {/* Map Container */}
      <MapContainer
        center={centerPosition}
        zoom={currentZoom}
        ref={mapRef}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
        attributionControl={false}
        className="z-0"
      >
        <TileLayer
          url={tileLayerConfigs[mapStyle].url}
          attribution={tileLayerConfigs[mapStyle].attribution}
        />
        
        {/* Professional Road Route from Windhoek to Farm Aris */}
        {routeData && !loadingRoute && (
          <Polyline
            positions={routeData.geometry}
            color="#2563eb"
            weight={5}
            opacity={0.9}
            smoothFactor={1}
          />
        )}
        
        {/* Loading indicator for route */}
        {loadingRoute && (
          <Polyline
            positions={[windhoekPosition, farmPosition]}
            color="#94a3b8"
            weight={3}
            opacity={0.5}
            dashArray="5, 10"
          />
        )}
        
        {/* Windhoek Marker */}
        <Marker position={windhoekPosition} icon={windhoekIcon}>
          <Popup className="custom-popup">
            <div className="p-3 min-w-[200px]">
              <h3 className="font-rubik font-bold text-lg text-gray-800 mb-2">
                🏛️ Windhoek
              </h3>
              <p className="text-gray-600 font-montserrat text-sm mb-2">
                📍 Capital of Namibia
              </p>
              <p className="text-gray-500 font-montserrat text-xs mb-3">
                GPS: {windhoekPosition[0].toFixed(6)}°S {Math.abs(windhoekPosition[1]).toFixed(6)}°E
              </p>
              <p className="text-blue-600 font-montserrat text-xs mb-2">
                Starting point for directions to Farm Aris
              </p>
              {routeData && (
                <div className="text-green-600 font-montserrat text-xs">
                  <p>📍 {formatDistance(routeData.totalDistance * 1000)} to Farm Aris</p>
                  <p>⏱️ {formatDuration(routeData.totalDuration)} driving time</p>
                </div>
              )}
            </div>
          </Popup>
        </Marker>
        
        {/* Farm Aris Marker */}
        <Marker position={farmPosition}>
          <Popup className="custom-popup">
            <div className="p-3 min-w-[200px]">
              <h3 className="font-rubik font-bold text-lg text-gray-800 mb-2">
                🏡 {farmName}
              </h3>
              <p className="text-gray-600 font-montserrat text-sm mb-2">
                📍 Grootfontein, Namibia
              </p>
              <p className="text-gray-500 font-montserrat text-xs mb-3">
                GPS: {latitude.toFixed(6)}°S {Math.abs(longitude).toFixed(6)}°E
              </p>
              <div className="flex gap-2">
                <button
                  onClick={getDirections}
                  className="px-3 py-1 bg-safari-khaki text-white text-xs rounded-full hover:bg-savanna-gold transition-colors"
                >
                  Get Directions
                </button>
              </div>
            </div>
          </Popup>
        </Marker>
      </MapContainer>

      {/* Light Modern Overlay */}
      <div className="absolute inset-0 pointer-events-none z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-black/5 via-transparent to-black/10"></div>
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/5"></div>
      </div>

      {/* Map Style Selector - Top Left */}
      <div className="absolute top-4 left-4 z-20">
        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-2 shadow-lg flex gap-1">
          {(['street', 'dark'] as const).map((style) => (
            <motion.button
              key={style}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setMapStyle(style)}
              className={`px-3 py-2 rounded-lg text-xs font-montserrat font-medium transition-all duration-300 ${
                mapStyle === style
                  ? 'bg-safari-khaki text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {style === 'street' ? '🗺️' : '🌙'} 
              {style.charAt(0).toUpperCase() + style.slice(1)}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Route Info - Top Right */}
      <div className="absolute top-4 right-4 z-20">
        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg max-w-xs">
          <h3 className="font-rubik font-bold text-lg text-gray-800 mb-2">
            🛣️ Route to {farmName}
          </h3>
          {loadingRoute ? (
            <div className="flex items-center gap-2 text-gray-600">
              <div className="animate-spin w-4 h-4 border-2 border-safari-khaki border-t-transparent rounded-full"></div>
              <span className="font-montserrat text-sm">Loading route...</span>
            </div>
          ) : routeData ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-blue-600">
                <Icon icon="solar:route-bold-duotone" className="text-lg" />
                <span className="font-montserrat font-semibold text-sm">
                  From Windhoek
                </span>
              </div>
              <div className="text-gray-700 font-montserrat text-sm space-y-1">
                <p>📍 Distance: {formatDistance(routeData.totalDistance * 1000)}</p>
                <p>⏱️ Duration: {formatDuration(routeData.totalDuration)}</p>
                <p>🛣️ Following main highways</p>
              </div>
            </div>
          ) : (
            <p className="text-gray-600 font-montserrat text-sm">
              Route unavailable
            </p>
          )}
          <div className="mt-3 pt-2 border-t border-gray-200">
            <p className="text-gray-500 font-montserrat text-xs">
              📍 {farmName}, Grootfontein
            </p>
          </div>
        </div>
      </div>

      {/* Custom Zoom Controls - Bottom Right */}
      <div className="absolute bottom-20 right-4 z-20 flex flex-col gap-2">
        <motion.button
          whileHover={{ scale: 1.1, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleZoomIn}
          className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg flex items-center justify-center hover:shadow-xl transition-all duration-300 border border-white/20"
        >
          <Icon icon="solar:add-circle-bold-duotone" className="text-safari-khaki text-xl" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleZoomOut}
          className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg flex items-center justify-center hover:shadow-xl transition-all duration-300 border border-white/20"
        >
          <Icon icon="solar:minus-circle-bold-duotone" className="text-safari-khaki text-xl" />
        </motion.button>
      </div>

      {/* Modern Action Buttons - Bottom Center */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex gap-4">
        <motion.button
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={openInGoogleMaps}
          className="px-6 py-3 bg-gray-100/95 backdrop-blur-md text-gray-700 rounded-xl font-montserrat font-semibold hover:bg-gray-200/95 transition-all duration-300 flex items-center gap-3 shadow-lg border border-gray-200/50"
        >
          <Icon icon="solar:map-bold-duotone" className="text-xl" />
          <span>Open in Google Maps</span>
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={getDirections}
          className="px-6 py-3 bg-gray-300/95 backdrop-blur-md text-gray-800 rounded-xl font-montserrat font-semibold hover:bg-gray-400/95 transition-all duration-300 flex items-center gap-3 shadow-lg border border-gray-300/50"
        >
          <Icon icon="solar:routing-2-bold-duotone" className="text-xl" />
          <span>Get Directions</span>
        </motion.button>
      </div>
    </div>
  );
};

export default InteractiveMap;