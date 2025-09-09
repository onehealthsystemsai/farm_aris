import React from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { useCountdown } from '../../hooks/useCountdown';

const Hero: React.FC = () => {
  const eventDate = new Date('2025-10-10T16:00:00');
  const timeLeft = useCountdown(eventDate);
  
  const imageUrl = `https://plus.unsplash.com/premium_photo-1661962685099-c6a685e6c61d?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&bust=${Date.now()}`;

  const CountdownBox = ({ value, label }: { value: number; label: string }) => (
    <div className="bg-white/95 backdrop-blur-lg rounded-xl p-4 md:p-6 border border-white shadow-xl">
      <div className="text-3xl md:text-5xl font-rubik font-bold text-gray-800 mb-2">
        {String(value).padStart(2, '0')}
      </div>
      <div className="text-xs md:text-sm text-gray-600 uppercase tracking-wider font-montserrat">
        {label}
      </div>
    </div>
  );

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Beautiful Farm Background */}
      <div className="absolute inset-0 z-0">
        <img 
          src={imageUrl}
          alt="Herd of sheep grazing on dry grass field - Farm Aris"
          className="w-full h-full object-cover"
          crossOrigin="anonymous"
          onLoad={() => console.log('Hero image loaded successfully')}
          onError={(e) => {
            console.error('Hero image failed to load, trying backup:', imageUrl);
            // Try backup image first
            const backupUrl = "https://images.unsplash.com/photo-1500595046743-cd271d694d30?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80";
            if (!e.currentTarget.src.includes('photo-1500595046743')) {
              e.currentTarget.src = backupUrl;
              return;
            }
            // Final fallback to gradient if both images fail
            e.currentTarget.style.display = 'none';
            const fallback = document.createElement('div');
            fallback.className = 'absolute inset-0 bg-gradient-to-br from-acacia-green via-safari-khaki to-sunset-orange';
            e.currentTarget.parentElement?.appendChild(fallback);
          }}
        />
        <div className="absolute inset-0 bg-black/50"></div>
        <motion.div
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.3"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* Floating Safari Animals */}
      <motion.div
        animate={{
          y: [0, -30, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-20 left-10 opacity-20"
      >
        <Icon icon="solar:cat-bold-duotone" className="text-white text-6xl" />
      </motion.div>
      
      <motion.div
        animate={{
          y: [0, 30, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-20 right-10 opacity-20"
      >
        <Icon icon="solar:bird-bold-duotone" className="text-white text-6xl" />
      </motion.div>

      <div className="relative z-20 text-center px-4 max-w-7xl mx-auto">
        {/* Main Title */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-rubik font-black text-white mb-4 drop-shadow-2xl">
            Grand Opening of
          </h1>
          <h2 className="text-6xl md:text-8xl lg:text-9xl font-rubik font-black text-white mb-6 drop-shadow-2xl">
            Farm Aris
          </h2>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-xl md:text-2xl text-white mb-12 font-montserrat drop-shadow-lg"
        >
          A Weekend of Joy, Laughter & Unforgettable Farm Adventures
        </motion.p>

        {/* Countdown Timer */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mb-12"
        >
          <h3 className="text-2xl md:text-3xl font-rubik font-bold text-white mb-8 drop-shadow-lg">
            Grand Opening In
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-3xl mx-auto">
            <CountdownBox value={timeLeft.days} label="Days" />
            <CountdownBox value={timeLeft.hours} label="Hours" />
            <CountdownBox value={timeLeft.minutes} label="Minutes" />
            <CountdownBox value={timeLeft.seconds} label="Seconds" />
          </div>
        </motion.div>

        {/* Event Details */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col md:flex-row items-center justify-center gap-6 mb-12"
        >
          <div className="flex items-center gap-2 text-white drop-shadow-lg">
            <Icon icon="solar:calendar-bold-duotone" className="text-2xl" />
            <span className="font-montserrat font-semibold">October 10-11, 2025</span>
          </div>
          <div className="flex items-center gap-2 text-white drop-shadow-lg">
            <Icon icon="solar:map-point-bold-duotone" className="text-2xl" />
            <span className="font-montserrat font-semibold">Grootfontein, Namibia</span>
          </div>
          <div className="flex items-center gap-2 text-white drop-shadow-lg">
            <Icon icon="solar:t-shirt-bold-duotone" className="text-2xl" />
            <span className="font-montserrat font-semibold">Safari Theme</span>
          </div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-primary flex items-center gap-2 justify-center"
            onClick={() => {
              const element = document.getElementById('rsvp');
              if (element) {
                const offsetTop = element.getBoundingClientRect().top + window.pageYOffset - 80;
                window.scrollTo({ top: offsetTop, behavior: 'smooth' });
              }
            }}
          >
            <Icon icon="solar:letter-bold-duotone" className="text-xl" />
            RSVP Now
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-white/90 backdrop-blur-md text-gray-800 font-semibold rounded-full border-2 border-white hover:bg-white transition-all duration-300 flex items-center gap-2 justify-center"
            onClick={() => {
              const element = document.getElementById('schedule');
              if (element) {
                const offsetTop = element.getBoundingClientRect().top + window.pageYOffset - 80;
                window.scrollTo({ top: offsetTop, behavior: 'smooth' });
              }
            }}
          >
            <Icon icon="solar:calendar-date-bold-duotone" className="text-xl" />
            View Schedule
          </motion.button>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <Icon icon="solar:double-alt-arrow-down-bold-duotone" className="text-white text-3xl opacity-60" />
      </motion.div>
    </section>
  );
};

export default Hero;