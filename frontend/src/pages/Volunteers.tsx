import React, { useState } from 'react';
import { Users, MapPin, Clock, Star, Search, Heart, Shield, Zap } from 'lucide-react';

interface Volunteer {
  id: string;
  name: string;
  avatar: string;
  location: string;
  skills: string[];
  rating: number;
  completedMissions: number;
  availability: 'available' | 'busy' | 'offline';
  specialization: string;
  joinDate: string;
}

interface Mission {
  id: string;
  title: string;
  description: string;
  location: string;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  requiredSkills: string[];
  volunteersNeeded: number;
  volunteersAssigned: number;
  deadline: string;
  category: string;
  estimatedDuration: string;
}

export const Volunteers: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'missions' | 'volunteers' | 'register'>('missions');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedMission, setSelectedMission] = useState<string | null>(null);
  const [joinedMissions, setJoinedMissions] = useState<string[]>([]);
  const [applicationData, setApplicationData] = useState({
    motivation: '',
    availability: 'Full duration'
  });

  const volunteers: Volunteer[] = [
    {
      id: '1',
      name: 'Sarah Chen',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
      location: 'San Francisco, CA',
      skills: ['Medical Aid', 'Search & Rescue', 'Emergency Response'],
      rating: 4.9,
      completedMissions: 23,
      availability: 'available',
      specialization: 'Emergency Medical Technician',
      joinDate: '2023-01-15'
    },
    {
      id: '2',
      name: 'Marcus Rodriguez',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg',
      location: 'Miami, FL',
      skills: ['Disaster Relief', 'Logistics', 'Communication'],
      rating: 4.8,
      completedMissions: 31,
      availability: 'available',
      specialization: 'Disaster Coordination',
      joinDate: '2022-08-20'
    },
    {
      id: '3',
      name: 'Emma Thompson',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg',
      location: 'Seattle, WA',
      skills: ['Psychological Support', 'Community Outreach', 'Translation'],
      rating: 4.7,
      completedMissions: 18,
      availability: 'busy',
      specialization: 'Crisis Counselor',
      joinDate: '2023-03-10'
    }
  ];

  const missions: Mission[] = [
    {
      id: '1',
      title: 'Hurricane Evacuation Support',
      description: 'Assist with evacuation procedures and emergency shelter setup for Hurricane Maria affected areas.',
      location: 'Puerto Rico',
      urgency: 'critical',
      requiredSkills: ['Emergency Response', 'Medical Aid', 'Logistics'],
      volunteersNeeded: 15,
      volunteersAssigned: 8,
      deadline: '2024-01-20',
      category: 'Natural Disaster',
      estimatedDuration: '5-7 days'
    },
    {
      id: '2',
      title: 'Wildfire Relief Operations',
      description: 'Support firefighting efforts and provide aid to displaced families in California wildfire zones.',
      location: 'California, USA',
      urgency: 'high',
      requiredSkills: ['Search & Rescue', 'Disaster Relief', 'Communication'],
      volunteersNeeded: 20,
      volunteersAssigned: 12,
      deadline: '2024-01-25',
      category: 'Natural Disaster',
      estimatedDuration: '3-5 days'
    },
    {
      id: '3',
      title: 'Earthquake Recovery Team',
      description: 'Help with search and rescue operations and provide medical assistance to earthquake victims.',
      location: 'Turkey',
      urgency: 'critical',
      requiredSkills: ['Search & Rescue', 'Medical Aid', 'Heavy Machinery'],
      volunteersNeeded: 25,
      volunteersAssigned: 18,
      deadline: '2024-01-18',
      category: 'Natural Disaster',
      estimatedDuration: '7-10 days'
    },
    {
      id: '4',
      title: 'Flood Response Initiative',
      description: 'Coordinate relief efforts and distribute supplies to flood-affected communities.',
      location: 'Bangladesh',
      urgency: 'medium',
      requiredSkills: ['Logistics', 'Community Outreach', 'Water Safety'],
      volunteersNeeded: 12,
      volunteersAssigned: 7,
      deadline: '2024-02-01',
      category: 'Natural Disaster',
      estimatedDuration: '4-6 days'
    }
  ];

  const allSkills = [
    'Medical Aid', 'Search & Rescue', 'Emergency Response', 'Disaster Relief',
    'Logistics', 'Communication', 'Psychological Support', 'Community Outreach',
    'Translation', 'Heavy Machinery', 'Water Safety', 'Fire Safety'
  ];

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'available': return 'bg-green-400';
      case 'busy': return 'bg-yellow-400';
      case 'offline': return 'bg-red-400';
      default: return 'bg-slate-400';
    }
  };

  const handleMissionApplication = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedMission && applicationData.motivation.trim()) {
      setJoinedMissions([...joinedMissions, selectedMission]);
      setSelectedMission(null);
      setApplicationData({
        motivation: '',
        availability: 'Full duration'
      });
      alert('Mission application submitted successfully! You will be notified about the status.');
    }
  };

  const filteredMissions = missions.filter(mission => {
    const matchesSearch = mission.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mission.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mission.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSkills = selectedSkills.length === 0 || 
                         selectedSkills.some(skill => mission.requiredSkills.includes(skill));
    return matchesSearch && matchesSkills;
  });

  return (
    <div className="min-h-screen pt-8 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in-up">
          <h1 className="text-4xl font-bold text-white mb-4">Volunteer Network</h1>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            Join our global network of emergency responders and make a difference when disasters strike. Connect with missions and fellow volunteers worldwide.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {[
            { title: 'Active Volunteers', value: '2,847', icon: Users, color: 'from-blue-500 to-cyan-500' },
            { title: 'Active Missions', value: '23', icon: Shield, color: 'from-red-500 to-orange-500' },
            { title: 'Lives Saved', value: '15,600+', icon: Heart, color: 'from-green-500 to-emerald-500' },
            { title: 'Response Time', value: '<2hrs', icon: Zap, color: 'from-purple-500 to-pink-500' }
          ].map((stat, index) => (
            <div
              key={index}
              className="bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-700 hover:border-slate-600 shadow-lg hover:shadow-2xl transition-all duration-300 hover:transform hover:-translate-y-1 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 bg-gradient-to-r ${stat.color} rounded-lg`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <Star className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-slate-400 text-sm">{stat.title}</div>
            </div>
          ))}
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
          <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-1 border border-slate-700">
            {[
              { id: 'missions', label: 'Active Missions', icon: Shield },
              { id: 'volunteers', label: 'Volunteers', icon: Users },
              { id: 'register', label: 'Join Network', icon: Heart }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Missions Tab */}
        {activeTab === 'missions' && (
          <div className="animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            {/* Search and Filter */}
            <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-700 mb-8">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search missions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  {allSkills.slice(0, 6).map((skill) => (
                    <button
                      key={skill}
                      onClick={() => {
                        if (selectedSkills.includes(skill)) {
                          setSelectedSkills(selectedSkills.filter(s => s !== skill));
                        } else {
                          setSelectedSkills([...selectedSkills, skill]);
                        }
                      }}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        selectedSkills.includes(skill)
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                      }`}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Mission Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {filteredMissions.map((mission, index) => (
                <div
                  key={mission.id}
                  className="bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-700 hover:border-slate-600 transition-all duration-300 hover:transform hover:scale-105 animate-fade-in-up"
                  style={{ animationDelay: `${0.7 + index * 0.1}s` }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">{mission.title}</h3>
                      <div className="flex items-center space-x-2 mb-2">
                        <MapPin className="h-4 w-4 text-slate-400" />
                        <span className="text-slate-400 text-sm">{mission.location}</span>
                      </div>
                    </div>
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getUrgencyColor(mission.urgency)}`}>
                      {mission.urgency.toUpperCase()}
                    </span>
                  </div>

                  <p className="text-slate-400 mb-4 leading-relaxed">{mission.description}</p>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">Volunteers Needed:</span>
                      <span className="text-white font-medium">
                        {mission.volunteersAssigned}/{mission.volunteersNeeded}
                      </span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${(mission.volunteersAssigned / mission.volunteersNeeded) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {mission.requiredSkills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-1 bg-slate-700 text-slate-300 text-xs rounded-lg"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-slate-400">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>Deadline: {new Date(mission.deadline).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedMission(mission.id)}
                      disabled={joinedMissions.includes(mission.id)}
                      className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                        joinedMissions.includes(mission.id)
                          ? 'bg-green-600 text-white cursor-not-allowed'
                          : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
                      }`}
                    >
                      {joinedMissions.includes(mission.id) ? 'Joined ✓' : 'Join Mission'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Volunteers Tab */}
        {activeTab === 'volunteers' && (
          <div className="animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {volunteers.map((volunteer, index) => (
                <div
                  key={volunteer.id}
                  className="bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-700 hover:border-slate-600 transition-all duration-300 hover:transform hover:scale-105 animate-fade-in-up"
                  style={{ animationDelay: `${0.7 + index * 0.1}s` }}
                >
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="relative">
                      <img
                        src={volunteer.avatar}
                        alt={volunteer.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${getAvailabilityColor(volunteer.availability)} rounded-full border-2 border-slate-800`} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{volunteer.name}</h3>
                      <p className="text-slate-400 text-sm">{volunteer.specialization}</p>
                      <div className="flex items-center space-x-1 mt-1">
                        <MapPin className="h-3 w-3 text-slate-400" />
                        <span className="text-slate-400 text-xs">{volunteer.location}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-white font-medium">{volunteer.rating}</span>
                    </div>
                    <div className="text-sm text-slate-400">
                      {volunteer.completedMissions} missions
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {volunteer.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-1 bg-slate-700 text-slate-300 text-xs rounded"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      volunteer.availability === 'available' ? 'bg-green-500/20 text-green-400' :
                      volunteer.availability === 'busy' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {volunteer.availability}
                    </span>
                    <button className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors">
                      View Profile
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Register Tab */}
        {activeTab === 'register' && (
          <div className="max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl p-8 border border-slate-700">
              <div className="text-center mb-8">
                <Heart className="h-12 w-12 text-red-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">Join Our Volunteer Network</h2>
                <p className="text-slate-400">
                  Become part of a global community dedicated to emergency response and disaster relief.
                </p>
              </div>

              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">First Name</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter your first name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Last Name</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Location</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="City, State/Country"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Skills & Expertise</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {allSkills.map((skill) => (
                      <label key={skill} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          className="rounded border-slate-600 bg-slate-700 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-slate-300 text-sm">{skill}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Experience Level</label>
                  <select className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200">
                    <option>Beginner (0-1 years)</option>
                    <option>Intermediate (2-5 years)</option>
                    <option>Advanced (5+ years)</option>
                    <option>Expert (10+ years)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Availability</label>
                  <select className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200">
                    <option>Weekends only</option>
                    <option>Evenings and weekends</option>
                    <option>Flexible schedule</option>
                    <option>Full-time availability</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <Heart className="h-5 w-5" />
                  <span>Join Volunteer Network</span>
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Mission Application Modal */}
        {selectedMission && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-scale-in">
            <div className="bg-slate-800 rounded-2xl border border-slate-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-slate-700">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-white">Apply for Mission</h2>
                  <button 
                    onClick={() => setSelectedMission(null)}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    ×
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="bg-slate-700/30 rounded-lg p-4 mb-6">
                  <h3 className="text-white font-medium mb-2">
                    {missions.find(m => m.id === selectedMission)?.title}
                  </h3>
                  <p className="text-slate-400 text-sm">
                    {missions.find(m => m.id === selectedMission)?.description}
                  </p>
                </div>

                <form onSubmit={handleMissionApplication} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Why do you want to join this mission?
                    </label>
                    <textarea
                      rows={4}
                      value={applicationData.motivation}
                      onChange={(e) => setApplicationData({...applicationData, motivation: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Describe your motivation and relevant experience..."
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Availability
                    </label>
                    <select 
                      value={applicationData.availability}
                      onChange={(e) => setApplicationData({...applicationData, availability: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    >
                      <option>Full duration</option>
                      <option>Partial availability</option>
                      <option>Weekends only</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-200"
                  >
                    Submit Application
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};