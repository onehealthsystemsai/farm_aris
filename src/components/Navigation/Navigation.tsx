import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';
import { useAuth } from '../../auth/AuthContext';
import LoginPage from '../../pages/LoginPage';

const Navigation: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showLogin, setShowLogin] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 50);
      
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollY / totalHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Home', href: '#home', icon: 'solar:home-smile-bold-duotone' },
    { label: 'About', href: '#about', icon: 'solar:info-circle-bold-duotone' },
    { label: 'Schedule', href: '#schedule', icon: 'solar:calendar-bold-duotone' },
    { label: 'Highlights', href: '#highlights', icon: 'solar:star-bold-duotone' },
    { label: 'Location', href: '#location', icon: 'solar:map-point-bold-duotone' },
    { label: 'RSVP', href: '#rsvp', icon: 'solar:letter-bold-duotone' },
  ];

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      const offsetTop = element.getBoundingClientRect().top + window.pageYOffset - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'py-2' : 'py-4'
        }`}
      >
        <div className="section-padding">
          <div className={`rounded-2xl transition-all duration-300 ${
            isScrolled 
              ? 'glass-effect shadow-2xl' 
              : 'bg-white/90 backdrop-blur-md shadow-lg'
          }`}>
            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                {/* Logo */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-white shadow-md">
                    <img
                      src="/images/aris logo.jpg"
                      alt="Farm Aris Logo"
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        // Fallback to icon if logo doesn't load
                        const target = e.currentTarget;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          parent.innerHTML = '<div class="w-full h-full bg-gradient-to-br from-safari-khaki to-savanna-gold rounded-full flex items-center justify-center"><svg class="text-white text-2xl" fill="currentColor" viewBox="0 0 24 24"><path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z"/></svg></div>';
                        }
                      }}
                    />
                  </div>
                  <span className={`font-rubik font-bold text-2xl hidden sm:block ${
                    isScrolled ? 'text-gray-800' : 'text-gray-800'
                  }`}>
                    Farm Aris
                  </span>
                </motion.div>

                {/* Desktop Navigation */}
                <div className="hidden lg:flex items-center gap-1">
                  {navItems.map((item) => (
                    <motion.a
                      key={item.label}
                      href={item.href}
                      onClick={(e) => scrollToSection(e, item.href)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`px-4 py-2 font-montserrat font-medium rounded-lg transition-all duration-300 flex items-center gap-2 ${
                        isScrolled 
                          ? 'text-gray-800 hover:text-safari-khaki hover:bg-safari-khaki/10' 
                          : 'text-gray-700 hover:text-safari-khaki hover:bg-safari-khaki/10'
                      }`}
                    >
                      <Icon icon={item.icon} className="text-lg" />
                      <span>{item.label}</span>
                    </motion.a>
                  ))}
                </div>

                {/* Login Avatar */}
                <div className="flex items-center gap-3">
                  {user ? (
                    <div className="relative">
                      {/* Pulsating Ring for Logged-in Users */}
                      <motion.div
                        className="absolute inset-0 rounded-full border-2 border-green-400"
                        animate={{
                          scale: [1, 1.3, 1],
                          opacity: [0.8, 0.3, 0.8]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowUserMenu(!showUserMenu)}
                        className="relative w-10 h-10 bg-safari-khaki rounded-full flex items-center justify-center text-white hover:bg-safari-khaki/80 transition-all duration-300 border-2 border-green-400"
                      >
                        <Icon icon="solar:user-bold-duotone" className="text-xl" />
                      </motion.button>
                      
                      {showUserMenu && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="absolute right-0 top-12 bg-white/95 backdrop-blur-md rounded-xl p-4 shadow-2xl min-w-48 border border-gray-200"
                        >
                          <div className="text-sm font-montserrat text-gray-700 mb-2">
                            {user.fullName}
                          </div>
                          <div className="text-xs font-montserrat text-gray-500 mb-3">
                            {user.email}
                          </div>
                          {user.role === 'admin' && (
                            <button
                              onClick={() => {
                                window.open('/admin', '_blank');
                                setShowUserMenu(false);
                              }}
                              className="w-full flex items-center gap-2 px-3 py-2 text-safari-khaki hover:bg-safari-khaki/10 rounded-lg transition-colors text-sm font-montserrat mb-2"
                            >
                              <Icon icon="solar:settings-bold-duotone" className="text-lg" />
                              Dashboard
                            </button>
                          )}
                          <button
                            onClick={() => {
                              logout();
                              setShowUserMenu(false);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-montserrat"
                          >
                            <Icon icon="solar:logout-bold-duotone" className="text-lg" />
                            Sign Out
                          </button>
                        </motion.div>
                      )}
                    </div>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowLogin(true)}
                      className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-400 hover:text-gray-600 transition-all duration-300"
                    >
                      <Icon icon="solar:user-bold-duotone" className="text-xl" />
                    </motion.button>
                  )}

                  {/* Mobile Menu Toggle */}
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className={`lg:hidden w-10 h-10 backdrop-blur-md rounded-full flex items-center justify-center transition-all duration-300 ${
                      isScrolled 
                        ? 'bg-gray-800/10 text-gray-800' 
                        : 'bg-gray-800/10 text-gray-800'
                    }`}
                  >
                    <Icon 
                      icon={isMobileMenuOpen ? "solar:close-circle-bold-duotone" : "solar:hamburger-menu-bold-duotone"} 
                      className="text-2xl" 
                    />
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="h-1 bg-white/10 rounded-b-2xl overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-safari-khaki to-sunset-orange"
                style={{ width: `${scrollProgress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 left-4 right-4 z-40 lg:hidden"
          >
            <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-gray-200">
              <div className="flex flex-col gap-2">
                {navItems.map((item) => (
                  <motion.a
                    key={item.label}
                    href={item.href}
                    onClick={(e) => scrollToSection(e, item.href)}
                    whileHover={{ x: 10 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-3 text-gray-700 hover:text-safari-khaki font-montserrat font-medium rounded-lg hover:bg-safari-khaki/10 transition-all duration-300 flex items-center gap-3"
                  >
                    <Icon icon={item.icon} className="text-xl" />
                    <span>{item.label}</span>
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Login Modal */}
      {showLogin && (
        <LoginPage onClose={() => setShowLogin(false)} />
      )}
    </>
  );
};

export default Navigation;