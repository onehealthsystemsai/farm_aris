import React from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { useCountdown } from '../../hooks/useCountdown';

const Hero: React.FC = () => {
  const eventDate = new Date('2025-10-10T16:00:00');
  const timeLeft = useCountdown(eventDate);
  
  // Farm Aris field images - showcasing our actual farm
  const farmImages = [
    '/images/faris2.jpg', // Your beautiful wide-angle cabbage field with tractor
    '/images/ar.png' // Backup cabbage field image
  ];

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
      {/* Beautiful Farm Aris Background */}
      <div className="absolute inset-0 z-0">
        <img 
          src={farmImages[0]}
          alt="Expansive cabbage fields at Farm Aris with farming equipment - Grootfontein, Namibia"
          className="w-full h-full object-cover"
          onLoad={() => console.log('Farm Aris hero image loaded successfully')}
          onError={(e) => {
            console.error('Primary farm image failed to load, trying backup');
            // Try the backup farm image
            if (!e.currentTarget.src.includes('ar.png')) {
              e.currentTarget.src = farmImages[1];
              e.currentTarget.alt = 'Lush cabbage fields at Farm Aris - Grootfontein, Namibia';
              return;
            }
            // Final fallback to beautiful farm gradient
            e.currentTarget.style.display = 'none';
            const fallback = document.createElement('div');
            fallback.className = 'absolute inset-0 bg-gradient-to-br from-green-600 via-yellow-500 to-orange-500';
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
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-rubik font-black text-white mb-4 drop-shadow-2xl">
            Grand Opening of
          </h1>
          
          {/* Royal Elegant Farm Aris Title */}
          <div className="relative mb-6">
            <div className="flex items-center justify-center gap-6 md:gap-8 lg:gap-12">
              {/* Left Royal Ornament - Elegant Wheat & Scrollwork */}
              <motion.div 
                className="flex items-center gap-3"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1.2, delay: 0.4 }}
              >
                {/* Ornate Scrollwork */}
                <motion.div 
                  className="relative"
                  animate={{ rotate: [0, 2, -2, 0] }}
                  transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                >
                  <svg width="48" height="48" viewBox="0 0 48 48" className="text-yellow-300 opacity-90">
                    <motion.path
                      d="M8 24C8 16 16 8 24 8C32 8 40 16 40 24M40 24C40 32 32 40 24 40C16 40 8 32 8 24M24 12C20 12 16 16 16 20M32 28C28 28 24 32 24 36"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      animate={{ pathLength: [0, 1, 0] }}
                      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    />
                  </svg>
                  {/* Elegant center diamond */}
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    animate={{ scale: [0.8, 1.1, 0.8] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <div className="w-2 h-2 bg-yellow-300 transform rotate-45 opacity-80"></div>
                  </motion.div>
                </motion.div>

                {/* Elegant Wheat Stalk */}
                <motion.div
                  animate={{ y: [0, -3, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Icon icon="solar:leaf-bold-duotone" className="text-yellow-200 text-3xl md:text-4xl opacity-70 transform rotate-12" />
                </motion.div>

                {/* Refined Golden Line */}
                <motion.div
                  className="w-12 md:w-20 h-px relative"
                  style={{ 
                    background: 'linear-gradient(90deg, transparent 0%, rgba(253, 224, 71, 0.8) 50%, transparent 100%)'
                  }}
                  animate={{ scaleX: [0.6, 1.2, 0.6], opacity: [0.4, 0.9, 0.4] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  {/* Elegant dots */}
                  <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-yellow-300 rounded-full opacity-60"></div>
                </motion.div>
              </motion.div>

              {/* Main Title */}
              <motion.h2 
                className="text-6xl md:text-8xl lg:text-9xl font-rubik font-black relative z-10 text-white"
                style={{
                  textShadow: `
                    0 0 10px rgba(255, 255, 255, 0.4),
                    0 0 20px rgba(199, 154, 107, 0.3),
                    0 0 30px rgba(255, 107, 53, 0.2),
                    2px 2px 4px rgba(0, 0, 0, 0.8),
                    4px 4px 8px rgba(0, 0, 0, 0.5)
                  `,
                  filter: 'drop-shadow(0 0 15px rgba(255, 255, 255, 0.2))',
                }}
              >
                <span className="relative">
                  Farm Aris
                  {/* Elegant Shine Sweep - Every 5 Seconds */}
                  <motion.span
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0"
                    style={{
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      mixBlendMode: 'overlay'
                    }}
                    animate={{
                      opacity: [0, 0, 0, 0.5, 0, 0, 0, 0, 0, 0],
                      x: ['-100%', '-100%', '-100%', '100%', '100%', '100%', '100%', '100%', '100%', '100%']
                    }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      times: [0, 0.2, 0.3, 0.7, 0.8, 1]
                    }}
                  />
                </span>
              </motion.h2>

              {/* Right Royal Ornament - Mirrored Elegance */}
              <motion.div 
                className="flex items-center gap-3"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1.2, delay: 0.6 }}
              >
                {/* Refined Golden Line */}
                <motion.div
                  className="w-12 md:w-20 h-px relative"
                  style={{ 
                    background: 'linear-gradient(90deg, transparent 0%, rgba(253, 224, 71, 0.8) 50%, transparent 100%)'
                  }}
                  animate={{ scaleX: [0.6, 1.2, 0.6], opacity: [0.4, 0.9, 0.4] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                >
                  {/* Elegant dots */}
                  <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-yellow-300 rounded-full opacity-60"></div>
                </motion.div>

                {/* Elegant Wheat Stalk */}
                <motion.div
                  animate={{ y: [0, -3, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2.5 }}
                >
                  <Icon icon="solar:leaf-bold-duotone" className="text-yellow-200 text-3xl md:text-4xl opacity-70 transform -rotate-12 scale-x-[-1]" />
                </motion.div>

                {/* Ornate Scrollwork - Mirrored */}
                <motion.div 
                  className="relative"
                  animate={{ rotate: [0, -2, 2, 0] }}
                  transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 4 }}
                >
                  <svg width="48" height="48" viewBox="0 0 48 48" className="text-yellow-300 opacity-90 transform scale-x-[-1]">
                    <motion.path
                      d="M8 24C8 16 16 8 24 8C32 8 40 16 40 24M40 24C40 32 32 40 24 40C16 40 8 32 8 24M24 12C20 12 16 16 16 20M32 28C28 28 24 32 24 36"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      animate={{ pathLength: [0, 1, 0] }}
                      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 3 }}
                    />
                  </svg>
                  {/* Elegant center diamond */}
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    animate={{ scale: [0.8, 1.1, 0.8] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                  >
                    <div className="w-2 h-2 bg-yellow-300 transform rotate-45 opacity-80"></div>
                  </motion.div>
                </motion.div>
              </motion.div>
            </div>
            
            {/* Enhanced Celebratory Animations */}
            {/* Floating Confetti */}
            <motion.div
              className="absolute -top-8 left-1/4 w-1.5 h-1.5 bg-yellow-200 rounded-full opacity-70"
              animate={{
                scale: [0, 1.2, 0],
                y: [0, -15, 0],
                opacity: [0, 0.7, 0]
              }}
              transition={{
                duration: 3.5,
                repeat: Infinity,
                ease: "easeOut",
                delay: 1,
              }}
            />
            <motion.div
              className="absolute -top-12 right-1/4 w-1 h-1 bg-orange-200 rounded-full opacity-60"
              animate={{
                scale: [0, 1, 0],
                x: [0, 10, 0],
                opacity: [0, 0.6, 0]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeOut",
                delay: 2.5,
              }}
            />
            <motion.div
              className="absolute -bottom-6 left-1/3 w-1 h-1 bg-green-200 rounded-full opacity-50"
              animate={{
                scale: [0, 1.5, 0],
                y: [0, -8, 0],
                rotate: [0, 180, 360],
                opacity: [0, 0.5, 0]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeOut",
                delay: 0.5,
              }}
            />
            <motion.div
              className="absolute -bottom-10 right-1/3 w-1.5 h-1.5 bg-blue-200 rounded-full opacity-40"
              animate={{
                scale: [0, 0.8, 0],
                x: [0, -12, 0],
                opacity: [0, 0.4, 0]
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeOut",
                delay: 1.5,
              }}
            />
            
            {/* Subtle Royal Sparkles */}
            <motion.div
              className="absolute top-0 left-1/2 transform -translate-x-1/2 w-2 h-2 rounded-full opacity-30"
              style={{
                background: 'radial-gradient(circle, rgba(253, 224, 71, 0.8) 0%, transparent 70%)'
              }}
              animate={{
                scale: [0, 1.5, 0],
                opacity: [0, 0.6, 0]
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeOut",
                delay: 3,
              }}
            />
          </div>
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

        {/* Premium Glassmorphic CTA Buttons */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="flex flex-col sm:flex-row gap-6 justify-center"
        >
          {/* RSVP Now - Premium Glassmorphic Button */}
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="group relative px-10 py-4 backdrop-blur-lg bg-gradient-to-r from-white/20 to-white/10 border border-white/30 rounded-full font-semibold text-white shadow-2xl overflow-hidden transition-all duration-500"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.1) 100%)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.1)',
            }}
            onClick={() => {
              const element = document.getElementById('rsvp');
              if (element) {
                const offsetTop = element.getBoundingClientRect().top + window.pageYOffset - 80;
                window.scrollTo({ top: offsetTop, behavior: 'smooth' });
              }
            }}
          >
            {/* Animated Gradient Background */}
            <motion.div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                background: 'linear-gradient(135deg, rgba(199, 154, 107, 0.3) 0%, rgba(255, 107, 53, 0.3) 100%)',
              }}
              animate={{ 
                background: [
                  'linear-gradient(135deg, rgba(199, 154, 107, 0.3) 0%, rgba(255, 107, 53, 0.3) 100%)',
                  'linear-gradient(135deg, rgba(255, 107, 53, 0.3) 0%, rgba(199, 154, 107, 0.3) 100%)',
                  'linear-gradient(135deg, rgba(199, 154, 107, 0.3) 0%, rgba(255, 107, 53, 0.3) 100%)',
                ]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            
            {/* Button Content */}
            <span className="relative flex items-center gap-3 justify-center font-montserrat font-bold text-lg">
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <Icon icon="solar:letter-bold-duotone" className="text-xl" />
              </motion.div>
              RSVP Now
            </span>
            
            {/* Subtle Inner Glow */}
            <div 
              className="absolute inset-0.5 rounded-full opacity-50 group-hover:opacity-70 transition-opacity duration-500"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
              }}
            />
          </motion.button>

          {/* View Schedule - Elegant Glassmorphic Button */}
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="group relative px-10 py-4 backdrop-blur-lg bg-gradient-to-r from-white/15 to-white/5 border border-white/20 rounded-full font-semibold text-white shadow-2xl overflow-hidden transition-all duration-500"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.08) 50%, rgba(255, 255, 255, 0.05) 100%)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.08)',
            }}
            onClick={() => {
              const element = document.getElementById('schedule');
              if (element) {
                const offsetTop = element.getBoundingClientRect().top + window.pageYOffset - 80;
                window.scrollTo({ top: offsetTop, behavior: 'smooth' });
              }
            }}
          >
            {/* Animated Subtle Background */}
            <motion.div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                background: 'linear-gradient(135deg, rgba(74, 95, 62, 0.2) 0%, rgba(135, 206, 235, 0.2) 100%)',
              }}
              animate={{ 
                background: [
                  'linear-gradient(135deg, rgba(74, 95, 62, 0.2) 0%, rgba(135, 206, 235, 0.2) 100%)',
                  'linear-gradient(135deg, rgba(135, 206, 235, 0.2) 0%, rgba(74, 95, 62, 0.2) 100%)',
                  'linear-gradient(135deg, rgba(74, 95, 62, 0.2) 0%, rgba(135, 206, 235, 0.2) 100%)',
                ]
              }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            
            {/* Button Content */}
            <span className="relative flex items-center gap-3 justify-center font-montserrat font-bold text-lg">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Icon icon="solar:calendar-date-bold-duotone" className="text-xl" />
              </motion.div>
              View Schedule
            </span>
            
            {/* Subtle Inner Highlight */}
            <div 
              className="absolute inset-0.5 rounded-full opacity-40 group-hover:opacity-60 transition-opacity duration-500"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%)',
              }}
            />
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