import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { useAuth } from '../auth/AuthContext';

interface LoginPageProps {
  onClose: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        onClose();
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden"
      >
        {/* Header */}
        <div className="relative bg-gradient-to-r from-safari-khaki to-sunset-orange p-8 text-white text-center">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <Icon icon="solar:close-circle-bold-duotone" className="text-xl" />
          </button>
          
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon icon="solar:leaf-bold-duotone" className="text-3xl" />
          </div>
          <h1 className="text-2xl font-rubik font-bold">Farm Aris Admin</h1>
          <p className="text-white/90 font-montserrat">Sign in to access the dashboard</p>
        </div>

        {/* Form */}
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2 text-red-700"
              >
                <Icon icon="solar:warning-circle-bold-duotone" className="text-lg" />
                <span className="text-sm font-montserrat">{error}</span>
              </motion.div>
            )}

            <div>
              <label className="block text-sm font-montserrat font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Icon icon="solar:letter-bold-duotone" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-safari-khaki focus:outline-none transition-colors font-montserrat"
                  placeholder="admin@farmaris.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-montserrat font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Icon icon="solar:lock-password-bold-duotone" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:border-safari-khaki focus:outline-none transition-colors font-montserrat"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <Icon 
                    icon={showPassword ? "solar:eye-closed-bold-duotone" : "solar:eye-bold-duotone"} 
                    className="text-lg" 
                  />
                </button>
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-safari-khaki to-sunset-orange text-white font-semibold py-3 rounded-xl hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {isLoading ? (
                <>
                  <Icon icon="solar:refresh-bold-duotone" className="text-xl animate-spin" />
                  <span className="font-montserrat">Signing in...</span>
                </>
              ) : (
                <>
                  <Icon icon="solar:login-2-bold-duotone" className="text-xl" />
                  <span className="font-montserrat">Sign In</span>
                </>
              )}
            </motion.button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 font-montserrat">
              Demo credentials: admin@farmaris.com / farmaris2025
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;