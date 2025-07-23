import React from 'react';
import { Search, UserCheck, MessageCircle, Calendar, Trophy, Users, Star, CreditCard, BarChart3 } from 'lucide-react';

const HowItWorks = () => {
  const clientSteps = [
    {
      icon: <Search className="w-8 h-8 text-orange-500" />,
      title: "Browse & Discover",
      description: "Explore certified trainers by specialty, location, and ratings to find your perfect fitness match."
    },
    {
      icon: <MessageCircle className="w-8 h-8 text-orange-500" />,
      title: "Connect & Chat",
      description: "Message trainers directly to discuss your goals, schedule, and create a personalized fitness plan."
    },
    {
      icon: <Calendar className="w-8 h-8 text-orange-500" />,
      title: "Book Sessions",
      description: "Schedule training sessions that fit your lifestyle - in-person, virtual, or hybrid options available."
    },
    {
      icon: <Trophy className="w-8 h-8 text-orange-500" />,
      title: "Train & Progress",
      description: "Work with your trainer and track your fitness journey with built-in progress monitoring tools."
    }
  ];

  const trainerSteps = [
    {
      icon: <UserCheck className="w-8 h-8 text-orange-500" />,
      title: "Create Your Profile",
      description: "Showcase your certifications, specialties, and experience to attract the right clients."
    },
    {
      icon: <Users className="w-8 h-8 text-orange-500" />,
      title: "Connect with Clients",
      description: "Respond to inquiries, chat with potential clients, and build your fitness community."
    },
    {
      icon: <Calendar className="w-8 h-8 text-orange-500" />,
      title: "Manage Bookings",
      description: "Set your availability, accept bookings, and organize your training schedule seamlessly."
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-orange-500" />,
      title: "Track & Earn",
      description: "Monitor client progress, manage payments, and grow your fitness coaching business."
    }
  ];

  const StepCard = ({ step, index }) => (
    <div className="relative group">
      {/* Step connector line */}
      {index < 3 && (
        <div className="hidden md:block absolute top-16 left-1/2 w-full h-0.5 bg-gradient-to-r from-white/40 to-transparent transform translate-x-1/2 z-0"></div>
      )}

      <div className="relative bg-gradient-to-br from-white to-white backdrop-blur-sm border border-white rounded-2xl p-6 hover:bg-gradient-to-br hover:from-white hover:to-white transition-all duration-300 hover:transform hover:scale-105 z-10 shadow-lg">
        {/* Step number */}
        <div className="absolute -top-3 -left-3 w-8 h-8 bg-white rounded-full flex items-center justify-center font-bold text-orange-500 shadow-lg">
          {index + 1}
        </div>

        {/* Icon */}
        <div className="text-orange-500 mb-4 group-hover:text-orange-600 transition-colors duration-300">
          {step.icon}
        </div>

        {/* Content */}
        <h3 className="text-orange-500 font-semibold text-lg mb-3">{step.title}</h3>
        <p className="text-orange-600/90 text-sm leading-relaxed">{step.description}</p>
      </div>
    </div>
  );

  return (
    <section className="w-full bg-orange-500 py-20 px-4 md:px-10 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-72 h-72 bg-gradient-to-br from-white to-orange-200 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-gradient-to-tl from-orange-300 to-white rounded-full blur-3xl"></div>
      </div>

      <div className="w-full mx-auto relative z-10 px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            How <span className="bg-gradient-to-r from-white to-orange-100 bg-clip-text text-transparent">TrainLink</span> Works
          </h2>
          <p className="text-white/90 text-lg max-w-2xl mx-auto leading-relaxed">
            Whether you're looking to transform your fitness journey or grow your coaching business,
            TrainLink makes it simple to connect, train, and succeed together.
          </p>
        </div>

        {/* Main content grid */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 w-full">
          {/* Client Flow */}
          <div className="space-y-8">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-3 bg-white/20 rounded-full px-6 py-3 mb-4 border border-white/30">
                <Users className="w-5 h-5 text-white" />
                <span className="text-white font-semibold">For Clients</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Find Your Perfect Trainer</h3>
              <p className="text-white/80">Connect with certified fitness professionals who understand your goals</p>
            </div>

            <div className="grid gap-6">
              {clientSteps.map((step, index) => (
                <StepCard key={index} step={step} index={index} />
              ))}
            </div>
          </div>

          {/* Trainer Flow */}
          <div className="space-y-8">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-3 bg-white/20 rounded-full px-6 py-3 mb-4 border border-white/30">
                <Star className="w-5 h-5 text-white" />
                <span className="text-white font-semibold">For Trainers</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Grow Your Coaching Business</h3>
              <p className="text-white/80">Build your client base and manage your fitness coaching career</p>
            </div>

            <div className="grid gap-6">
              {trainerSteps.map((step, index) => (
                <StepCard key={index} step={step} index={index} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
