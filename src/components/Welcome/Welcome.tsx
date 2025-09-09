import React from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';

const Welcome: React.FC = () => {
  const features = [
    {
      icon: 'solar:home-smile-bold-duotone',
      title: 'Family Heritage',
      description: 'Three generations of farming excellence',
      image: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      icon: 'solar:leaf-bold-duotone',
      title: 'Sustainable Farming',
      description: 'Eco-friendly practices for a better tomorrow',
      image: 'https://images.unsplash.com/photo-1574263867128-2c5c88e7ecfb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      icon: 'solar:users-group-rounded-bold-duotone',
      title: 'Community Focus',
      description: 'Growing together with our neighbors',
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      icon: 'solar:sun-bold-duotone',
      title: 'Namibian Pride',
      description: 'Celebrating our rich agricultural heritage',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    }
  ];

  return (
    <section id="about" className="py-20 bg-gradient-to-b from-white to-namibian-blue/10">
      <div className="section-padding max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-rubik font-black text-gradient mb-6">
            Welcome to Our Family
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-safari-khaki to-sunset-orange mx-auto mb-8"></div>
          <p className="text-lg md:text-xl text-gray-700 font-montserrat max-w-3xl mx-auto leading-relaxed">
            Join us for a celebration of growth, community, and the rich agricultural heritage of Namibia. 
            The Aris family invites you to witness the culmination of years of dedication and hard work 
            as we officially open our farm to the community.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="group"
            >
              <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 h-full border border-gray-100 overflow-hidden">
                {/* Background Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      // Fallback to gradient if image fails to load
                      e.currentTarget.style.display = 'none';
                      const fallback = document.createElement('div');
                      fallback.className = 'absolute inset-0 bg-gradient-to-br from-safari-khaki to-sunset-orange';
                      e.currentTarget.parentElement?.appendChild(fallback);
                    }}
                  />
                  <div className="absolute inset-0 bg-black/40"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-white/90 backdrop-blur-md rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Icon icon={feature.icon} className="text-safari-khaki text-3xl" />
                    </div>
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-rubik font-bold text-gray-800 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 font-montserrat">
                    {feature.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <div className="bg-gradient-to-r from-acacia-green to-safari-khaki rounded-3xl p-12 text-white overflow-hidden">
            <div className="relative z-10">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <h3 className="text-3xl md:text-4xl font-rubik font-bold mb-6">
                    A Special Weekend Celebration
                  </h3>
                  <p className="text-white/90 font-montserrat mb-6 leading-relaxed">
                    Experience the warmth of Namibian hospitality as we open our gates for two unforgettable days. 
                    From traditional braai dinners under the stars to cultural performances and farm tours, 
                    every moment is designed to create lasting memories.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2">
                      <Icon icon="solar:fire-bold-duotone" className="text-2xl text-savanna-gold" />
                      <span className="font-montserrat">Bonfire Nights</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Icon icon="solar:music-note-2-bold-duotone" className="text-2xl text-savanna-gold" />
                      <span className="font-montserrat">Live Music</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Icon icon="solar:cup-hot-bold-duotone" className="text-2xl text-savanna-gold" />
                      <span className="font-montserrat">Traditional Cuisine</span>
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <motion.div
                    animate={{
                      rotate: [0, 5, -5, 0],
                    }}
                    transition={{
                      duration: 6,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20"
                  >
                    <h4 className="text-2xl font-rubik font-bold mb-4">Special Celebration</h4>
                    <p className="text-white/90 font-montserrat mb-4">
                      Join us in celebrating Mrs. Hanhabo's birthday on Friday evening!
                    </p>
                    <div className="flex items-center gap-3">
                      <Icon icon="solar:cake-bold-duotone" className="text-3xl text-savanna-gold" />
                      <span className="text-lg font-montserrat">Birthday Festivities</span>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
            
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-white/10 to-transparent rounded-full blur-3xl"></div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Welcome;