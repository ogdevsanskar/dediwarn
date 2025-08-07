import { useState, useEffect, useRef } from 'react';
// import { X, Send, Bot, Phone, Mail, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';

const API_BASE_URL = import.meta.env.MODE === 'production' 
  ? 'https://your-production-api.com' 
  : 'http://localhost:3001';

export const ENDPOINTS = {
  // Disaster management endpoints
  EMERGENCY_ALERTS: '/api/alerts',
  INCIDENT_REPORTS: '/api/incidents',
  RESOURCE_REQUESTS: '/api/resources',
  AI_ASSISTANT: '/api/ai/chat',
  WEATHER_DATA: '/api/weather'
};

// Web Speech API types
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  actions?: Array<{
    type: 'sms' | 'call' | 'email';
    label: string;
    data: string;
  }>;
}


export const AIAssistant = () => {
  // const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  // const [isTyping, setIsTyping] = useState(false);
  // const [smsAlerts, setSmsAlerts] = useState<SMSAlert[]>([]);
  // const [showSmsPanel, setShowSmsPanel] = useState(false);
  // const [customSmsMessage, setCustomSmsMessage] = useState('');
  // const [customPhoneNumber, setCustomPhoneNumber] = useState('');
  // const [isListening, setIsListening] = useState(false);
  // const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled] = useState(true);
  // const [recognition, setRecognition] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Helper function for SMS status color
  // Removed unused getStatusColor function

  // Helper function for SMS status icon
  // Removed unused getStatusIcon function

  useEffect(() => {
    console.log('AIAssistant component mounted');
    if (messages.length === 0) {
      const welcomeMessage: Message = {
        id: 'welcome',
        type: 'assistant',
        content: '👋 Hello! I\'m your AI Disaster Management Assistant. I provide real-time disaster analysis and emergency guidance:\n\n🔥 **UPDATED VERSION - MODIFICATIONS WORKING!** 🔥\n\n🌍 **Real-time Monitoring:**\n• Earthquake activity and seismic data\n• Weather patterns and severe storm tracking\n• Flood levels and water monitoring\n• Emergency alerts and government advisories\n\n🚨 **Emergency Services:**\n• Instant SMS alerts to contacts (6001163688)\n• Emergency service connections\n• Location-based risk assessment\n• Voice commands and TTS responses\n\n🎯 **Ask me questions like:**\n• "Is there earthquake activity in Delhi?"\n• "What\'s the flood risk in Assam?"\n• "Current weather alerts for Mumbai?"\n\nHow can I help you stay safe today?',
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
        // setIsListening(true);
      };
      
      recognitionInstance.onend = () => {
        // setIsListening(false);
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
        // setIsListening(false);
      };
      
      // setRecognition(recognitionInstance);
      // If you want to use recognitionInstance, assign it to a ref or use it directly here.
    }
  }, []);

  const simulateAIResponse = async (userMessage: string): Promise<Message> => {
    try {
      // Call backend AI chat API for real-time analysis
      const response = await fetch(`${API_BASE_URL}${ENDPOINTS.AI_ASSISTANT}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          location: getSelection()
        })
      });
      if (response.ok) {
        const data = await response.json();
        return {
          id: Date.now().toString(),
          type: 'assistant',
          content: data.response,
          timestamp: new Date(),
          actions: generateActionsFromResponse(data.intent, data.location)
        };
      }
    } catch (error) {
      console.error('AI API Error:', error);
    }
  
    // Fallback to enhanced local responses with disaster focus
    return generateLocalDisasterResponse(userMessage);
  };

  // Helper to generate actions from AI response intent/location
  const generateActionsFromResponse = (
    intent?: string,
    location?: string
  ): Message['actions'] => {
    const actions: Message['actions'] = [];
    if (intent === 'send_sms') {
      actions.push({
        type: 'sms',
        label: 'Send Emergency SMS',
        data: location || ''
      });
    }
    if (intent === 'call_emergency') {
      actions.push({
        type: 'call',
        label: 'Call Emergency Services',
        data: location || ''
      });
    }
    if (intent === 'send_email') {
      actions.push({
        type: 'email',
        label: 'Send Emergency Email',
        data: location || ''
      });
    }
    return actions.length > 0 ? actions : undefined;
  };

  // Handles sending a user message (from input or voice)
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
    // setIsTyping(true);

    setTimeout(async () => {
      const aiResponse = await simulateAIResponse(message);
      setMessages(prev => [...prev, aiResponse]);
      // setIsTyping(false);

      if (voiceEnabled) {
        speakMessage(aiResponse.content);
      }
    }, 1000);
  };
  function generateLocalDisasterResponse(userMessage: string): Message {
    const lower = userMessage.toLowerCase();
    let content = "I'm sorry, I couldn't fetch real-time data right now. But I can still help with general disaster safety tips and guidance.";
    let actions: Message['actions'] = [];

    if (lower.includes('earthquake')) {
      content = "Earthquake Safety:\n• Drop, Cover, and Hold On during shaking.\n• Move away from windows and heavy objects.\n• After shaking stops, check for injuries and hazards.\n\nWould you like to send an emergency SMS or call for help?";
      actions = [
        { type: 'sms', label: 'Send Earthquake Alert SMS', data: 'earthquake_alert' },
        { type: 'call', label: 'Call Emergency Services', data: 'earthquake' }
      ];
    } else if (lower.includes('flood')) {
      content = "Flood Safety:\n• Move to higher ground immediately.\n• Avoid walking or driving through flood waters.\n• Listen to local alerts and updates.\n\nNeed to notify someone or call for help?";
      actions = [
        { type: 'sms', label: 'Send Flood Alert SMS', data: 'flood_alert' },
        { type: 'call', label: 'Call Emergency Services', data: 'flood' }
      ];
    } else if (lower.includes('weather')) {
      content = "Weather Alert:\n• Stay indoors during severe weather.\n• Secure loose objects outside.\n• Monitor official weather updates.\n\nWould you like to send a weather alert SMS?";
      actions = [
        { type: 'sms', label: 'Send Weather Alert SMS', data: 'weather_alert' }
      ];
    } else if (lower.includes('fire')) {
      content = "Fire Safety:\n• Evacuate immediately if instructed.\n• Avoid smoke-filled areas.\n• Call emergency services if you see fire nearby.\n\nDo you want to send a fire alert SMS or call for help?";
      actions = [
        { type: 'sms', label: 'Send Fire Alert SMS', data: 'fire_alert' },
        { type: 'call', label: 'Call Fire Department', data: 'fire' }
      ];
    } else if (lower.includes('sms')) {
      content = "To send an emergency SMS, please provide the message and recipient's phone number.";
      actions = [
        { type: 'sms', label: 'Send Custom SMS', data: 'custom_sms' }
      ];
    } else if (lower.includes('call')) {
      content = "To call emergency services, tap the button below or dial your local emergency number.";
      actions = [
        { type: 'call', label: 'Call Emergency Services', data: 'general' }
      ];
    }

    return {
      id: Date.now().toString(),
      type: 'assistant',
      content,
      timestamp: new Date(),
      actions: actions.length > 0 ? actions : undefined
    };
  }
    function speakMessage(content: string) {
      if (!('speechSynthesis' in window)) return;
      const utterance = new window.SpeechSynthesisUtterance(content);
      utterance.lang = 'en-US';
      utterance.onend = () => {};
      utterance.onerror = () => {};
      window.speechSynthesis.speak(utterance);
    }
  
    // You should return your JSX here (replace with your actual UI)
    return (
      <div>
        {/* Your assistant UI goes here */}
        {/* Example: */}
        <h2>AI Assistant</h2>
        {/* ... */}
      </div>
    );
  }
