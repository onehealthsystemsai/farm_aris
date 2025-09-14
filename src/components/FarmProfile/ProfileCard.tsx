import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import type { ProfileCardData } from './profileData';

interface ProfileCardProps {
  data: ProfileCardData;
  onViewDetails: (data: ProfileCardData) => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ data, onViewDetails }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleCardClick = () => {
    onViewDetails(data);
  };

  const handleFlipOnly = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFlipped(!isFlipped);
  };

  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    onViewDetails(data);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="group h-[400px]"
    >
      <div className="relative w-full h-full">
        {/* Front Side */}
        <div
          className={`absolute inset-0 rounded-3xl overflow-hidden shadow-lg transition-all duration-300 cursor-pointer ${
            isFlipped ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
          onClick={handleCardClick}
        >
          <div className="relative h-full">
            {/* Background Image */}
            <img
              src={data.frontImage}
              alt={data.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                const fallback = document.createElement('div');
                fallback.className = `absolute inset-0 bg-gradient-to-br ${data.gradient}`;
                e.currentTarget.parentElement?.appendChild(fallback);
              }}
            />
            
            {/* Gradient Overlay */}
            <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent`} />
            
            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-between p-6">
              {/* Icon */}
              <div className="flex justify-end">
                <div className="bg-white/20 backdrop-blur-md rounded-full p-3 border border-white/30">
                  <Icon icon={data.icon} className="text-white text-3xl" />
                </div>
              </div>

              {/* Title & Subtitle */}
              <div className="text-white">
                <h3 className="text-2xl md:text-3xl font-rubik font-bold mb-2 leading-tight">
                  {data.title}
                </h3>
                <p className="text-white/90 font-montserrat text-sm md:text-base mb-4">
                  {data.subtitle}
                </p>
                
                {/* Highlights */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {data.highlights.map((highlight, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2"
                    >
                      <Icon
                        icon="solar:check-circle-bold-duotone"
                        className="text-savanna-gold text-sm flex-shrink-0"
                      />
                      <span className="text-xs font-montserrat text-white/80 leading-tight">
                        {highlight}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Flip Indicator */}
                <div 
                  className="flex items-center gap-2 text-xs font-montserrat text-white/60 cursor-pointer hover:text-white/80 transition-colors"
                  onClick={handleFlipOnly}
                >
                  <Icon icon="solar:refresh-bold-duotone" className="text-sm" />
                  <span>Flip card</span>
                </div>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-xl" />
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/10 rounded-full blur-xl" />
          </div>
        </div>

        {/* Back Side - ENHANCED WITH BULLETPROOF SCROLLING */}
        <div
          className={`absolute inset-0 rounded-3xl shadow-lg bg-white transition-all duration-300 ${
            isFlipped ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          {/* Header */}
          <div className={`bg-gradient-to-r ${data.gradient} p-4 text-white rounded-t-3xl flex-shrink-0`}>
            <div className="flex items-center gap-2 mb-2">
              <Icon icon={data.icon} className="text-lg" />
              <h4 className="text-sm font-rubik font-bold">{data.title}</h4>
            </div>
            <p className="text-white/90 font-montserrat text-xs">
              {data.subtitle}
            </p>
          </div>

          {/* SIMPLE SCROLLABLE AREA */}
          <div 
            style={{
              height: '280px',
              overflow: 'auto',
              padding: '16px',
              backgroundColor: 'white'
            }}
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Enhanced Stats Section */}
            {data.sections[0]?.stats && (
              <div className="grid grid-cols-3 gap-2 mb-4 bg-gray-50 p-3 rounded-lg">
                {data.sections[0].stats.map((stat, idx) => (
                  <div key={idx} className="text-center">
                    <div className="text-sm font-rubik font-bold text-gray-800">{stat.value}</div>
                    <div className="text-xs font-montserrat text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            )}

            {/* BASIC CONTENT TO TEST SCROLLING */}
            <div className="space-y-4">
              {/* Test Content - Simple Text Blocks */}
              <div className="bg-gray-50 p-4 rounded">
                <h3 className="font-bold mb-2">SCROLL TEST - Section 1</h3>
                <p>This is test content to verify scrolling works. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
              </div>
              <div className="bg-blue-50 p-4 rounded">
                <h3 className="font-bold mb-2">SCROLL TEST - Section 2</h3>
                <p>More test content. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
              </div>
              <div className="bg-green-50 p-4 rounded">
                <h3 className="font-bold mb-2">SCROLL TEST - Section 3</h3>
                <p>Even more content to force scrolling. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
              </div>
              <div className="bg-yellow-50 p-4 rounded">
                <h3 className="font-bold mb-2">SCROLL TEST - Section 4</h3>
                <p>This should definitely require scrolling. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim.</p>
              </div>
              <div className="bg-red-50 p-4 rounded">
                <h3 className="font-bold mb-2">SCROLL TEST - Section 5</h3>
                <p>Final test section. If you can see this, scrolling is working!</p>
              </div>
              
              {/* Original Content */}
              {data.sections.map((section, idx) => (
                <div key={idx} className="bg-gray-50 p-3 rounded-lg">
                  <h5 className="font-rubik font-bold text-gray-800 text-sm mb-2 flex items-center gap-2">
                    <Icon icon={data.icon} className="text-base" />
                    {section.title}
                  </h5>
                  <p className="text-xs font-montserrat text-gray-600 leading-relaxed mb-3">
                    {section.content}
                  </p>
                  {section.image && (
                    <div className="mt-2">
                      <img 
                        src={section.image} 
                        alt={section.title}
                        className="w-full h-20 object-cover rounded"
                      />
                    </div>
                  )}
                  
                  {/* Additional Details for More Scrollable Content */}
                  <div className="mt-3 p-2 bg-white rounded border border-gray-200">
                    <h6 className="text-xs font-rubik font-bold text-gray-700 mb-1">Key Features:</h6>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {section.title.includes('Production') && (
                        <>
                          <li>• Premium hardwood sourcing from sustainable forests</li>
                          <li>• Traditional 3-day carbonization process</li>
                          <li>• Quality control testing at every production stage</li>
                          <li>• Environmental compliance certification</li>
                          <li>• Export-ready packaging standards</li>
                        </>
                      )}
                      {section.title.includes('Portfolio') && (
                        <>
                          <li>• 5kg household BBQ charcoal packages</li>
                          <li>• 25kg restaurant-grade professional bags</li>
                          <li>• Premium briquettes for extended burning</li>
                          <li>• Traditional Mushara earth-method charcoal</li>
                          <li>• Sustainably sourced firewood products</li>
                        </>
                      )}
                      {section.title.includes('Crop') && (
                        <>
                          <li>• Maize production across 40+ hectares</li>
                          <li>• Tomato cultivation using modern techniques</li>
                          <li>• Watermelon farming with drip irrigation</li>
                          <li>• Butternut squash for regional markets</li>
                          <li>• Organic vegetable production methods</li>
                        </>
                      )}
                      {section.title.includes('Wildlife') && (
                        <>
                          <li>• Game-fenced conservation area</li>
                          <li>• Indigenous species protection programs</li>
                          <li>• Guided safari tour experiences</li>
                          <li>• Wildlife photography opportunities</li>
                          <li>• Educational conservation programs</li>
                        </>
                      )}
                      {section.title.includes('Safari') && (
                        <>
                          <li>• 10 fully-equipped safari tents</li>
                          <li>• Modern ablution facilities</li>
                          <li>• Traditional braai cooking areas</li>
                          <li>• Camping ground for own equipment</li>
                          <li>• Guided nature walk experiences</li>
                        </>
                      )}
                      {(!section.title.includes('Production') && 
                        !section.title.includes('Portfolio') && 
                        !section.title.includes('Crop') && 
                        !section.title.includes('Wildlife') && 
                        !section.title.includes('Safari')) && (
                        <>
                          <li>• Industry-leading quality standards</li>
                          <li>• Sustainable production methods</li>
                          <li>• Community partnership programs</li>
                          <li>• Environmental protection initiatives</li>
                          <li>• Expert guidance and support</li>
                        </>
                      )}
                    </ul>
                  </div>
                </div>
              ))}
              
              {/* Additional Scrollable Content */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-lg">
                <h5 className="font-rubik font-bold text-gray-800 text-sm mb-2">Why Choose Us?</h5>
                <div className="space-y-2 text-xs text-gray-600">
                  <p>Farm Aris represents the pinnacle of sustainable agricultural and conservation practices in Namibia. Our commitment to excellence spans across all our operations, from premium charcoal production to wildlife conservation.</p>
                  <p>With over 5,000 hectares of pristine land and cutting-edge agricultural techniques, we deliver products and experiences that exceed international standards while supporting local communities.</p>
                  <p>Our integrated approach combines traditional methods with modern innovation, ensuring both environmental sustainability and economic viability for generations to come.</p>
                </div>
              </div>
              
              {/* Extra Content to Ensure Scrolling */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h5 className="font-rubik font-bold text-blue-800 text-sm mb-2">Visit Us at the Grand Opening</h5>
                <p className="text-xs text-blue-700 leading-relaxed mb-2">
                  Experience firsthand the excellence that defines Farm Aris. Join us for an unforgettable weekend celebrating sustainable agriculture, wildlife conservation, and community partnership.
                </p>
                <div className="text-xs text-blue-600 space-y-1">
                  <p>• Guided tours of all facilities</p>
                  <p>• Traditional Namibian cuisine</p>
                  <p>• Cultural performances and entertainment</p>
                  <p>• Wildlife viewing opportunities</p>
                  <p>• Meet our expert team</p>
                </div>
              </div>

              {/* Padding to ensure smooth scrolling at bottom */}
              <div className="h-16 flex items-center justify-center text-gray-400">
                <p className="text-xs">Scroll up to see more content</p>
              </div>
            </div>
          </div>

          {/* Fixed Bottom Button */}
          <div className="absolute bottom-0 left-0 right-0 p-3 bg-white border-t border-gray-200 rounded-b-3xl flex-shrink-0">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleViewDetails}
              className={`w-full bg-gradient-to-r ${data.gradient} text-white py-2 px-4 rounded-xl font-montserrat font-semibold text-sm shadow-lg hover:shadow-xl transition-shadow duration-300 flex items-center justify-center gap-2`}
            >
              <Icon icon="solar:eye-bold-duotone" className="text-sm" />
              View Full Details
            </motion.button>
          </div>

          {/* Flip Back Indicator */}
          <div className="absolute top-2 right-2 z-10">
            <motion.div
              animate={{ rotate: [0, 180, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="bg-black/20 backdrop-blur-md rounded-full p-1 border border-white/30 cursor-pointer hover:bg-black/30 transition-colors"
              onClick={handleFlipOnly}
            >
              <Icon icon="solar:refresh-bold-duotone" className="text-white text-xs" />
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfileCard;