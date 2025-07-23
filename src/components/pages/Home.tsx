'use client';

import React, { useState, useEffect } from 'react';
import { Dumbbell, Play, Star, Users, Target, TrendingUp, ArrowRight } from 'lucide-react';

export default function TrainLinkHero() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const stats = [
        { icon: Users, value: "10K+", label: "Active Members" },
        { icon: Dumbbell, value: "500+", label: "Certified Trainers" },
        { icon: Target, value: "95%", label: "Goal Achievement" }
    ];

    return (
        <div className="relative min-h-screen bg-orange-500 overflow-hidden">

            {/* Background Elements */}
            <div className="absolute inset-0">
                <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
                <div className="absolute top-40 right-20 w-24 h-24 bg-white/10 rounded-full blur-lg animate-pulse delay-1000"></div>
                <div className="absolute bottom-40 left-1/4 w-40 h-40 bg-white/5 rounded-full blur-2xl animate-pulse delay-500"></div>
            </div>

            {/* Hero Content */}
            <div className="relative z-10 px-6 pt-12 pb-20">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">

                        {/* Left Column - Content */}
                        <div className={`transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>

                            {/* Badge */}
                            <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                                <Star className="h-4 w-4 text-yellow-300 mr-2" />
                                <span className="text-white text-sm font-medium">#1 Fitness Platform</span>
                            </div>

                            {/* Main Headline */}
                            <h1 className="text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                                <span className="bg-gradient-to-b from-white to-white/80 bg-clip-text text-transparent">
                                    Train Smarter.
                                </span>
                                <br />
                                <span className="text-white/90">Live Stronger.</span>
                            </h1>

                            {/* Supporting Text */}
                            <p className="text-xl text-white/90 leading-relaxed mb-8 max-w-lg">
                                Connect with certified personal trainers, get customized fitness plans,
                                and reach your goals — all in one platform.
                            </p>

                            {/* CTA Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 mb-12">
                                <button className="group bg-white text-orange-500 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-50 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center">
                                    Get Started
                                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                </button>
                                <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white/10 transition-all duration-200 transform hover:scale-105">
                                    Become a Trainer
                                </button>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-6">
                                {stats.map((stat, index) => (
                                    <div
                                        key={index}
                                        className={`text-center transform transition-all duration-1000 delay-${(index + 1) * 200} ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
                                            }`}
                                    >
                                        <stat.icon className="h-6 w-6 text-white/80 mx-auto mb-2" />
                                        <div className="text-2xl font-bold text-white">{stat.value}</div>
                                        <div className="text-sm text-white/70">{stat.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right Column - Visual */}
                        <div className={`relative transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>

                            {/* Main Dashboard Mockup */}
                            <div className="relative bg-white rounded-2xl shadow-2xl p-6 transform rotate-3 hover:rotate-0 transition-transform duration-500">

                                {/* Dashboard Header */}
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                                            <Dumbbell className="h-5 w-5 text-orange-500" />
                                        </div>
                                        <div>
                                            <div className="font-semibold text-gray-900">Sarah's Workout</div>
                                            <div className="text-sm text-gray-500">with Coach Mike</div>
                                        </div>
                                    </div>
                                    <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                                        Live
                                    </div>
                                </div>

                                {/* Progress Chart Mockup */}
                                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-sm font-medium text-gray-700">Weekly Progress</span>
                                        <TrendingUp className="h-4 w-4 text-green-500" />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center">
                                            <div className="w-20 text-xs text-gray-600">Mon</div>
                                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                                                <div className="bg-orange-500 h-2 rounded-full w-4/5"></div>
                                            </div>
                                        </div>
                                        <div className="flex items-center">
                                            <div className="w-20 text-xs text-gray-600">Tue</div>
                                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                                                <div className="bg-orange-500 h-2 rounded-full w-full"></div>
                                            </div>
                                        </div>
                                        <div className="flex items-center">
                                            <div className="w-20 text-xs text-gray-600">Wed</div>
                                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                                                <div className="bg-orange-500 h-2 rounded-full w-3/5"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Trainer Cards */}
                                <div className="space-y-3">
                                    <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
                                        <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                                            M
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-sm font-medium text-gray-900">Coach Mike</div>
                                            <div className="text-xs text-gray-500">Strength Training</div>
                                        </div>
                                        <div className="flex text-yellow-400">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className="h-3 w-3 fill-current" />
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                        <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                                            A
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-sm font-medium text-gray-900">Coach Anna</div>
                                            <div className="text-xs text-gray-500">Yoga & Flexibility</div>
                                        </div>
                                        <div className="flex text-yellow-400">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className="h-3 w-3 fill-current" />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Floating Elements */}
                            <div className="absolute -top-4 -left-4 bg-white rounded-lg shadow-lg p-3 animate-bounce">
                                <div className="flex items-center space-x-2">
                                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                                    <span className="text-xs font-medium text-gray-700">Live Session</span>
                                </div>
                            </div>

                            <div className="absolute -bottom-4 -right-4 bg-white rounded-lg shadow-lg p-3">
                                <div className="flex items-center space-x-2">
                                    <Target className="h-4 w-4 text-orange-500" />
                                    <span className="text-xs font-medium text-gray-700">Goal: 85% Complete</span>
                                </div>
                            </div>

                            {/* Play Button Overlay */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <button className="bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full p-4 transition-all duration-200 transform hover:scale-110">
                                    <Play className="h-8 w-8 text-white fill-current" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Wave */}
            <div className="absolute bottom-0 left-0 right-0">
                <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-20 fill-white">
                    <path d="M0,120 C150,80 350,40 600,60 C850,80 1050,100 1200,80 L1200,120 Z"></path>
                </svg>
            </div>
        </div>
    );
}