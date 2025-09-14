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
      time: '4:00 PM - 5:00 PM',
      title: 'Arrival & Guest Registration',
      description: 'Guests welcomed at Farm Aris birthday venue. Light snacks & refreshments',
      icon: 'solar:hand-shake-bold-duotone',
      color: 'from-safari-khaki to-savanna-gold'
    },
    {
      time: '5:00 PM - 5:10 PM',
      title: 'Opening Prayer',
      description: 'Led by Pastor',
      icon: 'solar:hands-clapping-bold-duotone',
      color: 'from-namibian-blue to-safari-khaki'
    },
    {
      time: '5:10 PM - 5:25 PM',
      title: 'Welcome & Family Remarks',
      description: 'Short remarks by a family representative',
      icon: 'solar:users-group-rounded-bold-duotone',
      color: 'from-acacia-green to-safari-khaki'
    },
    {
      time: '5:25 PM - 5:45 PM',
      title: 'Birthday Remarks',
      description: 'Mrs. M.M. Hanhapo shares a few words on her special day',
      icon: 'solar:cake-bold-duotone',
      color: 'from-sunset-orange to-savanna-gold'
    },
    {
      time: '5:45 PM - 6:15 PM',
      title: 'Tributes & Short Speeches',
      description: 'Selected family members & friends',
      icon: 'solar:microphone-2-bold-duotone',
      color: 'from-savanna-gold to-earth-brown'
    },
    {
      time: '6:15 PM - 6:45 PM',
      title: 'Photo Shoot Session',
      description: 'Professional photos with family, friends, and invited guests',
      icon: 'solar:camera-bold-duotone',
      color: 'from-earth-brown to-sunset-orange'
    },
    {
      time: '6:45 PM - 7:15 PM',
      title: 'Live Performance',
      description: 'Young T performance',
      icon: 'solar:music-note-2-bold-duotone',
      color: 'from-namibian-blue to-acacia-green'
    },
    {
      time: '7:15 PM onwards',
      title: 'Dinner & Socialising',
      description: 'Informal mingling, music, and family celebration continue into the evening',
      icon: 'solar:dish-bold-duotone',
      color: 'from-bush-gray to-earth-brown'
    }
  ];

  const saturdayEvents: EventItem[] = [
    {
      time: '10:00 AM - 10:30 AM',
      title: 'Arrival & Registration',
      description: 'Guests welcomed and ushered to seating area. Light background traditional music',
      icon: 'solar:hand-shake-bold-duotone',
      color: 'from-savanna-gold to-sunset-orange'
    },
    {
      time: '10:30 AM - 10:40 AM',
      title: 'Opening Prayer',
      description: 'Led by Pastor',
      icon: 'solar:hands-clapping-bold-duotone',
      color: 'from-namibian-blue to-safari-khaki'
    },
    {
      time: '10:40 AM - 10:50 AM',
      title: 'Introduction to Programme',
      description: 'Master of Ceremony',
      icon: 'solar:microphone-2-bold-duotone',
      color: 'from-safari-khaki to-acacia-green'
    },
    {
      time: '10:50 AM - 11:05 AM',
      title: 'Welcoming Remarks',
      description: 'Hon. Regional Governor of Otjozondjupa Region',
      icon: 'solar:podium-bold-duotone',
      color: 'from-acacia-green to-namibian-blue'
    },
    {
      time: '11:05 AM - 11:25 AM',
      title: 'Farm Aris Presentation',
      description: 'Mr. Onesmus H. Hanhapo - Products & Services overview',
      icon: 'solar:presentation-graph-bold-duotone',
      color: 'from-sunset-orange to-earth-brown'
    },
    {
      time: '11:25 AM - 11:40 AM',
      title: 'Motivational Speech',
      description: 'Hon. Sankwasa James Sankwasa - Non-Conventional Agri-Production',
      icon: 'solar:chart-2-bold-duotone',
      color: 'from-namibian-blue to-safari-khaki'
    },
    {
      time: '11:45 AM - 12:15 PM',
      title: 'Keynote & Official Opening',
      description: 'Right Hon. Dr. Elijah T. Ngurare, Prime Minister of Namibia',
      icon: 'solar:cup-star-bold-duotone',
      color: 'from-savanna-gold to-sunset-orange'
    },
    {
      time: '12:15 PM - 12:35 PM',
      title: 'Ribbon Cutting Ceremony',
      description: 'Unveiling of Corner Plaque led by Prime Minister & Ministers',
      icon: 'solar:scissors-square-bold-duotone',
      color: 'from-safari-khaki to-savanna-gold'
    },
    {
      time: '12:35 PM - 12:50 PM',
      title: 'Vote of Thanks',
      description: 'Hon. Verna Sinimbo, Governor of Kavango East Region',
      icon: 'solar:heart-bold-duotone',
      color: 'from-earth-brown to-namibian-blue'
    },
    {
      time: '12:50 PM - 1:10 PM',
      title: 'Musical Performance',
      description: 'Young T - Official Event Performance',
      icon: 'solar:music-note-2-bold-duotone',
      color: 'from-sunset-orange to-safari-khaki'
    },
    {
      time: '1:10 PM - 3:10 PM',
      title: 'Refreshments & Networking',
      description: 'Factory & gardens viewing, marketing booths, photo sessions',
      icon: 'solar:wine-glass-bold-duotone',
      color: 'from-acacia-green to-savanna-gold'
    },
    {
      time: '6:00 PM onwards',
      title: 'Evening Celebration',
      description: 'Music by Kuku Nkandanga, Drawer & Young T',
      icon: 'solar:notes-bold-duotone',
      color: 'from-namibian-blue to-sunset-orange'
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
            Comprehensive Programme
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-safari-khaki to-sunset-orange mx-auto mb-8" />
        </motion.div>

        {/* Day Selector */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex justify-center mb-12"
        >
          <div className="bg-white rounded-full p-2 shadow-xl flex gap-1 md:gap-2">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveDay('friday')}
              className={`px-3 md:px-8 py-3 rounded-full font-rubik font-semibold transition-all duration-300 ${
                activeDay === 'friday'
                  ? 'bg-gradient-to-r from-safari-khaki to-savanna-gold text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <div className="flex flex-col md:flex-row items-center gap-1 md:gap-2">
                <Icon icon="solar:cake-bold-duotone" className="text-lg md:text-xl" />
                <div className="text-center md:text-left">
                  <span className="text-sm md:text-base block">Friday, Oct 10</span>
                  <span className="text-xs text-gray-500">40th Birthday Celebration</span>
                </div>
              </div>
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveDay('saturday')}
              className={`px-3 md:px-8 py-3 rounded-full font-rubik font-semibold transition-all duration-300 ${
                activeDay === 'saturday'
                  ? 'bg-gradient-to-r from-safari-khaki to-savanna-gold text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <div className="flex flex-col md:flex-row items-center gap-1 md:gap-2">
                <Icon icon="solar:cup-star-bold-duotone" className="text-lg md:text-xl" />
                <div className="text-center md:text-left">
                  <span className="text-sm md:text-base block">Saturday, Oct 11</span>
                  <span className="text-xs text-gray-500">Grand Opening</span>
                </div>
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
            {/* Desktop Timeline */}
            <div className="hidden md:block">
              <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-safari-khaki to-sunset-orange opacity-20" />
              
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
                       />
                    </div>
                    
                    <div className="flex-1" />
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Mobile Timeline */}
            <div className="md:hidden">
              <div className="space-y-4">
                {events.map((event, index) => (
                  <motion.div
                    key={event.time}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100"
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 bg-gradient-to-br ${event.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                        <Icon icon={event.icon} className="text-white text-lg" />
                      </div>
                      <div className="flex-1">
                        <div className="text-xs font-montserrat text-safari-khaki font-semibold mb-1">
                          {event.time}
                        </div>
                        <h3 className="text-lg font-rubik font-bold text-gray-800 mb-2">
                          {event.title}
                        </h3>
                        <p className="text-gray-600 font-montserrat text-sm leading-relaxed">
                          {event.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
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