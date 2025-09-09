import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';

interface EventItem {
  time: string;
  title: string;
  description: string;
  icon: string;
  color: string;
}

const Timeline: React.FC = () => {
  const [activeDay, setActiveDay] = useState<'friday' | 'saturday'>('friday');

  const fridayEvents: EventItem[] = [
    {
      time: '4:00 PM',
      title: 'Welcome & Registration',
      description: 'Arrival and check-in with traditional refreshments',
      icon: 'solar:hand-shake-bold-duotone',
      color: 'from-safari-khaki to-savanna-gold'
    },
    {
      time: '5:00 PM',
      title: 'Farm Tours & Meet the Animals',
      description: 'Explore the farm and meet our livestock',
      icon: 'solar:cat-bold-duotone',
      color: 'from-acacia-green to-safari-khaki'
    },
    {
      time: '6:00 PM',
      title: "Mrs Hanhabo's Birthday Celebration",
      description: 'Special birthday festivities and cake',
      icon: 'solar:cake-bold-duotone',
      color: 'from-sunset-orange to-savanna-gold'
    },
    {
      time: '7:00 PM',
      title: 'Traditional Braai Dinner',
      description: 'Authentic Namibian BBQ under the stars',
      icon: 'solar:fire-bold-duotone',
      color: 'from-earth-brown to-sunset-orange'
    },
    {
      time: '8:30 PM',
      title: 'Bonfire & Storytelling',
      description: 'Gather around the fire with music and stories',
      icon: 'solar:moon-stars-bold-duotone',
      color: 'from-namibian-blue to-acacia-green'
    },
    {
      time: '10:00 PM',
      title: 'Camping Setup',
      description: 'Set up tents for overnight camping',
      icon: 'solar:home-bold-duotone',
      color: 'from-bush-gray to-earth-brown'
    }
  ];

  const saturdayEvents: EventItem[] = [
    {
      time: '7:00 AM',
      title: 'Sunrise & Traditional Coffee',
      description: 'Start the day with Namibian coffee and rusks',
      icon: 'solar:sun-bold-duotone',
      color: 'from-savanna-gold to-sunset-orange'
    },
    {
      time: '9:00 AM',
      title: 'Official Opening Ceremony',
      description: 'Ribbon cutting and blessing of the farm',
      icon: 'solar:cup-star-bold-duotone',
      color: 'from-safari-khaki to-acacia-green'
    },
    {
      time: '10:00 AM',
      title: 'Guided Farm Tours',
      description: 'Comprehensive tours of our farming operations',
      icon: 'solar:compass-bold-duotone',
      color: 'from-acacia-green to-namibian-blue'
    },
    {
      time: '12:00 PM',
      title: 'Traditional Lunch',
      description: 'Local cuisine and specialties',
      icon: 'solar:dish-bold-duotone',
      color: 'from-sunset-orange to-earth-brown'
    },
    {
      time: '2:00 PM',
      title: 'Cultural Performances',
      description: 'Traditional music, dance and entertainment',
      icon: 'solar:music-note-2-bold-duotone',
      color: 'from-namibian-blue to-safari-khaki'
    },
    {
      time: '3:30 PM',
      title: "Children's Activities",
      description: 'Farm games and animal interactions',
      icon: 'solar:gameboy-bold-duotone',
      color: 'from-savanna-gold to-sunset-orange'
    },
    {
      time: '5:00 PM',
      title: 'Community Celebration',
      description: 'Music, dancing, and community fellowship',
      icon: 'solar:users-group-rounded-bold-duotone',
      color: 'from-safari-khaki to-savanna-gold'
    },
    {
      time: '7:00 PM',
      title: 'Farewell Gathering',
      description: 'Closing ceremony and group photos',
      icon: 'solar:camera-bold-duotone',
      color: 'from-earth-brown to-namibian-blue'
    }
  ];

  const events = activeDay === 'friday' ? fridayEvents : saturdayEvents;

  return (
    <section id="schedule" className="py-20 bg-gradient-to-b from-namibian-blue/10 to-white">
      <div className="section-padding max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-rubik font-black text-gradient mb-6">
            Weekend Event Schedule
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-safari-khaki to-sunset-orange mx-auto mb-8"></div>
        </motion.div>

        {/* Day Selector */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex justify-center mb-12"
        >
          <div className="bg-white rounded-full p-2 shadow-xl flex gap-2">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveDay('friday')}
              className={`px-8 py-3 rounded-full font-rubik font-semibold transition-all duration-300 ${
                activeDay === 'friday'
                  ? 'bg-gradient-to-r from-safari-khaki to-savanna-gold text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center gap-2">
                <Icon icon="solar:moon-bold-duotone" className="text-xl" />
                <span>Friday, Oct 10</span>
              </div>
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveDay('saturday')}
              className={`px-8 py-3 rounded-full font-rubik font-semibold transition-all duration-300 ${
                activeDay === 'saturday'
                  ? 'bg-gradient-to-r from-safari-khaki to-savanna-gold text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center gap-2">
                <Icon icon="solar:sun-bold-duotone" className="text-xl" />
                <span>Saturday, Oct 11</span>
              </div>
            </motion.button>
          </div>
        </motion.div>

        {/* Timeline */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeDay}
            initial={{ opacity: 0, x: activeDay === 'friday' ? -50 : 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: activeDay === 'friday' ? 50 : -50 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-safari-khaki to-sunset-orange opacity-20"></div>
            
            <div className="space-y-8">
              {events.map((event, index) => (
                <motion.div
                  key={event.time}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`flex items-center gap-8 ${
                    index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                  }`}
                >
                  <div className={`flex-1 ${index % 2 === 0 ? 'text-right' : 'text-left'}`}>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="inline-block"
                    >
                      <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100">
                        <div className={`flex items-center gap-4 ${index % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
                          <div className={`${index % 2 === 0 ? 'order-2' : 'order-1'}`}>
                            <div className={`w-12 h-12 bg-gradient-to-br ${event.color} rounded-xl flex items-center justify-center`}>
                              <Icon icon={event.icon} className="text-white text-2xl" />
                            </div>
                          </div>
                          <div className={`${index % 2 === 0 ? 'order-1 text-right' : 'order-2 text-left'}`}>
                            <div className="text-sm font-montserrat text-safari-khaki font-semibold mb-1">
                              {event.time}
                            </div>
                            <h3 className="text-xl font-rubik font-bold text-gray-800 mb-2">
                              {event.title}
                            </h3>
                            <p className="text-gray-600 font-montserrat text-sm">
                              {event.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                  
                  <div className="relative">
                    <motion.div
                      whileHover={{ scale: 1.2 }}
                      className={`w-6 h-6 bg-gradient-to-br ${event.color} rounded-full border-4 border-white shadow-lg`}
                    ></motion.div>
                  </div>
                  
                  <div className="flex-1"></div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mt-16"
        >
          <p className="text-lg text-gray-700 font-montserrat mb-6">
            Join us for one or both days of celebration!
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-primary"
            onClick={() => document.getElementById('rsvp')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Reserve Your Spot Now
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default Timeline;