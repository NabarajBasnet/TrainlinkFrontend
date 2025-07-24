'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Facebook, Instagram, Youtube, Linkedin } from 'lucide-react';

const ContactPage = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        message: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate form submission
        setTimeout(() => {
            setIsSubmitting(false);
            alert('Thank you for your message! We\'ll get back to you soon.');
            setFormData({ fullName: '', email: '', message: '' });
        }, 2000);
    };

    const contactInfo = [
        {
            icon: Mail,
            label: 'Email',
            value: 'support@trainlink.com',
            href: 'mailto:support@trainlink.com'
        },
        {
            icon: Phone,
            label: 'Phone',
            value: '+977-9812345678',
            href: 'tel:+9779812345678'
        },
        {
            icon: MapPin,
            label: 'Location',
            value: 'Kathmandu, Nepal',
            href: null
        }
    ];

    const socialLinks = [
        {
            icon: Facebook,
            name: 'Facebook',
            href: '#',
            color: 'hover:text-blue-300'
        },
        {
            icon: Instagram,
            name: 'Instagram',
            href: '#',
            color: 'hover:text-pink-300'
        },
        {
            icon: Youtube,
            name: 'YouTube',
            href: '#',
            color: 'hover:text-red-300'
        },
        {
            icon: Linkedin,
            name: 'LinkedIn',
            href: '#',
            color: 'hover:text-blue-400'
        }
    ];

    return (
        <div className="min-h-screen bg-orange-500 text-white">
            {/* Header Section */}
            <div className="container mx-auto px-4 py-16 text-center">
                <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-b from-white to-white/80 bg-clip-text text-transparent">
                    Let's Connect
                </h1>
                <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
                    Have a question or feedback? We'd love to hear from you.
                </p>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 pb-16">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">

                        {/* Contact Form */}
                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-xl">
                            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white">
                                Send us a Message
                            </h2>

                            <div className="space-y-6">
                                {/* Full Name */}
                                <div>
                                    <label htmlFor="fullName" className="block text-sm font-medium text-white/90 mb-2">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        id="fullName"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-300"
                                        placeholder="Enter your full name"
                                    />
                                </div>

                                {/* Email */}
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-white/90 mb-2">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-300"
                                        placeholder="Enter your email address"
                                    />
                                </div>

                                {/* Message */}
                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-white/90 mb-2">
                                        Message
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleInputChange}
                                        required
                                        rows="5"
                                        className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-300 resize-none"
                                        placeholder="Tell us how we can help you..."
                                    />
                                </div>

                                {/* Submit Button */}
                                <button
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                                    className="group w-full flex items-center justify-center gap-2 bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-orange-500 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                            Send Message
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div className="space-y-8">
                            {/* Contact Details */}
                            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-xl">
                                <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white">
                                    Get in Touch
                                </h2>

                                <div className="space-y-6">
                                    {contactInfo.map((item, index) => {
                                        const IconComponent = item.icon;
                                        const content = (
                                            <div className="flex items-center gap-4 p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300">
                                                <div className="flex-shrink-0 w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                                                    <IconComponent className="w-6 h-6 text-white" />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-white/80 font-medium">{item.label}</p>
                                                    <p className="text-white font-semibold">{item.value}</p>
                                                </div>
                                            </div>
                                        );

                                        return item.href ? (
                                            <a key={index} href={item.href} className="block">
                                                {content}
                                            </a>
                                        ) : (
                                            <div key={index}>
                                                {content}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Social Media */}
                            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-xl">
                                <h3 className="text-xl font-bold mb-6 text-white">
                                    Follow Us
                                </h3>

                                <div className="flex items-center gap-4">
                                    {socialLinks.map((social, index) => {
                                        const IconComponent = social.icon;
                                        return (
                                            <a
                                                key={index}
                                                href={social.href}
                                                className={`w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30 ${social.color} transition-all duration-300 transform hover:scale-110`}
                                                aria-label={social.name}
                                            >
                                                <IconComponent className="w-6 h-6" />
                                            </a>
                                        );
                                    })}
                                </div>

                                <p className="text-white/80 text-sm mt-4">
                                    Stay connected with the TrainLink community for updates, tips, and success stories.
                                </p>
                            </div>

                            {/* Quick Response Promise */}
                            <div className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Mail className="w-8 h-8 text-white" />
                                    </div>
                                    <h4 className="text-lg font-semibold text-white mb-2">
                                        Quick Response
                                    </h4>
                                    <p className="text-white/80 text-sm">
                                        We typically respond to all inquiries within 24 hours during business days.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Note */}
            <div className="bg-white/5 backdrop-blur-sm border-t border-white/20">
                <div className="container mx-auto px-4 py-8 text-center">
                    <p className="text-white/80">
                        Part of the TrainLink family? We're here to support your fitness journey every step of the way.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;