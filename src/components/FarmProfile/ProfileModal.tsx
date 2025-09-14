import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';
import type { ProfileCardData, ProfileSection } from './profileData';

interface ProfileModalProps {
  data: ProfileCardData | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ data, isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!data) return null;

  const SectionCard: React.FC<{ section: ProfileSection; index: number }> = ({ section, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
    >
      {/* Section Image */}
      {section.image && (
        <div className="h-64 relative overflow-hidden">
          <img
            src={section.image}
            alt={section.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              const fallback = document.createElement('div');
              fallback.className = `absolute inset-0 bg-gradient-to-br ${data.gradient}`;
              e.currentTarget.parentElement?.appendChild(fallback);
            }}
          />
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute bottom-4 left-4 right-4">
            <h3 className="text-2xl font-rubik font-bold text-white mb-2">
              {section.title}
            </h3>
          </div>
        </div>
      )}

      {/* Section Content */}
      <div className="p-6">
        {!section.image && (
          <h3 className="text-2xl font-rubik font-bold text-gray-800 mb-4 flex items-center gap-3">
            <Icon icon={data.icon} className={`text-${data.color} text-2xl`} />
            {section.title}
          </h3>
        )}

        {/* Stats */}
        {section.stats && (
          <div className="grid grid-cols-3 gap-4 mb-6">
            {section.stats.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="text-center bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors duration-300"
              >
                <Icon icon={stat.icon} className={`text-${data.color} text-3xl mx-auto mb-2`} />
                <div className="text-2xl font-rubik font-bold text-gray-800">{stat.value}</div>
                <div className="text-sm font-montserrat text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Content */}
        <p className="text-gray-700 font-montserrat leading-relaxed text-base">
          {section.content}
        </p>
      </div>
    </motion.div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={onClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.8, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 50 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative w-full h-full max-w-7xl mx-4 bg-white rounded-t-3xl md:rounded-3xl md:max-h-[90vh] flex flex-col shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className={`relative bg-gradient-to-r ${data.gradient} text-white p-6 md:p-8 flex-shrink-0`}>
              {/* Hero Image Background */}
              <div className="absolute inset-0 opacity-20">
                <img
                  src={data.frontImage}
                  alt={data.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="relative z-10">
                {/* Close Button */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="absolute top-0 right-0 bg-white/20 backdrop-blur-md rounded-full p-3 hover:bg-white/30 transition-colors duration-300"
                >
                  <Icon icon="solar:close-circle-bold-duotone" className="text-2xl" />
                </motion.button>

                {/* Title Section */}
                <div className="flex items-start gap-4 mb-6 pr-16">
                  <motion.div
                    animate={{
                      rotate: [0, 10, -10, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="bg-white/20 backdrop-blur-md rounded-2xl p-4 border border-white/30"
                  >
                    <Icon icon={data.icon} className="text-4xl" />
                  </motion.div>
                  
                  <div className="flex-1">
                    <h2 className="text-3xl md:text-4xl font-rubik font-bold mb-3 leading-tight">
                      {data.title}
                    </h2>
                    <p className="text-white/90 font-montserrat text-lg md:text-xl">
                      {data.subtitle}
                    </p>
                  </div>
                </div>

                {/* Highlights Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {data.highlights.map((highlight, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: idx * 0.1 }}
                      className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/20 hover:bg-white/20 transition-colors duration-300"
                    >
                      <div className="flex items-center gap-2">
                        <Icon 
                          icon="solar:check-circle-bold-duotone" 
                          className="text-savanna-gold text-lg flex-shrink-0" 
                        />
                        <span className="text-sm font-montserrat text-white/90 leading-tight">
                          {highlight}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Content - PERFECTLY SMOOTH SCROLLABLE */}
            <div 
              className="flex-1 p-6 md:p-8 bg-gradient-to-b from-white to-gray-50 smooth-scroll"
              style={{
                overflowY: 'auto',
                minHeight: 0,
                scrollbarWidth: 'thin',
                scrollbarColor: '#cbd5e1 #f1f5f9'
              }}
            >
              <div className="max-w-5xl mx-auto">
                {/* Introduction */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="mb-12 text-center"
                >
                  <div className={`w-24 h-1 bg-gradient-to-r ${data.gradient} mx-auto mb-6`} />
                  <p className="text-xl font-montserrat text-gray-700 leading-relaxed max-w-3xl mx-auto">
                    Discover the excellence and innovation that defines our commitment to sustainable practices and community development.
                  </p>
                </motion.div>


                {/* Sections */}
                <div className="space-y-8">
                  {data.sections.map((section, index) => (
                    <SectionCard key={index} section={section} index={index} />
                  ))}
                </div>

                {/* Call to Action */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className={`mt-12 bg-gradient-to-r ${data.gradient} rounded-2xl p-8 text-white text-center`}
                >
                  <h3 className="text-2xl font-rubik font-bold mb-4">
                    Experience {data.title}
                  </h3>
                  <p className="text-white/90 font-montserrat mb-6 max-w-2xl mx-auto">
                    Join us at Farm Aris Grand Opening and witness firsthand the innovation, sustainability, and excellence that defines our operations.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-white/20 backdrop-blur-md text-white px-8 py-3 rounded-xl font-montserrat font-semibold hover:bg-white/30 transition-colors duration-300 flex items-center gap-2 mx-auto"
                  >
                    <Icon icon="solar:calendar-bold-duotone" className="text-xl" />
                    Reserve Your Spot
                  </motion.button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProfileModal;