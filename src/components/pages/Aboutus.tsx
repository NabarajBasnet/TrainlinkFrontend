'use client';

import React from 'react';
import {
    Heart,
    Eye,
    Users,
    Zap,
    Shield,
    TrendingUp,
    Dumbbell,
    ArrowRight,
    Target,
    Globe
} from 'lucide-react';

const AboutPage = () => {
    const coreValues = [
        {
            icon: Users,
            title: "Accessibility",
            description: "Making fitness guidance available to everyone, regardless of location or budget constraints."
        },
        {
            icon: Shield,
            title: "Transparency",
            description: "Clear pricing, verified credentials, and honest reviews create trust between trainers and clients."
        },
        {
            icon: Zap,
            title: "Empowerment",
            description: "Empowering trainers to build sustainable businesses while helping clients achieve their goals."
        },
        {
            icon: TrendingUp,
            title: "Growth",
            description: "Fostering continuous improvement for both fitness professionals and those on their wellness journey."
        }
    ];

    const teamMembers = [
        {
            name: "Sarah Chen",
            role: "Co-Founder & CEO",
            photo: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face",
            bio: "Former fitness trainer turned tech entrepreneur"
        },
        {
            name: "Michael Rodriguez",
            role: "Co-Founder & CTO",
            photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
            bio: "Software engineer passionate about health tech"
        },
        {
            name: "Alex Thompson",
            role: "Head of Community",
            photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
            bio: "Connecting trainers and clients worldwide"
        }
    ];

    return (
        <div className="w-full min-h-screen bg-orange-500 text-white px-6 md:px-20">
            {/* Header Section */}
            <div className="w-full mx-auto px-4 py-16 text-center">
                <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-b from-white to-white/70 bg-clip-text text-transparent">
                    Our Story
                </h1>
                <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
                    Why we built TrainLink — for fitness professionals and those seeking transformation.
                </p>
            </div>

            {/* Mission Section */}
            <div className="w-full mx-auto px-4 py-16">
                <div className="w-full mx-auto text-center">
                    <div className="flex justify-center mb-6">
                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                            <Target className="w-8 h-8 text-white" />
                        </div>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold mb-8 text-white">
                        Our Mission
                    </h2>
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-white/20 shadow-xl">
                        <p className="text-lg md:text-xl leading-relaxed text-white/95">
                            We believe everyone deserves access to quality fitness guidance, and every trainer deserves the opportunity to build a thriving business. TrainLink bridges this gap by creating a trusted marketplace where fitness professionals can connect with clients who truly need their expertise. Our platform eliminates geographical barriers, reduces costs, and ensures that whether you're seeking transformation or offering it, you'll find your perfect match.
                        </p>
                    </div>
                </div>
            </div>

            {/* Vision Section */}
            <div className="bg-white/5 backdrop-blur-sm border-y border-white/10">
                <div className="mx-auto px-4 py-16">
                    <div className="max-w-8xl mx-auto text-center">
                        <div className="flex justify-center mb-6">
                            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                                <Globe className="w-8 h-8 text-white" />
                            </div>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-white">
                            Our Vision
                        </h2>
                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-white/20 shadow-xl">
                            <p className="text-lg md:text-xl leading-relaxed text-white/95">
                                To create the world's most trusted fitness marketplace — a global community where expertise meets aspiration, where every fitness journey is supported by the right professional, and where trainers can build sustainable careers doing what they love. We envision a future where quality fitness guidance is as accessible as ordering food or booking a ride.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Core Values Section */}
            <div className="mx-auto px-4 py-16">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
                        Our Core Values
                    </h2>
                    <p className="text-lg text-white/90 max-w-2xl mx-auto">
                        The principles that guide every decision we make and every feature we build.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                    {coreValues.map((value, index) => {
                        const IconComponent = value.icon;
                        return (
                            <div
                                key={index}
                                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl hover:shadow-2xl hover:bg-white/15 transition-all duration-300 transform hover:-translate-y-2 text-center"
                            >
                                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <IconComponent className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-white">
                                    {value.title}
                                </h3>
                                <p className="text-white/90 text-sm leading-relaxed">
                                    {value.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Team Section */}
            <div className="bg-white/5 backdrop-blur-sm border-y border-white/10">
                <div className="mx-auto px-4 py-16">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
                            Meet the Team
                        </h2>
                        <p className="text-lg text-white/90 max-w-2xl mx-auto">
                            The passionate individuals working to revolutionize how fitness guidance is delivered and accessed.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-8xl mx-auto">
                        {teamMembers.map((member, index) => (
                            <div
                                key={index}
                                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl hover:shadow-2xl hover:bg-white/15 transition-all duration-300 transform hover:-translate-y-2 text-center"
                            >
                                <img
                                    src={member.photo}
                                    alt={member.name}
                                    className="w-24 h-24 rounded-full object-cover mx-auto mb-4 border-3 border-white/30"
                                />
                                <h3 className="text-xl font-bold mb-2 text-white">
                                    {member.name}
                                </h3>
                                <p className="text-white/80 font-medium mb-3">
                                    {member.role}
                                </p>
                                <p className="text-white/90 text-sm">
                                    {member.bio}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="mx-auto px-4 py-16">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-white/20 shadow-xl">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                        <div>
                            <div className="text-3xl md:text-4xl font-bold mb-2 text-white">
                                10K+
                            </div>
                            <p className="text-white/90">Active Trainers</p>
                        </div>
                        <div>
                            <div className="text-3xl md:text-4xl font-bold mb-2 text-white">
                                50K+
                            </div>
                            <p className="text-white/90">Happy Clients</p>
                        </div>
                        <div>
                            <div className="text-3xl md:text-4xl font-bold mb-2 text-white">
                                1M+
                            </div>
                            <p className="text-white/90">Training Sessions</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Call to Action Section */}
            <div className="bg-white/5 backdrop-blur-sm border-t border-white/20">
                <div className="mx-auto px-4 py-16 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
                        Join our movement to transform fitness accessibility
                    </h2>
                    <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
                        Whether you're a fitness professional ready to expand your reach or someone seeking personalized guidance, TrainLink is here to make it happen.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <button className="group flex items-center gap-2 bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-orange-500 transition-all duration-300 transform hover:scale-105">
                            <Dumbbell className="w-5 h-5" />
                            Become a Trainer
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button className="group flex items-center gap-2 bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-orange-500 transition-all duration-300 transform hover:scale-105">
                            <Users className="w-5 h-5" />
                            Start Training
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;