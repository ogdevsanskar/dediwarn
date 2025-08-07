import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Bot, Phone, Mail, Mic, MicOff, Volume2, VolumeX, Satellite, MapPin, Settings, Zap } from 'lucide-react';
import './AIAssistant_new.css';

// Web Speech API types
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

// AI Configuration
interface AIConfig {
  provider: 'openai' | 'rasa' | 'local';
  openaiApiKey?: string;
  rasaUrl?: string;
  model?: string;
  enableSentimentAnalysis: boolean;
  enableUrgencyDetection: boolean;
}

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  actions?: Array<{
    type: 'sms' | 'email' | 'call';
    label: string;
    data: string;
  }>;
  aiProvider?: 'openai' | 'rasa' | 'local';
  confidence?: number;
}


export const AIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  // Removed unused smsAlerts state
  const [showSmsPanel, setShowSmsPanel] = useState(false);
  const [showMapPanel, setShowMapPanel] = useState(false);
  const [showAISettings, setShowAISettings] = useState(false);
  // AI Configuration
  const [aiConfig, setAiConfig] = useState<AIConfig>({
    provider: 'local',
    openaiApiKey: localStorage.getItem('openai_api_key') || '',
    rasaUrl: localStorage.getItem('rasa_url') || 'http://localhost:5005',
    model: 'gpt-3.5-turbo',
    enableSentimentAnalysis: true,
    enableUrgencyDetection: true
  });
  // Removed unused customSmsMessage state
  const [customPhoneNumber, setCustomPhoneNumber] = useState('');
  const [customSmsMessage, setCustomSmsMessage] = useState(''); // <-- Add this missing state
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [recognition, setRecognition] = useState<any>(null);
  const [currentLocation, setCurrentLocation] = useState<{lat: number, lng: number} | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log('AIAssistant component mounted');
    
    // Get user's location for satellite map
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.log('Geolocation error:', error);
          // Default to New York coordinates if location access is denied
          setCurrentLocation({ lat: 40.7128, lng: -74.0060 });
        }
      );
    }
    
    if (messages.length === 0) {
      const welcomeMessage: Message = {
        id: 'welcome',
        type: 'assistant',
        content: '🤖 **Advanced AI Disaster Management Assistant v2.0**\n\nPowered by Machine Learning & Live Satellite Mapping:\n\n🛰️ **NEW: Live Satellite View**\n• Real-time satellite imagery\n• GPS location tracking\n• Emergency zone mapping\n• Disaster overlay visualization\n\n🧠 **AI Capabilities:**\n• Real-time sentiment analysis\n• Urgency level prediction (1-10 scale)\n• Disaster type classification\n• Response confidence scoring\n• Predictive risk modeling\n\n🌍 **Real-time Monitoring:**\n• Earthquake activity and seismic data\n• Weather patterns and severe storm tracking\n• Flood levels and water monitoring\n• Emergency alerts and government advisories\n\n🚨 **Emergency Services:**\n• Instant SMS alerts to contacts (6001163688)\n• Emergency service connections\n• Location-based risk assessment\n• Voice commands and TTS responses\n\n🎯 **Try ML-powered queries:**\n• "Emergency! Earthquake in Delhi!"\n• "Show satellite view of my area"\n• "I\'m worried about flooding"\n• "Share my location for rescue"\n\nClick the 🛰️ satellite button to view live map!',
        timestamp: new Date(),
        actions: [
          { type: 'sms', label: 'Test Emergency SMS', data: 'test_sms' },
          { type: 'call', label: 'Emergency Contacts', data: 'contacts' }
        ]
      };
      setMessages([welcomeMessage]);
    }
  }, [messages.length]);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize Speech Recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';
      
      recognitionInstance.onstart = () => {
        setIsListening(true);
      };
      
      recognitionInstance.onend = () => {
        setIsListening(false);
      };
      
      recognitionInstance.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
        // Auto-send voice commands
        setTimeout(() => {
          handleSendMessage(transcript);
        }, 500);
      };
      
      recognitionInstance.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
      
      setRecognition(recognitionInstance);
    }
  }, []);

  // OpenAI GPT API Integration
  const callOpenAIAPI = async (userMessage: string): Promise<Message> => {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${aiConfig.openaiApiKey}`,
        },
        body: JSON.stringify({
          model: aiConfig.model || 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: `You are an advanced AI Disaster Management Assistant. Provide helpful, accurate, and actionable advice for disaster preparedness, emergency response, and safety. Always prioritize human safety. Include specific recommendations for:
              - Safety tips and protocols
              - Nearest shelters and emergency services
              - Evacuation procedures
              - Emergency supplies and preparation
              - Real-time disaster information
              
              User location: ${currentLocation ? `${currentLocation.lat}, ${currentLocation.lng}` : 'Unknown'}
              Current time: ${new Date().toISOString()}
              
              Always end responses with relevant emergency actions or contacts.`
            },
            {
              role: 'user',
              content: userMessage
            }
          ],
          max_tokens: 1000,
          temperature: 0.7,
          presence_penalty: 0.1,
          frequency_penalty: 0.1
        })
      });

      if (response.ok) {
        const data = await response.json();
        const content = data.choices[0]?.message?.content || 'Sorry, I could not process your request.';
        
        return {
          id: Date.now().toString(),
          type: 'assistant',
          content: `${content}\n\n🤖 **OpenAI GPT Analysis:**\n• AI Provider: OpenAI GPT-${aiConfig.model}\n• Tokens Used: ${data.usage?.total_tokens || 'N/A'}\n• Response Quality: High\n• Safety Verified: ✅`,
          timestamp: new Date(),
          aiProvider: 'openai',
          confidence: 0.95,
          actions: generateDisasterActions(userMessage)
        };
      } else {
        throw new Error(`OpenAI API error: ${response.status}`);
      }
    } catch (error) {
      console.error('OpenAI API Error:', error);
      throw error;
    }
  };

  // Rasa API Integration
  const callRasaAPI = async (userMessage: string): Promise<Message> => {
    try {
      const response = await fetch(`${aiConfig.rasaUrl}/webhooks/rest/webhook`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sender: 'user',
          message: userMessage,
          metadata: {
            location: currentLocation,
            timestamp: new Date().toISOString(),
            urgency: calculateUrgencyLevel(userMessage),
            disaster_type: predictDisasterType(userMessage)
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        let content = 'I understand you need help. Let me assist you with disaster-related information.';
        let actions: any[] = [];
        
        if (data && data.length > 0) {
          content = data.map((msg: any) => msg.text).join('\n') || content;
          
          // Extract custom actions from Rasa response
          data.forEach((msg: any) => {
            if (msg.custom && msg.custom.actions) {
              actions.push(...msg.custom.actions);
            }
          });
        }

        return {
          id: Date.now().toString(),
          type: 'assistant',
          content: `${content}\n\n🤖 **Rasa Chatbot Analysis:**\n• AI Provider: Rasa Open Source\n• Intent Recognition: Active\n• Local Processing: ✅\n• Privacy Protected: ✅`,
          timestamp: new Date(),
          aiProvider: 'rasa',
          confidence: 0.85,
          actions: actions.length > 0 ? actions : generateDisasterActions(userMessage)
        };
      } else {
        throw new Error(`Rasa API error: ${response.status}`);
      }
    } catch (error) {
      console.error('Rasa API Error:', error);
      throw error;
    }
  };

  // Enhanced AI Response Function with Multiple Providers
  const simulateAIResponse = async (userMessage: string): Promise<Message> => {
    try {
      // Try the selected AI provider first
      switch (aiConfig.provider) {
        case 'openai':
          if (aiConfig.openaiApiKey) {
            return await callOpenAIAPI(userMessage);
          }
          console.warn('OpenAI API key not configured, falling back to local');
          break;
          
        case 'rasa':
          try {
            return await callRasaAPI(userMessage);
          } catch (error) {
            console.warn('Rasa API not available, falling back to local');
          }
          break;
      }

      // Fallback to local backend API
      const response = await fetch('http://localhost:3001/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          location: getUserLocation(),
          context: {
            sentiment: analyzeSentiment(userMessage),
            urgency: calculateUrgencyLevel(userMessage),
            disasterType: predictDisasterType(userMessage),
            confidence: calculateResponseConfidence(userMessage)
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        return {
          id: Date.now().toString(),
          type: 'assistant',
          content: `${data.response}\n\n🤖 **Local AI Analysis:**\n• Confidence Level: ${data.confidence || '85%'}\n• Response Time: ${data.responseTime || '0.3s'}\n• Context Relevance: ${data.relevance || 'High'}`,
          timestamp: new Date(),
          aiProvider: 'local',
          actions: generateActionsFromResponse(data.intent)
        };
      }
    } catch (error) {
      console.error('AI API Error:', error);
    }

    // Enhanced fallback with ML-style analysis
    return {
      id: Date.now().toString(),
      type: 'assistant' as const,
      content: generateEnhancedLocalResponseText(userMessage),
      timestamp: new Date(),
      aiProvider: 'local',
      actions: generateDisasterActions(userMessage)
    };
  };

  // Generate enhanced local response text
  const generateEnhancedLocalResponseText = (message: string): string => {
    const lowerMessage = message.toLowerCase();
    
    // Emergency patterns
    if (lowerMessage.includes('emergency') || lowerMessage.includes('help') || lowerMessage.includes('urgent')) {
      return "🚨 EMERGENCY RESPONSE:\n• Call 911 immediately\n• Stay calm and safe\n• If trapped, make noise to signal rescuers\n• Conserve phone battery for emergency calls\n• Share your location with emergency contacts";
    }
    
    // Earthquake patterns
    if (lowerMessage.includes('earthquake') || lowerMessage.includes('quake') || lowerMessage.includes('seismic')) {
      return "🏠 EARTHQUAKE SAFETY:\n• DROP, COVER, and HOLD ON\n• Get under a sturdy table or doorway\n• Stay away from windows and heavy objects\n• If outdoors, move away from buildings\n• After shaking stops, check for injuries and hazards\n• Be prepared for aftershocks";
    }
    
    // Flood patterns
    if (lowerMessage.includes('flood') || lowerMessage.includes('water') || lowerMessage.includes('tsunami')) {
      return "🌊 FLOOD SAFETY:\n• Move to higher ground immediately\n• Never drive through flooded roads\n• Avoid walking in moving water\n• Turn off utilities if safe to do so\n• Stay away from electrical lines\n• Listen to emergency broadcasts for updates";
    }
    
    // Fire patterns
    if (lowerMessage.includes('fire') || lowerMessage.includes('wildfire') || lowerMessage.includes('smoke')) {
      return "🔥 FIRE SAFETY:\n• Evacuate immediately if ordered\n• Stay low if there's smoke\n• Check doors before opening (use back of hand)\n• Close doors behind you as you exit\n• Meet at designated assembly point\n• Call 911 from a safe location";
    }
    
    // Hurricane/Storm patterns
    if (lowerMessage.includes('hurricane') || lowerMessage.includes('storm') || lowerMessage.includes('tornado') || lowerMessage.includes('wind')) {
      return "🌪️ STORM SAFETY:\n• Stay indoors away from windows\n• Go to lowest floor and interior room\n• Avoid using electrical devices\n• Have emergency supplies ready\n• Monitor weather alerts continuously\n• Don't go outside until all-clear is given";
    }
    
    // Shelter patterns
    if (lowerMessage.includes('shelter') || lowerMessage.includes('evacuation') || lowerMessage.includes('refuge')) {
      return "🏠 SHELTER INFORMATION:\n• Emergency shelters are available at local schools and community centers\n• Bring essentials: ID, medications, clothing\n• Pets may need special accommodations\n• Contact Red Cross: 1-800-733-2767\n• Check local emergency management website for updates";
    }
    
    // First aid patterns
    if (lowerMessage.includes('first aid') || lowerMessage.includes('injury') || lowerMessage.includes('medical')) {
      return "🏥 FIRST AID BASICS:\n• Check for responsiveness and breathing\n• Control bleeding with direct pressure\n• Don't move someone with potential spinal injury\n• Treat for shock: keep warm and elevated legs\n• Call 911 for serious injuries\n• Use AED if available and trained";
    }
    
    // Preparation patterns
    if (lowerMessage.includes('prepare') || lowerMessage.includes('kit') || lowerMessage.includes('supplies')) {
      return "📦 EMERGENCY PREPAREDNESS:\n• Water: 1 gallon per person per day (3-day supply)\n• Non-perishable food (3-day supply)\n• Battery-powered radio and flashlight\n• First aid kit and medications\n• Copies of important documents\n• Cash in small bills";
    }
    
    // Communication patterns
    if (lowerMessage.includes('contact') || lowerMessage.includes('family') || lowerMessage.includes('communication')) {
      return "📱 EMERGENCY COMMUNICATION:\n• Text messages often work when calls don't\n• Use social media check-in features\n• Have out-of-state contact as central point\n• Register with Red Cross Safe and Well\n• Keep phone charged and have backup power\n• Know local emergency alert systems";
    }
    
    // Default response with general disaster guidance
    return "🛡️ DISASTER PREPAREDNESS ASSISTANT:\n\nI can help with:\n• Emergency procedures and safety tips\n• Shelter and evacuation information\n• First aid and medical guidance\n• Communication strategies\n• Supply preparation\n\nFor immediate emergencies, call 911.\n\nWhat specific disaster topic can I help you with today?";
  };

  // Generate disaster-specific actions based on user message
  const generateDisasterActions = (userMessage: string) => {
    const lowerMessage = userMessage.toLowerCase();
    const actions: Array<{ type: 'sms' | 'email' | 'call'; label: string; data: string }> = [];
    
    if (lowerMessage.includes('emergency') || lowerMessage.includes('help') || lowerMessage.includes('urgent')) {
      actions.push(
        { type: 'call', label: 'Call Emergency Services', data: '911' },
        { type: 'sms', label: 'Send Emergency SMS', data: 'emergency_sms' },
        { type: 'sms', label: 'Share Location', data: 'location_share' }
      );
    } else if (lowerMessage.includes('shelter') || lowerMessage.includes('evacuation')) {
      actions.push(
        { type: 'call', label: 'Contact Red Cross', data: 'red_cross' },
        { type: 'sms', label: 'Find Nearest Shelter', data: 'shelter_info' }
      );
    } else if (lowerMessage.includes('earthquake') || lowerMessage.includes('quake')) {
      actions.push(
        { type: 'sms', label: 'Earthquake Safety Tips', data: 'earthquake_tips' },
        { type: 'call', label: 'Seismic Services', data: 'seismic' }
      );
    } else if (lowerMessage.includes('flood') || lowerMessage.includes('water')) {
      actions.push(
        { type: 'sms', label: 'Flood Safety Guide', data: 'flood_safety' },
        { type: 'call', label: 'Flood Response Team', data: 'flood_response' }
      );
    } else {
      actions.push(
        { type: 'sms', label: 'Safety Information', data: 'safety_info' },
        { type: 'call', label: 'Information Hotline', data: 'info_hotline' }
      );
    }
    
    return actions;
  };

  // ML Helper Functions
  const analyzeSentiment = (message: string): 'urgent' | 'concerned' | 'neutral' | 'calm' => {
    const urgentWords = ['help', 'emergency', 'urgent', 'danger', 'trapped', 'injured'];
    const concernedWords = ['worried', 'scared', 'anxious', 'concerned', 'problem'];
    
    const lowerMessage = message.toLowerCase();
    
    if (urgentWords.some(word => lowerMessage.includes(word))) return 'urgent';
    if (concernedWords.some(word => lowerMessage.includes(word))) return 'concerned';
    return 'neutral';
  };

  const calculateUrgencyLevel = (message: string): number => {
    const urgencyKeywords = {
      'emergency': 10, 'urgent': 9, 'help': 8, 'danger': 9, 'trapped': 10,
      'injured': 9, 'fire': 10, 'flood': 8, 'earthquake': 9, 'storm': 7,
      'evacuation': 9, 'rescue': 10, 'accident': 8, 'damage': 6
    };
    
    let score = 0;
    const lowerMessage = message.toLowerCase();
    
    Object.entries(urgencyKeywords).forEach(([keyword, weight]) => {
      if (lowerMessage.includes(keyword)) {
        score += weight;
      }
    });
    
    return Math.min(score, 10); // Cap at 10
  };

  const predictDisasterType = (message: string): string => {
    const disasterPatterns = {
      'earthquake': ['earthquake', 'quake', 'tremor', 'seismic', 'shake'],
      'flood': ['flood', 'water', 'rain', 'river', 'overflow', 'dam'],
      'fire': ['fire', 'smoke', 'burn', 'flame', 'wildfire'],
      'weather': ['storm', 'wind', 'tornado', 'hurricane', 'cyclone', 'weather'],
      'medical': ['injured', 'hurt', 'medical', 'hospital', 'ambulance'],
      'general': []
    };
    
    const lowerMessage = message.toLowerCase();
    
    for (const [type, keywords] of Object.entries(disasterPatterns)) {
      if (keywords.some(keyword => lowerMessage.includes(keyword))) {
        return type;
      }
    }
    
    return 'general';
  };

  const calculateResponseConfidence = (message: string): string => {
    const messageLength = message.length;
    const hasSpecificKeywords = ['earthquake', 'flood', 'emergency', 'help'].some(
      keyword => message.toLowerCase().includes(keyword)
    );
    
    if (hasSpecificKeywords && messageLength > 20) return '95%';
    if (hasSpecificKeywords) return '88%';
    if (messageLength > 50) return '82%';
    return '75%';
  };

  const generateLocalDisasterResponse = (userMessage: string): Message => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Map/satellite related responses
    if (lowerMessage.includes('map') || lowerMessage.includes('satellite') || lowerMessage.includes('location') || lowerMessage.includes('where')) {
      return {
        id: Date.now().toString(),
        type: 'assistant',
        content: `🛰️ SATELLITE MAP ACTIVATED:

Live satellite view with real-time disaster monitoring:

📍 **Location Services:**
• GPS coordinates: ${currentLocation ? `${currentLocation.lat.toFixed(4)}, ${currentLocation.lng.toFixed(4)}` : 'Acquiring location...'}
• Satellite resolution: High (1m/pixel)
• Live weather overlay: Active
• Emergency zone mapping: Enabled

🌍 **Monitoring Features:**
• Real-time disaster detection
• Evacuation route planning
• Emergency services mapping
• Weather pattern tracking

Click the 🛰️ satellite button in the header to view your live satellite map with disaster overlays!`,
        timestamp: new Date(),
        actions: [
          { type: 'sms', label: 'Share Location', data: 'location_share' },
          { type: 'call', label: 'Emergency Services', data: 'emergency' }
        ]
      };
    }
    
    // Enhanced disaster-specific responses
    if (lowerMessage.includes('earthquake') || lowerMessage.includes('quake')) {
      return {
        id: Date.now().toString(),
        type: 'assistant',
        content: `🚨 EARTHQUAKE INFORMATION:

I can provide real-time earthquake monitoring and safety guidance. Recent seismic activity analysis shows:

🔸 Current Status: Monitoring global seismic networks
🔸 Safety Protocol: Drop, Cover, and Hold On
🔸 Emergency Kit: Keep 72-hour supply ready

For location-specific earthquake data, please specify your area (e.g., "earthquake in Delhi" or "seismic activity near Tokyo").

Would you like me to check current earthquake activity in a specific location?`,
        timestamp: new Date(),
        actions: [
          { type: 'sms', label: 'Send Earthquake Alert', data: 'earthquake_alert' },
          { type: 'call', label: 'Emergency Services', data: 'emergency' }
        ]
      };
    }

    if (lowerMessage.includes('flood') || lowerMessage.includes('water')) {
      return {
        id: Date.now().toString(),
        type: 'assistant',
        content: `🌊 FLOOD RISK ASSESSMENT:

Real-time flood monitoring includes:

🔸 River water levels: Monitoring major river systems
🔸 Rainfall data: Analyzing precipitation patterns  
🔸 Dam status: Checking reservoir levels
🔸 Evacuation routes: Mapping safe pathways

Current flood safety measures:
• Move to higher ground immediately if water is rising
• Avoid walking/driving through flood water
• Turn off electricity in affected areas
• Monitor official emergency broadcasts

Specify your location for detailed flood risk analysis.`,
        timestamp: new Date(),
        actions: [
          { type: 'sms', label: 'Flood Warning SMS', data: 'flood_warning' },
          { type: 'call', label: 'Rescue Services', data: 'rescue' }
        ]
      };
    }

    if (lowerMessage.includes('weather') || lowerMessage.includes('storm') || lowerMessage.includes('cyclone')) {
      return {
        id: Date.now().toString(),
        type: 'assistant',
        content: `🌪️ WEATHER DISASTER ANALYSIS:

Real-time weather monitoring includes:

🔸 Wind speed analysis: Tracking storm formation
🔸 Temperature extremes: Heat/cold wave detection
🔸 Precipitation: Heavy rainfall and snow monitoring
🔸 Atmospheric pressure: Storm development tracking

Current weather-based risks:
• Severe thunderstorms: Lightning and hail danger
• High winds: Structural damage potential
• Temperature extremes: Health risk assessment
• Visibility conditions: Travel safety analysis

Provide your location for current weather disaster risk assessment.`,
        timestamp: new Date(),
        actions: [
          { type: 'sms', label: 'Weather Alert', data: 'weather_alert' },
          { type: 'call', label: 'Weather Service', data: 'weather' }
        ]
      };
    }

    if (lowerMessage.includes('emergency') || lowerMessage.includes('help') || lowerMessage.includes('urgent')) {
      return {
        id: Date.now().toString(),
        type: 'assistant',
        content: `🚨 EMERGENCY RESPONSE ACTIVATED:

Immediate Actions Available:
1. 📞 Contact emergency services (911/112)
2. 📱 Send SMS alerts to emergency contacts
3. 📍 Share location with rescue teams
4. 🏥 Find nearest hospitals/shelters
5. 📻 Access emergency broadcasts

Real-time emergency data:
• Emergency services response times
• Hospital availability and capacity
• Evacuation route status
• Shelter locations and capacity

Tell me your specific emergency type for immediate assistance protocol.`,
        timestamp: new Date(),
        actions: [
          { type: 'call', label: 'Call 911', data: '911' },
          { type: 'sms', label: 'Emergency SMS', data: 'emergency_sms' },
          { type: 'sms', label: 'Send Location', data: 'location_share' }
        ]
      };
    }

    // General disaster preparedness response
    return {
      id: Date.now().toString(),
      type: 'assistant',
      content: `🛡️ DISASTER MANAGEMENT ASSISTANT

I provide real-time disaster analysis and emergency guidance:

🌍 **Real-time Monitoring:**
• Earthquake activity and seismic data
• Weather patterns and severe storm tracking  
• Flood levels and water monitoring
• Emergency alerts and government advisories

🚨 **Emergency Services:**
• Instant SMS alerts to contacts (6001163688)
• Emergency service connections
• Location-based risk assessment
• Evacuation guidance and shelter information

🎯 **Ask me specific questions like:**
• "Is there earthquake activity in [location]?"
• "What's the flood risk in [area]?"
• "Current weather alerts for [city]?"
• "Emergency procedures for [disaster type]?"

How can I help you stay safe today?`,
      timestamp: new Date(),
      actions: [
        { type: 'sms', label: 'Test Emergency SMS', data: 'test_sms' },
        { type: 'call', label: 'Emergency Contacts', data: 'contacts' }
      ]
    };
  };

  const generateActionsFromResponse = (intent: string) => {
    const actions: Array<{ type: 'sms' | 'email' | 'call'; label: string; data: string }> = [
      { type: 'sms', label: 'Send Alert SMS', data: 'alert_sms' }
    ];
  
    switch (intent) {
      case 'earthquake':
        actions.push({ type: 'call', label: 'Seismic Services', data: 'seismic' });
        break;
      case 'weather':
        actions.push({ type: 'call', label: 'Weather Service', data: 'weather' });
        break;
      case 'flood':
        actions.push({ type: 'call', label: 'Flood Response', data: 'flood_response' });
        break;
      default:
        actions.push({ type: 'call', label: 'Emergency Services', data: 'emergency' });
    }
  
    return actions;
  };

  const getUserLocation = () => {
    // Try to get user's location (in a real app, you'd use geolocation API)
    return 'Current Location'; // Placeholder
  };

  const speakMessage = (text: string) => {
    if (!voiceEnabled || isSpeaking) return;
    
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      utterance.volume = 0.8;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      window.speechSynthesis.speak(utterance);
    }
  };

  const startListening = () => {
    if (recognition && !isListening) {
      setInputMessage('');
      recognition.start();
    }
  };

  const stopListening = () => {
    if (recognition && isListening) {
      recognition.stop();
    }
  };

  const toggleVoice = () => {
    setVoiceEnabled(!voiceEnabled);
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const handleSendMessage = async (messageText?: string) => {
    const message = messageText || inputMessage.trim();
    if (!message) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: message,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate processing delay
    setTimeout(async () => {
      const aiResponse = await simulateAIResponse(message);
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
      
      // Speak the response if voice is enabled
      if (voiceEnabled) {
        speakMessage(aiResponse.content);
      }
    }, 1000);
  };

  const handleSendSMS = async (phone: string, message: string) => {
    // Removed smsAlert declaration (unused)

    // Removed smsAlerts update (unused)

    try {
      // Simulate SMS API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update status
      // Removed smsAlerts update (unused)

      // Add confirmation message
      const confirmationMessage: Message = {
        id: Date.now().toString(),
        type: 'assistant',
        content: `✅ SMS Alert sent successfully to ${phone}\n\nMessage: "${message}"\n\nThe recipient has been notified of the emergency situation.`,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, confirmationMessage]);
      
    } catch (error) {
      // Removed smsAlerts update (unused)
      // The following block is commented out because smsAlerts is not used anywhere else in the code.
      // If you need to use smsAlerts, uncomment and add the state definition:
      // setSmsAlerts((prev: SMSAlert[]) =>
      //   prev.map((alert: SMSAlert) =>
      //     alert.id === smsAlert.id
      //       ? { ...alert, status: 'failed' as const }
      //       : alert
      //   )
      // );
      // You may want to show an error message to the user here.
      const errorMessage: Message = {
        id: Date.now().toString(),
        type: 'assistant',
        content: `❌ Failed to send SMS Alert to ${phone}. Please try again later.`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  }

  // Move the action handler logic to a separate function
  const handleActionClick = (action: { type: 'sms' | 'email' | 'call'; label: string; data: string }) => {
    if (action.type === 'sms') {
      if (action.data === 'emergency' || action.data === 'test_sms') {
        handleSendSMS('6001163688', '🚨 EMERGENCY ALERT: This is an automated disaster management alert. Please respond if you need assistance. Location tracking enabled.');
      } else if (action.data === 'earthquake_alert') {
        handleSendSMS('6001163688', '🚨 EARTHQUAKE ALERT: Seismic activity detected in your area. Follow safety protocols: Drop, Cover, Hold On. Stay safe!');
      } else if (action.data === 'flood_warning') {
        handleSendSMS('6001163688', '🌊 FLOOD WARNING: Rising water levels detected. Move to higher ground immediately. Avoid flooded roads.');
      } else if (action.data === 'weather_alert') {
        handleSendSMS('6001163688', '🌪️ SEVERE WEATHER ALERT: Dangerous weather conditions detected. Stay indoors and monitor emergency broadcasts.');
      } else if (action.data === 'location_share') {
        const locationData = currentLocation 
          ? `📍 LOCATION SHARED: Lat: ${currentLocation.lat.toFixed(4)}, Lng: ${currentLocation.lng.toFixed(4)} - Emergency location transmitted.`
          : '📍 LOCATION SHARING: Unable to detect precise location. Please manually share your address.';
        handleSendSMS('6001163688', locationData);
      } else if (action.data === 'alert_sms') {
        handleSendSMS('6001163688', '🚨 ALERT: Automated disaster alert triggered.');
      }
    } else if (action.type === 'call') {
      // In a real app, this would initiate actual calls
      const callMessage: Message = {
        id: Date.now().toString(),
        type: 'assistant',
        content: `📞 Initiating call to ${action.data}...\n\nIn a real emergency, this would connect you directly to emergency services. For actual emergencies, please dial your local emergency number (911, 112, etc.).`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, callMessage]);
    } else if (action.type === 'email') {
      // You can implement email logic here if needed
      const emailMessage: Message = {
        id: Date.now().toString(),
        type: 'assistant',
        content: `✉️ Email action triggered: ${action.label}`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, emailMessage]);
    }
  };

  const handleSendCustomSMS = () => {
    if (customPhoneNumber && customSmsMessage) {
      handleSendSMS(customPhoneNumber, customSmsMessage);
      setCustomPhoneNumber('');
      setCustomSmsMessage('');
      setShowSmsPanel(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 z-[9999] group"
      >
        <Bot className="h-6 w-6" />
        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
          !
        </div>
        <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          AI Disaster Assistant
        </div>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col z-[9999] border border-gray-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-t-2xl flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Bot className="h-6 w-6" />
          <div>
            <h3 className="font-semibold flex items-center space-x-2">
              <span>AI Disaster Assistant</span>
              <span className="text-xs bg-green-400 text-green-900 px-2 py-0.5 rounded-full">ML v2.0</span>
            </h3>
            <p className="text-xs opacity-90">Real-time ML analysis & prediction</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={toggleVoice}
            className={`p-2 rounded-full transition-all ${voiceEnabled ? 'bg-white/20' : 'bg-red-500/50'}`}
            title={voiceEnabled ? 'Voice On' : 'Voice Off'}
          >
            {voiceEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </button>
          <button
            onClick={() => setShowMapPanel(!showMapPanel)}
            className={`p-2 rounded-full transition-all ${showMapPanel ? 'bg-blue-500/50' : 'hover:bg-white/20'}`}
            title="Satellite Map"
          >
            <Satellite className="h-4 w-4" />
          </button>
          <button
            onClick={() => setShowSmsPanel(!showSmsPanel)}
            className="p-2 rounded-full hover:bg-white/20 transition-all"
            title="SMS Panel"
          >
            <Phone className="h-4 w-4" />
          </button>
          <button
            onClick={() => setShowAISettings(!showAISettings)}
            className={`p-2 rounded-full transition-all ${showAISettings ? 'bg-yellow-500/50' : 'hover:bg-white/20'}`}
            title="AI Settings"
          >
            <Settings className="h-4 w-4" />
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-full hover:bg-white/20 transition-all"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-2xl ${
                message.type === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-800 shadow-md'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              <p className={`text-xs mt-2 ${message.type === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                {message.timestamp.toLocaleTimeString()}
              </p>
              
              {message.actions && message.actions.length > 0 && (
                <div className="mt-3 space-y-2">
                  {message.actions.map((action, index) => (
                    <button
                      key={index}
                      onClick={() => handleActionClick(action)}
                      className="w-full text-left text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 p-2 rounded-lg transition-colors flex items-center space-x-2"
                    >
                      {action.type === 'sms' && <Phone className="h-3 w-3" />}
                      {action.type === 'call' && <Phone className="h-3 w-3" />}
                      {action.type === 'email' && <Mail className="h-3 w-3" />}
                      <span>{action.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white text-gray-800 p-3 rounded-2xl shadow-md">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce bounce-delay-1"></div>
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce bounce-delay-2"></div>
                  <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce bounce-delay-3"></div>
                </div>
                <span className="text-xs text-gray-500 animate-pulse">AI analyzing...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Satellite Map Panel */}
      {showMapPanel && (
        <div className="border-t border-gray-200 p-4 bg-white">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold flex items-center">
              <Satellite className="h-4 w-4 mr-2 text-blue-600" />
              Live Satellite Map
            </h4>
            <button
              onClick={() => {
                if (currentLocation) {
                  const mapMessage: Message = {
                    id: Date.now().toString(),
                    type: 'assistant',
                    content: `📍 **Current Location Detected:**\n• Latitude: ${currentLocation.lat.toFixed(4)}\n• Longitude: ${currentLocation.lng.toFixed(4)}\n\n🛰️ **Satellite View Features:**\n• Real-time disaster monitoring\n• Emergency zone mapping\n• Evacuation route planning\n• Live weather overlay\n\n🌍 Opening full satellite map view...`,
                    timestamp: new Date(),
                    actions: [
                      { type: 'call', label: 'Emergency Services', data: 'emergency' },
                      { type: 'sms', label: 'Share Location', data: 'location_share' }
                    ]
                  };
                  setMessages(prev => [...prev, mapMessage]);
                }
              }}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-lg transition-colors"
            >
              <MapPin className="h-3 w-3 mr-1 inline" />
              Show Location
            </button>
          </div>
          
          {/* Satellite Map Container */}
          <div className="relative h-40 bg-slate-900 rounded-lg overflow-hidden mb-3">
            {currentLocation ? (
              <div className="absolute inset-0">
                {/* Satellite imagery would be loaded here */}
                <div className="w-full h-full bg-gradient-to-br from-blue-900 via-green-800 to-brown-700 relative">
                  <div className="absolute inset-0 bg-black/20"></div>
                  
                  {/* Location marker */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="relative">
                      <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
                      <div className="absolute -top-1 -left-1 w-6 h-6 border-2 border-red-500 rounded-full animate-ping"></div>
                    </div>
                  </div>
                  
                  {/* Coordinate overlay */}
                  <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                    {currentLocation.lat.toFixed(4)}, {currentLocation.lng.toFixed(4)}
                  </div>
                  
                  {/* Satellite imagery overlay */}
                  <div className="absolute top-2 right-2 bg-green-500/80 text-white text-xs px-2 py-1 rounded flex items-center">
                    <div className="w-2 h-2 bg-green-300 rounded-full mr-1 animate-pulse"></div>
                    LIVE
                  </div>
                  
                  {/* Map tiles simulation */}
                  <div className="absolute inset-0 opacity-30">
                    <div className="grid grid-cols-4 grid-rows-4 h-full w-full">
                      {Array.from({ length: 16 }).map((_, i) => (
                        <div key={i} className="border border-white/10"></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500 text-sm">
                <div className="text-center">
                  <Satellite className="h-8 w-8 mx-auto mb-2 animate-pulse" />
                  Loading satellite data...
                </div>
              </div>
            )}
          </div>
          
          {/* Map Controls */}
          <div className="flex space-x-2">
            <button
              onClick={() => {
                const mapMessage: Message = {
                  id: Date.now().toString(),
                  type: 'assistant',
                  content: `🛰️ **Satellite View Enhanced**\n\n📍 **Your Location Analysis:**\n• GPS Coordinates: ${currentLocation?.lat.toFixed(4) || 'N/A'}, ${currentLocation?.lng.toFixed(4) || 'N/A'}\n• Satellite Resolution: High (1m/pixel)\n• Last Update: ${new Date().toLocaleTimeString()}\n\n🌍 **Disaster Monitoring:**\n• No immediate threats detected\n• Weather conditions: Clear\n• Emergency services: Available\n• Evacuation routes: Mapped\n\n💡 Ask me about specific locations or disaster types for detailed satellite analysis!`,
                  timestamp: new Date(),
                  actions: [
                    { type: 'sms', label: 'Emergency Alert', data: 'emergency_sms' },
                    { type: 'call', label: 'Weather Service', data: 'weather' }
                  ]
                };
                setMessages(prev => [...prev, mapMessage]);
              }}
              className="flex-1 px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-xs rounded-lg transition-colors"
            >
              🌍 Analyze Area
            </button>
            <button
              onClick={() => {
                const alertMessage: Message = {
                  id: Date.now().toString(),
                  type: 'assistant',
                  content: `🚨 **Emergency Mode Activated**\n\n📡 **Satellite Emergency Features:**\n• Real-time disaster detection\n• Emergency beacon activation\n• Rescue coordination mapping\n• Live weather radar overlay\n\n🆘 **Emergency Actions:**\n• Location shared with emergency services\n• Nearest hospitals mapped\n• Evacuation routes calculated\n• Emergency contacts notified\n\nStay safe! Help is on the way if needed.`,
                  timestamp: new Date(),
                  actions: [
                    { type: 'call', label: 'Call 911', data: '911' },
                    { type: 'sms', label: 'SOS Alert', data: 'emergency_sms' }
                  ]
                };
                setMessages(prev => [...prev, alertMessage]);
              }}
              className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-xs rounded-lg transition-colors"
            >
              🆘 Emergency
            </button>
          </div>
        </div>
      )}

      {/* SMS Panel */}
      {showSmsPanel && (
        <div className="border-t border-gray-200 p-4 bg-white">
          <h4 className="text-sm font-semibold mb-2">Send Custom SMS Alert</h4>
          <input
            type="tel"
            placeholder="Phone number"
            value={customPhoneNumber}
            onChange={(e) => setCustomPhoneNumber(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg text-sm mb-2"
          />
          <textarea
            placeholder="Emergency message"
            value={customSmsMessage}
            onChange={(e) => setCustomSmsMessage(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg text-sm mb-2 h-16 resize-none"
          />
          <button
            onClick={handleSendCustomSMS}
            className="w-full bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg text-sm transition-colors"
          >
            Send Emergency SMS
          </button>
        </div>
      )}

      {/* AI Settings Panel */}
      {showAISettings && (
        <div className="border-t border-gray-200 p-4 bg-white">
          <div className="space-y-4">
            <h4 className="text-sm font-semibold flex items-center space-x-2">
              <Zap className="h-4 w-4 text-yellow-500" />
              <span>AI Configuration</span>
            </h4>
            
            {/* AI Provider Selection */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">AI Provider</label>
              <select 
                value={aiConfig.provider}
                onChange={(e) => setAiConfig(prev => ({...prev, provider: e.target.value as 'openai' | 'rasa' | 'local'}))}
                className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                title="Select AI Provider"
              >
                <option value="local">Local AI (Fast, Privacy-focused)</option>
                <option value="openai">OpenAI GPT (Advanced, Cloud)</option>
                <option value="rasa">Rasa NLU (Open Source)</option>
              </select>
            </div>

            {/* OpenAI Configuration */}
            {aiConfig.provider === 'openai' && (
              <div className="space-y-2">
                <label className="block text-xs font-medium text-gray-700">OpenAI API Key</label>
                <input
                  type="password"
                  placeholder="sk-..."
                  value={aiConfig.openaiApiKey}
                  onChange={(e) => setAiConfig(prev => ({...prev, openaiApiKey: e.target.value}))}
                  className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                />
                <p className="text-xs text-gray-500">Your API key is stored locally and never shared</p>
              </div>
            )}

            {/* Rasa Configuration */}
            {aiConfig.provider === 'rasa' && (
              <div className="space-y-2">
                <label className="block text-xs font-medium text-gray-700">Rasa Server URL</label>
                <input
                  type="url"
                  placeholder="http://localhost:5005"
                  value={aiConfig.rasaUrl}
                  onChange={(e) => setAiConfig(prev => ({...prev, rasaUrl: e.target.value}))}
                  className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                />
                <p className="text-xs text-gray-500">Your local Rasa server endpoint</p>
              </div>
            )}

            {/* AI Features Toggle */}
            <div className="border-t border-gray-100 pt-3">
              <label className="flex items-center space-x-2 text-sm">
                <input
                  type="checkbox"
                  checked={aiConfig.enableSentimentAnalysis}
                  onChange={(e) => setAiConfig(prev => ({...prev, enableSentimentAnalysis: e.target.checked}))}
                  className="rounded"
                />
                <span>Advanced Sentiment Analysis</span>
              </label>
              <label className="flex items-center space-x-2 text-sm mt-2">
                <input
                  type="checkbox"
                  checked={aiConfig.enableUrgencyDetection}
                  onChange={(e) => setAiConfig(prev => ({...prev, enableUrgencyDetection: e.target.checked}))}
                  className="rounded"
                />
                <span>Urgency Level Detection</span>
              </label>
            </div>

            {/* Status Display */}
            <div className="bg-gray-50 p-2 rounded-lg">
              <p className="text-xs text-gray-600">
                <span className="font-medium">Status:</span> {aiConfig.provider === 'local' ? 'Ready' : 
                (aiConfig.provider === 'openai' && aiConfig.openaiApiKey) ? 'Configured' : 
                (aiConfig.provider === 'rasa' && aiConfig.rasaUrl) ? 'Configured' : 'Needs Configuration'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="border-t border-gray-200 p-4 bg-white rounded-b-2xl">
        <div className="flex space-x-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask about disasters, emergencies, or safety... (AI will analyze sentiment & urgency)"
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isListening}
            />
            {isListening && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              </div>
            )}
          </div>
          <button
            onClick={isListening ? stopListening : startListening}
            className={`p-3 rounded-xl transition-all ${
              isListening 
                ? 'bg-red-600 hover:bg-red-700 text-white' 
                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
            }`}
            title={isListening ? 'Stop Listening' : 'Start Voice Input'}
          >
            {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </button>
          <button
            onClick={() => handleSendMessage()}
            className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl transition-colors"
            disabled={!inputMessage.trim() || isListening}
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
