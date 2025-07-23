'use client';

import { useState } from 'react';
import { Users, Calendar, MessageCircle, TrendingUp } from 'lucide-react';

const Features = () => {
    const [hoveredCard, setHoveredCard] = useState(null);

    const features = [
        {
            id: 1,
            icon: Users,
            title: "Find Personal Trainers",
            description: "Discover certified trainers in your area with detailed profiles, specializations, and verified reviews from real clients."
        },
        {
            id: 2,
            icon: Calendar,
            title: "Book Sessions",
            description: "Schedule training sessions with ease using our smart booking system. Choose your preferred time slots and locations."
        },
        {
            id: 3,
            icon: MessageCircle,
            title: "Real-time Chat",
            description: "Stay connected with your trainer through instant messaging. Get quick answers and motivation whenever you need it."
        },
        {
            id: 4,
            icon: TrendingUp,
            title: "Track Progress",
            description: "Monitor your fitness journey with detailed analytics, workout logs, and progress photos to see your transformation."
        }
    ];

    return (
        <div className="w-full relative min-h-screen bg-orange-500 overflow-hidden">

            {/* Background Shapes */}
            <div className="w-full absolute inset-0 pointer-events-none">
                <div className="absolute top-20 left-10 w-32 h-32 bg-white bg-opacity-10 rounded-full animate-pulse"></div>
                <div className="absolute top-40 right-16 w-20 h-20 bg-white bg-opacity-10 rotate-45 animate-bounce"></div>
                <div className="absolute bottom-32 left-8 w-24 h-24 bg-white bg-opacity-10 rounded-lg animate-pulse"></div>
                <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white bg-opacity-10 rounded-full"></div>
                <div className="absolute top-1/3 right-1/3 w-12 h-12 bg-white bg-opacity-10 rotate-45"></div>
            </div>

            {/* Main Content */}
            <div className="w-full relative z-10 container mx-auto px-6 py-16">
                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-white to-orange-100 bg-clip-text text-transparent">
                        Features & Benefits
                    </h2>
                    <p className="text-xl text-white text-opacity-90 max-w-2xl mx-auto leading-relaxed">
                        Discover powerful tools designed to transform your fitness journey and connect you with the perfect training experience.
                    </p>
                </div>

                {/* Features Grid */}
                <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full mx-auto">
                    {features.map((feature) => {
                        const IconComponent = feature.icon;
                        return (
                            <div
                                key={feature.id}
                                className={`bg-white rounded-2xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer group ${hoveredCard === feature.id ? 'scale-105' : ''
                                    }`}
                                onMouseEnter={() => setHoveredCard(feature.id)}
                                onMouseLeave={() => setHoveredCard(null)}
                            >
                                {/* Icon */}
                                <div className="mb-6 relative">
                                    <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                                        <IconComponent className="w-8 h-8 text-white" />
                                    </div>
                                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-orange-200 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </div>

                                {/* Title */}
                                <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent group-hover:from-orange-600 group-hover:to-orange-500 transition-all duration-300">
                                    {feature.title}
                                </h3>

                                {/* Description */}
                                <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                                    {feature.description}
                                </p>

                                {/* Hover Effect Line */}
                                <div className="mt-6 h-1 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                            </div>
                        );
                    })}
                </div>

                {/* Bottom CTA Section */}
                <div className="text-center mt-16">
                    <div className="inline-flex items-center space-x-4 bg-white bg-opacity-20 backdrop-blur-lg rounded-full px-4 py-2 border border-white border-opacity-30">
                        <span className="text-orange-500 font-medium">Ready to get started?</span>
                        <button className="bg-orange-500 text-white px-6 py-2 rounded-full font-semibold hover:bg-orange-500 cursor-pointer transition-all duration-500 shadow-lg hover:shadow-xl transform hover:scale-105">
                            Join Now
                        </button>
                    </div>
                </div>
            </div>

            {/* Additional floating elements */}
            <div className="absolute top-1/4 left-1/2 w-2 h-2 bg-white bg-opacity-30 rounded-full animate-ping"></div>
            <div className="absolute bottom-1/4 right-1/4 w-3 h-3 bg-white bg-opacity-20 rounded-full animate-pulse"></div>
        </div>
    );
};

export default Features;
