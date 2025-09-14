import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import ProfileCard from './ProfileCard';
import ProfileModal from './ProfileModal';
import { farmProfileData } from './profileData';
import type { ProfileCardData } from './profileData';

const FarmProfile: React.FC = () => {
  const [selectedProfile, setSelectedProfile] = useState<ProfileCardData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewDetails = (data: ProfileCardData) => {
    setSelectedProfile(data);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProfile(null);
  };

  return (
    <section id="farm-profile" className="py-20 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-32 h-32 bg-safari-khaki rounded-full blur-3xl" />
        <div className="absolute bottom-40 right-20 w-40 h-40 bg-sunset-orange rounded-full blur-3xl" />
        <div className="absolute top-60 right-40 w-24 h-24 bg-acacia-green rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-40 w-36 h-36 bg-namibian-blue rounded-full blur-3xl" />
      </div>

      <div className="section-padding max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            animate={{
              rotate: [0, 5, -5, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="inline-block bg-gradient-to-r from-safari-khaki to-sunset-orange rounded-2xl p-4 mb-6"
          >
            <Icon icon="solar:buildings-3-bold-duotone" className="text-white text-5xl" />
          </motion.div>

          <h2 className="text-5xl md:text-6xl font-rubik font-black text-gradient mb-6">
            Farm Aris Excellence
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-safari-khaki to-sunset-orange mx-auto mb-8" />
          <p className="text-lg md:text-xl text-gray-700 font-montserrat max-w-3xl mx-auto leading-relaxed">
            Discover the four pillars of excellence that define Farm Aris - from sustainable charcoal production 
            to wildlife conservation, agricultural innovation, and premium hospitality experiences.
          </p>

          {/* Key Statistics */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 max-w-4xl mx-auto"
          >
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-rubik font-black text-safari-khaki mb-2">5,000</div>
              <div className="text-sm font-montserrat text-gray-600">Hectares</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-rubik font-black text-sunset-orange mb-2">100+</div>
              <div className="text-sm font-montserrat text-gray-600">Crop Hectares</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-rubik font-black text-acacia-green mb-2">5</div>
              <div className="text-sm font-montserrat text-gray-600">Product Lines</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-rubik font-black text-namibian-blue mb-2">10</div>
              <div className="text-sm font-montserrat text-gray-600">Safari Tents</div>
            </div>
          </motion.div>
        </motion.div>

        {/* Profile Cards Grid - 2x2 Layout */}
        <div className="grid md:grid-cols-2 gap-8 mb-16 max-w-4xl mx-auto">
          {farmProfileData.map((profileData) => (
            <ProfileCard
              key={profileData.id}
              data={profileData}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>

        {/* Additional Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-gradient-to-r from-safari-khaki via-sunset-orange to-earth-brown rounded-3xl p-8 md:p-12 text-white"
        >
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-3xl md:text-4xl font-rubik font-bold mb-6">
                Sustainable Excellence Since 2025
              </h3>
              <p className="text-white/90 font-montserrat mb-6 leading-relaxed text-lg">
                Through sustainable business growth and the drive to make an impact on society and 
                human livelihood, Nessipark Investments has created Farm Aris as a beacon of 
                excellence in Grootfontein district, Otjozondjupa Region, Namibia.
              </p>
              <div className="space-y-4">
                {[
                  { icon: 'solar:leaf-bold-duotone', text: 'Environmentally friendly strategies' },
                  { icon: 'solar:users-group-rounded-bold-duotone', text: 'Community impact focus' },
                  { icon: 'solar:medal-star-bold-duotone', text: 'Industry-leading quality' },
                  { icon: 'solar:global-bold-duotone', text: 'Long-term partnerships' }
                ].map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <Icon icon={item.icon} className="text-2xl text-savanna-gold" />
                    <span className="font-montserrat">{item.text}</span>
                  </motion.div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <motion.div
                animate={{
                  y: [0, -20, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20"
              >
                <div className="text-center">
                  <Icon icon="solar:buildings-3-bold-duotone" className="text-6xl text-savanna-gold mx-auto mb-4" />
                  <h4 className="text-2xl font-rubik font-bold mb-3">Farm Aris Grand Opening</h4>
                  <p className="text-white/80 font-montserrat mb-6">
                    Experience all four excellence pillars in one unforgettable event
                  </p>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-savanna-gold text-earth-brown py-3 px-6 rounded-xl font-montserrat font-semibold cursor-pointer hover:bg-yellow-400 transition-colors duration-300 inline-flex items-center gap-2"
                  >
                    <Icon icon="solar:calendar-bold-duotone" className="text-lg" />
                    October 10-11, 2025
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Scroll Hint */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-center mt-12"
        >
          <p className="text-gray-500 font-montserrat text-sm mb-4">
            Click any card to explore, flip for quick info, or view full details
          </p>
          <motion.div
            animate={{
              y: [0, 10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="inline-flex items-center gap-2 text-gray-400"
          >
            <Icon icon="solar:mouse-bold-duotone" className="text-xl" />
            <Icon icon="solar:hand-pointer-bold-duotone" className="text-xl" />
          </motion.div>
        </motion.div>
      </div>

      {/* Profile Modal */}
      <ProfileModal
        data={selectedProfile}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </section>
  );
};

export default FarmProfile;