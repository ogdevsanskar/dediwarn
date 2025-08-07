import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Users, 
  Shield, 
  AlertTriangle, 
  Activity, 
  MessageSquare,
  UserCheck,
  Server,
  Database,
  Zap,
  Eye,
  Bell,
  CheckCircle,
  RotateCcw,
  Download,
  Search,
  ChevronRight,
  TrendingUp,
  BarChart3,
  PieChart as PieChartIcon
} from 'lucide-react';
import { Line, Doughnut } from 'react-chartjs-2';

interface SystemStatus {
  server: 'Online' | 'Offline' | 'Maintenance';
  database: 'Connected' | 'Disconnected' | 'Syncing';
  aiServices: 'Active' | 'Inactive' | 'Error';
  communications: 'Operational' | 'Degraded' | 'Failed';
  mapping: 'Online' | 'Offline' | 'Limited';
  uptime: number;
  lastUpdate: Date;
}

interface UserData {
  id: string;
  name: string;
  role: 'Admin' | 'Operator' | 'Viewer' | 'Responder';
  status: 'Online' | 'Offline' | 'Away';
  lastActive: Date;
  permissions: string[];
  location?: string;
}

interface AlertData {
  id: string;
  type: 'System' | 'Disaster' | 'Communication' | 'Security';
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  title: string;
  description: string;
  timestamp: Date;
  status: 'New' | 'Acknowledged' | 'Resolved';
  assignedTo?: string;
}

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'alerts' | 'system' | 'reports'>('overview');
  const [systemStatus] = useState<SystemStatus>({
    server: 'Online',
    database: 'Connected',
    aiServices: 'Active',
    communications: 'Operational',
    mapping: 'Online',
    uptime: 99.8,
    lastUpdate: new Date()
  });
  const [users, setUsers] = useState<UserData[]>([]);
  const [alerts, setAlerts] = useState<AlertData[]>([]);
  const [selectedTimeRange, setSelectedTimeRange] = useState<'1h' | '24h' | '7d' | '30d'>('24h');

  // Generate sample data
  useEffect(() => {
    // Sample users
    const sampleUsers: UserData[] = [
      {
        id: '1',
        name: 'Dr. Sarah Chen',
        role: 'Admin',
        status: 'Online',
        lastActive: new Date(),
        permissions: ['full_access', 'user_management', 'system_config'],
        location: 'Emergency Command Center'
      },
      {
        id: '2',
        name: 'Mark Johnson',
        role: 'Operator',
        status: 'Online',
        lastActive: new Date(Date.now() - 300000),
        permissions: ['disaster_management', 'alerts', 'communications'],
        location: 'Field Operations'
      },
      {
        id: '3',
        name: 'Lisa Rodriguez',
        role: 'Responder',
        status: 'Away',
        lastActive: new Date(Date.now() - 3600000),
        permissions: ['field_access', 'status_updates'],
        location: 'Mobile Unit 1'
      },
      {
        id: '4',
        name: 'James Park',
        role: 'Viewer',
        status: 'Offline',
        lastActive: new Date(Date.now() - 7200000),
        permissions: ['read_only'],
        location: 'Regional Office'
      }
    ];

    // Sample alerts
    const sampleAlerts: AlertData[] = [
      {
        id: '1',
        type: 'Disaster',
        severity: 'Critical',
        title: 'Earthquake Detected - Magnitude 6.2',
        description: 'Seismic activity detected 15km northeast of San Francisco',
        timestamp: new Date(Date.now() - 900000),
        status: 'Acknowledged',
        assignedTo: 'Mark Johnson'
      },
      {
        id: '2',
        type: 'System',
        severity: 'Medium',
        title: 'High Server Load',
        description: 'Server CPU usage at 87% for the last 10 minutes',
        timestamp: new Date(Date.now() - 1800000),
        status: 'New'
      },
      {
        id: '3',
        type: 'Communication',
        severity: 'Low',
        title: 'SMS Gateway Latency',
        description: 'Slight delay in SMS delivery, investigating',
        timestamp: new Date(Date.now() - 3600000),
        status: 'Resolved'
      }
    ];

    setUsers(sampleUsers);
    setAlerts(sampleAlerts);
  }, []);

  // Chart data for system metrics
  const systemMetricsData = {
    labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
    datasets: [
      {
        label: 'CPU Usage (%)',
        data: [45, 52, 68, 75, 83, 67],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
      },
      {
        label: 'Memory Usage (%)',
        data: [38, 42, 56, 64, 71, 58],
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
      }
    ]
  };

  const alertDistribution = {
    labels: ['System', 'Disaster', 'Communication', 'Security'],
    datasets: [{
      data: [12, 8, 5, 3],
      backgroundColor: [
        '#3B82F6', // Blue
        '#EF4444', // Red
        '#10B981', // Green
        '#F59E0B', // Yellow
      ],
    }]
  };

  const StatusIndicator = ({ status, label }: { status: 'Online' | 'Offline' | 'Active' | 'Inactive' | 'Connected' | 'Disconnected' | 'Operational' | 'Degraded' | 'Failed' | 'Maintenance' | 'Syncing' | 'Error' | 'Limited'; label: string }) => (
    <div className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg">
      <span className="font-medium text-gray-700">{label}</span>
      <div className="flex items-center">
        <div className={`w-3 h-3 rounded-full mr-2 ${
          ['Online', 'Active', 'Connected', 'Operational'].includes(status) ? 'bg-green-500' :
          ['Offline', 'Inactive', 'Disconnected', 'Failed'].includes(status) ? 'bg-red-500' :
          ['Maintenance', 'Syncing', 'Degraded', 'Limited'].includes(status) ? 'bg-yellow-500' :
          'bg-red-500'
        }`}></div>
        <span className={`text-sm font-medium ${
          ['Online', 'Active', 'Connected', 'Operational'].includes(status) ? 'text-green-700' :
          ['Offline', 'Inactive', 'Disconnected', 'Failed'].includes(status) ? 'text-red-700' :
          ['Maintenance', 'Syncing', 'Degraded', 'Limited'].includes(status) ? 'text-yellow-700' :
          'text-red-700'
        }`}>
          {status}
        </span>
      </div>
    </div>
  );

  const TabButton = ({ label, icon: Icon, active, onClick }: {
    label: string;
    icon: any;
    active: boolean;
    onClick: () => void;
  }) => (
    <button
      onClick={onClick}
      className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all ${
        active 
          ? 'bg-blue-600 text-white shadow-lg' 
          : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
      }`}
    >
      <Icon className="w-5 h-5 mr-2" />
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Shield className="w-8 h-8 text-blue-600 mr-3" />
                Admin Control Center
              </h1>
              <p className="text-gray-600 mt-2">Emergency Management System Administration</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">System Uptime</p>
                <p className="text-lg font-bold text-green-600">{systemStatus.uptime}%</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Last Update</p>
                <p className="text-sm font-medium text-gray-900">
                  {systemStatus.lastUpdate.toLocaleTimeString()}
                </p>
              </div>
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center">
                <RotateCcw className="w-4 h-4 mr-2" />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-4 mb-8 overflow-x-auto pb-2">
          <TabButton
            label="System Overview"
            icon={BarChart3}
            active={activeTab === 'overview'}
            onClick={() => setActiveTab('overview')}
          />
          <TabButton
            label="User Management"
            icon={Users}
            active={activeTab === 'users'}
            onClick={() => setActiveTab('users')}
          />
          <TabButton
            label="Alert Center"
            icon={Bell}
            active={activeTab === 'alerts'}
            onClick={() => setActiveTab('alerts')}
          />
          <TabButton
            label="System Status"
            icon={Server}
            active={activeTab === 'system'}
            onClick={() => setActiveTab('system')}
          />
          <TabButton
            label="Reports"
            icon={Download}
            active={activeTab === 'reports'}
            onClick={() => setActiveTab('reports')}
          />
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Active Users</p>
                    <p className="text-3xl font-bold text-blue-600 mt-2">
                      {users.filter(u => u.status === 'Online').length}
                    </p>
                  </div>
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Critical Alerts</p>
                    <p className="text-3xl font-bold text-red-600 mt-2">
                      {alerts.filter(a => a.severity === 'Critical' && a.status !== 'Resolved').length}
                    </p>
                  </div>
                  <AlertTriangle className="w-8 h-8 text-red-600" />
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">System Health</p>
                    <p className="text-3xl font-bold text-green-600 mt-2">{systemStatus.uptime}%</p>
                  </div>
                  <Activity className="w-8 h-8 text-green-600" />
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Communications</p>
                    <p className="text-3xl font-bold text-purple-600 mt-2">Operational</p>
                  </div>
                  <MessageSquare className="w-8 h-8 text-purple-600" />
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                  <TrendingUp className="w-5 h-5 text-blue-600 mr-2" />
                  System Performance
                </h3>
                <div className="h-80">
                  <Line 
                    data={systemMetricsData} 
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        y: {
                          beginAtZero: true,
                          max: 100,
                        },
                      },
                    }} 
                  />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                  <PieChartIcon className="w-5 h-5 text-purple-600 mr-2" />
                  Alert Distribution
                </h3>
                <div className="h-80">
                  <Doughnut 
                    data={alertDistribution}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'bottom',
                        },
                      },
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
              <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center">
                <UserCheck className="w-4 h-4 mr-2" />
                Add User
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-800">Active Users</h3>
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                      <input 
                        type="text"
                        placeholder="Search users..."
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <select 
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      aria-label="Filter users by role"
                    >
                      <option>All Roles</option>
                      <option>Admin</option>
                      <option>Operator</option>
                      <option>Responder</option>
                      <option>Viewer</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left py-3 px-6 font-semibold text-gray-700">User</th>
                      <th className="text-left py-3 px-6 font-semibold text-gray-700">Role</th>
                      <th className="text-left py-3 px-6 font-semibold text-gray-700">Status</th>
                      <th className="text-left py-3 px-6 font-semibold text-gray-700">Location</th>
                      <th className="text-left py-3 px-6 font-semibold text-gray-700">Last Active</th>
                      <th className="text-left py-3 px-6 font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-6">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                              <span className="text-blue-600 font-semibold">
                                {user.name.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{user.name}</p>
                              <p className="text-sm text-gray-600">{user.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            user.role === 'Admin' ? 'bg-purple-100 text-purple-800' :
                            user.role === 'Operator' ? 'bg-blue-100 text-blue-800' :
                            user.role === 'Responder' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center">
                            <div className={`w-3 h-3 rounded-full mr-2 ${
                              user.status === 'Online' ? 'bg-green-500' :
                              user.status === 'Away' ? 'bg-yellow-500' :
                              'bg-gray-400'
                            }`}></div>
                            <span className="text-sm">{user.status}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-gray-600">{user.location || 'Unknown'}</td>
                        <td className="py-4 px-6 text-gray-600 text-sm">
                          {user.lastActive.toLocaleString()}
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-2">
                            <button className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-green-600 hover:bg-green-100 rounded-lg">
                              <Settings className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'alerts' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Alert Center</h2>
              <div className="flex items-center space-x-4">
                <select 
                  aria-label="Filter alerts by time range"
                  value={selectedTimeRange}
                  onChange={(e) => setSelectedTimeRange(e.target.value as any)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="1h">Last Hour</option>
                  <option value="24h">Last 24 Hours</option>
                  <option value="7d">Last 7 Days</option>
                  <option value="30d">Last 30 Days</option>
                </select>
                <button className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center">
                  <Bell className="w-4 h-4 mr-2" />
                  New Alert
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Critical</p>
                    <p className="text-2xl font-bold text-red-600">
                      {alerts.filter(a => a.severity === 'Critical').length}
                    </p>
                  </div>
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">High</p>
                    <p className="text-2xl font-bold text-orange-600">
                      {alerts.filter(a => a.severity === 'High').length}
                    </p>
                  </div>
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Medium</p>
                    <p className="text-2xl font-bold text-yellow-600">
                      {alerts.filter(a => a.severity === 'Medium').length}
                    </p>
                  </div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Low</p>
                    <p className="text-2xl font-bold text-green-600">
                      {alerts.filter(a => a.severity === 'Low').length}
                    </p>
                  </div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800">Recent Alerts</h3>
              </div>
              <div className="divide-y divide-gray-100">
                {alerts.map((alert) => (
                  <div key={alert.id} className="p-6 hover:bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className={`w-3 h-3 rounded-full mt-2 ${
                          alert.severity === 'Critical' ? 'bg-red-500' :
                          alert.severity === 'High' ? 'bg-orange-500' :
                          alert.severity === 'Medium' ? 'bg-yellow-500' :
                          'bg-green-500'
                        }`}></div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="font-semibold text-gray-900">{alert.title}</h4>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              alert.type === 'Disaster' ? 'bg-red-100 text-red-800' :
                              alert.type === 'System' ? 'bg-blue-100 text-blue-800' :
                              alert.type === 'Communication' ? 'bg-green-100 text-green-800' :
                              'bg-purple-100 text-purple-800'
                            }`}>
                              {alert.type}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              alert.status === 'New' ? 'bg-red-100 text-red-800' :
                              alert.status === 'Acknowledged' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {alert.status}
                            </span>
                          </div>
                          <p className="text-gray-600 mb-2">{alert.description}</p>
                          <div className="text-sm text-gray-500">
                            <span>{alert.timestamp.toLocaleString()}</span>
                            {alert.assignedTo && (
                              <span className="ml-4">Assigned to: {alert.assignedTo}</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {alert.status === 'New' && (
                          <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                            Acknowledge
                          </button>
                        )}
                        {alert.status !== 'Resolved' && (
                          <button className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700">
                            Resolve
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'system' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">System Status</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                  <Server className="w-5 h-5 text-blue-600 mr-2" />
                  Core Services
                </h3>
                <div className="space-y-4">
                  <StatusIndicator status={systemStatus.server} label="Primary Server" />
                  <StatusIndicator status={systemStatus.database} label="Database" />
                  <StatusIndicator status={systemStatus.aiServices} label="AI Services" />
                  <StatusIndicator status={systemStatus.communications} label="Communications" />
                  <StatusIndicator status={systemStatus.mapping} label="Mapping Service" />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                  <Activity className="w-5 h-5 text-green-600 mr-2" />
                  System Performance
                </h3>
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">CPU Usage</span>
                      <span className="text-sm text-gray-600">67%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full w-cpu-usage"></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Memory Usage</span>
                      <span className="text-sm text-gray-600">54%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full memory-usage-bar"></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Storage Usage</span>
                      <span className="text-sm text-gray-600">78%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-yellow-600 h-2 rounded-full storage-usage-bar"></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Network Usage</span>
                      <span className="text-sm text-gray-600">23%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full network-usage-bar"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                <Database className="w-5 h-5 text-purple-600 mr-2" />
                Recent System Events
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 px-4 bg-green-50 rounded-lg">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900">System backup completed</p>
                      <p className="text-sm text-gray-600">Automated daily backup successful</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">2 hours ago</span>
                </div>
                
                <div className="flex items-center justify-between py-3 px-4 bg-yellow-50 rounded-lg">
                  <div className="flex items-center">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900">High memory usage detected</p>
                      <p className="text-sm text-gray-600">Memory usage exceeded 80% threshold</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">4 hours ago</span>
                </div>
                
                <div className="flex items-center justify-between py-3 px-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center">
                    <Zap className="w-5 h-5 text-blue-600 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900">AI service updated</p>
                      <p className="text-sm text-gray-600">OpenAI integration updated to latest version</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">6 hours ago</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">System Reports</h2>
              <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center">
                <Download className="w-4 h-4 mr-2" />
                Generate Report
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: 'Disaster Response Report', desc: 'Comprehensive disaster response analytics', icon: AlertTriangle, color: 'red' },
                { title: 'System Performance Report', desc: 'Server and system performance metrics', icon: Activity, color: 'blue' },
                { title: 'User Activity Report', desc: 'User engagement and activity statistics', icon: Users, color: 'green' },
                { title: 'Communication Report', desc: 'Alert delivery and communication metrics', icon: MessageSquare, color: 'purple' },
                { title: 'Security Audit Report', desc: 'Security events and access logs', icon: Shield, color: 'yellow' },
                { title: 'System Health Report', desc: 'Overall system health and uptime', icon: Activity, color: 'indigo' }
              ].map((report, index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-lg ${
                      report.color === 'red' ? 'bg-red-100' :
                      report.color === 'blue' ? 'bg-blue-100' :
                      report.color === 'green' ? 'bg-green-100' :
                      report.color === 'purple' ? 'bg-purple-100' :
                      report.color === 'yellow' ? 'bg-yellow-100' :
                      'bg-indigo-100'
                    }`}>
                      <report.icon className={`w-6 h-6 ${
                        report.color === 'red' ? 'text-red-600' :
                        report.color === 'blue' ? 'text-blue-600' :
                        report.color === 'green' ? 'text-green-600' :
                        report.color === 'purple' ? 'text-purple-600' :
                        report.color === 'yellow' ? 'text-yellow-600' :
                        'text-indigo-600'
                      }`} />
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{report.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">{report.desc}</p>
                  <button className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                    Generate
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
