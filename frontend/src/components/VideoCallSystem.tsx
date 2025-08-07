import React, { useState, useEffect, useRef } from 'react';
import { 
  Phone, 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  PhoneOff, 
  Camera, 
  CameraOff,
  Users,
  Volume2,
  VolumeX
} from 'lucide-react';

interface VideoCallSystemProps {
  emergencyNumber?: string;
  userLocation?: { lat: number; lng: number };
  emergencyType?: string;
}

const VideoCallSystem: React.FC<VideoCallSystemProps> = ({
  emergencyNumber = "6001163688", // Real emergency number provided
  userLocation,
  emergencyType = "general"
}) => {
  // Call States
  const [isCallActive, setIsCallActive] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [callStatus, setCallStatus] = useState<'idle' | 'connecting' | 'connected' | 'ended'>('idle');
  
  // Media States
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isSpeakerEnabled, setIsSpeakerEnabled] = useState(false);
  const [cameraFacing, setCameraFacing] = useState<'user' | 'environment'>('user');
  
  // UI States
  const [connectionQuality, setConnectionQuality] = useState<'excellent' | 'good' | 'poor' | 'disconnected'>('excellent');

  // Refs for media elements
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const callTimerRef = useRef<NodeJS.Timeout | null>(null);

  // WebRTC Configuration
  const rtcConfig = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
      { urls: 'stun:stun2.l.google.com:19302' }
    ]
  };

  useEffect(() => {
    return () => {
      endCall();
      if (callTimerRef.current) {
        clearInterval(callTimerRef.current);
      }
    };
  }, []);

  // Initialize WebRTC peer connection
  const initializePeerConnection = () => {
    peerConnectionRef.current = new RTCPeerConnection(rtcConfig);
    
    peerConnectionRef.current.onicecandidate = (event) => {
      if (event.candidate) {
        // Send ICE candidate to remote peer
        console.log('ICE candidate:', event.candidate);
      }
    };

    peerConnectionRef.current.ontrack = (event) => {
      if (remoteVideoRef.current && event.streams[0]) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    peerConnectionRef.current.onconnectionstatechange = () => {
      const state = peerConnectionRef.current?.connectionState;
      switch (state) {
        case 'connecting':
          setConnectionQuality('poor');
          break;
        case 'connected':
          setConnectionQuality('excellent');
          break;
        case 'disconnected':
        case 'failed':
          setConnectionQuality('disconnected');
          break;
      }
    };
  };

  // Start video call
  const startVideoCall = async () => {
    try {
      setCallStatus('connecting');
      
      // Get user media
      const constraints = {
        video: {
          facingMode: cameraFacing,
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 30 }
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      localStreamRef.current = stream;
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // Initialize peer connection
      initializePeerConnection();
      
      // Add stream to peer connection
      stream.getTracks().forEach(track => {
        peerConnectionRef.current?.addTrack(track, stream);
      });

      // For demo purposes, we'll simulate a call to the emergency number
      // In a real implementation, this would connect to a SIP server or WebRTC gateway
      simulateEmergencyCall();
      
      setIsCallActive(true);
      setCallStatus('connected');
      startCallTimer();
      
    } catch (error) {
      console.error('Error starting video call:', error);
      alert('Unable to access camera/microphone. Please check permissions and try again.');
      setCallStatus('idle');
    }
  };

  // Simulate emergency call connection
  const simulateEmergencyCall = () => {
    // This simulates connecting to emergency services
    console.log(`Connecting video call to emergency number: ${emergencyNumber}`);
    
    // In production, this would:
    // 1. Connect to emergency services via SIP/WebRTC gateway
    // 2. Include location data and emergency type
    // 3. Route to appropriate emergency response center
    
    // Send emergency data
    const emergencyData = {
      phoneNumber: emergencyNumber,
      location: userLocation,
      emergencyType: emergencyType,
      timestamp: new Date().toISOString(),
      deviceInfo: {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language
      }
    };
    
    console.log('Emergency call data:', emergencyData);
    
    // Simulate incoming call acceptance after 2 seconds
    setTimeout(() => {
      console.log('Emergency services connected');
      // You could add remote video stream simulation here
    }, 2000);
  };

  // Start voice call
  const startVoiceCall = async () => {
    try {
      setCallStatus('connecting');
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      localStreamRef.current = stream;
      
      initializePeerConnection();
      
      stream.getTracks().forEach(track => {
        peerConnectionRef.current?.addTrack(track, stream);
      });

      // Make actual phone call to emergency number
      makePhoneCall(emergencyNumber);
      
      setIsCallActive(true);
      setCallStatus('connected');
      startCallTimer();
      
    } catch (error) {
      console.error('Error starting voice call:', error);
      alert('Unable to access microphone. Please check permissions and try again.');
      setCallStatus('idle');
    }
  };

  // Make actual phone call
  const makePhoneCall = (phoneNumber: string) => {
    // Open phone dialer with the emergency number
    const telUrl = `tel:${phoneNumber}`;
    window.open(telUrl, '_self');
  };

  // Start call timer
  const startCallTimer = () => {
    callTimerRef.current = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
  };

  // Toggle video
  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
      }
    }
  };

  // Toggle audio
  const toggleAudio = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioEnabled(audioTrack.enabled);
      }
    }
  };

  // Switch camera
  const switchCamera = async () => {
    try {
      const newFacing = cameraFacing === 'user' ? 'environment' : 'user';
      
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: newFacing },
        audio: true
      });

      localStreamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      setCameraFacing(newFacing);
    } catch (error) {
      console.error('Error switching camera:', error);
    }
  };

  // Toggle speaker
  const toggleSpeaker = () => {
    setIsSpeakerEnabled(!isSpeakerEnabled);
    // In a real implementation, this would route audio output
  };

  // End call
  const endCall = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
    }
    
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
    }
    
    if (callTimerRef.current) {
      clearInterval(callTimerRef.current);
    }
    
    setIsCallActive(false);
    setCallStatus('ended');
    setCallDuration(0);
    setIsVideoEnabled(true);
    setIsAudioEnabled(true);
  };

  // Format call duration
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Get connection status color
  const getConnectionStatusColor = () => {
    switch (connectionQuality) {
      case 'excellent': return 'text-green-500';
      case 'good': return 'text-yellow-500';
      case 'poor': return 'text-orange-500';
      case 'disconnected': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="video-call-system bg-gradient-to-br from-slate-900 to-blue-900 rounded-xl shadow-2xl overflow-hidden">
      {/* Call Header */}
      <div className="call-header bg-slate-800/50 backdrop-blur-sm p-4 border-b border-slate-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
              <Phone className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold">Emergency Services</h3>
              <p className="text-gray-300 text-sm">{emergencyNumber}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {isCallActive && (
              <>
                <div className={`text-sm ${getConnectionStatusColor()}`}>
                  {connectionQuality.toUpperCase()}
                </div>
                <div className="text-white text-sm font-mono">
                  {formatDuration(callDuration)}
                </div>
              </>
            )}
            <div className="flex items-center space-x-1 text-gray-300">
              <Users className="w-4 h-4" />
              <span className="text-sm">
                {callStatus === 'connected' ? '2' : '1'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Video Interface */}
      <div className="video-interface relative">
        {isCallActive ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 p-2">
            {/* Local Video */}
            <div className="relative bg-slate-800 rounded-lg overflow-hidden aspect-video">
              <video
                ref={localVideoRef}
                autoPlay
                muted
                playsInline
                className={`w-full h-full object-cover ${!isVideoEnabled ? 'hidden' : ''}`}
              />
              {!isVideoEnabled && (
                <div className="absolute inset-0 bg-slate-700 flex items-center justify-center">
                  <CameraOff className="w-12 h-12 text-gray-400" />
                </div>
              )}
              <div className="absolute bottom-2 left-2 bg-black/50 backdrop-blur-sm px-2 py-1 rounded text-white text-xs">
                You
              </div>
              <div className="absolute top-2 right-2 flex space-x-1">
                {!isAudioEnabled && (
                  <div className="bg-red-500 rounded-full p-1">
                    <MicOff className="w-3 h-3 text-white" />
                  </div>
                )}
                {!isVideoEnabled && (
                  <div className="bg-red-500 rounded-full p-1">
                    <CameraOff className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>
            </div>

            {/* Remote Video */}
            <div className="relative bg-slate-800 rounded-lg overflow-hidden aspect-video">
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-slate-700 flex items-center justify-center">
                <div className="text-center text-white">
                  <Users className="w-16 h-16 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm">Emergency Responder</p>
                  <p className="text-xs text-gray-400">Waiting to connect...</p>
                </div>
              </div>
              <div className="absolute bottom-2 left-2 bg-black/50 backdrop-blur-sm px-2 py-1 rounded text-white text-xs">
                Emergency Services
              </div>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Phone className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Emergency Communication</h2>
            <p className="text-gray-300 mb-6">Connect with emergency services instantly</p>
            <p className="text-sm text-gray-400 mb-8">
              Location services and camera access will be used to provide emergency responders with critical information.
            </p>
          </div>
        )}

        {/* Call Controls */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-4 transition-opacity duration-300 opacity-100">
          <div className="flex justify-center items-center space-x-4">
            {!isCallActive ? (
              <>
                {/* Start Call Buttons */}
                <button
                  onClick={startVideoCall}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-full flex items-center space-x-2 transition-all duration-200 hover:scale-105 shadow-lg"
                  title="Start Video Call"
                >
                  <Video className="w-5 h-5" />
                  <span className="font-medium">Video Call</span>
                </button>
                
                <button
                  onClick={startVoiceCall}
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-full flex items-center space-x-2 transition-all duration-200 hover:scale-105 shadow-lg"
                  title="Start Voice Call"
                >
                  <Phone className="w-5 h-5" />
                  <span className="font-medium">Voice Call</span>
                </button>
                
                <button
                  onClick={() => makePhoneCall(emergencyNumber)}
                  className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-3 rounded-full flex items-center space-x-2 transition-all duration-200 hover:scale-105 shadow-lg"
                  title={`Call ${emergencyNumber}`}
                >
                  <Phone className="w-5 h-5" />
                  <span className="font-medium">Call {emergencyNumber}</span>
                </button>
              </>
            ) : (
              <>
                {/* Active Call Controls */}
                <button
                  onClick={toggleAudio}
                  className={`p-4 rounded-full transition-all duration-200 hover:scale-110 ${
                    isAudioEnabled 
                      ? 'bg-slate-600 hover:bg-slate-700 text-white' 
                      : 'bg-red-500 hover:bg-red-600 text-white'
                  }`}
                  title={isAudioEnabled ? "Mute microphone" : "Unmute microphone"}
                >
                  {isAudioEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                </button>

                <button
                  onClick={toggleVideo}
                  className={`p-4 rounded-full transition-all duration-200 hover:scale-110 ${
                    isVideoEnabled 
                      ? 'bg-slate-600 hover:bg-slate-700 text-white' 
                      : 'bg-red-500 hover:bg-red-600 text-white'
                  }`}
                  title={isVideoEnabled ? "Turn off camera" : "Turn on camera"}
                >
                  {isVideoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                </button>

                <button
                  onClick={switchCamera}
                  className="p-4 rounded-full bg-slate-600 hover:bg-slate-700 text-white transition-all duration-200 hover:scale-110"
                  title="Switch camera"
                >
                  <Camera className="w-5 h-5" />
                </button>

                <button
                  onClick={toggleSpeaker}
                  className={`p-4 rounded-full transition-all duration-200 hover:scale-110 ${
                    isSpeakerEnabled 
                      ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                      : 'bg-slate-600 hover:bg-slate-700 text-white'
                  }`}
                  title="Toggle speaker"
                >
                  {isSpeakerEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                </button>

                <button
                  onClick={endCall}
                  className="p-4 rounded-full bg-red-500 hover:bg-red-600 text-white transition-all duration-200 hover:scale-110 shadow-lg"
                  title="End call"
                >
                  <PhoneOff className="w-5 h-5" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Status Messages */}
      {callStatus !== 'idle' && (
        <div className="status-bar bg-slate-800/50 backdrop-blur-sm p-3 text-center">
          <p className="text-sm text-gray-300">
            {callStatus === 'connecting' && 'Connecting to emergency services...'}
            {callStatus === 'connected' && `Connected to emergency services • ${formatDuration(callDuration)}`}
            {callStatus === 'ended' && 'Call ended'}
          </p>
        </div>
      )}
    </div>
  );
};

export default VideoCallSystem;
