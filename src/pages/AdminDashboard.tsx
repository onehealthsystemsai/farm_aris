import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';
import { 
  BarChart, Bar, PieChart, Pie, Cell, 
  AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { useAuth } from '../auth/AuthContext';
import { supabase } from '../lib/supabase';

// Custom colors for charts matching the farm theme
const COLORS = {
  primary: '#C19A6B', // Safari Khaki
  secondary: '#4A5F3E', // Acacia Green
  accent: '#FF6B35', // Sunset Orange
  earth: '#8B4513', // Rich Brown
  sky: '#87CEEB', // Namibian Blue
  gold: '#DAA520', // Savanna Gold
  forest: '#228B22', // Forest Green
  sunset: '#FF8C00', // Dark Orange
};

const CHART_COLORS = [
  COLORS.primary, COLORS.secondary, COLORS.accent, COLORS.earth,
  COLORS.sky, COLORS.gold, COLORS.forest, COLORS.sunset
];

interface DashboardData {
  overview: {
    total_rsvps?: number;
    total_attendees?: number;
    vip_attendees?: number;
    avg_group_size?: string;
    vegetarian_count?: number;
    vegan_count?: number;
    halal_count?: number;
    gluten_free_count?: number;
    day_1_attendees?: number;
    day_2_attendees?: number;
    both_days_attendees?: number;
    solo_attendees?: number;
    couple_groups?: number;
    family_groups?: number;
  };
  demographics: DemographicData[];
  foodDrinks: FoodDrinkData[];
  attendance: AttendanceData[];
  popular: PopularSelectionData[];
}

interface DemographicData {
  rsvp_id: string;
  full_name: string;
  email: string;
  group_type: string;
  relationship_type: string;
  total_attendees: number;
  table_number?: string;
  seat_number?: string;
  is_vip: boolean;
  meal_preference?: string;
}

interface FoodDrinkData {
  id: string;
  name: string;
  category: string;
  selections: number;
}

interface AttendanceData {
  id: string;
  name: string;
  email: string;
  num_guests: number;
  ticket_id?: string;
}

interface PopularSelectionData {
  item_name: string;
  item_type: 'food' | 'drink';
  category: string;
  selection_count: number;
  total_quantity: number;
  is_vegetarian?: boolean;
  is_vegan?: boolean;
  is_halal?: boolean;
  is_gluten_free?: boolean;
}

interface TeamUser {
  id: string;
  full_name: string;
  email: string;
  role: string;
  committee: string;
  status: 'active' | 'busy' | 'away' | 'offline';
  is_leader: boolean;
  avatar_url?: string;
}

interface TeamActivity {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'done';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  committee: string;
  assigned_to?: string;
  assigned_user?: {
    full_name: string;
    avatar_url?: string;
    committee: string;
  };
  creator?: {
    full_name: string;
  };
  due_date?: string;
  estimated_hours?: number;
}

interface TeamData {
  users: TeamUser[];
  activities: TeamActivity[];
}

const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [tabLoading, setTabLoading] = useState<{ [key: string]: boolean }>({});

  const tabs = [
    { id: 'overview', name: 'Overview', icon: 'solar:chart-bold-duotone' },
    { id: 'attendees', name: 'Attendees', icon: 'solar:users-group-two-rounded-bold-duotone' },
    { id: 'food', name: 'Food', icon: 'solar:fork-knife-bold-duotone' },
    { id: 'drinks', name: 'Drinks', icon: 'solar:cup-hot-bold-duotone' },
    { id: 'analytics', name: 'Analytics', icon: 'solar:graph-new-bold-duotone' },
    { id: 'team', name: 'Team Management', icon: 'solar:users-group-two-rounded-bold-duotone' }
  ];

  useEffect(() => {
    loadInitialData();
  }, []);

  // Fast initial load - only overview data
  const loadInitialData = async () => {
    try {
      setLoading(true);

      // Load only critical overview data first
      const { data: overview } = await supabase
        .from('event_statistics')
        .select('*')
        .single();

      setDashboardData({
        overview: overview || {},
        demographics: [],
        foodDrinks: [],
        attendance: [],
        popular: []
      });

      setLoading(false);

      // Load other data in background
      loadBackgroundData();
    } catch (error) {
      console.error('Error loading initial data:', error);
      setLoading(false);
    }
  };

  // Load remaining data in parallel, in background
  const loadBackgroundData = async () => {
    try {
      // Parallel requests for faster loading
      const [
        { data: demographics },
        { data: foodDrinks },
        { data: popular },
        { data: attendance }
      ] = await Promise.all([
        supabase.from('attendee_demographics').select('*'),
        supabase.from('food_drink_analytics').select('*'),
        supabase.from('popular_selections').select('*'),
        supabase.from('rsvps').select('*, attendance(*)').like('ticket_id', 'FA-2024-%')
      ]);

      setDashboardData(prev => ({
        ...prev!,
        demographics: demographics || [],
        foodDrinks: foodDrinks || [],
        attendance: attendance || [],
        popular: popular || []
      }));
    } catch (error) {
      console.error('Error loading background data:', error);
    }
  };

  // Load data only when tab is accessed
  const loadTabData = useCallback(async (tabId: string) => {
    if (tabLoading[tabId]) return;

    setTabLoading(prev => ({ ...prev, [tabId]: true }));

    try {
      // Load only the data needed for this tab
      switch (tabId) {
        case 'attendees':
          if (!dashboardData?.demographics.length) {
            const { data: demographics } = await supabase
              .from('attendee_demographics')
              .select('*');
            setDashboardData(prev => ({ ...prev!, demographics: demographics || [] }));
          }
          break;
        case 'food':
        case 'drinks':
          if (!dashboardData?.foodDrinks.length) {
            const { data: foodDrinks } = await supabase
              .from('food_drink_analytics')
              .select('*');
            setDashboardData(prev => ({ ...prev!, foodDrinks: foodDrinks || [] }));
          }
          break;
        case 'analytics':
          if (!dashboardData?.popular.length) {
            const { data: popular } = await supabase
              .from('popular_selections')
              .select('*');
            setDashboardData(prev => ({ ...prev!, popular: popular || [] }));
          }
          break;
      }
    } catch (error) {
      console.error(`Error loading ${tabId} data:`, error);
    } finally {
      setTabLoading(prev => ({ ...prev, [tabId]: false }));
    }
  }, [dashboardData, tabLoading]);

  const handleExportCSV = () => {
    // Implementation for CSV export
    console.log('Exporting CSV...');
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-safari-khaki/5 to-acacia-green/5">
        <div className="text-center">
          <Icon icon="solar:lock-bold-duotone" className="text-6xl text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-rubik font-bold text-gray-800 mb-2">Access Denied</h2>
          <p className="text-gray-600 font-montserrat">You need admin privileges to access this page.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-safari-khaki/5 to-acacia-green/5">
        {/* Fast Loading Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="w-full px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-safari-khaki to-sunset-orange rounded-full animate-pulse" />
                <div>
                  <div className="h-6 bg-gray-200 rounded w-40 animate-pulse mb-1" />
                  <div className="h-4 bg-gray-100 rounded w-32 animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Loading Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[1,2,3,4].map(i => (
              <div key={i} className="bg-white rounded-xl p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-24 mb-4" />
                <div className="h-8 bg-gray-100 rounded w-16 mb-2" />
                <div className="h-3 bg-gray-100 rounded w-32" />
              </div>
            ))}
          </div>
          <div className="text-center">
            <div className="inline-flex items-center gap-2 text-safari-khaki">
              <div className="w-4 h-4 border-2 border-safari-khaki border-t-transparent rounded-full animate-spin" />
              <span className="font-montserrat text-sm">Loading dashboard data...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-safari-khaki/5 to-acacia-green/5">
      {/* Header */}
      <div className="bg-white shadow-sm border-b backdrop-blur-sm bg-white/95 sticky top-0 z-40">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-safari-khaki to-sunset-orange rounded-full flex items-center justify-center shadow-lg">
                <Icon icon="solar:leaf-bold-duotone" className="text-white text-2xl" />
              </div>
              <div>
                <h1 className="text-2xl font-rubik font-bold text-gray-900">Farm Aris Dashboard</h1>
                <p className="text-gray-600 font-montserrat text-sm">Welcome back, {user.fullName}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Icon icon="solar:logout-bold-duotone" className="text-lg" />
              <span className="font-montserrat hidden sm:block">Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Premium Navigation Tabs - Mobile Optimized */}
      <div className="w-full px-2 sm:px-4 lg:px-8 pt-4 lg:pt-6">
        <div className="bg-white rounded-xl lg:rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-0 w-full">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    loadTabData(tab.id);
                  }}
                  className={`relative flex flex-col items-center justify-center gap-1 px-1 sm:px-2 lg:px-4 py-2 sm:py-3 lg:py-4 text-xs sm:text-sm font-medium transition-all duration-200 capitalize min-h-[50px] sm:min-h-[60px] ${
                    isActive
                      ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon icon={tab.icon} className={`w-4 sm:w-5 h-4 sm:h-5 ${isActive ? 'text-white' : ''} flex-shrink-0`} />
                  <span className="truncate text-center leading-tight">{tab.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="w-full px-2 sm:px-4 lg:px-8 py-4 lg:py-6">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <OverviewTab key="overview" data={dashboardData} />
          )}
          {activeTab === 'attendees' && (
            <AttendeesTab key="attendees" data={dashboardData} />
          )}
          {activeTab === 'food' && (
            <FoodTab key="food" data={dashboardData} />
          )}
          {activeTab === 'drinks' && (
            <DrinksTab key="drinks" data={dashboardData} />
          )}
          {activeTab === 'analytics' && (
            <AnalyticsTab key="analytics" data={dashboardData} />
          )}
          {activeTab === 'team' && (
            <TeamManagementTab 
            key="team" 
            data={dashboardData} 
            onExport={handleExportCSV}
          />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Overview Tab Component
const OverviewTab: React.FC<{ data: DashboardData | null }> = ({ data }) => {
  if (!data) return null;

  const groupTypeData = data.demographics.reduce((acc: { name: string; value: number; attendees: number }[], demo) => {
    const existing = acc.find(item => item.name === demo.group_type);
    if (existing) {
      existing.value += 1;
      existing.attendees += demo.total_attendees;
    } else {
      acc.push({
        name: demo.group_type,
        value: 1,
        attendees: demo.total_attendees
      });
    }
    return acc;
  }, []);

  const mealPreferenceData = data.demographics.reduce((acc: { name: string; value: number }[], demo) => {
    const existing = acc.find(item => item.name === demo.meal_preference || 'standard');
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({
        name: demo.meal_preference || 'standard',
        value: 1
      });
    }
    return acc;
  }, []);

  const registrationTrend = data.attendance.map((item, index) => ({
    day: `Day ${index + 1}`,
    registrations: Math.floor(Math.random() * 8) + 2, // Simulated daily registrations
    cumulative: index + 1
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Key Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        <StatsCard 
          title="Total RSVPs" 
          value={data.overview.total_rsvps || 0}
          icon="solar:ticket-bold-duotone"
          color="from-blue-500 to-blue-600"
          trend="+12%"
        />
        <StatsCard 
          title="Total Attendees" 
          value={data.overview.total_attendees || 0}
          icon="solar:users-group-two-rounded-bold-duotone"
          color="from-green-500 to-green-600"
          trend="+8%"
        />
        <StatsCard 
          title="VIP Guests" 
          value={data.overview.vip_attendees || 0}
          icon="solar:crown-bold-duotone"
          color="from-yellow-500 to-yellow-600"
          trend="+2"
        />
        <StatsCard 
          title="Avg Group Size" 
          value={parseFloat(data.overview.avg_group_size || '0').toFixed(1)}
          icon="solar:group-bold-duotone"
          color="from-purple-500 to-purple-600"
          trend="2.3"
        />
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Group Types Pie Chart */}
        <ChartCard title="Group Composition" icon="solar:pie-chart-bold-duotone">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={groupTypeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {groupTypeData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Meal Preferences Bar Chart */}
        <ChartCard title="Dietary Preferences" icon="solar:cup-hot-bold-duotone">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={mealPreferenceData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="value" fill={COLORS.primary} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Registration Trend */}
      <ChartCard title="Registration Trend" icon="solar:graph-new-bold-duotone">
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={registrationTrend}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis dataKey="day" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Area 
              type="monotone" 
              dataKey="cumulative" 
              stroke={COLORS.primary} 
              fill={COLORS.primary} 
              fillOpacity={0.3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>
    </motion.div>
  );
};

// Attendees Tab Component
const AttendeesTab: React.FC<{ data: DashboardData | null }> = ({ data }) => {
  if (!data) return null;

  const relationshipData = data.demographics.reduce((acc: { name: string; value: number }[], demo) => {
    const existing = acc.find(item => item.name === demo.relationship_type);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({
        name: demo.relationship_type,
        value: 1
      });
    }
    return acc;
  }, []);

  const vipData = [
    { name: 'Regular', value: (data.overview.total_rsvps || 0) - (data.overview.vip_attendees || 0) },
    { name: 'VIP', value: data.overview.vip_attendees || 0 }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Relationship Types */}
        <ChartCard title="Who's Coming Together" icon="solar:heart-bold-duotone">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={relationshipData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {relationshipData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* VIP Status */}
        <ChartCard title="Guest Status" icon="solar:star-bold-duotone">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={vipData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, value }: any) => `${name}: ${value}`}
              >
                {vipData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={index === 0 ? COLORS.secondary : COLORS.gold} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Attendees Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="px-6 py-4 border-b bg-gradient-to-r from-safari-khaki/5 to-sunset-orange/5">
          <h3 className="text-lg font-rubik font-bold text-gray-900 flex items-center gap-2">
            <Icon icon="solar:users-group-two-rounded-bold-duotone" />
            Attendee Breakdown ({data.demographics.length} groups)
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-montserrat font-semibold text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-montserrat font-semibold text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-montserrat font-semibold text-gray-500 uppercase">Size</th>
                <th className="px-6 py-3 text-left text-xs font-montserrat font-semibold text-gray-500 uppercase">Table</th>
                <th className="px-6 py-3 text-left text-xs font-montserrat font-semibold text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.demographics.slice(0, 10).map((attendee) => (
                <tr key={attendee.rsvp_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3 ${
                        attendee.is_vip ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' : 'bg-gradient-to-r from-blue-400 to-blue-600'
                      }`}>
                        {attendee.full_name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-sm font-montserrat font-semibold text-gray-900">{attendee.full_name}</div>
                        <div className="text-sm font-montserrat text-gray-500">{attendee.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-montserrat font-medium bg-blue-100 text-blue-800">
                      {attendee.relationship_type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-montserrat text-gray-900">
                    {attendee.total_attendees} {attendee.total_attendees === 1 ? 'person' : 'people'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-montserrat text-gray-500">
                    {attendee.table_number} - {attendee.seat_number}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-montserrat font-medium ${
                      attendee.is_vip ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {attendee.is_vip ? 'VIP' : 'Regular'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

// Food Tab Component
const FoodTab: React.FC<{ data: DashboardData | null }> = ({ data }) => {
  if (!data) return null;

  const foodData = data.popular.filter(item => item.item_type === 'food').slice(0, 8);
  const foodCategoryData = data.popular.filter(item => item.item_type === 'food').reduce((acc: { name: string; value: number; quantity: number }[], item) => {
    const existing = acc.find(cat => cat.name === item.category);
    if (existing) {
      existing.value += item.selection_count;
    } else {
      acc.push({
        name: item.category,
        value: item.selection_count,
        quantity: item.total_quantity
      });
    }
    return acc;
  }, []);

  const dietaryData = data.popular.filter(item => item.item_type === 'food').reduce((acc: { name: string; value: number }[], item) => {
    if (item.is_vegetarian) acc.push({ name: 'Vegetarian', value: item.selection_count });
    if (item.is_vegan) acc.push({ name: 'Vegan', value: item.selection_count });
    if (item.is_halal) acc.push({ name: 'Halal', value: item.selection_count });
    if (item.is_gluten_free) acc.push({ name: 'Gluten-Free', value: item.selection_count });
    return acc;
  }, []).reduce((acc: { name: string; value: number }[], item) => {
    const existing = acc.find(d => d.name === item.name);
    if (existing) {
      existing.value += item.value;
    } else {
      acc.push(item);
    }
    return acc;
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Food Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Most Popular Food Items" icon="solar:fork-knife-bold-duotone">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={foodData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="item_name" tick={{ fontSize: 10 }} angle={-45} textAnchor="end" />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="total_quantity" fill={COLORS.accent} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Food Categories Distribution" icon="solar:pie-chart-bold-duotone">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={foodCategoryData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {foodCategoryData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Dietary Requirements Radar Chart */}
      <ChartCard title="Special Dietary Requirements" icon="solar:leaf-bold-duotone">
        <ResponsiveContainer width="100%" height={250}>
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={dietaryData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="name" tick={{ fontSize: 12 }} />
            <PolarRadiusAxis />
            <Radar
              name="Selections"
              dataKey="value"
              stroke={COLORS.secondary}
              fill={COLORS.secondary}
              fillOpacity={0.3}
            />
            <Tooltip />
          </RadarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Food Selections Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="px-6 py-4 border-b bg-gradient-to-r from-safari-khaki/5 to-sunset-orange/5">
          <h3 className="text-lg font-rubik font-bold text-gray-900 flex items-center gap-2">
            <Icon icon="solar:fork-knife-bold-duotone" />
            Food Selection Details
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-montserrat font-semibold text-gray-500 uppercase">Food Item</th>
                <th className="px-6 py-3 text-left text-xs font-montserrat font-semibold text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-montserrat font-semibold text-gray-500 uppercase">Selections</th>
                <th className="px-6 py-3 text-left text-xs font-montserrat font-semibold text-gray-500 uppercase">Total Qty</th>
                <th className="px-6 py-3 text-left text-xs font-montserrat font-semibold text-gray-500 uppercase">Dietary Info</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.popular.filter(item => item.item_type === 'food').slice(0, 12).map((item, index) => (
                <tr key={`food-${item.item_name}-${index}`} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Icon 
                        icon="solar:fork-knife-bold-duotone" 
                        className="text-2xl mr-3 text-orange-500" 
                      />
                      <div className="text-sm font-montserrat font-semibold text-gray-900">{item.item_name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-montserrat font-medium bg-green-100 text-green-800">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-montserrat text-gray-900">
                    {item.selection_count}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-montserrat text-gray-900">
                    {item.total_quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex gap-1 flex-wrap">
                      {item.is_vegetarian && <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Vegetarian</span>}
                      {item.is_vegan && <span className="text-xs bg-green-200 text-green-900 px-2 py-1 rounded">Vegan</span>}
                      {item.is_halal && <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Halal</span>}
                      {item.is_gluten_free && <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">GF</span>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

// Drinks Tab Component
const DrinksTab: React.FC<{ data: DashboardData | null }> = ({ data }) => {
  if (!data) return null;

  const drinkData = data.popular.filter(item => item.item_type === 'drink').slice(0, 8);
  const drinkCategoryData = data.popular.filter(item => item.item_type === 'drink').reduce((acc: { name: string; value: number; quantity: number }[], item) => {
    const existing = acc.find(cat => cat.name === item.category);
    if (existing) {
      existing.value += item.selection_count;
    } else {
      acc.push({
        name: item.category,
        value: item.selection_count,
        quantity: item.total_quantity
      });
    }
    return acc;
  }, []);

  const alcoholicData = [
    { 
      name: 'Alcoholic', 
      value: data.popular.filter(item => item.item_type === 'drink' && item.category !== 'soft_drink' && item.category !== 'juice' && item.category !== 'water' && item.category !== 'hot_beverage').reduce((sum, item) => sum + item.selection_count, 0)
    },
    { 
      name: 'Non-Alcoholic', 
      value: data.popular.filter(item => item.item_type === 'drink' && (item.category === 'soft_drink' || item.category === 'juice' || item.category === 'water' || item.category === 'hot_beverage')).reduce((sum, item) => sum + item.selection_count, 0)
    }
  ];

  const brandData = data.popular.filter(item => item.item_type === 'drink').reduce((acc: { name: string; value: number }[], item) => {
    const brand = item.item_name.split(' ')[0]; // Extract brand from name
    const existing = acc.find(b => b.name === brand);
    if (existing) {
      existing.value += item.selection_count;
    } else {
      acc.push({
        name: brand,
        value: item.selection_count
      });
    }
    return acc;
  }, []).sort((a, b) => b.value - a.value).slice(0, 6);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Drinks Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Most Popular Beverages" icon="solar:cup-hot-bold-duotone">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={drinkData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="item_name" tick={{ fontSize: 10 }} angle={-45} textAnchor="end" />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="total_quantity" fill={COLORS.sky} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Alcoholic vs Non-Alcoholic" icon="solar:wine-bold-duotone">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={alcoholicData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, value }: any) => `${name}: ${value}`}
              >
                {alcoholicData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={index === 0 ? COLORS.accent : COLORS.secondary} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Secondary Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Drink Categories" icon="solar:pie-chart-bold-duotone">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={drinkCategoryData}
                cx="50%"
                cy="50%"
                outerRadius={70}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {drinkCategoryData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Popular Brands" icon="solar:star-bold-duotone">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={brandData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis type="number" tick={{ fontSize: 12 }} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={80} />
              <Tooltip />
              <Bar dataKey="value" fill={COLORS.gold} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Drinks Selections Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="px-6 py-4 border-b bg-gradient-to-r from-safari-khaki/5 to-sunset-orange/5">
          <h3 className="text-lg font-rubik font-bold text-gray-900 flex items-center gap-2">
            <Icon icon="solar:cup-hot-bold-duotone" />
            Beverage Selection Details
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-montserrat font-semibold text-gray-500 uppercase">Beverage</th>
                <th className="px-6 py-3 text-left text-xs font-montserrat font-semibold text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-montserrat font-semibold text-gray-500 uppercase">Selections</th>
                <th className="px-6 py-3 text-left text-xs font-montserrat font-semibold text-gray-500 uppercase">Total Qty</th>
                <th className="px-6 py-3 text-left text-xs font-montserrat font-semibold text-gray-500 uppercase">Type</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.popular.filter(item => item.item_type === 'drink').slice(0, 15).map((item, index) => (
                <tr key={`drink-${item.item_name}-${index}`} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Icon 
                        icon="solar:cup-hot-bold-duotone" 
                        className="text-2xl mr-3 text-blue-500" 
                      />
                      <div className="text-sm font-montserrat font-semibold text-gray-900">{item.item_name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-montserrat font-medium bg-blue-100 text-blue-800">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-montserrat text-gray-900">
                    {item.selection_count}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-montserrat text-gray-900">
                    {item.total_quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-montserrat font-medium ${
                      item.category === 'beer' || item.category === 'wine' || item.category === 'spirits' || item.category === 'cocktail'
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {item.category === 'beer' || item.category === 'wine' || item.category === 'spirits' || item.category === 'cocktail' 
                        ? 'Alcoholic' 
                        : 'Non-Alcoholic'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

// Analytics Tab Component
const AnalyticsTab: React.FC<{ data: DashboardData | null }> = ({ data }) => {
  if (!data) return null;

  // Generate radar chart data for dietary preferences
  const dietaryRadarData = [
    { subject: 'Standard', A: (data.overview.total_rsvps || 0) - (data.overview.vegetarian_count || 0) - (data.overview.vegan_count || 0) - (data.overview.halal_count || 0) - (data.overview.gluten_free_count || 0) },
    { subject: 'Vegetarian', A: data.overview.vegetarian_count },
    { subject: 'Vegan', A: data.overview.vegan_count },
    { subject: 'Halal', A: data.overview.halal_count },
    { subject: 'Gluten-Free', A: data.overview.gluten_free_count },
  ];

  const attendanceData = [
    { name: 'Day 1 Only', value: (data.overview.day_1_attendees || 0) - (data.overview.both_days_attendees || 0) },
    { name: 'Day 2 Only', value: (data.overview.day_2_attendees || 0) - (data.overview.both_days_attendees || 0) },
    { name: 'Both Days', value: data.overview.both_days_attendees }
  ];

  const groupSizeData = [
    { name: 'Solo', value: data.overview.solo_attendees },
    { name: 'Couples', value: data.overview.couple_groups },
    { name: 'Families', value: data.overview.family_groups }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Advanced Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Dietary Preferences Radar */}
        <ChartCard title="Dietary Preferences Analysis" icon="solar:chart-2-bold-duotone">
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={dietaryRadarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12 }} />
              <PolarRadiusAxis />
              <Radar
                name="Count"
                dataKey="A"
                stroke={COLORS.primary}
                fill={COLORS.primary}
                fillOpacity={0.3}
              />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Attendance Days */}
        <ChartCard title="Event Day Attendance" icon="solar:calendar-bold-duotone">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={attendanceData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, value }: any) => `${name}: ${value}`}
              >
                {attendanceData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Group Size Distribution */}
      <ChartCard title="Group Size Distribution" icon="solar:users-group-rounded-bold-duotone">
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={groupSizeData}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="value" fill={COLORS.secondary} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Analytics Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-montserrat text-gray-600">Conversion Rate</p>
              <p className="text-2xl font-rubik font-bold text-gray-900">94.5%</p>
            </div>
            <Icon icon="solar:chart-square-bold-duotone" className="text-3xl text-green-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-montserrat text-gray-600">Avg Response Time</p>
              <p className="text-2xl font-rubik font-bold text-gray-900">2.3 days</p>
            </div>
            <Icon icon="solar:clock-circle-bold-duotone" className="text-3xl text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-montserrat text-gray-600">Completion Rate</p>
              <p className="text-2xl font-rubik font-bold text-gray-900">98.2%</p>
            </div>
            <Icon icon="solar:verified-check-bold-duotone" className="text-3xl text-purple-500" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Team Management Tab Component (Purple Theme)
const TeamManagementTab: React.FC<{ 
  data: DashboardData | null; 
  onExport: () => void;
}> = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeKanbanTab, setActiveKanbanTab] = useState<'todo' | 'in_progress' | 'done' | 'kanban'>('kanban');
  const [selectedCommittee, setSelectedCommittee] = useState<string>('all');
  const [teamData, setTeamData] = useState<TeamData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showEditTaskModal, setShowEditTaskModal] = useState(false);
  const [showDeleteTaskModal, setShowDeleteTaskModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TeamActivity | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [taskFormData, setTaskFormData] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
    committee: 'all',
    assigned_to: '',
    due_date: '',
    estimated_hours: 1
  });

  // Committee color helper function
  const getCommitteeColors = useCallback((committee: string) => {
    const colors: { [key: string]: { bg: string; border: string; text: string } } = {
      'Security': { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700' },
      'Food': { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700' },
      'Drinks': { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700' },
      'Entertainment': { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700' },
      'Logistics': { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700' },
      'Marketing': { bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-700' },
      'Decoration': { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700' },
      'Accommodation': { bg: 'bg-pink-50', border: 'border-pink-200', text: 'text-pink-700' },
      'Transport': { bg: 'bg-teal-50', border: 'border-teal-200', text: 'text-teal-700' },
      'all': { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-700' },
    };
    return colors[committee] || colors['all'];
  }, []);

  // Memoized helper functions
  const openEditTask = useCallback((task: TeamActivity) => {
    setSelectedTask(task);
    setTaskFormData({
      title: task.title,
      description: task.description,
      priority: task.priority,
      committee: task.committee || 'all',
      assigned_to: task.assigned_to || '',
      due_date: task.due_date || '',
      estimated_hours: task.estimated_hours || 1
    });
    setShowEditTaskModal(true);
  }, []);

  const openDeleteTask = useCallback((task: TeamActivity) => {
    setSelectedTask(task);
    setShowDeleteTaskModal(true);
  }, []);

  const resetTaskForm = useCallback(() => {
    setTaskFormData({
      title: '',
      description: '',
      priority: 'medium',
      committee: 'all',
      assigned_to: '',
      due_date: '',
      estimated_hours: 1
    });
  }, []);

  // Memoized computed values for better performance
  const committees = useMemo(() => 
    ['all', ...Array.from(new Set(teamData?.users?.map((u) => u.committee) || []))], 
    [teamData?.users]
  );
  
  const filteredUsers = useMemo(() => 
    teamData?.users?.filter((user) => 
      (selectedCommittee === 'all' || user.committee === selectedCommittee) &&
      (user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       user.email.toLowerCase().includes(searchTerm.toLowerCase()))
    ) || [], 
    [teamData?.users, selectedCommittee, searchTerm]
  );

  const filteredActivities = useMemo(() => 
    teamData?.activities?.filter((activity) => {
      const matchesCommittee = selectedCommittee === 'all' || activity.committee === selectedCommittee;
      
      // If no specific user is selected, show all activities that match the committee
      if (!selectedUserId) {
        return matchesCommittee;
      }
      
      // Get the selected user's committee
      const selectedUser = teamData?.users?.find(u => u.id === selectedUserId);
      const userCommittee = selectedUser?.committee;
      
      // Show task if:
      // 1. Task is specifically assigned to this user, OR
      // 2. Task is assigned to the user's committee but not to a specific person (committee-wide task)
      const matchesUser = activity.assigned_to === selectedUserId || 
                         (!activity.assigned_to && activity.committee === userCommittee);
      
      return matchesCommittee && matchesUser;
    }) || [], 
    [teamData?.activities, selectedCommittee, selectedUserId, teamData?.users]
  );

  // Memoized status counts for performance
  const statusCounts = useMemo(() => {
    const todoCount = filteredActivities.filter((a) => a.status === 'todo').length;
    const inProgressCount = filteredActivities.filter((a) => a.status === 'in_progress').length;
    const doneCount = filteredActivities.filter((a) => a.status === 'done').length;
    
    return { todoCount, inProgressCount, doneCount };
  }, [filteredActivities]);

  // Load team management data with performance optimizations
  useEffect(() => {
    const loadTeamData = async () => {
      try {
        // Run queries in parallel for faster loading
        const [usersResult, activitiesResult] = await Promise.all([
          supabase
            .from('management_users')
            .select('id, full_name, email, committee, role, status, avatar_url, phone, created_at')
            .order('committee', { ascending: true })
            .limit(100), // Add reasonable limit
          
          supabase
            .from('management_activities')
            .select(`
              id, title, description, status, priority, committee,
              assigned_to, due_date, estimated_hours, created_at, position,
              assigned_user:assigned_to(full_name, avatar_url, committee),
              creator:created_by(full_name)
            `)
            .order('position', { ascending: true })
            .limit(200) // Add reasonable limit
        ]);

        const { data: users, error: usersError } = usersResult;
        const { data: activities, error: activitiesError } = activitiesResult;

        if (usersError) throw usersError;
        if (activitiesError) throw activitiesError;

        setTeamData({ 
          users: users || [], 
          activities: activities || [] 
        });
      } catch (error) {
        console.error('Error loading team data:', error);
        setTeamData({ users: [], activities: [] }); // Fallback to empty state
      } finally {
        setLoading(false);
      }
    };

    loadTeamData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Icon icon="solar:users-group-two-rounded-bold-duotone" className="text-white text-2xl" />
          </div>
          <p className="text-gray-600 font-montserrat">Loading team management...</p>
        </div>
      </div>
    );
  }

  // Task Management Functions
  const handleAddTask = async () => {
    try {
      const { data, error } = await supabase
        .from('management_activities')
        .insert({
          title: taskFormData.title,
          description: taskFormData.description,
          priority: taskFormData.priority,
          committee: taskFormData.committee === 'all' ? null : taskFormData.committee,
          assigned_to: taskFormData.assigned_to || null,
          due_date: taskFormData.due_date || null,
          estimated_hours: taskFormData.estimated_hours,
          status: 'todo',
          created_by: null // Will be handled by RLS/triggers
        })
        .select('*')
        .single();

      if (error) throw error;

      // Refresh team data
      const updatedActivities = [...(teamData?.activities || []), data];
      setTeamData(prev => prev ? { ...prev, activities: updatedActivities } : null);
      
      setShowAddTaskModal(false);
      resetTaskForm();
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleEditTask = async () => {
    if (!selectedTask) return;
    
    try {
      const { error } = await supabase
        .from('management_activities')
        .update({
          title: taskFormData.title,
          description: taskFormData.description,
          priority: taskFormData.priority,
          committee: taskFormData.committee === 'all' ? null : taskFormData.committee,
          assigned_to: taskFormData.assigned_to || null,
          due_date: taskFormData.due_date || null,
          estimated_hours: taskFormData.estimated_hours
        })
        .eq('id', selectedTask.id);

      if (error) throw error;

      // Refresh data
      const updatedActivities = teamData?.activities?.map(activity => 
        activity.id === selectedTask.id 
          ? { ...activity, ...taskFormData }
          : activity
      ) || [];
      
      setTeamData(prev => prev ? { ...prev, activities: updatedActivities } : null);
      setShowEditTaskModal(false);
      setSelectedTask(null);
      resetTaskForm();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDeleteTask = async () => {
    if (!selectedTask) return;
    
    try {
      const { error } = await supabase
        .from('management_activities')
        .delete()
        .eq('id', selectedTask.id);

      if (error) throw error;

      // Refresh data
      const updatedActivities = teamData?.activities?.filter(activity => 
        activity.id !== selectedTask.id
      ) || [];
      
      setTeamData(prev => prev ? { ...prev, activities: updatedActivities } : null);
      setShowDeleteTaskModal(false);
      setSelectedTask(null);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleStatusChange = async (taskId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('management_activities')
        .update({ status: newStatus })
        .eq('id', taskId);

      if (error) throw error;

      // Update local state
      const updatedActivities = teamData?.activities?.map(activity => 
        activity.id === taskId ? { ...activity, status: newStatus } : activity
      ) || [];
      
      setTeamData(prev => prev ? { ...prev, activities: updatedActivities } : null);
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('taskId', taskId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e: React.DragEvent, newStatus: string) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    if (taskId) {
      await handleStatusChange(taskId, newStatus);
    }
  };

  const kanbanTabs = [
    { id: 'kanban', name: 'Kanban', icon: 'solar:widget-3-bold-duotone', count: filteredActivities.length },
    { id: 'todo', name: 'To Do', icon: 'solar:list-bold-duotone', count: statusCounts.todoCount },
    { id: 'in_progress', name: 'In Progress', icon: 'solar:clock-circle-bold-duotone', count: statusCounts.inProgressCount },
    { id: 'done', name: 'Done', icon: 'solar:check-circle-bold-duotone', count: statusCounts.doneCount }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Team Management Header with Sub-tabs - Matching HPMS Style */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Team Management</h2>
              <p className="text-sm text-gray-600">Managing {teamData?.users?.length || 0} team members</p>
            </div>
            <button
              onClick={() => setShowAddTaskModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-all duration-200"
            >
              <Icon icon="solar:add-circle-bold-duotone" />
              <span className="font-montserrat">Add Task</span>
            </button>
          </div>
          
          {/* Kanban Sub-Tabs - Mobile Responsive */}
          <div className="flex gap-1 bg-gray-100 p-1 rounded-lg overflow-x-auto">
            {kanbanTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveKanbanTab(tab.id as 'todo' | 'in_progress' | 'done' | 'kanban')}
                className={`flex-1 flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                  activeKanbanTab === tab.id
                    ? 'bg-white text-purple-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon icon={tab.icon} className="w-3 sm:w-4 h-3 sm:h-4 flex-shrink-0" />
                <span className="hidden sm:inline">{tab.name}</span>
                <span className="sm:hidden">{tab.name.split(' ')[0]}</span>
                <span className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs ${
                  activeKanbanTab === tab.id
                    ? 'bg-purple-100 text-purple-700'
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3-Column Layout - Mobile Responsive */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-3 lg:gap-6 min-h-[400px] lg:min-h-[600px]">
        
        {/* Left Column - Stats & Quick Actions (20% - 2 columns) */}
        <div className="lg:col-span-2 space-y-3 lg:space-y-4">
          {/* Team Progress Bars */}
          <div className="bg-white rounded-xl p-4 lg:p-6 shadow-sm border">
            <h3 className="text-base lg:text-lg font-rubik font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Icon icon="solar:chart-2-bold-duotone" className="text-purple-600 w-5 h-5" />
              <span className="truncate">Progress by Team</span>
            </h3>
            <div className="space-y-4 max-h-64 overflow-y-auto">
              {committees.filter(c => c !== 'all').map((committee) => {
                const committeTasks = filteredActivities.filter(a => a.committee === committee);
                const completedTasks = committeTasks.filter(a => a.status === 'done').length;
                const totalTasks = committeTasks.length;
                const progressPercent = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
                
                return (
                  <div key={committee} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700 truncate">{committee}</span>
                      <span className="text-xs text-gray-500 ml-2">{completedTasks}/{totalTasks}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-indigo-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progressPercent}%` }}
                       />
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{progressPercent.toFixed(0)}% Complete</span>
                      {totalTasks > 0 && (
                        <span className="truncate ml-2">{committeTasks.filter(a => a.status === 'in_progress').length} in progress</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Team Overview Stats - Matching HPMS Style */}
          <div className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white border-0 rounded-xl shadow-sm">
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-base">Team Overview</h3>
                <Icon icon="solar:chart-square-bold-duotone" className="w-5 h-5 opacity-70 flex-shrink-0" />
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-purple-100 text-xs">Total Staff</p>
                  <p className="text-2xl font-bold">{teamData?.users?.length || 0}</p>
                </div>
                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-purple-400/30">
                  <div>
                    <p className="text-purple-100 text-xs">Active</p>
                    <p className="text-lg font-semibold">{teamData?.users?.filter((u) => u.status === 'active').length || 0}</p>
                  </div>
                  <div>
                    <p className="text-purple-100 text-xs">Committees</p>
                    <p className="text-lg font-semibold">9</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Middle Column - Kanban Board Content (60% - 6 columns) */}
        <div className="lg:col-span-6 space-y-3 lg:space-y-4">
          {/* Kanban Content */}
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="p-3 sm:p-4 lg:p-6">
              {activeKanbanTab === 'kanban' ? (
                /* Full Kanban Board View */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
                  {['todo', 'in_progress', 'done'].map((status) => (
                    <div 
                      key={status} 
                      className="space-y-3"
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, status)}
                    >
                      <h4 className="font-semibold text-gray-900 flex items-center gap-2 capitalize text-sm lg:text-base">
                        <div className={`w-3 h-3 rounded-full ${
                          status === 'todo' ? 'bg-gray-400' :
                          status === 'in_progress' ? 'bg-blue-500' : 'bg-green-500'
                        }`} />
                        <span className="truncate">{status.replace('_', ' ')} ({filteredActivities.filter((a) => a.status === status).length})</span>
                      </h4>
                      <div className="space-y-2 max-h-64 sm:max-h-80 lg:max-h-96 overflow-y-auto min-h-[100px] bg-gray-50/50 rounded-lg p-2">
                        {filteredActivities.filter((a) => a.status === status).map((activity) => {
                          const commitColors = getCommitteeColors(activity.committee || 'all');
                          return (
                            <div 
                            key={activity.id} 
                            className={`${commitColors.bg} ${commitColors.border} rounded-lg p-3 sm:p-4 border-2 hover:shadow-md transition-all cursor-move`}
                            draggable
                            onDragStart={(e) => handleDragStart(e, activity.id)}
                            onClick={() => openEditTask(activity)}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <h5 className="font-semibold text-gray-900 text-base mb-1 flex-1">{activity.title}</h5>
                              <div className="flex items-center gap-1 ml-2">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openEditTask(activity);
                                  }}
                                  className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                                  title="Edit task"
                                >
                                  <Icon icon="solar:pen-bold-duotone" className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openDeleteTask(activity);
                                  }}
                                  className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                                  title="Delete task"
                                >
                                  <Icon icon="solar:trash-bin-minimalistic-bold-duotone" className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{activity.description}</p>
                            
                            {/* Team and Assignment Info */}
                            <div className="mb-3">
                              <div className="flex items-center gap-2 mb-1">
                                <Icon icon="solar:users-group-two-rounded-bold-duotone" className={`w-4 h-4 ${commitColors.text.replace('-700', '-600')}`} />
                                <span className={`text-sm font-medium ${commitColors.text}`}>{activity.committee || 'General'}</span>
                              </div>
                              {activity.assigned_user ? (
                                <div className="flex items-center gap-2">
                                  <img 
                                    src={activity.assigned_user.avatar_url || `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=20&h=20&fit=crop&crop=face`}
                                    alt={activity.assigned_user.full_name}
                                    className="w-6 h-6 rounded-full"
                                  />
                                  <span className="text-sm text-gray-600">{activity.assigned_user.full_name}</span>
                                </div>
                              ) : (
                                <div className="flex items-center gap-2">
                                  <Icon icon="solar:users-group-two-rounded-bold" className="w-5 h-5 text-purple-500" />
                                  <span className="text-sm text-purple-600 font-medium">Committee-wide</span>
                                </div>
                              )}
                            </div>
                            
                            {/* Status Change Dropdown */}
                            <div className="mb-2">
                              <select
                                value={activity.status}
                                onChange={(e) => {
                                  e.stopPropagation();
                                  handleStatusChange(activity.id, e.target.value);
                                }}
                                onClick={(e) => e.stopPropagation()}
                                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md bg-white hover:border-purple-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-200 outline-none transition-all font-medium"
                              >
                                <option value="todo">📋 To Do</option>
                                <option value="in_progress">🔄 In Progress</option>
                                <option value="done">✅ Done</option>
                              </select>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className={`px-2 py-1 rounded text-sm font-medium ${
                                  activity.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                                  activity.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                                  activity.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {activity.priority}
                                </span>
                                {activity.estimated_hours && (
                                  <span className="text-sm text-gray-500">{activity.estimated_hours}h</span>
                                )}
                              </div>
                              {activity.due_date && (
                                <span className="text-sm text-gray-500">
                                  {new Date(activity.due_date).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* Individual Status Lists */
                <div className="space-y-3">
                  {filteredActivities.filter((a) => a.status === activeKanbanTab).map((activity) => {
                    const commitColors = getCommitteeColors(activity.committee || 'all');
                    return (
                    <div key={activity.id} className={`${commitColors.bg} ${commitColors.border} rounded-lg p-3 sm:p-4 border-2 hover:shadow-md transition-all`}>
                      <div className="flex items-start justify-between mb-2">
                        <h5 className="text-base font-semibold text-gray-900">{activity.title}</h5>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openEditTask(activity);
                            }}
                            className="p-1 text-gray-400 hover:text-purple-600 transition-colors"
                            title="Edit task"
                          >
                            <Icon icon="solar:pen-bold-duotone" className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openDeleteTask(activity);
                            }}
                            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                            title="Delete task"
                          >
                            <Icon icon="solar:trash-bin-minimalistic-bold-duotone" className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{activity.description}</p>
                      
                      {/* Team and Assignment Info */}
                      <div className="mb-3">
                        <div className="flex items-center gap-2 mb-1">
                          <Icon icon="solar:users-group-two-rounded-bold-duotone" className={`w-4 h-4 ${commitColors.text.replace('-700', '-600')}`} />
                          <span className={`text-sm font-medium ${commitColors.text}`}>{activity.committee || 'General'}</span>
                        </div>
                        {activity.assigned_user ? (
                          <div className="flex items-center gap-2">
                            <img 
                              src={activity.assigned_user.avatar_url || `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=20&h=20&fit=crop&crop=face`}
                              alt={activity.assigned_user.full_name}
                              className="w-6 h-6 rounded-full"
                            />
                            <span className="text-sm text-gray-600">{activity.assigned_user.full_name}</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Icon icon="solar:users-group-two-rounded-bold" className="w-5 h-5 text-purple-500" />
                            <span className="text-sm text-purple-600 font-medium">Committee-wide</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Status Change Dropdown */}
                      <div className="mb-2">
                        <select
                          value={activity.status}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleStatusChange(activity.id, e.target.value);
                          }}
                          onClick={(e) => e.stopPropagation()}
                          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md bg-white hover:border-purple-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-200 outline-none transition-all font-medium"
                        >
                          <option value="todo">📋 To Do</option>
                          <option value="in_progress">🔄 In Progress</option>
                          <option value="done">✅ Done</option>
                        </select>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded text-sm font-medium ${
                            activity.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                            activity.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                            activity.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {activity.priority}
                          </span>
                          {activity.estimated_hours && (
                            <span className="text-sm text-gray-500">{activity.estimated_hours}h</span>
                          )}
                        </div>
                        {activity.due_date && (
                          <span className="text-sm text-gray-500">
                            {new Date(activity.due_date).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Team List (20% - 2 columns) */}
        <div className="lg:col-span-2 space-y-3 lg:space-y-4">
          {/* Search and Filter */}
          <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm border">
            <div className="relative mb-4">
              <Icon icon="solar:magnifer-bold-duotone" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search team members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition-colors font-montserrat text-sm"
              />
            </div>
            
            <select
              value={selectedCommittee}
              onChange={(e) => setSelectedCommittee(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition-colors font-montserrat text-sm"
            >
              {committees.map(committee => (
                <option key={committee} value={committee}>
                  {committee === 'all' ? 'All Committees' : committee}
                </option>
              ))}
            </select>
          </div>

          {/* Team Members List */}
          <div className="bg-white rounded-xl shadow-sm border max-h-[400px] sm:max-h-[500px] overflow-y-auto">
            <div className="p-3 sm:p-4 border-b bg-gradient-to-r from-purple-50 to-indigo-50">
              <h3 className="font-rubik font-bold text-gray-900 flex items-center gap-2 text-sm sm:text-base">
                <Icon icon="solar:users-group-two-rounded-bold-duotone" className="text-purple-600 w-4 sm:w-5 h-4 sm:h-5" />
                <span className="truncate">Team ({filteredUsers.length})</span>
              </h3>
            </div>
            
            <div className="p-1 sm:p-2">
              {filteredUsers.map((user) => (
                <div 
                  key={user.id} 
                  className={`flex items-center gap-2 sm:gap-3 p-2 sm:p-3 hover:bg-purple-50 rounded-lg transition-colors cursor-pointer ${
                    selectedUserId === user.id ? 'bg-purple-100 border-purple-300' : ''
                  }`}
                  onClick={() => setSelectedUserId(selectedUserId === user.id ? null : user.id)}
                >
                  <div className="relative">
                    <img 
                      src={user.avatar_url || `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face`}
                      alt={user.full_name}
                      className="w-8 sm:w-10 h-8 sm:h-10 rounded-full object-cover border-2 border-white shadow-sm"
                    />
                    <div className={`absolute -bottom-1 -right-1 w-3 sm:w-4 h-3 sm:h-4 rounded-full border-2 border-white ${
                      user.status === 'active' ? 'bg-green-500' :
                      user.status === 'busy' ? 'bg-red-500' :
                      user.status === 'away' ? 'bg-yellow-500' : 'bg-gray-400'
                    }`} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1 sm:gap-2">
                      <h4 className="text-xs sm:text-sm font-montserrat font-semibold text-gray-900 truncate">
                        {user.full_name}
                      </h4>
                      {user.is_leader && (
                        <span className="px-1.5 sm:px-2 py-0.5 bg-purple-100 text-purple-800 text-xs rounded font-medium">
                          Leader
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 truncate font-montserrat">{user.role}</p>
                    <p className="text-xs text-purple-600 truncate font-montserrat font-medium">{user.committee}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add Task Modal */}
      {showAddTaskModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
            {/* Header with Gradient */}
            <div className="bg-gradient-to-r from-purple-500 to-indigo-600 px-6 py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                    <Icon icon="solar:add-circle-bold-duotone" className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Add New Task</h3>
                    <p className="text-purple-100 text-sm">Create a new task for your team</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAddTaskModal(false)}
                  className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-white hover:bg-opacity-30 transition-all"
                >
                  <Icon icon="solar:close-circle-bold" className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Form Content */}
            <div className="px-6 py-6">
            
              <div className="space-y-5">
                {/* Task Information Section */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Icon icon="solar:document-text-bold-duotone" className="w-5 h-5 text-purple-600" />
                    <h4 className="font-semibold text-gray-900">Task Information</h4>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Task Title</label>
                      <input
                        type="text"
                        value={taskFormData.title}
                        onChange={(e) => setTaskFormData({...taskFormData, title: e.target.value})}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none transition-all"
                        placeholder="Enter task title..."
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                      <textarea
                        value={taskFormData.description}
                        onChange={(e) => setTaskFormData({...taskFormData, description: e.target.value})}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none transition-all resize-none"
                        rows={3}
                        placeholder="Task description..."
                      />
                    </div>
                  </div>
                </div>
              
                {/* Assignment & Priority Section */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Icon icon="solar:settings-bold-duotone" className="w-5 h-5 text-purple-600" />
                    <h4 className="font-semibold text-gray-900">Assignment & Priority</h4>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                      <select
                        value={taskFormData.priority}
                        onChange={(e) => setTaskFormData({...taskFormData, priority: e.target.value as any})}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none transition-all"
                      >
                        <option value="low">🟢 Low</option>
                        <option value="medium">🟡 Medium</option>
                        <option value="high">🟠 High</option>
                        <option value="urgent">🔴 Urgent</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Committee</label>
                      <select
                        value={taskFormData.committee}
                        onChange={(e) => setTaskFormData({...taskFormData, committee: e.target.value})}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none transition-all"
                      >
                        {committees.map(committee => (
                          <option key={committee} value={committee}>
                            {committee === 'all' ? '🏢 All Committees' : `👥 ${committee}`}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Assign To</label>
                    <select
                      value={taskFormData.assigned_to}
                      onChange={(e) => setTaskFormData({...taskFormData, assigned_to: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none transition-all"
                    >
                      <option value="">👥 Committee-wide (No specific assignee)</option>
                      {filteredUsers.map(user => (
                        <option key={user.id} value={user.id}>
                          👤 {user.full_name} ({user.committee})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Timeline Section */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Icon icon="solar:calendar-bold-duotone" className="w-5 h-5 text-purple-600" />
                    <h4 className="font-semibold text-gray-900">Timeline</h4>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                      <input
                        type="date"
                        value={taskFormData.due_date}
                        onChange={(e) => setTaskFormData({...taskFormData, due_date: e.target.value})}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none transition-all"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Hours</label>
                      <input
                        type="number"
                        min="1"
                        value={taskFormData.estimated_hours}
                        onChange={(e) => setTaskFormData({...taskFormData, estimated_hours: parseInt(e.target.value)})}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none transition-all"
                        placeholder="Hours"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="px-6 py-4 bg-gray-50 flex gap-3">
              <button
                onClick={() => setShowAddTaskModal(false)}
                className="flex-1 px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleAddTask}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl hover:from-purple-600 hover:to-indigo-700 transition-all font-medium shadow-lg flex items-center justify-center gap-2"
              >
                <Icon icon="solar:add-circle-bold" className="w-5 h-5" />
                Add Task
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Task Modal */}
      {showEditTaskModal && selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
            {/* Header with Gradient */}
            <div className="bg-gradient-to-r from-purple-500 to-indigo-600 px-6 py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                    <Icon icon="solar:pen-bold-duotone" className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Edit Task</h3>
                    <p className="text-purple-100 text-sm">Update task details and assignment</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowEditTaskModal(false);
                    setSelectedTask(null);
                    resetTaskForm();
                  }}
                  className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-white hover:bg-opacity-30 transition-all"
                >
                  <Icon icon="solar:close-circle-bold" className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Form Content */}
            <div className="px-6 py-6">
            
              <div className="space-y-5">
                {/* Task Information Section */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Icon icon="solar:document-text-bold-duotone" className="w-5 h-5 text-purple-600" />
                    <h4 className="font-semibold text-gray-900">Task Information</h4>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Task Title</label>
                      <input
                        type="text"
                        value={taskFormData.title}
                        onChange={(e) => setTaskFormData({...taskFormData, title: e.target.value})}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none transition-all"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                      <textarea
                        value={taskFormData.description}
                        onChange={(e) => setTaskFormData({...taskFormData, description: e.target.value})}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none transition-all resize-none"
                        rows={3}
                      />
                    </div>
                  </div>
                </div>

                {/* Assignment & Priority Section */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Icon icon="solar:settings-bold-duotone" className="w-5 h-5 text-purple-600" />
                    <h4 className="font-semibold text-gray-900">Assignment & Priority</h4>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                      <select
                        value={taskFormData.priority}
                        onChange={(e) => setTaskFormData({...taskFormData, priority: e.target.value as any})}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none transition-all"
                      >
                        <option value="low">🟢 Low</option>
                        <option value="medium">🟡 Medium</option>
                        <option value="high">🟠 High</option>
                        <option value="urgent">🔴 Urgent</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Committee</label>
                      <select
                        value={taskFormData.committee}
                        onChange={(e) => setTaskFormData({...taskFormData, committee: e.target.value})}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none transition-all"
                      >
                        {committees.map(committee => (
                          <option key={committee} value={committee}>
                            {committee === 'all' ? '🏢 All Committees' : `👥 ${committee}`}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Assign To</label>
                    <select
                      value={taskFormData.assigned_to}
                      onChange={(e) => setTaskFormData({...taskFormData, assigned_to: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none transition-all"
                    >
                      <option value="">👥 Committee-wide (No specific assignee)</option>
                      {teamData?.users?.map(user => (
                        <option key={user.id} value={user.id}>
                          👤 {user.full_name} ({user.committee})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Timeline Section */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Icon icon="solar:calendar-bold-duotone" className="w-5 h-5 text-purple-600" />
                    <h4 className="font-semibold text-gray-900">Timeline</h4>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                      <input
                        type="date"
                        value={taskFormData.due_date}
                        onChange={(e) => setTaskFormData({...taskFormData, due_date: e.target.value})}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none transition-all"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Hours</label>
                      <input
                        type="number"
                        min="1"
                        value={taskFormData.estimated_hours}
                        onChange={(e) => setTaskFormData({...taskFormData, estimated_hours: parseInt(e.target.value)})}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none transition-all"
                        placeholder="Hours"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="px-6 py-4 bg-gray-50 flex gap-3">
              <button
                onClick={() => {
                  setShowEditTaskModal(false);
                  setSelectedTask(null);
                  resetTaskForm();
                }}
                className="flex-1 px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleEditTask}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl hover:from-purple-600 hover:to-indigo-700 transition-all font-medium shadow-lg flex items-center justify-center gap-2"
              >
                <Icon icon="solar:pen-bold" className="w-5 h-5" />
                Update Task
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Task Modal */}
      {showDeleteTaskModal && selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-red-600">Delete Task</h3>
              <button
                onClick={() => {
                  setShowDeleteTaskModal(false);
                  setSelectedTask(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <Icon icon="solar:close-circle-bold-duotone" className="w-6 h-6" />
              </button>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-600">Are you sure you want to delete this task?</p>
              <p className="font-medium text-gray-900 mt-2">&quot;{selectedTask.title}&quot;</p>
              <p className="text-sm text-red-600 mt-2">This action cannot be undone.</p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteTaskModal(false);
                  setSelectedTask(null);
                }}
                className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteTask}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

// Reusable Components
const StatsCard: React.FC<{
  title: string;
  value: string | number;
  icon: string;
  color: string;
  trend?: string;
}> = ({ title, value, icon, color, trend }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="bg-white rounded-xl p-3 sm:p-4 lg:p-6 shadow-sm border hover:shadow-md transition-all duration-200"
  >
    <div className="flex items-center justify-between">
      <div className="flex-1 min-w-0">
        <p className="text-xs sm:text-sm font-montserrat text-gray-600 mb-1 truncate">{title}</p>
        <p className="text-xl sm:text-2xl lg:text-3xl font-rubik font-bold text-gray-900">{value}</p>
        {trend && (
          <p className="text-xs sm:text-sm font-montserrat text-green-600 mt-1">↗ {trend}</p>
        )}
      </div>
      <div className={`w-10 sm:w-12 h-10 sm:h-12 bg-gradient-to-r ${color} rounded-lg flex items-center justify-center flex-shrink-0 ml-2`}>
        <Icon icon={icon} className="text-white text-lg sm:text-2xl" />
      </div>
    </div>
  </motion.div>
);

const ChartCard: React.FC<{
  title: string;
  icon: string;
  children: React.ReactNode;
}> = ({ title, icon, children }) => (
  <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
    <div className="px-6 py-4 border-b bg-gradient-to-r from-safari-khaki/5 to-sunset-orange/5">
      <h3 className="text-lg font-rubik font-bold text-gray-900 flex items-center gap-2">
        <Icon icon={icon} />
        {title}
      </h3>
    </div>
    <div className="p-6">
      {children}
    </div>
  </div>
);

export default AdminDashboard;