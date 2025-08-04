import React from 'react';
import { Search, UserCheck, MessageCircle, Calendar, Trophy, Users, Star, BarChart3, ArrowDown } from 'lucide-react';

const HowItWorks = () => {
  const clientSteps = [
    {
      icon: Search,
      title: "Browse & Discover",
      description: "Explore certified trainers by specialty, location, and ratings to find your perfect fitness match.",
      color: "from-blue-400 to-blue-600"
    },
    {
      icon: MessageCircle,
      title: "Connect & Chat",
      description: "Message trainers directly to discuss your goals, schedule, and create a personalized fitness plan.",
      color: "from-green-400 to-green-600"
    },
    {
      icon: Calendar,
      title: "Book Sessions",
      description: "Schedule training sessions that fit your lifestyle - in-person, virtual, or hybrid options available.",
      color: "from-purple-400 to-purple-600"
    },
    {
      icon: Trophy,
      title: "Train & Progress",
      description: "Work with your trainer and track your fitness journey with built-in progress monitoring tools.",
      color: "from-yellow-400 to-yellow-600"
    }
  ];

  const trainerSteps = [
    {
      icon: UserCheck,
      title: "Create Your Profile",
      description: "Showcase your certifications, specialties, and experience to attract the right clients.",
      color: "from-pink-400 to-pink-600"
    },
    {
      icon: Users,
      title: "Connect with Clients",
      description: "Respond to inquiries, chat with potential clients, and build your fitness community.",
      color: "from-indigo-400 to-indigo-600"
    },
    {
      icon: Calendar,
      title: "Manage Bookings",
      description: "Set your availability, accept bookings, and organize your training schedule seamlessly.",
      color: "from-teal-400 to-teal-600"
    },
    {
      icon: BarChart3,
      title: "Track & Earn",
      description: "Monitor client progress, manage payments, and grow your fitness coaching business.",
      color: "from-red-400 to-red-600"
    }
  ];

  const TimelineStep = ({ step, index, isLast, side = 'left' }) => {
    const IconComponent = step.icon;
    const isLeft = side === 'left';

    return (
      <div className="relative flex items-center w-full">
        {/* Timeline line */}
        <div className="absolute left-1/2 top-0 w-0.5 h-full bg-white/30 -translate-x-0.5 z-0" />

        {/* Step content */}
        <div className={`relative w-1/2 ${isLeft ? 'pr-8' : 'pl-8 ml-auto'} z-10`}>
          <div className={`group ${isLeft ? 'text-right' : 'text-left'}`}>
            {/* Card */}
            <div className="relative bg-white/25 backdrop-blur-md border border-white/40 rounded-2xl p-6 transition-all duration-500 hover:bg-white/35 hover:scale-105 hover:rotate-1 shadow-lg">
              {/* Floating icon */}
              <div className={`absolute ${isLeft ? '-right-4' : '-left-4'} top-1/2 -translate-y-1/2 w-12 h-12 bg-gradient-to-br ${step.color} rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <IconComponent size={20} className="text-white" />
              </div>

              {/* Step number */}
              <div className={`inline-flex items-center justify-center w-8 h-8 bg-white rounded-full text-orange-500 font-bold text-sm mb-4 ${isLeft ? 'ml-auto' : ''}`}>
                {index + 1}
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-orange-100 transition-colors drop-shadow-sm">
                {step.title}
              </h3>
              <p className="text-white/90 leading-relaxed drop-shadow-sm">
                {step.description}
              </p>
            </div>
          </div>
        </div>

        {/* Central timeline dot */}
        <div className="absolute left-1/2 top-8 w-4 h-4 bg-white rounded-full -translate-x-1/2 z-20 shadow-lg" />

        {/* Arrow connector */}
        {!isLast && (
          <div className="absolute left-1/2 bottom-0 -translate-x-1/2 text-white/60 z-20 animate-bounce">
            <ArrowDown size={16} />
          </div>
        )}
      </div>
    );
  };

  const ProcessFlow = ({ steps, title, subtitle, icon: Icon, side }) => (
    <div className="relative">
      {/* Section header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 mb-4 border border-white/30">
          <Icon size={20} className="text-white" />
          <span className="text-white font-semibold">{title}</span>
        </div>
        <p className="text-white/90 text-lg max-w-md mx-auto">{subtitle}</p>
      </div>

      {/* Timeline steps */}
      <div className="space-y-8">
        {steps.map((step, index) => (
          <TimelineStep
            key={index}
            step={step}
            index={index}
            isLast={index === steps.length - 1}
            side={index % 2 === 0 ? 'left' : 'right'}
          />
        ))}
      </div>
    </div>
  );

  return (
    <section className="w-full bg-orange-500 py-20 px-6 md:px-10 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-2xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-tl from-orange-400/30 to-transparent rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-gradient-to-r from-white/10 to-orange-300/20 rounded-full blur-2xl animate-pulse delay-500 -translate-x-1/2 -translate-y-1/2" />
      </div>

      <div className="w-full mx-auto relative z-10">
        {/* Main header */}
        <div className="text-center mb-20">
          <div className="inline-block">
            <h2 className="text-5xl md:text-7xl font-black text-white mb-6 leading-none">
              HOW IT
              <span className="block bg-gradient-to-r from-white to-orange-200 bg-clip-text text-transparent">
                WORKS
              </span>
            </h2>
          </div>
          <div className="w-24 h-1 bg-white mx-auto mb-6" />
          <p className="text-white/90 text-xl max-w-2xl mx-auto leading-relaxed">
            Two paths, one destination: fitness success through meaningful connections
          </p>
        </div>

        {/* Split layout */}
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Client Journey */}
          <div>
            <ProcessFlow
              steps={clientSteps}
              title="Client Journey"
              subtitle="Your path to fitness transformation"
              icon={Users}
            />
          </div>

          {/* Trainer Journey */}
          <div>
            <ProcessFlow
              steps={trainerSteps}
              title="Trainer Journey"
              subtitle="Build and grow your coaching empire"
              icon={Star}
            />
          </div>
        </div>

        {/* Bottom CTA section */}
        <div className="text-center mt-20">
          <div className="inline-flex items-center gap-4 bg-white/20 backdrop-blur-lg rounded-full px-8 py-4 border border-white/30">
            <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
            <span className="text-white font-semibold">Ready to start your journey?</span>
            <div className="w-3 h-3 bg-white rounded-full animate-pulse delay-500" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;