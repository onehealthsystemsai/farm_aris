import React from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';

const Highlights: React.FC = () => {
  const highlights = [
    {
      icon: 'solar:compass-bold-duotone',
      title: 'Farm Tours',
      description: 'Guided walks through our sustainable farming operations',
      image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80',
      features: ['Meet the animals', 'Learn farming techniques', 'See our equipment']
    },
    {
      icon: 'solar:masks-theater-bold-duotone',
      title: 'Cultural Show',
      description: 'Traditional Namibian music and dance performances',
      image: '/images/youngt.png',
      features: ['Live performances', 'Traditional dances', 'Cultural storytelling']
    },
    {
      icon: 'solar:fire-bold-duotone',
      title: 'Traditional Braai',
      description: 'Authentic Namibian BBQ with local specialties',
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80',
      features: ['Local delicacies', 'Vegetarian options', 'Traditional beverages']
    },
    {
      icon: 'solar:confetti-bold-duotone',
      title: 'Good Vibes',
      description: 'Celebration and social experiences with friends',
      image: '/images/aparty.jpg',
      features: ['Social gatherings', 'Evening entertainment', 'Memorable moments']
    }
  ];

  return (
    <section id="highlights" className="py-20 bg-gradient-to-b from-white to-namibian-blue/10">
      <div className="section-padding">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-rubik font-black text-gradient mb-6">
            Event Highlights
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-safari-khaki to-sunset-orange mx-auto mb-8"></div>
          <p className="text-lg md:text-xl text-gray-700 font-montserrat max-w-3xl mx-auto">
            Experience the best of Farm Aris with these exciting activities and features
          </p>
        </motion.div>

        {/* A Special Weekend Celebration Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative mb-16"
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

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {highlights.map((highlight, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="group cursor-pointer"
            >
              <div className="relative h-full">
                <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 h-full">
                  {/* Image Area */}
                  <div className="h-48 relative overflow-hidden">
                    <img
                      src={highlight.image}
                      alt={highlight.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        // Fallback to gradient if image fails to load
                        e.currentTarget.style.display = 'none';
                        const fallback = document.createElement('div');
                        fallback.className = 'absolute inset-0 bg-gradient-to-br from-safari-khaki to-sunset-orange';
                        e.currentTarget.parentElement?.appendChild(fallback);
                      }}
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-300"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.div
                        animate={{
                          scale: [1, 1.1, 1],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      >
                        <Icon icon={highlight.icon} className="text-white text-6xl opacity-80" />
                      </motion.div>
                    </div>
                    
                    {/* Decorative circles */}
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
                    <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-2xl font-rubik font-bold text-gray-800 mb-3">
                      {highlight.title}
                    </h3>
                    <p className="text-gray-600 font-montserrat mb-4">
                      {highlight.description}
                    </p>
                    
                    {/* Features */}
                    <div className="space-y-2">
                      {highlight.features.map((feature, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.5, delay: idx * 0.1 }}
                          className="flex items-center gap-2"
                        >
                          <Icon 
                            icon="solar:check-circle-bold-duotone" 
                            className="text-safari-khaki text-xl flex-shrink-0" 
                          />
                          <span className="text-sm font-montserrat text-gray-700">
                            {feature}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Hover effect border */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-safari-khaki to-sunset-orange opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl"></div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Special Activities */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-16"
        >
          <div className="bg-gradient-to-r from-safari-khaki to-sunset-orange rounded-3xl p-8 md:p-12 text-white">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-3xl md:text-4xl font-rubik font-bold mb-6">
                  Overnight Camping Experience
                </h3>
                <p className="text-white/90 font-montserrat mb-6 leading-relaxed">
                  For those seeking the full farm experience, join us for overnight camping under 
                  the Namibian stars. Wake up to a beautiful sunrise and traditional breakfast.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Icon icon="solar:tent-bold-duotone" className="text-2xl" />
                    <span className="font-montserrat">Camping Facilities</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon icon="solar:bonfire-bold-duotone" className="text-2xl" />
                    <span className="font-montserrat">Bonfire Stories</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon icon="solar:moon-stars-bold-duotone" className="text-2xl" />
                    <span className="font-montserrat">Stargazing</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon icon="solar:cup-hot-bold-duotone" className="text-2xl" />
                    <span className="font-montserrat">Morning Coffee</span>
                  </div>
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
                  className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
                >
                  <div className="text-center">
                    <Icon icon="solar:stars-line-bold-duotone" className="text-6xl text-savanna-gold mx-auto mb-4" />
                    <h4 className="text-2xl font-rubik font-bold mb-2">Sleep Under the Stars</h4>
                    <p className="text-white/80 font-montserrat">
                      Limited camping spots available - RSVP early!
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Highlights;