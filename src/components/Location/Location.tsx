import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import InteractiveMap from './InteractiveMap';

const Location: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'map' | 'directions'>('map');

  const directions = [
    {
      from: 'Grootfontein Town',
      steps: [
        'Head north on the B8 highway for 15km',
        'Turn right at the Farm Aris sign',
        'Follow the farm road for 3km',
        'Arrive at the main gate'
      ],
      duration: '25 minutes',
      distance: '18 km'
    }
  ];

  const contacts = [
    {
      name: 'Onesmus',
      phone: '+264 81 129 9623',
      icon: 'solar:phone-bold-duotone'
    },
    {
      name: 'Maano',
      phone: '+264 81 294 5818',
      icon: 'solar:phone-bold-duotone'
    }
  ];

  return (
    <section id="location" className="py-20 bg-gradient-to-b from-namibian-blue/10 to-white">
      <div className="section-padding">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-rubik font-black text-gradient mb-6">
            Find Us
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-safari-khaki to-sunset-orange mx-auto mb-8"></div>
          <p className="text-lg md:text-xl text-gray-700 font-montserrat max-w-3xl mx-auto">
            Farm Aris is located in the heart of Grootfontein, Namibia
          </p>
        </motion.div>

        {/* Tab Selector */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex justify-center mb-8"
        >
          <div className="bg-white rounded-full p-2 shadow-xl flex gap-2">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab('map')}
              className={`px-6 py-3 rounded-full font-rubik font-semibold transition-all duration-300 ${
                activeTab === 'map'
                  ? 'bg-gradient-to-r from-safari-khaki to-savanna-gold text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center gap-2">
                <Icon icon="solar:map-bold-duotone" className="text-xl" />
                <span>Map View</span>
              </div>
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab('directions')}
              className={`px-6 py-3 rounded-full font-rubik font-semibold transition-all duration-300 ${
                activeTab === 'directions'
                  ? 'bg-gradient-to-r from-safari-khaki to-savanna-gold text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center gap-2">
                <Icon icon="solar:route-bold-duotone" className="text-xl" />
                <span>Directions</span>
              </div>
            </motion.button>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Map/Directions Area */}
          <div className="lg:col-span-2">
            {activeTab === 'map' ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-3xl shadow-xl overflow-hidden h-[580px]"
              >
                <InteractiveMap
                  latitude={-19.195082}
                  longitude={18.311077}
                  farmName="Farm Aris"
                />
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-3xl shadow-xl p-8"
              >
                <h3 className="text-2xl font-rubik font-bold text-gray-800 mb-6">
                  Getting There
                </h3>
                {directions.map((route, index) => (
                  <div key={index} className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-rubik font-semibold text-safari-khaki">
                        From {route.from}
                      </h4>
                      <div className="flex gap-4 text-sm font-montserrat text-gray-600">
                        <span className="flex items-center gap-1">
                          <Icon icon="solar:clock-circle-bold-duotone" className="text-lg" />
                          {route.duration}
                        </span>
                        <span className="flex items-center gap-1">
                          <Icon icon="solar:routing-2-bold-duotone" className="text-lg" />
                          {route.distance}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {route.steps.map((step, stepIndex) => (
                        <motion.div
                          key={stepIndex}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.5, delay: stepIndex * 0.1 }}
                          className="flex items-start gap-3"
                        >
                          <div className="w-8 h-8 bg-gradient-to-br from-safari-khaki to-savanna-gold rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                            <span className="text-white font-bold text-sm">{stepIndex + 1}</span>
                          </div>
                          <p className="text-gray-700 font-montserrat">{step}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ))}
                
                <div className="mt-8 p-6 bg-namibian-blue/10 rounded-2xl">
                  <div className="flex items-start gap-3">
                    <Icon icon="solar:info-circle-bold-duotone" className="text-2xl text-safari-khaki flex-shrink-0" />
                    <div>
                      <h5 className="font-rubik font-semibold text-gray-800 mb-2">
                        Need Directions?
                      </h5>
                      <p className="text-gray-600 font-montserrat text-sm">
                        Call us if you get lost - we're happy to guide you!
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Contact Information */}
          <div className="flex flex-col gap-6 h-[580px]">
            {/* Contact Cards */}
            {contacts.map((contact, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-safari-khaki to-savanna-gold rounded-xl flex items-center justify-center">
                      <Icon icon={contact.icon} className="text-white text-2xl" />
                    </div>
                    <div>
                      <h4 className="font-rubik font-semibold text-gray-800">
                        {contact.name}
                      </h4>
                      <a
                        href={`tel:${contact.phone.replace(/\s/g, '')}`}
                        className="text-safari-khaki font-montserrat hover:text-sunset-orange transition-colors duration-300"
                      >
                        {contact.phone}
                      </a>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ))}

            {/* Important Notes - Map Theme */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-gray-200/50 flex-grow"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-safari-khaki to-savanna-gold rounded-xl flex items-center justify-center">
                  <Icon icon="solar:info-circle-bold-duotone" className="text-white text-xl" />
                </div>
                <h4 className="text-xl font-rubik font-bold text-gray-800">
                  Important Notes
                </h4>
              </div>
              <div className="space-y-4">
                <motion.div
                  whileHover={{ scale: 1.02, x: 4 }}
                  className="flex items-start gap-3 p-3 bg-gray-50/80 rounded-xl transition-all duration-300"
                >
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon icon="solar:parking-bold-duotone" className="text-blue-600 text-lg" />
                  </div>
                  <span className="font-montserrat text-sm text-gray-700 leading-relaxed">
                    Parking available on-site - follow the signs
                  </span>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.02, x: 4 }}
                  className="flex items-start gap-3 p-3 bg-gray-50/80 rounded-xl transition-all duration-300"
                >
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon icon="solar:tent-bold-duotone" className="text-green-600 text-lg" />
                  </div>
                  <span className="font-montserrat text-sm text-gray-700 leading-relaxed">
                    Camping facilities available for overnight guests
                  </span>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.02, x: 4 }}
                  className="flex items-start gap-3 p-3 bg-gray-50/80 rounded-xl transition-all duration-300"
                >
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon icon="solar:t-shirt-bold-duotone" className="text-purple-600 text-lg" />
                  </div>
                  <span className="font-montserrat text-sm text-gray-700 leading-relaxed">
                    Bring safari-style clothing and comfortable walking shoes
                  </span>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.02, x: 4 }}
                  className="flex items-start gap-3 p-3 bg-gray-50/80 rounded-xl transition-all duration-300"
                >
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon icon="solar:calendar-mark-bold-duotone" className="text-orange-600 text-lg" />
                  </div>
                  <span className="font-montserrat text-sm text-gray-700 leading-relaxed">
                    Please RSVP by September 15th for catering purposes
                  </span>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Location;