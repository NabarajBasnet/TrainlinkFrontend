'use client';

import React, { useState, useEffect } from 'react';
import { Dumbbell, Menu, X, ChevronDown, User, Bell, Search } from 'lucide-react';

export default function MainNavbar({ isScrolled = false, variant = 'hero' }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [isScrolledState, setIsScrolledState] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolledState(window.scrollY > 20);
        };

        if (variant === 'hero') {
            window.addEventListener('scroll', handleScroll);
            return () => window.removeEventListener('scroll', handleScroll);
        }
    }, [variant]);

    // Close mobile menu when clicking outside or on links
    const handleMobileMenuClose = () => {
        setIsMobileMenuOpen(false);
        setActiveDropdown(null);
    };

    const scrolled = isScrolled || isScrolledState;

    const navItems = [
        {
            name: 'Platform',
            dropdown: ['For Members', 'For Trainers', 'Mobile App', 'API Access']
        },
        {
            name: 'Features',
            dropdown: ['Live Training', 'Progress Tracking', 'Nutrition Plans', 'Community']
        },
        {
            name: 'Trainers',
            href: '#trainers'
        },
        {
            name: 'Pricing',
            href: '#pricing'
        }
    ];

    return (
        <>
            <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled
                ? 'bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm'
                : 'bg-white'
                }`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">

                        {/* Logo */}
                        <div className="flex items-center space-x-2 group cursor-pointer">
                            <div className={`p-1.5 rounded-lg transition-all duration-200 ${scrolled
                                ? 'bg-orange-500 group-hover:bg-orange-600 group-hover:scale-105'
                                : 'bg-orange-500 group-hover:bg-orange-600 group-hover:scale-105'
                                }`}>
                                <Dumbbell className="h-5 w-5 text-white" />
                            </div>
                            <span className={`text-xl font-bold transition-colors ${scrolled
                                ? 'text-gray-900'
                                : 'text-gray-900'
                                }`}>
                                TrainLink
                            </span>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden lg:flex items-center space-x-1">
                            {navItems.map((item, index) => (
                                <div key={index} className="relative group">
                                    {item.dropdown ? (
                                        <button
                                            className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${scrolled
                                                ? 'text-gray-700 hover:text-orange-600 hover:bg-orange-50'
                                                : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50'
                                                }`}
                                            onMouseEnter={() => setActiveDropdown(index)}
                                            onMouseLeave={() => setActiveDropdown(null)}
                                        >
                                            <span>{item.name}</span>
                                            <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${activeDropdown === index ? 'rotate-180' : ''
                                                }`} />
                                        </button>
                                    ) : (
                                        <a
                                            href={item.href}
                                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 ${scrolled
                                                ? 'text-gray-700 hover:text-orange-600 hover:bg-orange-50'
                                                : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50'
                                                }`}
                                        >
                                            {item.name}
                                        </a>
                                    )}

                                    {/* Dropdown Menu */}
                                    {item.dropdown && (
                                        <div
                                            className={`absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 ${activeDropdown === index
                                                ? 'opacity-100 translate-y-0 visible'
                                                : 'opacity-0 translate-y-2 invisible'
                                                }`}
                                            onMouseEnter={() => setActiveDropdown(index)}
                                            onMouseLeave={() => setActiveDropdown(null)}
                                        >
                                            {item.dropdown.map((subItem, subIndex) => (
                                                <a
                                                    key={subIndex}
                                                    href="#"
                                                    className="block px-4 py-3 text-sm text-gray-700 hover:text-orange-600 hover:bg-orange-50 transition-colors duration-200 font-medium"
                                                >
                                                    {subItem}
                                                </a>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Right Side Actions */}
                        <div className="flex items-center space-x-2">

                            {/* Search - Desktop Only */}
                            <button className={`hidden md:flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-200 hover:scale-105 ${scrolled
                                ? 'text-gray-600 hover:text-orange-600 hover:bg-orange-50'
                                : 'text-gray-600 hover:text-orange-600 hover:bg-orange-50'
                                }`}>
                                <Search className="h-4 w-4" />
                            </button>

                            {/* Notifications - Desktop Only */}
                            <button className={`hidden md:flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-200 hover:scale-105 relative ${scrolled
                                ? 'text-gray-600 hover:text-orange-600 hover:bg-orange-50'
                                : 'text-gray-600 hover:text-orange-600 hover:bg-orange-50'
                                }`}>
                                <Bell className="h-4 w-4" />
                                <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-orange-500 rounded-full border-2 border-white animate-pulse"></div>
                            </button>

                            {/* Sign In Button */}
                            <button className={`hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 ${scrolled
                                ? 'text-gray-700 hover:text-orange-600 hover:bg-orange-50'
                                : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50'
                                }`}>
                                <User className="h-4 w-4" />
                                <span>Sign In</span>
                            </button>

                            {/* Get Started CTA */}
                            <button className={`px-4 py-1.5 text-sm rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95 ${scrolled
                                ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-md hover:shadow-lg'
                                : 'bg-orange-500 hover:bg-orange-600 text-white shadow-md hover:shadow-lg'
                                }`}>
                                Get Started
                            </button>

                            {/* Mobile Menu Button */}
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className={`lg:hidden p-1.5 rounded-lg transition-all duration-200 hover:scale-105 ${scrolled
                                    ? 'text-gray-700 hover:bg-orange-50'
                                    : 'text-gray-700 hover:bg-orange-50'
                                    }`}
                            >
                                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                <div className={`lg:hidden transition-all duration-300 overflow-hidden ${isMobileMenuOpen
                    ? 'max-h-screen opacity-100'
                    : 'max-h-0 opacity-0'
                    }`}>
                    <div className="bg-white border-t border-gray-100 px-4 py-4 shadow-lg">
                        <div className="space-y-2">
                            {navItems.map((item, index) => (
                                <div key={index}>
                                    {item.dropdown ? (
                                        <div>
                                            <button
                                                onClick={() => setActiveDropdown(activeDropdown === index ? null : index)}
                                                className="flex items-center justify-between w-full text-left px-3 py-2.5 text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg text-sm font-medium transition-all duration-200"
                                            >
                                                <span>{item.name}</span>
                                                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${activeDropdown === index ? 'rotate-180' : ''
                                                    }`} />
                                            </button>
                                            {activeDropdown === index && (
                                                <div className="pl-4 mt-2 space-y-1 animate-in slide-in-from-top-2 duration-200">
                                                    {item.dropdown.map((subItem, subIndex) => (
                                                        <a
                                                            key={subIndex}
                                                            href="#"
                                                            onClick={handleMobileMenuClose}
                                                            className="block px-3 py-2 text-sm text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors duration-200"
                                                        >
                                                            {subItem}
                                                        </a>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <a
                                            href={item.href}
                                            onClick={handleMobileMenuClose}
                                            className="block px-3 py-2.5 text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg text-sm font-medium transition-all duration-200"
                                        >
                                            {item.name}
                                        </a>
                                    )}
                                </div>
                            ))}

                            <div className="pt-3 mt-3 border-t border-gray-100 space-y-2">
                                <button className="w-full flex items-center space-x-2 px-3 py-2.5 text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg text-sm font-medium transition-all duration-200">
                                    <User className="h-4 w-4" />
                                    <span>Sign In</span>
                                </button>
                                <button className="w-full bg-orange-500 hover:bg-orange-600 text-white px-3 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 transform hover:scale-[1.02] active:scale-95 shadow-md">
                                    Get Started
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Backdrop for mobile menu */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
                    onClick={handleMobileMenuClose}
                />
            )}
        </>
    );
}