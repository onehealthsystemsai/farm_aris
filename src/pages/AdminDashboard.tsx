import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { useAuth } from '../auth/AuthContext';
import { databaseService, type Registration } from '../utils/database';

const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showExportModal, setShowExportModal] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const allRegistrations = databaseService.getAllRegistrations();
    const registrationStats = databaseService.getRegistrationStats();
    setRegistrations(allRegistrations);
    setStats(registrationStats);
  };

  const handleExportCSV = () => {
    const csvData = databaseService.exportRegistrations();
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `farm-aris-registrations-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setShowExportModal(false);
  };

  const filteredRegistrations = registrations.filter(reg =>
    reg.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reg.phone.includes(searchTerm)
  );

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Icon icon="solar:lock-bold-duotone" className="text-6xl text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-rubik font-bold text-gray-800 mb-2">Access Denied</h2>
          <p className="text-gray-600 font-montserrat">You need admin privileges to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-safari-khaki to-savanna-gold rounded-full flex items-center justify-center">
                <Icon icon="solar:leaf-bold-duotone" className="text-white text-2xl" />
              </div>
              <div>
                <h1 className="text-2xl font-rubik font-bold text-gray-900">Farm Aris Dashboard</h1>
                <p className="text-gray-600 font-montserrat">Welcome back, {user.fullName}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Icon icon="solar:logout-bold-duotone" className="text-lg" />
              <span className="font-montserrat">Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl p-6 shadow-sm border"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Icon icon="solar:users-group-two-rounded-bold-duotone" className="text-blue-600 text-xl" />
                </div>
                <div>
                  <p className="text-sm font-montserrat text-gray-600">Total Registrations</p>
                  <p className="text-2xl font-rubik font-bold text-gray-900">{stats.totalRegistrations}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl p-6 shadow-sm border"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Icon icon="solar:user-bold-duotone" className="text-green-600 text-xl" />
                </div>
                <div>
                  <p className="text-sm font-montserrat text-gray-600">Total Attendees</p>
                  <p className="text-2xl font-rubik font-bold text-gray-900">{stats.totalAttendees}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl p-6 shadow-sm border"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Icon icon="solar:calendar-bold-duotone" className="text-orange-600 text-xl" />
                </div>
                <div>
                  <p className="text-sm font-montserrat text-gray-600">Friday Attendees</p>
                  <p className="text-2xl font-rubik font-bold text-gray-900">{stats.fridayAttendees}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl p-6 shadow-sm border"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Icon icon="solar:tent-bold-duotone" className="text-purple-600 text-xl" />
                </div>
                <div>
                  <p className="text-sm font-montserrat text-gray-600">Camping</p>
                  <p className="text-2xl font-rubik font-bold text-gray-900">{stats.campingAttendees}</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Search and Export */}
        <div className="bg-white rounded-xl p-6 shadow-sm border mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="relative w-full md:w-96">
              <Icon icon="solar:magnifer-bold-duotone" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
              <input
                type="text"
                placeholder="Search registrations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-safari-khaki focus:outline-none transition-colors font-montserrat"
              />
            </div>
            <button
              onClick={() => setShowExportModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-safari-khaki to-sunset-orange text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300"
            >
              <Icon icon="solar:download-bold-duotone" className="text-lg" />
              <span className="font-montserrat">Export CSV</span>
            </button>
          </div>
        </div>

        {/* Registrations Table */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h3 className="text-lg font-rubik font-bold text-gray-900">
              Registrations ({filteredRegistrations.length})
            </h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-montserrat font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-montserrat font-semibold text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-montserrat font-semibold text-gray-500 uppercase tracking-wider">Attendees</th>
                  <th className="px-6 py-3 text-left text-xs font-montserrat font-semibold text-gray-500 uppercase tracking-wider">Days</th>
                  <th className="px-6 py-3 text-left text-xs font-montserrat font-semibold text-gray-500 uppercase tracking-wider">Registered</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRegistrations.map((registration, index) => (
                  <motion.tr
                    key={registration.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-montserrat font-semibold text-gray-900">{registration.fullName}</div>
                        <div className="text-sm font-montserrat text-gray-500">{registration.mealPreference}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-montserrat text-gray-900">{registration.email}</div>
                        <div className="text-sm font-montserrat text-gray-500">{registration.phone}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-montserrat font-medium bg-blue-100 text-blue-800">
                        {registration.attendees} {registration.attendees === 1 ? 'person' : 'people'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {registration.days.map((day) => (
                          <span
                            key={day}
                            className="inline-flex items-center px-2 py-1 rounded text-xs font-montserrat font-medium bg-green-100 text-green-800"
                          >
                            {day}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-montserrat text-gray-500">
                      {new Date(registration.created_at).toLocaleDateString()}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredRegistrations.length === 0 && (
            <div className="text-center py-12">
              <Icon icon="solar:inbox-bold-duotone" className="text-6xl text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-rubik font-semibold text-gray-900 mb-2">No registrations found</h3>
              <p className="text-gray-500 font-montserrat">
                {searchTerm ? 'Try adjusting your search terms.' : 'Registrations will appear here once people start signing up.'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-safari-khaki to-sunset-orange rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon icon="solar:download-bold-duotone" className="text-white text-3xl" />
              </div>
              <h3 className="text-xl font-rubik font-bold text-gray-900 mb-2">Export Registrations</h3>
              <p className="text-gray-600 font-montserrat mb-6">
                Download all registrations as a CSV file for your records.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowExportModal(false)}
                  className="flex-1 px-4 py-3 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors font-montserrat"
                >
                  Cancel
                </button>
                <button
                  onClick={handleExportCSV}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-safari-khaki to-sunset-orange text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 font-montserrat"
                >
                  Download
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;