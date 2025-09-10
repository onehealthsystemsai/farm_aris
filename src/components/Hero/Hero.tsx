import React from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { useCountdown } from '../../hooks/useCountdown';

interface CountdownBoxProps {
  value: number;
  label: string;
}

const CountdownBox: React.FC<CountdownBoxProps> = ({ value, label }) => (
  <motion.div
    initial={{ scale: 0.8, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ duration: 0.5 }}
    className="relative p-2 sm:p-4 lg:p-6 rounded-lg sm:rounded-2xl backdrop-blur-sm bg-white/10 border border-white/20 shadow-2xl"
  >
    <div className="text-center">
      <motion.div
        key={value}
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="text-lg sm:text-2xl lg:text-4xl font-bold text-white mb-1"
      >
        {String(value).padStart(2, '0')}
      </motion.div>
      <div className="text-xs sm:text-sm lg:text-base font-montserrat text-white/80 uppercase tracking-wider">
        {label}
      </div>
    </div>
  </motion.div>
);

const Hero: React.FC = () => {
  const targetDate = new Date('2025-01-17T09:00:00');
  const timeLeft = useCountdown(targetDate);

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2532&q=80')"
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/70" />
      </div>

      {/* Floating Animals */}
      <motion.div
        animate={{ y: [-10, 10, -10] }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-20 left-10 opacity-20"
      >
        <Icon icon="solar:leaf-bold-duotone" className="text-white text-6xl" />
      </motion.div>

      <motion.div
        animate={{ y: [10, -10, 10] }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-20 right-10 opacity-20"
      >
        <Icon icon="solar:bird-bold-duotone" className="text-white text-6xl" />
      </motion.div>

      <div className="relative z-20 text-center px-3 sm:px-4 max-w-7xl mx-auto">
        {/* Main Title */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 className="text-2xl sm:text-4xl md:text-6xl lg:text-7xl font-rubik font-black text-white mb-2 sm:mb-4 drop-shadow-2xl">
            Grand Opening of
          </h1>
          
          {/* Farm Aris Title */}
          <div className="relative mb-4 sm:mb-6">
            <motion.h2 
              className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-rubik font-black relative z-10 text-white mb-2"
              style={{
                textShadow: `
                  0 0 10px rgba(255, 255, 255, 0.4),
                  0 0 20px rgba(199, 154, 107, 0.3),
                  2px 2px 4px rgba(0, 0, 0, 0.8)
                `,
              }}
            >
              Farm Aris
            </motion.h2>
          </div>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-sm sm:text-lg md:text-xl lg:text-2xl text-white mb-6 sm:mb-8 lg:mb-12 font-montserrat drop-shadow-lg px-2"
        >
          A Weekend of Joy, Laughter & Unforgettable Farm Adventures
        </motion.p>

        {/* Countdown Timer */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mb-6 sm:mb-8 lg:mb-12"
        >
          <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-rubik font-bold text-white mb-4 sm:mb-6 lg:mb-8 drop-shadow-lg">
            Grand Opening In
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 lg:gap-6 max-w-xs sm:max-w-2xl lg:max-w-3xl mx-auto px-2">
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
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8 lg:mb-12 px-2"
        >
          <div className="flex items-center gap-2 text-white drop-shadow-lg">
            <Icon icon="solar:calendar-bold-duotone" className="text-lg sm:text-xl lg:text-2xl" />
            <span className="font-montserrat font-semibold text-sm sm:text-base">October 10-11, 2025</span>
          </div>
          <div className="flex items-center gap-2 text-white drop-shadow-lg">
            <Icon icon="solar:map-point-bold-duotone" className="text-lg sm:text-xl lg:text-2xl" />
            <span className="font-montserrat font-semibold text-sm sm:text-base">Grootfontein, Namibia</span>
          </div>
          <div className="flex items-center gap-2 text-white drop-shadow-lg">
            <Icon icon="solar:t-shirt-bold-duotone" className="text-lg sm:text-xl lg:text-2xl" />
            <span className="font-montserrat font-semibold text-sm sm:text-base">Safari Theme</span>
          </div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 lg:gap-6 justify-center px-4 sm:px-6"
        >
          {/* RSVP Now Button */}
          <motion.button
            whileHover={{ scale: 1.08, y: -3 }}
            whileTap={{ scale: 0.95 }}
            className="group relative px-6 sm:px-8 lg:px-12 py-3 sm:py-4 lg:py-5 backdrop-blur-md rounded-full font-bold text-white shadow-2xl overflow-hidden transition-all duration-300 w-full sm:w-auto"
            style={{
              background: 'linear-gradient(135deg, #FF6B35 0%, #C19A6B 50%, #FF6B35 100%)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              boxShadow: '0 12px 40px rgba(255, 107, 53, 0.4), 0 0 0 2px rgba(255, 255, 255, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
            }}
            onClick={() => {
              const element = document.getElementById('rsvp');
              if (element) {
                const offsetTop = element.getBoundingClientRect().top + window.pageYOffset - 80;
                window.scrollTo({ top: offsetTop, behavior: 'smooth' });
              }
            }}
          >
            <span className="relative flex items-center gap-2 sm:gap-3 justify-center font-montserrat font-black text-base sm:text-lg lg:text-xl z-10">
              <Icon icon="solar:letter-bold-duotone" className="text-xl sm:text-2xl drop-shadow-lg" />
              <span className="drop-shadow-lg tracking-wide">RSVP NOW</span>
            </span>
          </motion.button>

          {/* View Schedule Button */}
          <motion.button
            whileHover={{ scale: 1.08, y: -3 }}
            whileTap={{ scale: 0.95 }}
            className="group relative px-6 sm:px-8 lg:px-12 py-3 sm:py-4 lg:py-5 backdrop-blur-md rounded-full font-bold text-gray-800 shadow-2xl overflow-hidden transition-all duration-300 w-full sm:w-auto"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.85) 100%)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15), 0 0 0 2px rgba(255, 255, 255, 0.8), inset 0 1px 0 rgba(255, 255, 255, 1)',
            }}
            onClick={() => {
              const element = document.getElementById('schedule');
              if (element) {
                const offsetTop = element.getBoundingClientRect().top + window.pageYOffset - 80;
                window.scrollTo({ top: offsetTop, behavior: 'smooth' });
              }
            }}
          >
            <span className="relative flex items-center gap-2 sm:gap-3 justify-center font-montserrat font-black text-base sm:text-lg lg:text-xl z-10">
              <Icon icon="solar:calendar-date-bold-duotone" className="text-xl sm:text-2xl text-safari-khaki drop-shadow-sm" />
              <span className="tracking-wide text-gray-700">VIEW SCHEDULE</span>
            </span>
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