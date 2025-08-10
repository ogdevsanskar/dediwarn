// Progress bars in this component require dynamic styles for percentage-based widths
import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Award,
  Target,
  Trophy,
  Star,
  Users,
  Play,
  CheckCircle,
  Lock,
  Clock,
  TrendingUp,
  Globe,
  Shield,
  Heart,
  Leaf,
  UserCheck,
  Calendar,
  Medal
} from 'lucide-react';

// Progress bar component using Tailwind arbitrary values
const ProgressBar: React.FC<{ 
  percentage: number; 
  className?: string;
  gradientClass?: string;
}> = ({ percentage, className = "", gradientClass = "bg-gradient-to-r from-blue-500 to-purple-500" }) => {
  // Create a div with calculated width using ref
  const progressRef = React.useRef<HTMLDivElement>(null);
  
  React.useEffect(() => {
    if (progressRef.current) {
      progressRef.current.style.width = `${percentage}%`;
    }
  }, [percentage]);
  
  return (
    <div 
      ref={progressRef}
      className={`h-full rounded-full ${gradientClass} ${className}`}
    />
  );
};

interface LearningModule {
  id: string;
  title: string;
  description: string;
  category: 'climate-literacy' | 'emergency-prep' | 'biodiversity' | 'sustainability' | 'community-action';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // in minutes
  points: number;
  badge?: string;
  completed: boolean;
  locked: boolean;
  prerequisites?: string[];
  completionRate: number;
  learners: number;
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'monthly' | 'special';
  category: string;
  points: number;
  deadline?: Date;
  progress: number;
  maxProgress: number;
  completed: boolean;
  participants: number;
  reward: {
    points: number;
    badge?: string;
    title?: string;
  };
}

interface UserProgress {
  level: number;
  experience: number;
  experienceToNext: number;
  totalPoints: number;
  badges: string[];
  streakDays: number;
  completedModules: number;
  challengesWon: number;
  rank: number;
  totalUsers: number;
  achievements: {
    title: string;
    description: string;
    unlockedAt: Date;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
  }[];
}

const EducationGamification: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'learn' | 'challenges' | 'progress' | 'community'>('learn');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [learningModules, setLearningModules] = useState<LearningModule[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [userProgress] = useState<UserProgress>({
    level: 12,
    experience: 3420,
    experienceToNext: 1580,
    totalPoints: 15670,
    badges: ['Climate Hero', 'Emergency Expert', 'Eco Warrior', 'Community Leader'],
    streakDays: 7,
    completedModules: 23,
    challengesWon: 12,
    rank: 147,
    totalUsers: 25000,
    achievements: [
      {
        title: 'First Steps',
        description: 'Completed your first learning module',
        unlockedAt: new Date('2024-07-15'),
        rarity: 'common'
      },
      {
        title: 'Knowledge Seeker',
        description: 'Completed 10 learning modules',
        unlockedAt: new Date('2024-08-01'),
        rarity: 'rare'
      },
      {
        title: 'Climate Champion',
        description: 'Maintained a 30-day learning streak',
        unlockedAt: new Date('2024-08-05'),
        rarity: 'epic'
      }
    ]
  });

  useEffect(() => {
    loadLearningModules();
    loadChallenges();
  }, []);

  const loadLearningModules = () => {
    setLearningModules([
      {
        id: 'module-1',
        title: 'Climate Change Fundamentals',
        description: 'Understanding the science behind climate change, greenhouse gases, and global warming impacts.',
        category: 'climate-literacy',
        difficulty: 'beginner',
        duration: 25,
        points: 100,
        badge: 'Climate Aware',
        completed: true,
        locked: false,
        completionRate: 94,
        learners: 12450
      },
      {
        id: 'module-2',
        title: 'Emergency Preparedness Basics',
        description: 'Essential skills for disaster preparedness, emergency kits, and family emergency plans.',
        category: 'emergency-prep',
        difficulty: 'beginner',
        duration: 30,
        points: 120,
        badge: 'Prepared Citizen',
        completed: true,
        locked: false,
        completionRate: 87,
        learners: 9870
      },
      {
        id: 'module-3',
        title: 'Biodiversity Conservation',
        description: 'Learn about ecosystem protection, species conservation, and habitat restoration.',
        category: 'biodiversity',
        difficulty: 'intermediate',
        duration: 40,
        points: 150,
        badge: 'Bio Guardian',
        completed: false,
        locked: false,
        completionRate: 76,
        learners: 7230
      },
      {
        id: 'module-4',
        title: 'Advanced Disaster Response',
        description: 'Professional disaster response techniques, coordination, and emergency communication.',
        category: 'emergency-prep',
        difficulty: 'advanced',
        duration: 60,
        points: 200,
        badge: 'Response Expert',
        completed: false,
        locked: true,
        prerequisites: ['module-2'],
        completionRate: 45,
        learners: 3420
      },
      {
        id: 'module-5',
        title: 'Sustainable Living Practices',
        description: 'Practical approaches to reduce environmental impact and live sustainably.',
        category: 'sustainability',
        difficulty: 'beginner',
        duration: 35,
        points: 130,
        badge: 'Eco Warrior',
        completed: false,
        locked: false,
        completionRate: 82,
        learners: 8900
      },
      {
        id: 'module-6',
        title: 'Community Resilience Building',
        description: 'Strategies for building resilient communities and grassroots environmental action.',
        category: 'community-action',
        difficulty: 'intermediate',
        duration: 45,
        points: 170,
        badge: 'Community Leader',
        completed: false,
        locked: false,
        completionRate: 68,
        learners: 5670
      }
    ]);
  };

  const loadChallenges = () => {
    setChallenges([
      {
        id: 'challenge-1',
        title: 'Daily Check-in',
        description: 'Complete your daily environmental awareness check-in',
        type: 'daily',
        category: 'engagement',
        points: 10,
        deadline: new Date(Date.now() + 24 * 60 * 60 * 1000),
        progress: 1,
        maxProgress: 1,
        completed: true,
        participants: 8940,
        reward: { points: 10 }
      },
      {
        id: 'challenge-2',
        title: 'Photo Challenge: Local Wildlife',
        description: 'Share photos of wildlife in your local area to contribute to biodiversity mapping',
        type: 'weekly',
        category: 'biodiversity',
        points: 50,
        deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        progress: 2,
        maxProgress: 5,
        completed: false,
        participants: 3240,
        reward: { points: 50, badge: 'Nature Photographer' }
      },
      {
        id: 'challenge-3',
        title: 'Emergency Kit Assembly',
        description: 'Build and verify your family emergency preparedness kit',
        type: 'monthly',
        category: 'emergency-prep',
        points: 100,
        deadline: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
        progress: 0,
        maxProgress: 1,
        completed: false,
        participants: 1890,
        reward: { points: 100, badge: 'Prepared Family', title: 'Emergency Ready' }
      },
      {
        id: 'challenge-4',
        title: 'Climate Action Week',
        description: 'Participate in global climate action initiatives and log your activities',
        type: 'special',
        category: 'climate-action',
        points: 200,
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        progress: 3,
        maxProgress: 7,
        completed: false,
        participants: 15670,
        reward: { points: 200, badge: 'Climate Activist', title: 'Planet Protector' }
      }
    ]);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'climate-literacy': return <Globe className="h-4 w-4" />;
      case 'emergency-prep': return <Shield className="h-4 w-4" />;
      case 'biodiversity': return <Leaf className="h-4 w-4" />;
      case 'sustainability': return <Heart className="h-4 w-4" />;
      case 'community-action': return <Users className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'intermediate': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'advanced': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const getChallengeTypeColor = (type: string) => {
    switch (type) {
      case 'daily': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'weekly': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'monthly': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'special': return 'bg-pink-500/20 text-pink-400 border-pink-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-400';
      case 'rare': return 'text-blue-400';
      case 'epic': return 'text-purple-400';
      case 'legendary': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const filteredModules = learningModules.filter(module => 
    selectedCategory === 'all' || module.category === selectedCategory
  );

  const progressPercentage = (userProgress.experience / (userProgress.experience + userProgress.experienceToNext)) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with User Progress */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-xl border border-blue-500/30 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  Climate Education & Action Center
                </h1>
                <p className="text-blue-400">
                  Learn, engage, and make a difference in environmental protection
                </p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-purple-400">Level {userProgress.level}</div>
                <div className="text-sm text-gray-400">Rank #{userProgress.rank.toLocaleString()}</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-gray-300">Experience Progress</span>
                <span className="text-white">{userProgress.experience}/{userProgress.experience + userProgress.experienceToNext} XP</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-3">
                <ProgressBar 
                  percentage={progressPercentage}
                  className="transition-all duration-500"
                />
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              <div className="bg-slate-800/50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-400">{userProgress.totalPoints.toLocaleString()}</div>
                <div className="text-sm text-gray-400">Total Points</div>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-400">{userProgress.streakDays}</div>
                <div className="text-sm text-gray-400">Day Streak</div>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-purple-400">{userProgress.completedModules}</div>
                <div className="text-sm text-gray-400">Modules Done</div>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-orange-400">{userProgress.challengesWon}</div>
                <div className="text-sm text-gray-400">Challenges Won</div>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-yellow-400">{userProgress.badges.length}</div>
                <div className="text-sm text-gray-400">Badges</div>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-cyan-400">{userProgress.achievements.length}</div>
                <div className="text-sm text-gray-400">Achievements</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-6 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-2">
          {[
            { key: 'learn', label: 'Learning Modules', icon: BookOpen },
            { key: 'challenges', label: 'Challenges', icon: Target },
            { key: 'progress', label: 'My Progress', icon: TrendingUp },
            { key: 'community', label: 'Community', icon: Users }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as typeof activeTab)}
                className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                  activeTab === tab.key
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-slate-700'
                }`}
              >
                <Icon className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="space-y-6">
          {activeTab === 'learn' && (
            <>
              {/* Category Filter */}
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-4">
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                      selectedCategory === 'all' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                    }`}
                  >
                    All Categories
                  </button>
                  {[
                    { key: 'climate-literacy', label: 'Climate Literacy' },
                    { key: 'emergency-prep', label: 'Emergency Prep' },
                    { key: 'biodiversity', label: 'Biodiversity' },
                    { key: 'sustainability', label: 'Sustainability' },
                    { key: 'community-action', label: 'Community Action' }
                  ].map(category => (
                    <button
                      key={category.key}
                      onClick={() => setSelectedCategory(category.key)}
                      className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                        selectedCategory === category.key ? 'bg-blue-600 text-white' : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                      }`}
                    >
                      {category.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Learning Modules Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredModules.map(module => (
                  <div key={module.id} className={`rounded-xl border p-6 transition-all duration-300 ${
                    module.locked 
                      ? 'bg-slate-800/30 border-slate-600 opacity-60' 
                      : 'bg-slate-800/50 border-slate-700 hover:border-blue-500/50'
                  }`}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        {getCategoryIcon(module.category)}
                        <div>
                          <h3 className="text-lg font-semibold text-white">{module.title}</h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className={`px-2 py-1 rounded text-xs font-medium border ${getDifficultyColor(module.difficulty)}`}>
                              {module.difficulty}
                            </span>
                            <span className="text-xs text-gray-400 flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {module.duration}m
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        {module.completed && <CheckCircle className="h-6 w-6 text-green-400" />}
                        {module.locked && <Lock className="h-6 w-6 text-gray-400" />}
                        {!module.completed && !module.locked && <Play className="h-6 w-6 text-blue-400" />}
                      </div>
                    </div>

                    <p className="text-gray-300 text-sm mb-4 line-clamp-3">{module.description}</p>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-gray-400">Community Progress</span>
                        <span className="text-white">{module.completionRate}%</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <ProgressBar 
                          percentage={module.completionRate}
                          gradientClass="bg-gradient-to-r from-green-500 to-blue-500"
                        />
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                      <div>
                        <div className="text-lg font-bold text-blue-400">{module.points}</div>
                        <div className="text-xs text-gray-400">Points</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-green-400">{module.learners.toLocaleString()}</div>
                        <div className="text-xs text-gray-400">Learners</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-purple-400">
                          {module.badge ? <Award className="h-4 w-4 mx-auto" /> : '-'}
                        </div>
                        <div className="text-xs text-gray-400">Badge</div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <button
                      disabled={module.locked}
                      className={`w-full py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                        module.locked
                          ? 'bg-slate-600 text-gray-400 cursor-not-allowed'
                          : module.completed
                          ? 'bg-green-600 hover:bg-green-700 text-white'
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                    >
                      {module.locked ? 'Locked' : module.completed ? 'Completed' : 'Start Learning'}
                    </button>

                    {module.badge && (
                      <div className="mt-2 text-xs text-center text-yellow-400">
                        Earn "{module.badge}" badge
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}

          {activeTab === 'challenges' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {challenges.map(challenge => (
                <div key={challenge.id} className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">{challenge.title}</h3>
                      <p className="text-gray-300 text-sm mb-3">{challenge.description}</p>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium border ${getChallengeTypeColor(challenge.type)}`}>
                          {challenge.type}
                        </span>
                        <span className="text-xs text-gray-400 flex items-center">
                          <Users className="h-3 w-3 mr-1" />
                          {challenge.participants.toLocaleString()} participants
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      {challenge.completed ? (
                        <CheckCircle className="h-8 w-8 text-green-400" />
                      ) : (
                        <div className="text-2xl font-bold text-blue-400">{challenge.points}</div>
                      )}
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-400">Progress</span>
                      <span className="text-white">{challenge.progress}/{challenge.maxProgress}</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <ProgressBar 
                        percentage={(challenge.progress / challenge.maxProgress) * 100}
                      />
                    </div>
                  </div>

                  {/* Deadline */}
                  {challenge.deadline && (
                    <div className="mb-4 text-sm text-gray-400 flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      Ends {challenge.deadline.toLocaleDateString()}
                    </div>
                  )}

                  {/* Rewards */}
                  <div className="mb-4">
                    <div className="text-sm text-gray-400 mb-2">Rewards</div>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2 py-1 bg-blue-600/20 text-blue-400 rounded text-xs">
                        {challenge.reward.points} points
                      </span>
                      {challenge.reward.badge && (
                        <span className="px-2 py-1 bg-yellow-600/20 text-yellow-400 rounded text-xs">
                          Badge: {challenge.reward.badge}
                        </span>
                      )}
                      {challenge.reward.title && (
                        <span className="px-2 py-1 bg-purple-600/20 text-purple-400 rounded text-xs">
                          Title: {challenge.reward.title}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    disabled={challenge.completed}
                    className={`w-full py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                      challenge.completed
                        ? 'bg-green-600 text-white cursor-default'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    {challenge.completed ? 'Completed!' : 'Join Challenge'}
                  </button>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'progress' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Badges */}
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <Award className="h-5 w-5 mr-2 text-yellow-400" />
                  Earned Badges
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {userProgress.badges.map((badge, index) => (
                    <div key={index} className="bg-slate-700/50 rounded-lg p-4 text-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Medal className="h-6 w-6 text-white" />
                      </div>
                      <div className="text-sm font-medium text-white">{badge}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Achievements */}
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <Trophy className="h-5 w-5 mr-2 text-purple-400" />
                  Recent Achievements
                </h3>
                <div className="space-y-4">
                  {userProgress.achievements.map((achievement, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <Star className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="text-white font-medium">{achievement.title}</h4>
                          <span className={`text-xs ${getRarityColor(achievement.rarity)}`}>
                            {achievement.rarity}
                          </span>
                        </div>
                        <p className="text-sm text-gray-400">{achievement.description}</p>
                        <p className="text-xs text-gray-500">
                          Unlocked {achievement.unlockedAt.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Leaderboard */}
              <div className="lg:col-span-2 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-green-400" />
                  Global Leaderboard
                </h3>
                <div className="space-y-3">
                  {[
                    { rank: 1, name: 'EcoHero2024', points: 45670, badge: 'Legendary Guardian' },
                    { rank: 2, name: 'ClimateChampion', points: 42340, badge: 'Epic Protector' },
                    { rank: 3, name: 'GreenWarrior', points: 38920, badge: 'Master Conservationist' },
                    { rank: userProgress.rank, name: 'You', points: userProgress.totalPoints, badge: 'Climate Hero', isUser: true }
                  ].map((entry, index) => (
                    <div key={index} className={`flex items-center justify-between p-3 rounded-lg ${
                      entry.isUser ? 'bg-blue-600/20 border border-blue-500/30' : 'bg-slate-700/50'
                    }`}>
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                          entry.rank === 1 ? 'bg-yellow-500 text-black' :
                          entry.rank === 2 ? 'bg-gray-400 text-black' :
                          entry.rank === 3 ? 'bg-orange-500 text-black' :
                          'bg-slate-600 text-white'
                        }`}>
                          #{entry.rank}
                        </div>
                        <div>
                          <div className="text-white font-medium">{entry.name}</div>
                          <div className="text-xs text-gray-400">{entry.badge}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-white font-bold">{entry.points.toLocaleString()}</div>
                        <div className="text-xs text-gray-400">points</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'community' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Community Stats */}
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                  <Users className="h-5 w-5 mr-2 text-blue-400" />
                  Community Impact
                </h3>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-400">{userProgress.totalUsers.toLocaleString()}</div>
                    <div className="text-sm text-gray-400">Active Learners</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-xl font-bold text-green-400">89%</div>
                      <div className="text-xs text-gray-400">Completion Rate</div>
                    </div>
                    <div>
                      <div className="text-xl font-bold text-purple-400">4.8</div>
                      <div className="text-xs text-gray-400">Avg Rating</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Featured Learners */}
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                  <Star className="h-5 w-5 mr-2 text-yellow-400" />
                  Featured Learners
                </h3>
                <div className="space-y-3">
                  {[
                    { name: 'Sarah Chen', achievement: 'Completed 50 modules', level: 25 },
                    { name: 'Mike Rodriguez', achievement: 'Climate Action Leader', level: 22 },
                    { name: 'Emma Thompson', achievement: '100-day streak', level: 18 }
                  ].map((learner, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <UserCheck className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="text-white font-medium">{learner.name}</div>
                        <div className="text-xs text-gray-400">{learner.achievement}</div>
                      </div>
                      <div className="text-purple-400 font-bold">L{learner.level}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Global Challenges */}
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                  <Globe className="h-5 w-5 mr-2 text-green-400" />
                  Global Initiatives
                </h3>
                <div className="space-y-3">
                  {[
                    { title: 'Ocean Cleanup', participants: 12450, progress: 67 },
                    { title: 'Forest Protection', participants: 8930, progress: 84 },
                    { title: 'Climate Education', participants: 15670, progress: 92 }
                  ].map((initiative, index) => (
                    <div key={index} className="bg-slate-700/50 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-white font-medium">{initiative.title}</div>
                        <div className="text-sm text-gray-400">{initiative.progress}%</div>
                      </div>
                      <div className="w-full bg-slate-600 rounded-full h-2 mb-1">
                        <ProgressBar 
                          percentage={initiative.progress}
                          gradientClass="bg-gradient-to-r from-green-500 to-blue-500"
                        />
                      </div>
                      <div className="text-xs text-gray-400">{initiative.participants.toLocaleString()} participants</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EducationGamification;
