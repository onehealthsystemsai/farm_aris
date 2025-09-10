import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';
import { useForm } from 'react-hook-form';
import { databaseService } from '../../utils/database';

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  attendees: number;
  additionalAttendees: Array<{
    fullName: string;
    phone: string;
  }>;
  days: string[];
  mealPreference: string;
  drinks: string[];
  specialRequirements: string;
  confirmationAccepted: boolean;
}

const RSVP: React.FC = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormData>();

  const selectedDrinks = watch('drinks') || [];
  const watchedValues = watch();
  const attendeesCount = watch('attendees') || 1;

  // Countdown timer effect
  useEffect(() => {
    const calculateTimeLeft = () => {
      const deadline = new Date('2025-09-20T23:59:59');
      const now = new Date();
      const difference = deadline.getTime() - now.getTime();

      if (difference > 0) {
        const newTimeLeft = {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
        setTimeLeft(newTimeLeft);
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      // Save registration to database
      const registration = databaseService.addRegistration({
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        attendees: Number(data.attendees) || 1,
        days: data.days || [],
        mealPreference: data.mealPreference || '',
        drinks: data.drinks || [],
        specialRequirements: data.specialRequirements || ''
      });
      
      console.log('Registration saved:', registration);
      setIsSubmitted(true);
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const drinkOptions = [
    { value: 'beer', label: 'Beer', icon: 'solar:wineglass-bold-duotone' },
    { value: 'wine', label: 'Wine', icon: 'solar:wineglass-triangle-bold-duotone' },
    { value: 'ciders', label: 'Ciders', icon: 'solar:cup-bold-duotone' },
    { value: 'whiskey', label: 'Whiskey', icon: 'solar:bottle-bold-duotone' },
    { value: 'brandy', label: 'Brandy', icon: 'solar:bottle-bold-duotone' },
    { value: 'gin', label: 'Gin', icon: 'solar:bottle-bold-duotone' },
    { value: 'soft-drinks', label: 'Soft Drinks', icon: 'solar:cup-bold-duotone' },
    { value: 'traditional', label: 'Traditional Brews', icon: 'solar:cup-hot-bold-duotone' },
    { value: 'coffee', label: 'Coffee', icon: 'solar:cup-hot-bold-duotone' },
    { value: 'tea', label: 'Tea', icon: 'solar:cup-hot-bold-duotone' },
    { value: 'juice', label: 'Fruit Juices', icon: 'solar:glass-water-bold-duotone' },
    { value: 'water', label: 'Water', icon: 'solar:water-drop-bold-duotone' },
  ];

  if (isSubmitted) {
    return (
      <section id="rsvp" className="py-20 bg-gradient-to-b from-white to-namibian-blue/10">
        <div className="section-padding">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-3xl shadow-2xl p-12 text-center"
          >
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 1,
              }}
            >
              <Icon icon="solar:check-circle-bold-duotone" className="text-8xl text-safari-khaki mx-auto mb-6" />
            </motion.div>
            <h2 className="text-4xl font-rubik font-bold text-gray-800 mb-4">
              Thank You for Your RSVP!
            </h2>
            <p className="text-lg text-gray-600 font-montserrat mb-8">
              We've received your registration and can't wait to see you at Farm Aris!
            </p>
            <div className="bg-gradient-to-r from-safari-khaki/10 to-sunset-orange/10 rounded-2xl p-6">
              <p className="text-gray-700 font-montserrat">
                A confirmation email has been sent to your email address with all the event details.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="rsvp" className="py-20 bg-gradient-to-b from-white to-namibian-blue/10">
      <div className="section-padding">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-5xl md:text-6xl font-rubik font-black text-gradient mb-6">
            Reserve Your Spot
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-safari-khaki to-sunset-orange mx-auto mb-8"></div>
        </motion.div>

        {/* Modern 5-Step Progress Bar */}
        <div className="mb-12">
          {/* Step Labels */}
          <div className="flex justify-between mb-6">
            {[
              { step: 1, label: 'Personal Info', icon: 'solar:user-rounded-bold-duotone' },
              { step: 2, label: 'Event Details', icon: 'solar:calendar-mark-bold-duotone' },
              { step: 3, label: 'Drink Preferences', icon: 'solar:cup-bold-duotone' },
              { step: 4, label: 'Food Preferences', icon: 'solar:chef-hat-bold-duotone' },
              { step: 5, label: 'Complete', icon: 'solar:check-circle-bold-duotone' }
            ].map((item, index) => (
              <div key={item.step} className="flex flex-col items-center flex-1">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0.5 }}
                  animate={{ 
                    scale: currentStep >= item.step ? 1.1 : 0.9,
                    opacity: currentStep >= item.step ? 1 : 0.6
                  }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-all duration-300 ${
                    currentStep >= item.step
                      ? 'bg-gradient-to-br from-safari-khaki to-savanna-gold shadow-lg shadow-safari-khaki/30'
                      : currentStep === item.step
                      ? 'bg-gradient-to-br from-safari-khaki/20 to-savanna-gold/20 border-2 border-safari-khaki/50'
                      : 'bg-gray-100 border-2 border-gray-200'
                  }`}
                >
                  <Icon 
                    icon={item.icon} 
                    className={`text-xl transition-colors duration-300 ${
                      currentStep >= item.step 
                        ? 'text-white' 
                        : currentStep === item.step
                        ? 'text-safari-khaki'
                        : 'text-gray-400'
                    }`} 
                  />
                </motion.div>
                <div className="text-center">
                  <div className={`text-xs font-rubik font-semibold mb-1 transition-colors duration-300 ${
                    currentStep >= item.step 
                      ? 'text-safari-khaki' 
                      : 'text-gray-500'
                  }`}>
                    Step {item.step}
                  </div>
                  <div className={`text-sm font-montserrat transition-colors duration-300 ${
                    currentStep >= item.step 
                      ? 'text-gray-800 font-semibold' 
                      : 'text-gray-500'
                  }`}>
                    {item.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Modern Progress Line */}
          <div className="relative">
            <div className="absolute top-1/2 left-0 w-full h-2 bg-gray-200 rounded-full transform -translate-y-1/2"></div>
            <motion.div
              initial={{ width: '0%' }}
              animate={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="absolute top-1/2 left-0 h-2 bg-gradient-to-r from-safari-khaki to-savanna-gold rounded-full transform -translate-y-1/2 shadow-sm"
            ></motion.div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-3xl shadow-xl p-8 md:p-12"
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <AnimatePresence mode="wait">
              {/* Step 1: Personal Information */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Section Header with Icon and Countdown */}
                  <div className="flex items-start justify-between mb-8">
                    <div className="flex items-center gap-3 -ml-2">
                      <div className="p-3 bg-gradient-to-br from-safari-khaki/20 to-savanna-gold/20 rounded-xl">
                        <Icon icon="solar:user-rounded-bold-duotone" className="w-6 h-6 text-safari-khaki" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-rubik font-bold text-gray-900">Personal Information</h3>
                        <p className="text-sm text-gray-500 font-montserrat">Tell us about yourself</p>
                      </div>
                    </div>

                    {/* Compact Countdown Timer */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                      className="text-center"
                    >
                      <div className="flex items-center gap-1 justify-center mb-2">
                        <Icon icon="solar:calendar-mark-bold-duotone" className="text-sm text-safari-khaki" />
                        <span className="text-xs font-rubik text-safari-khaki">Reservations ends Sep 20, 2025</span>
                      </div>
                      
                      <div className="flex gap-1 justify-center" style={{ width: '200px' }}>
                        {[
                          { value: timeLeft.days, label: 'D' },
                          { value: timeLeft.hours, label: 'H' },
                          { value: timeLeft.minutes, label: 'M' },
                          { value: timeLeft.seconds, label: 'S' }
                        ].map((item, index) => (
                          <motion.div 
                            key={`${item.label}-${item.value}`} 
                            className="text-center flex-1"
                            initial={{ scale: 1 }}
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ duration: 0.3, times: [0, 0.5, 1] }}
                          >
                            <div className="bg-gray-300 text-gray-800 rounded px-2 py-1 shadow-sm">
                              <div className="text-xs font-rubik font-bold leading-none">
                                {item.value.toString().padStart(2, '0')}
                              </div>
                              <div className="text-xs font-montserrat leading-tight mt-0.5">
                                {item.label}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-montserrat font-semibold text-gray-700 mb-3">
                        Full Name *
                      </label>
                      <div className="relative">
                        <Icon 
                          icon="solar:user-rounded-bold-duotone" 
                          className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" 
                        />
                        <input
                          {...register('fullName', { required: 'Name is required' })}
                          className="w-full pl-12 pr-4 py-4 bg-gray-100 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-safari-khaki/30 transition-all duration-200 text-gray-700 hover:bg-gray-200"
                          placeholder="Enter your full name"
                        />
                      </div>
                      {errors.fullName && (
                        <motion.p 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="mt-2 text-sm text-red-600 flex items-center gap-1 font-montserrat"
                        >
                          <Icon icon="solar:danger-circle-bold" className="w-4 h-4" />
                          {errors.fullName.message}
                        </motion.p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-montserrat font-semibold text-gray-700 mb-3">
                        Email Address *
                      </label>
                      <div className="relative">
                        <Icon 
                          icon="solar:letter-bold-duotone" 
                          className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" 
                        />
                        <input
                          {...register('email', {
                            required: 'Email is required',
                            pattern: {
                              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                              message: 'Invalid email address',
                            },
                          })}
                          type="email"
                          className="w-full pl-12 pr-4 py-4 bg-gray-100 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-safari-khaki/30 transition-all duration-200 text-gray-700 hover:bg-gray-200"
                          placeholder="your@email.com"
                        />
                      </div>
                      {errors.email && (
                        <motion.p 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="mt-2 text-sm text-red-600 flex items-center gap-1 font-montserrat"
                        >
                          <Icon icon="solar:danger-circle-bold" className="w-4 h-4" />
                          {errors.email.message}
                        </motion.p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-montserrat font-semibold text-gray-700 mb-3">
                        Phone/WhatsApp *
                      </label>
                      <div className="relative">
                        <Icon 
                          icon="solar:phone-bold-duotone" 
                          className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" 
                        />
                        <input
                          {...register('phone', { required: 'Phone number is required' })}
                          type="tel"
                          className="w-full pl-12 pr-4 py-4 bg-gray-100 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-safari-khaki/30 transition-all duration-200 text-gray-700 hover:bg-gray-200"
                          placeholder="+264 81 123 4567"
                        />
                      </div>
                      {errors.phone && (
                        <motion.p 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="mt-2 text-sm text-red-600 flex items-center gap-1 font-montserrat"
                        >
                          <Icon icon="solar:danger-circle-bold" className="w-4 h-4" />
                          {errors.phone.message}
                        </motion.p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Event Details */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Section Header with Icon and Countdown */}
                  <div className="flex items-start justify-between mb-8">
                    <div className="flex items-center gap-3 -ml-2">
                      <div className="p-3 bg-gradient-to-br from-safari-khaki/20 to-savanna-gold/20 rounded-xl">
                        <Icon icon="solar:calendar-mark-bold-duotone" className="w-6 h-6 text-safari-khaki" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-rubik font-bold text-gray-900">Event Details</h3>
                        <p className="text-sm text-gray-500 font-montserrat">Choose your attendance preferences</p>
                      </div>
                    </div>

                    {/* Compact Countdown Timer */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                      className="text-center"
                    >
                      <div className="flex items-center gap-1 justify-center mb-2">
                        <Icon icon="solar:calendar-mark-bold-duotone" className="text-sm text-safari-khaki" />
                        <span className="text-xs font-rubik text-safari-khaki">Reservations ends Sep 20, 2025</span>
                      </div>
                      
                      <div className="flex gap-1 justify-center" style={{ width: '200px' }}>
                        {[
                          { value: timeLeft.days, label: 'D' },
                          { value: timeLeft.hours, label: 'H' },
                          { value: timeLeft.minutes, label: 'M' },
                          { value: timeLeft.seconds, label: 'S' }
                        ].map((item, index) => (
                          <motion.div 
                            key={`${item.label}-${item.value}`} 
                            className="text-center flex-1"
                            initial={{ scale: 1 }}
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ duration: 0.3, times: [0, 0.5, 1] }}
                          >
                            <div className="bg-gray-300 text-gray-800 rounded px-2 py-1 shadow-sm">
                              <div className="text-xs font-rubik font-bold leading-none">
                                {item.value.toString().padStart(2, '0')}
                              </div>
                              <div className="text-xs font-montserrat leading-tight mt-0.5">
                                {item.label}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-montserrat font-semibold text-gray-700 mb-3">
                        Number of Attendees *
                      </label>
                      <div className="relative">
                        <Icon 
                          icon="solar:users-group-rounded-bold-duotone" 
                          className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" 
                        />
                        <select
                          {...register('attendees')}
                          className="w-full pl-12 pr-10 py-4 bg-gray-100 border border-gray-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-safari-khaki/30 transition-all duration-200 text-gray-700 hover:bg-gray-200 appearance-none"
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                            <option key={num} value={num}>
                              {num} {num === 1 ? 'Person' : 'People'}
                            </option>
                          ))}
                        </select>
                        <Icon 
                          icon="solar:alt-arrow-down-bold" 
                          className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" 
                        />
                      </div>
                    </div>

                    {/* Additional Attendees Fields */}
                    {attendeesCount > 1 && (
                      <div>
                        <label className="block text-sm font-montserrat font-semibold text-gray-700 mb-4">
                          Additional Attendees Information
                        </label>
                        <div className="space-y-4">
                          {Array.from({ length: attendeesCount - 1 }, (_, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, delay: index * 0.1 }}
                              className="bg-gray-50 border border-gray-200/50 rounded-xl p-4"
                            >
                              <h4 className="font-rubik font-semibold text-gray-800 mb-3">
                                Person {index + 2}
                              </h4>
                              <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-sm font-montserrat font-medium text-gray-600 mb-2">
                                    Full Name *
                                  </label>
                                  <div className="relative">
                                    <Icon 
                                      icon="solar:user-rounded-bold-duotone" 
                                      className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10" 
                                    />
                                    <input
                                      {...register(`additionalAttendees.${index}.fullName`, { 
                                        required: 'Name is required for all attendees' 
                                      })}
                                      className="w-full pl-10 pr-3 py-3 bg-white border border-gray-200/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-safari-khaki/30 transition-all duration-200 text-gray-700 hover:bg-gray-50"
                                      placeholder="Enter full name"
                                    />
                                  </div>
                                  {errors.additionalAttendees?.[index]?.fullName && (
                                    <motion.p 
                                      initial={{ opacity: 0 }}
                                      animate={{ opacity: 1 }}
                                      className="mt-1 text-sm text-red-600 flex items-center gap-1 font-montserrat"
                                    >
                                      <Icon icon="solar:danger-circle-bold" className="w-4 h-4" />
                                      {errors.additionalAttendees[index].fullName?.message}
                                    </motion.p>
                                  )}
                                </div>
                                <div>
                                  <label className="block text-sm font-montserrat font-medium text-gray-600 mb-2">
                                    Phone Number *
                                  </label>
                                  <div className="relative">
                                    <Icon 
                                      icon="solar:phone-bold-duotone" 
                                      className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10" 
                                    />
                                    <input
                                      {...register(`additionalAttendees.${index}.phone`, { 
                                        required: 'Phone number is required for all attendees' 
                                      })}
                                      type="tel"
                                      className="w-full pl-10 pr-3 py-3 bg-white border border-gray-200/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-safari-khaki/30 transition-all duration-200 text-gray-700 hover:bg-gray-50"
                                      placeholder="+264 81 123 4567"
                                    />
                                  </div>
                                  {errors.additionalAttendees?.[index]?.phone && (
                                    <motion.p 
                                      initial={{ opacity: 0 }}
                                      animate={{ opacity: 1 }}
                                      className="mt-1 text-sm text-red-600 flex items-center gap-1 font-montserrat"
                                    >
                                      <Icon icon="solar:danger-circle-bold" className="w-4 h-4" />
                                      {errors.additionalAttendees[index].phone?.message}
                                    </motion.p>
                                  )}
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                        
                        <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-4">
                          <div className="flex items-start gap-3">
                            <Icon icon="solar:info-circle-bold-duotone" className="text-blue-600 text-xl flex-shrink-0 mt-0.5" />
                            <div>
                              <h4 className="font-rubik font-semibold text-blue-800 mb-1">Group Registration</h4>
                              <p className="text-sm font-montserrat text-blue-700">
                                Please provide contact information for each attendee to ensure we can reach everyone with event updates.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-montserrat font-semibold text-gray-700 mb-4">
                        Which Days Will You Attend? *
                      </label>
                      <div className="space-y-3">
                        <label className="flex items-center p-4 bg-gray-100 border-0 rounded-xl hover:bg-gray-200 transition-all duration-200 cursor-pointer">
                          <input
                            {...register('days')}
                            type="checkbox"
                            value="friday"
                            className="w-5 h-5 text-safari-khaki rounded focus:ring-safari-khaki"
                          />
                          <span className="ml-3 font-montserrat">
                            <strong>Friday (Welcome & Bonfire)</strong> - October 10
                          </span>
                        </label>
                        <label className="flex items-center p-4 bg-gray-100 border-0 rounded-xl hover:bg-gray-200 transition-all duration-200 cursor-pointer">
                          <input
                            {...register('days')}
                            type="checkbox"
                            value="saturday"
                            className="w-5 h-5 text-safari-khaki rounded focus:ring-safari-khaki"
                          />
                          <span className="ml-3 font-montserrat">
                            <strong>Saturday (Main Celebration)</strong> - October 11
                          </span>
                        </label>
                        <label className="flex items-center p-4 bg-gray-100 border-0 rounded-xl hover:bg-gray-200 transition-all duration-200 cursor-pointer">
                          <input
                            {...register('days')}
                            type="checkbox"
                            value="camping"
                            className="w-5 h-5 text-safari-khaki rounded focus:ring-safari-khaki"
                          />
                          <span className="ml-3 font-montserrat">
                            <strong>Overnight Camping</strong> - Friday to Saturday
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Drink Preferences */}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Section Header with Icon and Countdown */}
                  <div className="flex items-start justify-between mb-8">
                    <div className="flex items-center gap-3 -ml-2">
                      <div className="p-3 bg-gradient-to-br from-safari-khaki/20 to-savanna-gold/20 rounded-xl">
                        <Icon icon="solar:cup-bold-duotone" className="w-6 h-6 text-safari-khaki" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-rubik font-bold text-gray-900">Drink Preferences</h3>
                        <p className="text-sm text-gray-500 font-montserrat">Choose your favorite beverages</p>
                      </div>
                    </div>

                    {/* Compact Countdown Timer */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                      className="text-center"
                    >
                      <div className="flex items-center gap-1 justify-center mb-2">
                        <Icon icon="solar:calendar-mark-bold-duotone" className="text-sm text-safari-khaki" />
                        <span className="text-xs font-rubik text-safari-khaki">Reservations ends Sep 20, 2025</span>
                      </div>
                      
                      <div className="flex gap-1 justify-center" style={{ width: '200px' }}>
                        {[
                          { value: timeLeft.days, label: 'D' },
                          { value: timeLeft.hours, label: 'H' },
                          { value: timeLeft.minutes, label: 'M' },
                          { value: timeLeft.seconds, label: 'S' }
                        ].map((item, index) => (
                          <motion.div 
                            key={`${item.label}-${item.value}`} 
                            className="text-center flex-1"
                            initial={{ scale: 1 }}
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ duration: 0.3, times: [0, 0.5, 1] }}
                          >
                            <div className="bg-gray-300 text-gray-800 rounded px-2 py-1 shadow-sm">
                              <div className="text-xs font-rubik font-bold leading-none">
                                {item.value.toString().padStart(2, '0')}
                              </div>
                              <div className="text-xs font-montserrat leading-tight mt-0.5">
                                {item.label}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-montserrat font-semibold text-gray-700 mb-4">
                        Select Your Preferred Drinks (Choose all that apply)
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {drinkOptions.map((drink) => (
                          <motion.label
                            key={drink.value}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`flex items-center p-4 bg-gray-100 border border-gray-200/50 rounded-xl hover:bg-gray-200 transition-all duration-200 cursor-pointer ${
                              selectedDrinks.includes(drink.value) ? 'ring-2 ring-safari-khaki/40 bg-safari-khaki/10 border-safari-khaki/30' : ''
                            }`}
                          >
                            <input
                              {...register('drinks')}
                              type="checkbox"
                              value={drink.value}
                              className="sr-only"
                            />
                            <div className="flex items-center gap-3 w-full">
                              <div className={`p-2 rounded-lg ${
                                selectedDrinks.includes(drink.value) 
                                  ? 'bg-safari-khaki/20' 
                                  : 'bg-gray-200'
                              }`}>
                                <Icon
                                  icon={drink.icon}
                                  className={`text-xl ${
                                    selectedDrinks.includes(drink.value)
                                      ? 'text-safari-khaki'
                                      : 'text-gray-400'
                                  }`}
                                />
                              </div>
                              <span
                                className={`font-montserrat font-medium ${
                                  selectedDrinks.includes(drink.value)
                                    ? 'text-safari-khaki font-semibold'
                                    : 'text-gray-700'
                                }`}
                              >
                                {drink.label}
                              </span>
                            </div>
                          </motion.label>
                        ))}
                      </div>
                    </div>

                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                      <div className="flex items-start gap-3">
                        <Icon icon="solar:info-circle-bold-duotone" className="text-amber-600 text-xl flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-rubik font-semibold text-amber-800 mb-1">Drink Information</h4>
                          <p className="text-sm font-montserrat text-amber-700">
                            We'll have a variety of premium beverages available. Select your preferences so we can ensure adequate stock for your enjoyment.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 4: Food Preferences */}
              {currentStep === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Section Header with Icon and Countdown */}
                  <div className="flex items-start justify-between mb-8">
                    <div className="flex items-center gap-3 -ml-2">
                      <div className="p-3 bg-gradient-to-br from-safari-khaki/20 to-savanna-gold/20 rounded-xl">
                        <Icon icon="solar:chef-hat-bold-duotone" className="w-6 h-6 text-safari-khaki" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-rubik font-bold text-gray-900">Food Preferences</h3>
                        <p className="text-sm text-gray-500 font-montserrat">Let us know your dietary needs</p>
                      </div>
                    </div>

                    {/* Compact Countdown Timer */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                      className="text-center"
                    >
                      <div className="flex items-center gap-1 justify-center mb-2">
                        <Icon icon="solar:calendar-mark-bold-duotone" className="text-sm text-safari-khaki" />
                        <span className="text-xs font-rubik text-safari-khaki">Reservations ends Sep 20, 2025</span>
                      </div>
                      
                      <div className="flex gap-1 justify-center" style={{ width: '200px' }}>
                        {[
                          { value: timeLeft.days, label: 'D' },
                          { value: timeLeft.hours, label: 'H' },
                          { value: timeLeft.minutes, label: 'M' },
                          { value: timeLeft.seconds, label: 'S' }
                        ].map((item, index) => (
                          <motion.div 
                            key={`${item.label}-${item.value}`} 
                            className="text-center flex-1"
                            initial={{ scale: 1 }}
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ duration: 0.3, times: [0, 0.5, 1] }}
                          >
                            <div className="bg-gray-300 text-gray-800 rounded px-2 py-1 shadow-sm">
                              <div className="text-xs font-rubik font-bold leading-none">
                                {item.value.toString().padStart(2, '0')}
                              </div>
                              <div className="text-xs font-montserrat leading-tight mt-0.5">
                                {item.label}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-montserrat font-semibold text-gray-700 mb-3">
                        Meal Preferences *
                      </label>
                      <div className="relative">
                        <Icon 
                          icon="solar:chef-hat-bold-duotone" 
                          className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" 
                        />
                        <select
                          {...register('mealPreference', { required: 'Please select a meal preference' })}
                          className="w-full pl-12 pr-10 py-4 bg-gray-100 border border-gray-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-safari-khaki/30 transition-all duration-200 text-gray-700 hover:bg-gray-200 appearance-none"
                        >
                          <option value="">Select preference</option>
                          <option value="standard">Standard (All meats)</option>
                          <option value="vegetarian">Vegetarian</option>
                          <option value="vegan">Vegan</option>
                          <option value="halal">Halal</option>
                          <option value="kosher">Kosher</option>
                          <option value="gluten-free">Gluten-Free</option>
                        </select>
                        <Icon 
                          icon="solar:alt-arrow-down-bold" 
                          className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" 
                        />
                      </div>
                      {errors.mealPreference && (
                        <motion.p 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="mt-2 text-sm text-red-600 flex items-center gap-1 font-montserrat"
                        >
                          <Icon icon="solar:danger-circle-bold" className="w-4 h-4" />
                          {errors.mealPreference.message}
                        </motion.p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-montserrat font-semibold text-gray-700 mb-3">
                        Special Dietary Requirements & Allergies
                      </label>
                      <div className="relative">
                        <Icon 
                          icon="solar:document-text-bold-duotone" 
                          className="absolute left-4 top-4 w-5 h-5 text-gray-400 z-10" 
                        />
                        <textarea
                          {...register('specialRequirements')}
                          rows={4}
                          className="w-full pl-12 pr-4 py-4 bg-gray-100 border border-gray-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-safari-khaki/30 transition-all duration-200 text-gray-700 hover:bg-gray-200 resize-none"
                          placeholder="Please specify any allergies, dietary restrictions, accessibility needs, or special requests..."
                        />
                      </div>
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                      <div className="flex items-start gap-3">
                        <Icon icon="solar:shield-check-bold-duotone" className="text-green-600 text-xl flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-rubik font-semibold text-green-800 mb-1">Our Commitment</h4>
                          <p className="text-sm font-montserrat text-green-700">
                            We take all dietary requirements and allergies seriously. Our chefs will prepare special meals to accommodate your needs safely.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 5: Complete */}
              {currentStep === 5 && (
                <motion.div
                  key="step5"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Section Header with Icon and Countdown */}
                  <div className="flex items-start justify-between mb-8">
                    <div className="flex items-center gap-3 -ml-2">
                      <div className="p-3 bg-gradient-to-br from-safari-khaki/20 to-savanna-gold/20 rounded-xl">
                        <Icon icon="solar:check-circle-bold-duotone" className="w-6 h-6 text-safari-khaki" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-rubik font-bold text-gray-900">Review & Complete</h3>
                        <p className="text-sm text-gray-500 font-montserrat">Review your information before submitting</p>
                      </div>
                    </div>

                    {/* Compact Countdown Timer */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                      className="text-center"
                    >
                      <div className="flex items-center gap-1 justify-center mb-2">
                        <Icon icon="solar:calendar-mark-bold-duotone" className="text-sm text-safari-khaki" />
                        <span className="text-xs font-rubik text-safari-khaki">Reservations ends Sep 20, 2025</span>
                      </div>
                      
                      <div className="flex gap-1 justify-center" style={{ width: '200px' }}>
                        {[
                          { value: timeLeft.days, label: 'D' },
                          { value: timeLeft.hours, label: 'H' },
                          { value: timeLeft.minutes, label: 'M' },
                          { value: timeLeft.seconds, label: 'S' }
                        ].map((item, index) => (
                          <motion.div 
                            key={`${item.label}-${item.value}`} 
                            className="text-center flex-1"
                            initial={{ scale: 1 }}
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ duration: 0.3, times: [0, 0.5, 1] }}
                          >
                            <div className="bg-gray-300 text-gray-800 rounded px-2 py-1 shadow-sm">
                              <div className="text-xs font-rubik font-bold leading-none">
                                {item.value.toString().padStart(2, '0')}
                              </div>
                              <div className="text-xs font-montserrat leading-tight mt-0.5">
                                {item.label}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  </div>

                  <div className="space-y-6">
                    {/* Review Summary */}
                    <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                      <div className="flex items-center justify-between py-2 border-b border-gray-200">
                        <span className="font-montserrat text-sm text-gray-600">Full Name</span>
                        <span className="font-montserrat font-semibold text-gray-800">{watchedValues.fullName || 'Not provided'}</span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-gray-200">
                        <span className="font-montserrat text-sm text-gray-600">Email</span>
                        <span className="font-montserrat font-semibold text-gray-800">{watchedValues.email || 'Not provided'}</span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-gray-200">
                        <span className="font-montserrat text-sm text-gray-600">Phone</span>
                        <span className="font-montserrat font-semibold text-gray-800">{watchedValues.phone || 'Not provided'}</span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-gray-200">
                        <span className="font-montserrat text-sm text-gray-600">Attendees</span>
                        <span className="font-montserrat font-semibold text-gray-800">{watchedValues.attendees || 1} {watchedValues.attendees === 1 ? 'Person' : 'People'}</span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-gray-200">
                        <span className="font-montserrat text-sm text-gray-600">Meal Preference</span>
                        <span className="font-montserrat font-semibold text-gray-800">{watchedValues.mealPreference || 'Not specified'}</span>
                      </div>
                    </div>

                    {/* Confirmation Checkbox */}
                    <div className="flex items-start gap-3 p-4 bg-safari-khaki/10 border border-safari-khaki/20 rounded-xl">
                      <input
                        {...register('confirmationAccepted', { required: 'You must accept the terms to continue' })}
                        type="checkbox"
                        className="w-5 h-5 text-safari-khaki rounded focus:ring-safari-khaki mt-0.5"
                      />
                      <div>
                        <label className="font-montserrat font-semibold text-gray-800 cursor-pointer">
                          I confirm that the information provided is accurate
                        </label>
                        <p className="font-montserrat text-sm text-gray-600 mt-1">
                          By submitting this form, you agree to receive event updates and communications from Farm Aris.
                        </p>
                      </div>
                    </div>

                    {errors.confirmationAccepted && (
                      <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-2 text-sm text-red-600 flex items-center gap-1 font-montserrat"
                      >
                        <Icon icon="solar:danger-circle-bold" className="w-4 h-4" />
                        {errors.confirmationAccepted.message}
                      </motion.p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              {currentStep > 1 && (
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={prevStep}
                  className="px-6 py-3 border-2 border-safari-khaki text-safari-khaki rounded-full font-montserrat font-semibold hover:bg-safari-khaki hover:text-white transition-all duration-300"
                >
                  Previous
                </motion.button>
              )}
              
              {currentStep < totalSteps ? (
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={nextStep}
                  className="ml-auto btn-primary"
                >
                  Next Step
                </motion.button>
              ) : (
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: isSubmitting ? 1 : 1.05 }}
                  whileTap={{ scale: isSubmitting ? 1 : 0.95 }}
                  className="ml-auto btn-primary flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Icon icon="solar:refresh-bold-duotone" className="text-xl animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Icon icon="solar:letter-bold-duotone" className="text-xl" />
                      Confirm Registration
                    </>
                  )}
                </motion.button>
              )}
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default RSVP;