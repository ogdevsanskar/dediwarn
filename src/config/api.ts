// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || (import.meta.env.DEV ? '' : 'https://disaster-management-backend.onrender.com'),
  WS_URL: import.meta.env.VITE_WS_URL || (import.meta.env.DEV ? 'ws://localhost:5173' : 'wss://disaster-management-backend.onrender.com'),
  ENDPOINTS: {
    AI_CHAT: '/api/ai/chat',
    EMERGENCY_REPORTS: '/api/emergency-reports',
    ENVIRONMENTAL_DATA: '/api/environmental-data',
    NOTIFICATIONS: '/api/subscribe-notifications',
    WEATHER_ALERTS: '/api/weather-alerts',
    SEISMIC_DATA: '/api/seismic-data',
    TRANSLATE: '/api/translate',
    STATUS: '/api/status'
  }
};

// Helper function to get full API URL
export const getApiUrl = (endpoint: string) => `${API_CONFIG.BASE_URL}${endpoint}`;

// Helper function to get WebSocket URL
export const getWsUrl = (path: string) => `${API_CONFIG.WS_URL}${path}`;
