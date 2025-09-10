import React from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      icon: 'mdi:facebook',
      href: '#',
      label: 'Facebook',
      color: 'hover:text-blue-500'
    },
    {
      icon: 'mdi:instagram',
      href: '#',
      label: 'Instagram',
      color: 'hover:text-pink-500'
    },
    {
      icon: 'mdi:twitter',
      href: '#',
      label: 'Twitter',
      color: 'hover:text-blue-400'
    },
    {
      icon: 'mdi:youtube',
      href: '#',
      label: 'YouTube',
      color: 'hover:text-red-500'
    },
    {
      icon: 'mdi:whatsapp',
      href: 'https://wa.me/264811299623',
      label: 'WhatsApp',
      color: 'hover:text-green-500'
    }
  ];


  return (
    <footer className="bg-gradient-to-br from-acacia-green to-earth-brown text-white">
      {/* Main Footer Content */}
      <div className="section-padding py-16">
        <div className="grid md:grid-cols-3 gap-8">
            {/* Brand Section */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center p-1">
                  <img 
                    src="/images/aris logo.jpg" 
                    alt="Farm Aris Logo" 
                    className="w-full h-full object-contain rounded-full"
                  />
                </div>
                <span className="font-rubik font-bold text-2xl">Farm Aris</span>
              </div>
              <p className="text-white/80 font-montserrat mb-6">
                Growing together in Namibia's heart
              </p>
              <div className="flex flex-wrap gap-3">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    aria-label={social.label}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white/80 hover:bg-white/20 transition-all duration-300 ${social.color}`}
                  >
                    <Icon icon={social.icon} className="text-xl" />
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Event Info */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h3 className="font-rubik font-bold text-xl mb-4">Event Details</h3>
              <ul className="space-y-3 text-white/80 font-montserrat">
                <li className="flex items-center gap-2">
                  <Icon icon="solar:calendar-bold-duotone" className="text-savanna-gold" />
                  <span>October 10-11, 2025</span>
                </li>
                <li className="flex items-center gap-2">
                  <Icon icon="solar:map-point-bold-duotone" className="text-savanna-gold" />
                  <span>Grootfontein, Namibia</span>
                </li>
                <li className="flex items-center gap-2">
                  <Icon icon="solar:clock-circle-bold-duotone" className="text-savanna-gold" />
                  <span>Friday 4PM - Saturday 7PM</span>
                </li>
              </ul>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h3 className="font-rubik font-bold text-xl mb-4">Contact Information</h3>
              <ul className="space-y-3 text-white/80 font-montserrat">
                <li>
                  <div className="flex items-center gap-2">
                    <Icon icon="solar:user-bold-duotone" className="text-savanna-gold" />
                    <span>Onesmus: +264 81 129 9623</span>
                  </div>
                </li>
                <li>
                  <div className="flex items-center gap-2">
                    <Icon icon="solar:user-bold-duotone" className="text-savanna-gold" />
                    <span>Maano: +264 81 294 5818</span>
                  </div>
                </li>
                <li>
                  <a
                    href="https://wa.me/264811299623"
                    className="flex items-center gap-2 hover:text-white transition-colors duration-300"
                  >
                    <Icon icon="solar:chat-round-dots-bold-duotone" className="text-savanna-gold" />
                    <span>WhatsApp Available</span>
                  </a>
                </li>
              </ul>
            </motion.div>

          </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/20">
        <div className="section-padding py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
              <p className="text-white/60 font-montserrat text-sm">
                © {currentYear} Aris Farm. All rights reserved.
              </p>
              <p className="text-white/60 font-montserrat text-sm">
                Growing sustainable communities in Namibia
              </p>
            </div>
        </div>
      </div>

      {/* Decorative Element */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-safari-khaki via-savanna-gold to-sunset-orange"></div>
    </footer>
  );
};

export default Footer;