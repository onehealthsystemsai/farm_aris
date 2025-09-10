import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import ProfileCard from '../FarmProfile/ProfileCard';
import ProfileModal from '../FarmProfile/ProfileModal';
import { farmProfileData } from '../FarmProfile/profileData';
import type { ProfileCardData } from '../FarmProfile/profileData';

// Animated Counter Component
interface CountingNumberProps {
  end: number;
  duration?: number;
  suffix?: string;
}

const CountingNumber: React.FC<CountingNumberProps> = ({ end, duration = 2, suffix = '' }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!isVisible) return;

    const startTime = Date.now();
    const startCount = 0;

    const updateCount = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / (duration * 1000), 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentCount = Math.floor(startCount + (end - startCount) * easeOutQuart);
      
      setCount(currentCount);

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      } else {
        setCount(end);
      }
    };

    const timer = setTimeout(() => {
      updateCount();
    }, 300);

    return () => clearTimeout(timer);
  }, [end, duration, isVisible]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isVisible) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.3 }
    );

    const element = document.getElementById(`counting-number-${end}`);
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [end, isVisible]);

  return (
    <span id={`counting-number-${end}`}>
      {count.toLocaleString()}{suffix}
    </span>
  );
};

const Welcome: React.FC = () => {
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
    <section id="about" className="py-20 bg-gradient-to-b from-white to-namibian-blue/10">
      <div className="section-padding">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-block mb-6">
            <img 
              src="/images/aris logo.jpg" 
              alt="Farm Aris Logo" 
              className="w-32 h-32 object-contain"
            />
          </div>

          <h2 className="text-5xl md:text-6xl font-rubik font-black text-gradient mb-6">
            Welcome to Our Family
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-safari-khaki to-sunset-orange mx-auto mb-8"></div>
          <p className="text-lg md:text-xl text-gray-700 font-montserrat leading-relaxed mb-12">
            Join us for a celebration of growth, community, and the rich agricultural heritage of Namibia. 
            The Aris family invites you to witness the culmination of years of dedication and hard work 
            as we officially open our farm to the community. Through sustainable business growth and the drive to make an impact on society and 
            human livelihood, Nessipark Investments has created Farm Aris as a beacon of excellence in Grootfontein district, Otjozondjupa Region, Namibia. 
            Discover the four pillars of excellence that define Farm Aris - from sustainable charcoal production 
            to wildlife conservation, agricultural innovation, and premium hospitality experiences.
          </p>

          {/* Premium Statistics Section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.4 }}
            className="mb-20"
          >
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                {/* Hectares */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  whileHover={{ y: -8 }}
                  className="text-center group"
                >
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, delay: 0.8 }}
                    className="text-3xl font-rubik font-black text-gray-600 mb-2"
                  >
                    <CountingNumber end={5000} duration={2.5} />
                  </motion.div>
                  <div className="text-xs font-montserrat font-semibold text-gray-500 uppercase tracking-[0.1em]">Hectares</div>
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: "2rem" }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 1.5 }}
                    className="h-0.5 bg-gray-400 mx-auto mt-2 rounded-full"
                  />
                </motion.div>

                {/* Crop Hectares */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  whileHover={{ y: -8 }}
                  className="text-center group"
                >
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, delay: 1.0 }}
                    className="text-3xl font-rubik font-black text-gray-600 mb-2"
                  >
                    <CountingNumber end={100} duration={2.2} suffix="+" />
                  </motion.div>
                  <div className="text-xs font-montserrat font-semibold text-gray-500 uppercase tracking-[0.1em]">Crop Hectares</div>
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: "2rem" }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 1.7 }}
                    className="h-0.5 bg-gray-400 mx-auto mt-2 rounded-full"
                  />
                </motion.div>

                {/* Product Lines */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 1.0 }}
                  whileHover={{ y: -8 }}
                  className="text-center group"
                >
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, delay: 1.2 }}
                    className="text-3xl font-rubik font-black text-gray-600 mb-2"
                  >
                    <CountingNumber end={5} duration={1.8} />
                  </motion.div>
                  <div className="text-xs font-montserrat font-semibold text-gray-500 uppercase tracking-[0.1em]">Product Lines</div>
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: "2rem" }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 1.9 }}
                    className="h-0.5 bg-gray-400 mx-auto mt-2 rounded-full"
                  />
                </motion.div>

                {/* Safari Tents */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 1.2 }}
                  whileHover={{ y: -8 }}
                  className="text-center group"
                >
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, delay: 1.4 }}
                    className="text-3xl font-rubik font-black text-gray-600 mb-2"
                  >
                    <CountingNumber end={10} duration={1.5} />
                  </motion.div>
                  <div className="text-xs font-montserrat font-semibold text-gray-500 uppercase tracking-[0.1em]">Safari Tents</div>
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: "2rem" }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 2.1 }}
                    className="h-0.5 bg-gray-400 mx-auto mt-2 rounded-full"
                  />
                </motion.div>
              </div>
          </motion.div>
        </motion.div>

        {/* Profile Cards Grid - 2x2 Layout */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {farmProfileData.map((profileData) => (
            <ProfileCard
              key={profileData.id}
              data={profileData}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>


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

export default Welcome;