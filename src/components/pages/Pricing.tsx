'use client';

import React, { useState } from 'react';
import {
    Check,
    Star,
    Crown,
    Percent,
    ChevronDown,
    ChevronUp,
    Dumbbell,
    ArrowRight,
    Users,
    BarChart3,
    Shield,
    Headphones
} from 'lucide-react';

const PricingPage = () => {
    const [expandedFaq, setExpandedFaq] = useState(null);

    const toggleFaq = (index) => {
        setExpandedFaq(expandedFaq === index ? null : index);
    };

    const pricingPlans = [
        {
            name: "Free Trainer Plan",
            price: "$0",
            period: "/month",
            description: "Perfect for getting started",
            features: [
                "List up to 2 services",
                "Basic dashboard access",
                "Community support",
                "Standard profile visibility"
            ],
            buttonText: "Get Started",
            buttonStyle: "bg-white text-orange-500 hover:bg-gray-100",
            icon: Users,
            popular: false
        },
        {
            name: "Pro Trainer",
            price: "$9.99",
            period: "/month",
            description: "For growing fitness professionals",
            features: [
                "Unlimited services",
                "Featured in listings",
                "Booking management tools",
                "Basic analytics",
                "Priority customer support",
                "Custom service categories"
            ],
            buttonText: "Upgrade to Pro",
            buttonStyle: "bg-transparent border-2 border-white text-white hover:bg-white hover:text-orange-500",
            icon: BarChart3,
            popular: true
        },
        {
            name: "Elite Trainer",
            price: "$19.99",
            period: "/month",
            description: "Maximum visibility and growth",
            features: [
                "Everything in Pro",
                "Verified trainer badge",
                "Early access to new client requests",
                "Advanced analytics & insights",
                "Personalized account support",
                "Marketing tools & templates"
            ],
            buttonText: "Go Elite",
            buttonStyle: "bg-white text-orange-500 hover:bg-gray-100",
            icon: Crown,
            popular: false
        }
    ];

    const faqs = [
        {
            question: "Can I start for free?",
            answer: "Absolutely! Our Free Trainer Plan lets you create your profile, list up to 2 services, and start connecting with clients right away. No credit card required."
        },
        {
            question: "Can I cancel anytime?",
            answer: "Yes, you can upgrade, downgrade, or cancel your subscription at any time. Changes take effect at the next billing cycle, and there are no cancellation fees."
        },
        {
            question: "When do I get paid?",
            answer: "Payments are processed automatically after each completed session. Funds are transferred to your account within 2-3 business days, minus our 10% commission."
        },
        {
            question: "What's included in the Pro/Elite plans?",
            answer: "Pro includes unlimited services, featured listings, and booking tools. Elite adds verification badges, early client access, and dedicated support. See the full feature comparison above."
        },
        {
            question: "Is there a setup fee?",
            answer: "No setup fees ever! You only pay the monthly subscription fee for your chosen plan, plus our 10% commission on successful bookings."
        }
    ];

    return (
        <div className="min-h-screen bg-orange-500 text-white">
            {/* Header Section */}
            <div className="container mx-auto px-4 py-16 text-center">
                <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                    Choose Your Trainer Plan
                </h1>
                <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
                    Get more visibility, reach more clients, and grow your fitness business with TrainLink.
                </p>
            </div>

            {/* Pricing Cards */}
            <div className="container mx-auto px-4 pb-16">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
                    {pricingPlans.map((plan, index) => {
                        const IconComponent = plan.icon;
                        return (
                            <div
                                key={index}
                                className={`relative bg-white/10 backdrop-blur-sm rounded-2xl p-8 border-2 shadow-xl hover:shadow-2xl hover:bg-white/15 transition-all duration-300 transform hover:-translate-y-2 ${plan.popular
                                    ? 'border-white scale-105 md:scale-110'
                                    : 'border-white/30'
                                    }`}
                            >
                                {plan.popular && (
                                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                        <div className="bg-white text-orange-500 px-4 py-2 rounded-full text-sm font-bold flex items-center gap-1">
                                            <Star className="w-4 h-4 fill-current" />
                                            Most Popular
                                        </div>
                                    </div>
                                )}

                                <div className="text-center mb-6">
                                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <IconComponent className="w-8 h-8 text-white" />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-2 text-white">
                                        {plan.name}
                                    </h3>
                                    <p className="text-white/80 text-sm mb-4">
                                        {plan.description}
                                    </p>
                                    <div className="flex items-baseline justify-center">
                                        <span className="text-4xl md:text-5xl font-bold text-white">
                                            {plan.price}
                                        </span>
                                        <span className="text-white/70 ml-1">
                                            {plan.period}
                                        </span>
                                    </div>
                                </div>

                                <ul className="space-y-3 mb-8">
                                    {plan.features.map((feature, featureIndex) => (
                                        <li key={featureIndex} className="flex items-start gap-3">
                                            <Check className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                                            <span className="text-white/90 text-sm">
                                                {feature}
                                            </span>
                                        </li>
                                    ))}
                                </ul>

                                <button className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 ${plan.buttonStyle}`}>
                                    {plan.buttonText}
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Commission Info Section */}
            <div className="bg-white/5 backdrop-blur-sm border-y border-white/20">
                <div className="container mx-auto px-4 py-16">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="flex justify-center mb-6">
                            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                                <Percent className="w-10 h-10 text-white" />
                            </div>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
                            Simple Commission: 10% per successful booking
                        </h2>
                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-white/20 shadow-xl">
                            <p className="text-lg md:text-xl text-white/95 mb-6">
                                We only succeed when you do. You earn, we support.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                                <div>
                                    <div className="text-2xl font-bold mb-2 text-white">You Keep</div>
                                    <div className="text-3xl font-bold text-white">90%</div>
                                    <p className="text-white/80 text-sm mt-2">Of every booking</p>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold mb-2 text-white">We Take</div>
                                    <div className="text-3xl font-bold text-white">10%</div>
                                    <p className="text-white/80 text-sm mt-2">Platform & support</p>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold mb-2 text-white">You Get</div>
                                    <div className="text-3xl font-bold text-white">Paid</div>
                                    <p className="text-white/80 text-sm mt-2">In 2-3 business days</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* FAQ Section */}
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-white">
                        Frequently Asked Questions
                    </h2>
                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <div
                                key={index}
                                className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl overflow-hidden"
                            >
                                <button
                                    onClick={() => toggleFaq(index)}
                                    className="w-full p-6 text-left cursor-pointer flex items-center justify-between hover:bg-white/5 transition-colors duration-200"
                                >
                                    <h3 className="text-lg font-semibold text-white pr-4">
                                        {faq.question}
                                    </h3>
                                    {expandedFaq === index ? (
                                        <ChevronUp className="w-5 h-5 text-white flex-shrink-0" />
                                    ) : (
                                        <ChevronDown className="w-5 h-5 text-white flex-shrink-0" />
                                    )}
                                </button>
                                {expandedFaq === index && (
                                    <div className="px-6 pb-6">
                                        <p className="text-white/90 leading-relaxed">
                                            {faq.answer}
                                        </p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Call to Action Section */}
            <div className="bg-white/5 backdrop-blur-sm border-t border-white/20">
                <div className="container mx-auto px-4 py-16 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
                        Ready to grow your fitness business?
                    </h2>
                    <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
                        Join thousands of trainers who are already building successful careers on TrainLink. Start free and upgrade as you grow.
                    </p>

                    <button className="group inline-flex items-center gap-2 bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-orange-500 transition-all duration-300 transform hover:scale-105">
                        <Dumbbell className="w-5 h-5" />
                        Create Your Trainer Account
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>

                    <p className="text-white/70 text-sm mt-4">
                        No credit card required • Start earning in minutes
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PricingPage;