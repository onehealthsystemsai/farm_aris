import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';
import { useForm } from 'react-hook-form';
import { rsvpService, type RSVPFormData } from '../../services/rsvpService';
import { drinkCategories, getDrinksByCategory, type Drink } from '../../data/drinks';
import { ChevronLeft, ChevronRight, Mail } from 'lucide-react';

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
  const [isRSVPSectionVisible, setIsRSVPSectionVisible] = useState(false);
  const [hasStartedForm, setHasStartedForm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<FormData>();

  const selectedDrinks = watch('drinks') || [];
  const watchedValues = watch();
  const attendeesCount = watch('attendees') || 1;
  
  // Calculate total selected drinks across all categories
  const totalSelectedDrinks = selectedDrinks?.length || 0;
  
  // Helper function to get selected count for a category
  const getSelectedCountForCategory = (categoryKey: string): number => {
    if (!selectedDrinks || selectedDrinks.length === 0) return 0;
    
    const categoryDrinksInThisCategory = getDrinksByCategory(categoryKey);
    return selectedDrinks.filter(drinkName => {
      return categoryDrinksInThisCategory.some(drink => 
        drinkName.includes(drink.name) && drinkName.includes(drink.size)
      );
    }).length;
  };
  
  // Premium drink selection state
  const [selectedDrinkCategory, setSelectedDrinkCategory] = useState<string | null>(null);
  const [categoryDrinks, setCategoryDrinks] = useState<Drink[]>([]);
  const [selectedSpecificDrinks, setSelectedSpecificDrinks] = useState<string[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);

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

  // Intersection observer to detect when RSVP section is visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsRSVPSectionVisible(entry.isIntersecting);
      },
      {
        threshold: 0.1, // More sensitive - show buttons when 10% of RSVP section is visible
        rootMargin: '0px 0px 0px 0px' // No margin to be more forgiving during transitions
      }
    );

    const rsvpElement = document.getElementById('rsvp');
    if (rsvpElement) {
      observer.observe(rsvpElement);
    }

    return () => {
      if (rsvpElement) {
        observer.unobserve(rsvpElement);
      }
    };
  }, []);

  // Premium drink selection handlers
  const handleCategorySelect = async (category: string) => {
    if (selectedDrinkCategory === category) {
      // Deselect category
      setIsAnimating(true);
      setTimeout(() => {
        setSelectedDrinkCategory(null);
        setCategoryDrinks([]);
        setIsAnimating(false);
      }, 300);
    } else {
      // Select new category
      setIsAnimating(true);
      setTimeout(() => {
        setSelectedDrinkCategory(category);
        const categoryDrinksData = getDrinksByCategory(category);
        setCategoryDrinks(categoryDrinksData);
        
        // Populate selectedSpecificDrinks from form data to cache selections
        const currentDrinks = watch('drinks') || [];
        const preSelectedDrinks = currentDrinks
          .map(drinkName => {
            // Find matching drink by name and size
            const matchingDrink = categoryDrinksData.find(drink => 
              drinkName.includes(drink.name) && drinkName.includes(drink.size)
            );
            return matchingDrink?.id;
          })
          .filter(Boolean) as string[];
        
        setSelectedSpecificDrinks(preSelectedDrinks);
        setIsAnimating(false);
      }, 300);
    }
  };

  const handleSpecificDrinkToggle = (drinkId: string) => {
    setSelectedSpecificDrinks(prev => {
      const newSelection = prev.includes(drinkId) 
        ? prev.filter(id => id !== drinkId)
        : [...prev, drinkId];
      
      return newSelection;
    });
    
    // Update form data by managing all drinks across all categories
    const currentFormDrinks = watch('drinks') || [];
    const currentDrink = categoryDrinks.find(d => d.id === drinkId);
    
    if (currentDrink) {
      const drinkName = `${currentDrink.name} (${currentDrink.size})`;
      
      if (selectedSpecificDrinks.includes(drinkId)) {
        // Remove the drink
        const updatedDrinks = currentFormDrinks.filter(drink => drink !== drinkName);
        setValue('drinks', updatedDrinks);
      } else {
        // Add the drink
        const updatedDrinks = [...currentFormDrinks, drinkName];
        setValue('drinks', updatedDrinks);
      }
    }
  };

  const handleBackToCategories = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setIsAnimating(true);
    setTimeout(() => {
      setSelectedDrinkCategory(null);
      setCategoryDrinks([]);
      // Don't clear selectedSpecificDrinks here - let it persist for form data
      setIsAnimating(false);
    }, 300);
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      // Prepare RSVP data
      const rsvpData: RSVPFormData = {
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        attendees: Number(data.attendees) || 1,
        additionalAttendees: data.additionalAttendees || [],
        days: data.days || [],
        drinks: data.drinks || [],
        mealPreference: data.mealPreference || '',
        specialRequirements: data.specialRequirements || '',
        confirmationAccepted: data.confirmationAccepted || false
      };
      
      // Save to Supabase database
      console.log('Attempting to save RSVP with data:', {
        fullName: rsvpData.fullName,
        email: rsvpData.email,
        phone: rsvpData.phone,
        attendees: rsvpData.attendees,
        additionalAttendees: rsvpData.additionalAttendees?.length || 0,
        daysSelected: rsvpData.days?.length || 0,
        drinksSelected: rsvpData.drinks?.length || 0,
        mealPreference: rsvpData.mealPreference,
        confirmationAccepted: rsvpData.confirmationAccepted
      });
      
      const savedRSVP = await rsvpService.create(rsvpData);
      
      console.log('✅ RSVP saved successfully to Supabase:', savedRSVP);
      setIsSubmitted(true);
    } catch (error: any) {
      console.error('❌ RSVP submission error:', error);
      
      // Enhanced error reporting
      let userMessage = 'There was an error submitting your RSVP. ';
      
      if (error?.code === '42501') {
        userMessage += 'Database security policy prevented the submission. ';
        console.error('RLS Policy Error - likely missing INSERT or SELECT permissions for anonymous users');
      } else if (error?.code === '23505') {
        userMessage += 'This email address has already been registered. ';
      } else if (error?.message?.includes('Invalid API key')) {
        userMessage += 'API configuration error. ';
        console.error('Supabase API key configuration error');
      } else if (error?.message) {
        console.error('Detailed error:', error.message);
      }
      
      userMessage += 'Please try again or contact us directly at +264 81 129 9623.';
      alert(userMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      // Validate mandatory fields for step 1
      if (currentStep === 1) {
        const fullName = watch('fullName');
        const phone = watch('phone');
        
        if (!fullName || !fullName.trim()) {
          // Trigger validation by attempting to focus the field
          return;
        }
        
        if (!phone || !phone.trim()) {
          // Trigger validation by attempting to focus the field
          return;
        }
      }
      
      setCurrentStep(currentStep + 1);
      setHasStartedForm(true);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setHasStartedForm(true);
    }
  };


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
    <section id="rsvp" className="py-20 bg-gradient-to-b from-white to-namibian-blue/10 relative">
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
          <div className="w-24 h-1 bg-gradient-to-r from-safari-khaki to-sunset-orange mx-auto mb-8" />
        </motion.div>

        {/* Modern 5-Step Progress Bar */}
        <div className="mb-12">
          {/* Step Labels - Mobile optimized */}
          <div className="hidden md:flex justify-between mb-6">
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

          {/* Mobile Step Indicators */}
          <div className="md:hidden flex justify-center mb-6">
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((step) => (
                <motion.div
                  key={step}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                    currentStep >= step
                      ? 'bg-gradient-to-br from-safari-khaki to-savanna-gold shadow-lg'
                      : currentStep === step
                      ? 'bg-safari-khaki/20 border-2 border-safari-khaki'
                      : 'bg-gray-200'
                  }`}
                >
                  <span className={`text-xs font-rubik font-bold ${
                    currentStep >= step ? 'text-white' : 'text-gray-500'
                  }`}>
                    {step}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
          
          {/* Modern Progress Line */}
          <div className="relative">
            <div className="absolute top-1/2 left-0 w-full h-2 bg-gray-200 rounded-full transform -translate-y-1/2" />
            <motion.div
              initial={{ width: '0%' }}
              animate={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="absolute top-1/2 left-0 h-2 bg-gradient-to-r from-safari-khaki to-savanna-gold rounded-full transform -translate-y-1/2 shadow-sm"
             />
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-3xl shadow-xl p-8 md:p-12"
        >
          {/* Countdown Timer Component - Mobile only */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="md:hidden text-center mb-8"
          >
            <div className="flex items-center gap-1 justify-center mb-3">
              <Icon icon="solar:calendar-mark-bold-duotone" className="text-sm text-safari-khaki" />
              <span className="text-sm font-rubik text-safari-khaki">Reservations ends Sep 20, 2025</span>
            </div>
            
            <div className="flex gap-2 justify-center max-w-xs mx-auto">
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
                  <div className="bg-gray-300 text-gray-800 rounded-lg px-3 py-2 shadow-sm">
                    <div className="text-sm font-rubik font-bold leading-none">
                      {item.value.toString().padStart(2, '0')}
                    </div>
                    <div className="text-xs font-montserrat leading-tight mt-1">
                      {item.label}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

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
                  {/* Section Header with Icon */}
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

                    {/* Desktop Countdown Timer */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                      className="hidden md:block text-center"
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
                  {/* Section Header with Icon */}
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

                    {/* Desktop Countdown Timer */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                      className="hidden md:block text-center"
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
                  {/* Section Header with Icon */}
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

                    {/* Desktop Countdown Timer */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                      className="hidden md:block text-center"
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

                  <AnimatePresence mode="wait">
                    {!selectedDrinkCategory ? (
                      // Category Selection View
                      <motion.div
                        key="categories"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <label className="text-lg font-rubik font-bold text-gray-800">
                              Premium Beverage Selection
                            </label>
                            {totalSelectedDrinks > 0 && (
                              <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                whileHover={{ scale: 1.02 }}
                                transition={{ duration: 0.3 }}
                                className="bg-gradient-to-r from-safari-khaki to-savanna-gold text-white px-3 py-1.5 rounded-lg flex items-center gap-2 shadow-md"
                              >
                                <span className="text-sm font-montserrat font-semibold">
                                  {totalSelectedDrinks} Selected
                                </span>
                              </motion.div>
                            )}
                          </div>
                          <p className="text-sm font-montserrat text-gray-600 mb-6">
                            Choose from our curated collection of premium beverages. Select a category to explore our finest selections.
                          </p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {Object.entries(drinkCategories).map(([key, category]) => {
                              const categoryDrinksCount = getDrinksByCategory(key).length;
                              const selectedCount = getSelectedCountForCategory(key);
                              
                              return (
                                <motion.div
                                  key={key}
                                  whileHover={{ scale: 1.02, y: -2 }}
                                  whileTap={{ scale: 0.98 }}
                                  onClick={() => handleCategorySelect(key)}
                                  className="group cursor-pointer bg-gradient-to-br from-white to-gray-50 rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200/50 relative"
                                >
                                  {/* Professional Count Badge */}
                                  {selectedCount > 0 && (
                                    <motion.div
                                      initial={{ scale: 0, opacity: 0 }}
                                      animate={{ scale: 1, opacity: 1 }}
                                      whileHover={{ scale: 1.05 }}
                                      transition={{ duration: 0.2 }}
                                      className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-safari-khaki to-savanna-gold rounded-full flex items-center justify-center shadow-md z-10 border-2 border-white"
                                    >
                                      <span className="text-xs font-rubik font-bold text-white">{selectedCount}</span>
                                    </motion.div>
                                  )}
                                  
                                  <div className="text-center">
                                    <div className="w-14 h-14 mx-auto mb-3 bg-gradient-to-br from-safari-khaki/20 to-savanna-gold/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                      <Icon icon={category.icon} className="text-2xl text-safari-khaki" />
                                    </div>
                                    <h3 className="text-base font-rubik font-bold text-gray-800 mb-2 group-hover:text-safari-khaki transition-colors duration-300">
                                      {category.name}
                                    </h3>
                                    <p className="text-xs font-montserrat text-gray-600 leading-relaxed mb-3">
                                      {category.description}
                                    </p>
                                  </div>
                                  
                                  <div className="flex items-center justify-center text-safari-khaki opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <span className="text-xs font-montserrat font-semibold mr-1">Explore Selection</span>
                                    <Icon icon="solar:arrow-right-bold-duotone" className="text-sm" />
                                  </div>
                                </motion.div>
                              );
                            })}
                          </div>
                        </div>

                      </motion.div>
                    ) : (
                      // Specific Drinks Selection View
                      <motion.div
                        key="specific-drinks"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6 relative"
                      >
                        {/* Mobile Premium Back Button */}
                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={(e) => handleBackToCategories(e)}
                          className="md:hidden fixed bottom-4 left-4 right-4 z-50 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl shadow-2xl flex items-center justify-center gap-3 py-4 font-montserrat font-semibold backdrop-blur-sm border border-gray-500/20"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <ChevronLeft className="text-white" size={20} strokeWidth={3} />
                          <span className="text-sm">Back to Categories</span>
                          {selectedSpecificDrinks.length > 0 && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              whileHover={{ scale: 1.05 }}
                              transition={{ duration: 0.2 }}
                              className="bg-gradient-to-br from-safari-khaki to-savanna-gold text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold ml-auto shadow-md border-2 border-white"
                            >
                              {selectedSpecificDrinks.length}
                            </motion.div>
                          )}
                        </motion.button>

                        {/* Desktop Back Button & Category Header */}
                        <div className="hidden md:flex items-center gap-4 mb-6">
                          <motion.button
                            type="button"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={(e) => handleBackToCategories(e)}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors duration-200"
                          >
                            <Icon icon="solar:arrow-left-bold-duotone" className="text-lg text-gray-600" />
                            <span className="font-montserrat font-medium text-gray-700">Back to Categories</span>
                          </motion.button>
                          
                          <div className="flex-1">
                            <h3 className="text-xl font-rubik font-bold text-gray-800">
                              {drinkCategories[selectedDrinkCategory as keyof typeof drinkCategories]?.name}
                            </h3>
                            <p className="text-sm font-montserrat text-gray-600">
                              Select multiple options • {selectedSpecificDrinks.length} selected
                            </p>
                          </div>
                        </div>

                        {/* Mobile Category Header */}
                        <div className="md:hidden text-center mb-6">
                          <h3 className="text-lg font-rubik font-bold text-gray-800">
                            {drinkCategories[selectedDrinkCategory as keyof typeof drinkCategories]?.name}
                          </h3>
                          <p className="text-sm font-montserrat text-gray-600">
                            Select multiple options • {selectedSpecificDrinks.length} selected
                          </p>
                        </div>

                        {/* Premium Drinks Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                          {categoryDrinks.map((drink) => (
                            <motion.div
                              key={drink.id}
                              layout
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.3, delay: categoryDrinks.indexOf(drink) * 0.05 }}
                              whileHover={{ scale: 1.02, y: -2 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => handleSpecificDrinkToggle(drink.id)}
                              className={`relative cursor-pointer bg-gray-50 rounded-xl p-3 shadow-lg hover:shadow-xl transition-all duration-300 border-2 ${
                                selectedSpecificDrinks.includes(drink.id)
                                  ? 'border-safari-khaki bg-safari-khaki/5 shadow-safari-khaki/20'
                                  : 'border-gray-200 hover:border-safari-khaki/30'
                              }`}
                            >
                              {/* Premium Badge */}
                              {drink.premium && (
                                <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full flex items-center justify-center shadow-lg">
                                  <Icon icon="solar:crown-bold" className="text-xs text-white" />
                                </div>
                              )}

                              {/* Selection Indicator */}
                              <div className={`absolute top-2 left-2 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                                selectedSpecificDrinks.includes(drink.id)
                                  ? 'bg-safari-khaki border-safari-khaki'
                                  : 'border-gray-300 bg-white'
                              }`}>
                                {selectedSpecificDrinks.includes(drink.id) && (
                                  <Icon icon="solar:check-bold" className="text-xs text-white" />
                                )}
                              </div>

                              {/* Drink Image */}
                              <div className="h-32 mb-2 flex items-center justify-center bg-white rounded-lg overflow-hidden">
                                <img
                                  src={drink.image}
                                  alt={drink.name}
                                  className="h-full w-auto object-contain"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = 'none';
                                    const parent = target.parentElement;
                                    if (parent) {
                                      const icon = document.createElement('div');
                                      icon.className = 'text-2xl text-gray-400';
                                      icon.innerHTML = '🍻';
                                      parent.appendChild(icon);
                                    }
                                  }}
                                />
                              </div>

                              {/* Drink Details */}
                              <div className="text-center">
                                <h4 className={`font-rubik font-bold text-xs mb-1 transition-colors duration-200 ${
                                  selectedSpecificDrinks.includes(drink.id) ? 'text-safari-khaki' : 'text-gray-800'
                                }`}>
                                  {drink.name}
                                </h4>
                                <p className="font-montserrat text-xs text-gray-600 mb-1">
                                  {drink.size}
                                </p>
                                <p className="font-montserrat text-xs text-gray-500 leading-tight line-clamp-2">
                                  {drink.description}
                                </p>
                              </div>
                            </motion.div>
                          ))}
                        </div>

                        {/* Selection Summary */}
                        {selectedSpecificDrinks.length > 0 && (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4"
                          >
                            <div className="flex items-start gap-3">
                              <Icon icon="solar:check-circle-bold-duotone" className="text-2xl text-green-600 flex-shrink-0 mt-0.5" />
                              <div>
                                <h4 className="font-rubik font-semibold text-green-800 mb-2">
                                  {selectedSpecificDrinks.length} Beverage{selectedSpecificDrinks.length !== 1 ? 's' : ''} Selected
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                  {selectedSpecificDrinks.map(drinkId => {
                                    const drink = categoryDrinks.find(d => d.id === drinkId);
                                    return drink ? (
                                      <span key={drinkId} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-montserrat font-medium">
                                        {drink.name} ({drink.size})
                                      </span>
                                    ) : null;
                                  })}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
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
                  {/* Section Header with Icon */}
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

                    {/* Desktop Countdown Timer */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                      className="hidden md:block text-center"
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
                  {/* Section Header with Icon */}
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

                    {/* Desktop Countdown Timer */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                      className="hidden md:block text-center"
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
                      <div className="flex items-center justify-between py-2 border-b border-gray-200">
                        <span className="font-montserrat text-sm text-gray-600">Beverages Selected</span>
                        <div className="flex items-center gap-2">
                          <span className="font-montserrat font-semibold text-gray-800">
                            {(watchedValues.drinks && watchedValues.drinks.length) || 0}
                          </span>
                          {(watchedValues.drinks && watchedValues.drinks.length > 0) && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              whileHover={{ scale: 1.05 }}
                              transition={{ duration: 0.2 }}
                              className="bg-gradient-to-br from-safari-khaki to-savanna-gold text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow-md border-2 border-white"
                            >
                              {watchedValues.drinks.length}
                            </motion.div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Selected Drinks Details */}
                    {watchedValues.drinks && watchedValues.drinks.length > 0 && (
                      <div className="bg-gradient-to-r from-safari-khaki/5 to-savanna-gold/5 rounded-xl p-4 border border-safari-khaki/20">
                        <h4 className="font-rubik font-bold text-gray-800 mb-3 flex items-center gap-2">
                          <Icon icon="solar:cup-bold-duotone" className="text-safari-khaki text-lg" />
                          Selected Beverages
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {watchedValues.drinks.map((drink, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3, delay: index * 0.1 }}
                              className="flex items-center gap-2 bg-white/50 rounded-lg p-2"
                            >
                              <div className="w-2 h-2 bg-safari-khaki rounded-full" />
                              <span className="font-montserrat text-sm text-gray-700">{drink}</span>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}

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

            {/* Desktop Navigation Buttons - Hidden in drink selection view */}
            {!(currentStep === 3 && selectedDrinkCategory) && (
              <div className="hidden md:flex justify-between mt-8">
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
                  disabled={currentStep === 1 && (!watch('fullName')?.trim() || !watch('phone')?.trim())}
                  className={`ml-auto btn-primary ${
                    currentStep === 1 && (!watch('fullName')?.trim() || !watch('phone')?.trim())
                      ? 'opacity-50 cursor-not-allowed'
                      : ''
                  }`}
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
            )}

          </form>

        </motion.div>
      </div>

      {/* Mobile Floating Navigation Buttons - Only when RSVP section is visible or user has started form */}
      {(isRSVPSectionVisible || hasStartedForm) && !(currentStep === 3 && selectedDrinkCategory) && (
        <>
          {/* Mobile Previous Button - Bottom Left */}
          {currentStep > 1 && (
            <motion.button
              type="button"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={prevStep}
              className="md:hidden fixed bottom-6 left-6 z-50 w-14 h-14 bg-white border-2 border-safari-khaki/30 rounded-full shadow-2xl flex items-center justify-center backdrop-blur-sm"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronLeft className="text-safari-khaki" size={24} strokeWidth={3} />
            </motion.button>
          )}

          {/* Mobile Next/Submit Button - Bottom Right */}
          <motion.button
            type={currentStep < totalSteps ? "button" : "submit"}
            disabled={isSubmitting || (currentStep === 1 && (!watch('fullName')?.trim() || !watch('phone')?.trim()))}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={currentStep < totalSteps ? nextStep : undefined}
            className={`md:hidden fixed bottom-6 right-6 z-50 bg-gradient-to-r from-safari-khaki to-savanna-gold text-white rounded-full shadow-2xl flex items-center gap-3 px-6 py-4 font-montserrat font-semibold backdrop-blur-sm disabled:opacity-70 disabled:cursor-not-allowed ${
              currentStep === 1 && (!watch('fullName')?.trim() || !watch('phone')?.trim())
                ? 'opacity-50'
                : ''
            }`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            {isSubmitting ? (
              <>
                <Icon icon="solar:refresh-bold-duotone" className="text-lg animate-spin" />
                <span className="text-sm">Saving...</span>
              </>
            ) : currentStep < totalSteps ? (
              <>
                <span className="text-sm">Next Step</span>
                <ChevronRight className="text-white" size={20} strokeWidth={3} />
              </>
            ) : (
              <>
                <Mail className="text-white" size={18} strokeWidth={3} />
                <span className="text-sm">Complete</span>
              </>
            )}
          </motion.button>
        </>
      )}
    </section>
  );
};

export default RSVP;