import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';
import { useForm } from 'react-hook-form';
import { databaseService } from '../../utils/database';

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  attendees: number;
  days: string[];
  mealPreference: string;
  drinks: string[];
  specialRequirements: string;
}

const RSVP: React.FC = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormData>();

  const selectedDrinks = watch('drinks') || [];

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
        <div className="section-padding max-w-4xl mx-auto">
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
      <div className="section-padding max-w-4xl mx-auto">
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

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex-1 flex items-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: currentStep >= step ? 1 : 0.8 }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-rubik font-bold ${
                    currentStep >= step
                      ? 'bg-gradient-to-r from-safari-khaki to-savanna-gold text-white'
                      : 'bg-gray-200 text-gray-400'
                  }`}
                >
                  {step}
                </motion.div>
                {step < 3 && (
                  <div className="flex-1 h-1 mx-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: currentStep > step ? '100%' : '0%' }}
                      className="h-full bg-gradient-to-r from-safari-khaki to-savanna-gold"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-sm font-montserrat text-gray-600">
            <span>Personal Info</span>
            <span>Event Details</span>
            <span>Preferences</span>
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
                  <h3 className="text-2xl font-rubik font-bold text-gray-800 mb-6">
                    Personal Information
                  </h3>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-montserrat font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        {...register('fullName', { required: 'Name is required' })}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-safari-khaki focus:outline-none transition-colors duration-300"
                        placeholder="Enter your full name"
                      />
                      {errors.fullName && (
                        <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-montserrat font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        {...register('email', {
                          required: 'Email is required',
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'Invalid email address',
                          },
                        })}
                        type="email"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-safari-khaki focus:outline-none transition-colors duration-300"
                        placeholder="your@email.com"
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-montserrat font-medium text-gray-700 mb-2">
                        Phone/WhatsApp *
                      </label>
                      <input
                        {...register('phone', { required: 'Phone number is required' })}
                        type="tel"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-safari-khaki focus:outline-none transition-colors duration-300"
                        placeholder="+264 81 123 4567"
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
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
                  <h3 className="text-2xl font-rubik font-bold text-gray-800 mb-6">
                    Event Details
                  </h3>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-montserrat font-medium text-gray-700 mb-2">
                        Number of Attendees
                      </label>
                      <select
                        {...register('attendees')}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-safari-khaki focus:outline-none transition-colors duration-300"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                          <option key={num} value={num}>
                            {num} {num === 1 ? 'Person' : 'People'}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-montserrat font-medium text-gray-700 mb-4">
                        Which Days Will You Attend?
                      </label>
                      <div className="space-y-3">
                        <label className="flex items-center p-4 border-2 border-gray-200 rounded-xl hover:border-safari-khaki transition-colors duration-300 cursor-pointer">
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
                        <label className="flex items-center p-4 border-2 border-gray-200 rounded-xl hover:border-safari-khaki transition-colors duration-300 cursor-pointer">
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
                        <label className="flex items-center p-4 border-2 border-gray-200 rounded-xl hover:border-safari-khaki transition-colors duration-300 cursor-pointer">
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

              {/* Step 3: Preferences */}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="text-2xl font-rubik font-bold text-gray-800 mb-6">
                    Your Preferences
                  </h3>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-montserrat font-medium text-gray-700 mb-2">
                        Meal Preferences
                      </label>
                      <select
                        {...register('mealPreference')}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-safari-khaki focus:outline-none transition-colors duration-300"
                      >
                        <option value="">Select preference</option>
                        <option value="standard">Standard (All meats)</option>
                        <option value="vegetarian">Vegetarian</option>
                        <option value="vegan">Vegan</option>
                        <option value="halal">Halal</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-montserrat font-medium text-gray-700 mb-4">
                        Drink Preferences (Select all that apply)
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {drinkOptions.map((drink) => (
                          <label
                            key={drink.value}
                            className="flex items-center p-3 border-2 border-gray-200 rounded-xl hover:border-safari-khaki transition-colors duration-300 cursor-pointer"
                          >
                            <input
                              {...register('drinks')}
                              type="checkbox"
                              value={drink.value}
                              className="sr-only"
                            />
                            <div className="flex items-center gap-2">
                              <Icon
                                icon={drink.icon}
                                className={`text-xl ${
                                  selectedDrinks.includes(drink.value)
                                    ? 'text-safari-khaki'
                                    : 'text-gray-400'
                                }`}
                              />
                              <span
                                className={`font-montserrat text-sm ${
                                  selectedDrinks.includes(drink.value)
                                    ? 'text-safari-khaki font-semibold'
                                    : 'text-gray-600'
                                }`}
                              >
                                {drink.label}
                              </span>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-montserrat font-medium text-gray-700 mb-2">
                        Special Requirements
                      </label>
                      <textarea
                        {...register('specialRequirements')}
                        rows={4}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-safari-khaki focus:outline-none transition-colors duration-300"
                        placeholder="Any accessibility needs, dietary restrictions, or special requests..."
                      />
                    </div>
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