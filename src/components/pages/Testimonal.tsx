'use client'

import React, { useState } from 'react';
import { Star, Users, Dumbbell, ArrowRight } from 'lucide-react';

const TestimonialsPage = () => {
  const [activeTab, setActiveTab] = useState('members');

  const memberTestimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Member",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      quote: "Found my perfect trainer within hours! The platform makes it so easy to connect with certified professionals who truly understand my fitness goals.",
      rating: 5
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Member",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      quote: "TrainLink transformed my fitness journey. My trainer's personalized approach helped me lose 30 pounds and gain confidence I never had before.",
      rating: 5
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      role: "Member",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      quote: "The variety of trainers and specializations is incredible. I found a yoga instructor who specializes in post-injury recovery - exactly what I needed.",
      rating: 5
    },
    {
      id: 4,
      name: "David Thompson",
      role: "Member",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      quote: "Affordable, flexible, and results-driven. My trainer works around my busy schedule and delivers amazing workout plans that actually work.",
      rating: 5
    },
    {
      id: 5,
      name: "Lisa Park",
      role: "Member",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
      quote: "As a busy mom, I needed home workouts that fit my lifestyle. TrainLink connected me with a trainer who gets it and makes fitness fun!",
      rating: 5
    },
    {
      id: 6,
      name: "James Wilson",
      role: "Member",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
      quote: "The communication tools and progress tracking features keep me motivated. It's like having a personal trainer in your pocket 24/7.",
      rating: 5
    }
  ];

  const trainerTestimonials = [
    {
      id: 1,
      name: "Alex Martinez",
      role: "Certified Personal Trainer",
      avatar: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=150&h=150&fit=crop&crop=face",
      quote: "TrainLink gave me the freedom to build my own fitness business. I've connected with amazing clients and expanded my reach beyond my local gym.",
      rating: 5
    },
    {
      id: 2,
      name: "Jessica Kim",
      role: "Yoga Instructor",
      avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face",
      quote: "The platform's tools for scheduling and client management are fantastic. I can focus on what I love - helping people achieve their wellness goals.",
      rating: 5
    },
    {
      id: 3,
      name: "Marcus Brown",
      role: "Strength Coach",
      avatar: "https://images.unsplash.com/photo-1566753323558-f4e0952af115?w=150&h=150&fit=crop&crop=face",
      quote: "TrainLink's verification system builds trust with clients instantly. The quality of members I work with has significantly improved my business.",
      rating: 5
    },
    {
      id: 4,
      name: "Rachel Green",
      role: "Nutrition Coach",
      avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face",
      quote: "From profiles to payments, everything is streamlined. I've doubled my client base and love the supportive community of fellow trainers.",
      rating: 5
    },
    {
      id: 5,
      name: "Tony Reeves",
      role: "HIIT Specialist",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
      quote: "The flexible scheduling and remote training capabilities opened up opportunities I never imagined. TrainLink truly empowers fitness professionals.",
      rating: 5
    }
  ];

  const currentTestimonials = activeTab === 'members' ? memberTestimonials : trainerTestimonials;

  const renderStars = (rating: any) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'fill-yellow-300 text-yellow-300' : 'text-white/40'}`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-orange-500 text-white">
      {/* Header Section */}
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="mb-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-b from-white to-white/80 bg-clip-text text-transparent">
            What Our Users Say
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
            Real experiences from both members and fitness professionals
          </p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="mx-auto px-4 mb-12">
        <div className="flex justify-center">
          <div className="bg-transparent md:flex items-center md:space-x-4 rounded-full p-1 space-y-2 backdrop-blur-sm">
            <button
              onClick={() => setActiveTab('members')}
              className={`flex items-center gap-2 px-6 py-3 cursor-pointer rounded-full transition-all duration-300 ${activeTab === 'members'
                ? 'bg-white text-orange-500 shadow-lg'
                : 'text-white hover:bg-white/10'
                }`}
            >
              <Users className="w-5 h-5" />
              <span className="font-semibold">Members Speak</span>
            </button>
            <button
              onClick={() => setActiveTab('trainers')}
              className={`flex items-center gap-2 px-6 py-3 cursor-pointer rounded-full transition-all duration-300 ${activeTab === 'trainers'
                ? 'bg-white text-orange-500 shadow-lg'
                : 'text-white hover:bg-white/10'
                }`}
            >
              <Dumbbell className="w-5 h-5" />
              <span className="font-semibold">Trainers Speak</span>
            </button>
          </div>
        </div>
      </div>

      {/* Testimonials Grid */}
      <div className="container mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {currentTestimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl hover:shadow-2xl hover:bg-white/15 transition-all duration-300 transform hover:-translate-y-1"
            >
              {/* Header */}
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-white/30"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-white">
                    {testimonial.name}
                  </h3>
                  <span className="inline-block bg-white/20 text-white/90 text-sm px-3 py-1 rounded-full">
                    {testimonial.role}
                  </span>
                </div>
              </div>

              {/* Quote */}
              <blockquote className="text-white/95 leading-relaxed mb-4 text-sm md:text-base">
                "{testimonial.quote}"
              </blockquote>

              {/* Rating */}
              <div className="flex items-center gap-1">
                {renderStars(testimonial.rating)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-white backdrop-blur-sm border-t border-white/20">
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-orange-500">
            Want to become part of the TrainLink family?
          </h2>
          <p className="text-lg text-orange-500 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied members and professional trainers who've transformed their fitness journey with TrainLink.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="group flex items-center gap-2 bg-orange-500 cursor-pointer border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-orange-600 hover:text-orange-100 transition-all duration-300 transform hover:scale-105">
              <Dumbbell className="w-5 h-5" />
              Join as a Trainer
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="group flex items-center gap-2 bg-orange-500 cursor-pointer border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-orange-600 hover:text-orange-100 transition-all duration-300 transform hover:scale-105">
              <Users className="w-5 h-5" />
              Start Training Now
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialsPage;