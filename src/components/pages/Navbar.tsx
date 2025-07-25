'use client'

import { GrYoga } from "react-icons/gr";
import React, { useState, useEffect, useRef } from 'react';
import {
    LogIn, UserPlus, KeyRound,
    Dumbbell,
    Menu,
    X,
    ChevronDown,
    Search,
    Bell,
    HelpCircle,
    User,
    Settings,
    LogOut,
    MessageSquare,
    Heart,
    Bookmark,
    Clock,
    DollarSign,
    Users,
    BookOpen,
    Shield,
    Award,
    Briefcase,
    TrendingUp,
    Globe,
    Smartphone,
    Code,
    Database,
    Camera,
    PenTool,
    Target,
    CheckCircle,
    AlertCircle,
    Info,
    HeartPulse, Bike, ChefHat, BrainCircuit, LucideIcon
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useUser } from "../Providers/LoggedInUser/LoggedInUserProvider";
import { toast } from "sonner";

export default function MainNavbar({ isScrolled = false, variant = 'hero' }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [isScrolledState, setIsScrolledState] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showHelp, setShowHelp] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const router = useRouter();
    const { user, loading } = useUser();

    const searchRef = useRef(null);
    const notificationRef = useRef(null);
    const helpRef = useRef(null);
    const profileRef = useRef(null);

    function getInitials(name: string | undefined) {
        if (!name) return 'U';
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    }


    useEffect(() => {
        const handleScroll = () => {
            setIsScrolledState(window.scrollY > 20);
        };

        if (variant === 'hero') {
            window.addEventListener('scroll', handleScroll);
            return () => window.removeEventListener('scroll', handleScroll);
        }
    }, [variant]);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setIsSearchFocused(false);
            }
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
            if (helpRef.current && !helpRef.current.contains(event.target)) {
                setShowHelp(false);
            }
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setShowProfile(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleMobileMenuClose = () => {
        setIsMobileMenuOpen(false);
        setActiveDropdown(null);
    };

    const handleNavigation = (path) => {
        router.push(path);
        handleMobileMenuClose();
    };

    const logOutUser = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/auth/logout`, {
                method: "POST",
                credentials: 'include'
            });
            const resBody = await response.json();
            if (response.ok) {
                toast.success(resBody.message)
                window.location.href = resBody.redirect
            }
        } catch (error) {
            console.log("Error: ", error);
            toast.error(error.message);
        }
    }

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery('');
            setIsSearchFocused(false);
        }
    };

    const scrolled = isScrolled || isScrolledState;

    // Navigation structure similar to Upwork
    const navItems = [
        {
            name: 'Traing Programs',
            dropdown: [
                { name: 'Find Programs', path: '/find-programs', icon: Search },
                { name: 'Saved Programs', path: '/saved-programs', icon: Bookmark },
                { name: 'Proposals', path: '/proposals', icon: MessageSquare },
                { name: 'Profile', path: '/profile', icon: User },
                { name: 'My Stats', path: '/stats', icon: TrendingUp },
                { name: 'Earnings', path: '/earnings', icon: DollarSign }
            ]
        },
        {
            name: 'My Programs',
            dropdown: [
                { name: 'My Programs', path: '/my-programs', icon: Briefcase },
                { name: 'All Contracts', path: '/contracts', icon: Users },
                { name: 'Work Diary', path: '/work-diary', icon: Clock },
                { name: 'Reports', path: '/reports', icon: TrendingUp }
            ]
        },
        {
            name: 'Browse',
            dropdown: [
                { name: 'Browse Categories', path: '/browse', icon: Dumbbell },
                { name: 'Personal Training', path: '/browse/personal-training', icon: HeartPulse },
                { name: 'Weight Loss Programs', path: '/browse/weight-loss', icon: Bike },
                { name: 'Nutrition & Diet Plans', path: '/browse/nutrition', icon: ChefHat },
                { name: 'Mental Wellness & Mindset', path: '/browse/mental-wellness', icon: BrainCircuit },
                { name: 'Yoga & Flexibility', path: '/browse/yoga', icon: GrYoga },
                { name: 'Group Fitness & Bootcamps', path: '/browse/group-training', icon: Users },
            ]
        }
    ];

    // Sample notifications
    const notifications = [
        {
            id: 1,
            type: 'success',
            title: 'Proposal Accepted',
            message: 'Your proposal for "React Developer" has been accepted!',
            time: '2 minutes ago',
            unread: true,
            icon: CheckCircle
        },
        {
            id: 2,
            type: 'info',
            title: 'New Job Match',
            message: 'We found 3 new jobs matching your skills',
            time: '1 hour ago',
            unread: true,
            icon: Info
        },
        {
            id: 3,
            type: 'warning',
            title: 'Contract Ending Soon',
            message: 'Your contract with TechCorp ends in 3 days',
            time: '2 hours ago',
            unread: false,
            icon: AlertCircle
        },
        {
            id: 4,
            type: 'success',
            title: 'Payment Received',
            message: 'You received $850 for completed work',
            time: '1 day ago',
            unread: false,
            icon: DollarSign
        },
        {
            id: 5,
            type: 'info',
            title: 'Profile View',
            message: 'Your profile was viewed 15 times this week',
            time: '2 days ago',
            unread: false,
            icon: User
        }
    ];

    // Help dropdown items
    const helpItems = [
        { name: 'Help Center', path: '/help', icon: HelpCircle },
        { name: 'Community', path: '/community', icon: Users },
        { name: 'Getting Started', path: '/getting-started', icon: BookOpen },
        { name: 'Trust & Safety', path: '/trust-safety', icon: Shield },
        { name: 'Success Stories', path: '/success-stories', icon: Award },
        { name: 'Contact Support', path: '/contact-support', icon: MessageSquare }
    ];

    // Popular search suggestions
    const searchSuggestions = [
        'Personal Training',
        'Weight Loss Programs',
        'Nutrition & Diet Plans',
        'Mental Wellness & Mindset',
        'Yoga & Flexibility',
        'Group Fitness & Bootcamps',
    ];

    return (
        <>
            <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled
                ? 'bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm'
                : 'bg-white border-b border-gray-100'
                }`}>
                <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">

                        {/* Logo */}
                        <div className="flex items-center space-x-8">
                            <div
                                className="flex items-center space-x-2 group cursor-pointer"
                                onClick={() => handleNavigation('/')}
                            >
                                <div className="p-1.5 rounded-lg bg-orange-500 group-hover:bg-orange-600 transition-all duration-200 group-hover:scale-105">
                                    <Dumbbell className="h-5 w-5 text-white" />
                                </div>
                                <span className="text-xl font-bold text-gray-900">
                                    TrainLink
                                </span>
                            </div>

                            {/* Desktop Navigation */}
                            <div className="hidden lg:flex items-center space-x-1">
                                {navItems.map((item, index) => (
                                    <div key={index} className="relative group">
                                        <button
                                            className="flex items-center cursor-pointer space-x-1 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-orange-600 hover:bg-orange-50 transition-all duration-200"
                                            onMouseEnter={() => setActiveDropdown(index)}
                                            onMouseLeave={() => setActiveDropdown(null)}
                                        >
                                            <span>{item.name}</span>
                                            <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${activeDropdown === index ? 'rotate-180' : ''
                                                }`} />
                                        </button>

                                        {/* Dropdown Menu */}
                                        <div
                                            className={`absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden transition-all duration-300 ${activeDropdown === index
                                                ? 'opacity-100 translate-y-0 visible'
                                                : 'opacity-0 translate-y-2 invisible'
                                                }`}
                                            onMouseEnter={() => setActiveDropdown(index)}
                                            onMouseLeave={() => setActiveDropdown(null)}
                                        >
                                            {item.dropdown.map((subItem, subIndex) => (
                                                <button
                                                    key={subIndex}
                                                    onClick={() => handleNavigation(subItem.path)}
                                                    className="w-full flex cursor-pointer items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:text-orange-600 hover:bg-orange-50 transition-colors duration-200"
                                                >
                                                    <subItem.icon className="h-4 w-4" />
                                                    <span>{subItem.name}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Search Bar */}
                        <div className="hidden md:flex flex-1 max-w-lg mx-8" ref={searchRef}>
                            <form onSubmit={handleSearch} className="relative w-full">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        onFocus={() => setIsSearchFocused(true)}
                                        placeholder="Search for jobs, skills, or freelancers"
                                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-sm transition-all duration-200"
                                    />
                                    {searchQuery && (
                                        <button
                                            type="button"
                                            onClick={() => setSearchQuery('')}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>

                                {/* Search Suggestions */}
                                {isSearchFocused && (
                                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden z-50">
                                        <div className="p-3 border-b border-gray-100">
                                            <h3 className="text-sm font-medium text-gray-900">Popular Searches</h3>
                                        </div>
                                        <div className="max-h-64 overflow-y-auto">
                                            {searchSuggestions.map((suggestion, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => {
                                                        setSearchQuery(suggestion);
                                                        setIsSearchFocused(false);
                                                        handleNavigation(`/search?q=${encodeURIComponent(suggestion)}`);
                                                    }}
                                                    className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors duration-200"
                                                >
                                                    {suggestion}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </form>
                        </div>

                        {/* Right Side Actions */}
                        <div className="flex items-center space-x-2">

                            {/* Help */}
                            <div className="relative" ref={helpRef}>
                                <button
                                    onClick={() => setShowHelp(!showHelp)}
                                    className="hidden cursor-pointer md:flex items-center justify-center w-9 h-9 rounded-lg text-gray-600 hover:text-orange-600 hover:bg-orange-50 transition-all duration-200"
                                >
                                    <HelpCircle className="h-4 w-4" />
                                </button>

                                {/* Help Dropdown */}
                                {showHelp && (
                                    <div className="absolute cursor-pointer top-full right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
                                        <div className="p-3 border-b border-gray-100">
                                            <h3 className="text-sm font-medium text-gray-900">Help & Support</h3>
                                        </div>
                                        {helpItems.map((item, index) => (
                                            <button
                                                key={index}
                                                onClick={() => {
                                                    handleNavigation(item.path);
                                                    setShowHelp(false);
                                                }}
                                                className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:text-orange-600 hover:bg-orange-50 transition-colors duration-200"
                                            >
                                                <item.icon className="h-4 w-4" />
                                                <span>{item.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Notifications */}
                            <div className="relative" ref={notificationRef}>
                                <button
                                    onClick={() => setShowNotifications(!showNotifications)}
                                    className="hidden md:flex items-center justify-center cursor-pointer w-9 h-9 rounded-lg text-gray-600 hover:text-orange-600 hover:bg-orange-50 transition-all duration-200 relative"
                                >
                                    <Bell className="h-4 w-4" />
                                    {notifications.filter(n => n.unread).length > 0 && (
                                        <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-orange-500 rounded-full border-2 border-white animate-pulse"></div>
                                    )}
                                </button>

                                {/* Notifications Dropdown */}
                                {showNotifications && (
                                    <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
                                        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                                            <h3 className="text-sm font-medium text-gray-900">Notifications</h3>
                                            <span className="text-xs text-gray-500">
                                                {notifications.filter(n => n.unread).length} unread
                                            </span>
                                        </div>
                                        <div className="max-h-96 overflow-y-auto">
                                            {notifications.map((notification) => (
                                                <div
                                                    key={notification.id}
                                                    className={`p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors duration-200 cursor-pointer ${notification.unread ? 'bg-orange-50/50' : ''
                                                        }`}
                                                >
                                                    <div className="flex items-start space-x-3">
                                                        <div className={`p-1.5 rounded-lg ${notification.type === 'success' ? 'bg-green-100 text-green-600' :
                                                            notification.type === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                                                                'bg-blue-100 text-blue-600'
                                                            }`}>
                                                            <notification.icon className="h-4 w-4" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center justify-between">
                                                                <p className="text-sm font-medium text-gray-900 truncate">
                                                                    {notification.title}
                                                                </p>
                                                                {notification.unread && (
                                                                    <div className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0 ml-2"></div>
                                                                )}
                                                            </div>
                                                            <p className="text-sm text-gray-600 mt-1">
                                                                {notification.message}
                                                            </p>
                                                            <p className="text-xs text-gray-400 mt-1">
                                                                {notification.time}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="p-3 border-t border-gray-100">
                                            <button
                                                onClick={() => {
                                                    handleNavigation('/notifications');
                                                    setShowNotifications(false);
                                                }}
                                                className="w-full text-center text-sm text-orange-600 hover:text-orange-700 font-medium"
                                            >
                                                View All Notifications
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Profile / Account Dropdown */}
                            <div className="relative" ref={profileRef}>
                                {/* Toggle Button */}
                                <button
                                    onClick={() => setShowProfile(!showProfile)}
                                    className="flex items-center cursor-pointer space-x-2 px-3 py-2 rounded-lg text-gray-700 hover:text-orange-600 hover:bg-orange-50 transition-all duration-200"
                                >
                                    <div className="w-8 h-8 bg-orange-500 cursor-pointer rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                        {user ? getInitials(user.fullName) : <User className="h-4 w-4" />}
                                    </div>
                                    <ChevronDown
                                        className={`h-4 w-4 transition-transform duration-200 ${showProfile ? 'rotate-180' : ''}`}
                                    />
                                </button>

                                {/* Dropdown */}
                                {showProfile && (
                                    <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
                                        {user ? (
                                            <>
                                                {/* Authenticated User Dropdown */}
                                                <div className="p-4 border-b border-gray-100">
                                                    <div className="flex items-center space-x-3 cursor-pointer">
                                                        <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                                            {getInitials(user?.fullName)}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-900">
                                                                {user?.fullName || 'Unknown'}
                                                            </p>
                                                            <p className="text-xs text-gray-500">{user?.email || 'youremail@gmail.com'}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="py-2">
                                                    <button
                                                        onClick={() => {
                                                            handleNavigation('/profile');
                                                            setShowProfile(false);
                                                        }}
                                                        className="w-full flex cursor-pointer items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 hover:text-orange-600 hover:bg-orange-50 transition-colors duration-200"
                                                    >
                                                        <User className="h-4 w-4" />
                                                        <span>View Profile</span>
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            handleNavigation('/settings');
                                                            setShowProfile(false);
                                                        }}
                                                        className="w-full flex cursor-pointer items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 hover:text-orange-600 hover:bg-orange-50 transition-colors duration-200"
                                                    >
                                                        <Settings className="h-4 w-4" />
                                                        <span>Settings</span>
                                                    </button>
                                                    <div className="border-t border-gray-100 mt-2 pt-2">
                                                        <button
                                                            onClick={() => {
                                                                logOutUser();
                                                                setShowProfile(false);
                                                            }}
                                                            className="w-full flex cursor-pointer items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 hover:text-red-600 hover:bg-red-50 transition-colors duration-200"
                                                        >
                                                            <LogOut className="h-4 w-4" />
                                                            <span>Log Out</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                {/* Guest User Dropdown */}
                                                <div className="py-2">
                                                    <button
                                                        onClick={() => {
                                                            handleNavigation('/auth');
                                                            setShowProfile(false);
                                                        }}
                                                        className="w-full flex items-center cursor-pointer space-x-3 px-4 py-2.5 text-sm text-gray-700 hover:text-orange-600 hover:bg-orange-50"
                                                    >
                                                        <LogIn className="h-4 w-4" />
                                                        <span>Sign In</span>
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            handleNavigation('/auth');
                                                            setShowProfile(false);
                                                        }}
                                                        className="w-full flex items-center cursor-pointer space-x-3 px-4 py-2.5 text-sm text-gray-700 hover:text-orange-600 hover:bg-orange-50"
                                                    >
                                                        <UserPlus className="h-4 w-4" />
                                                        <span>Sign Up</span>
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            handleNavigation('/auth/forgot-password');
                                                            setShowProfile(false);
                                                        }}
                                                        className="w-full flex items-center cursor-pointer space-x-3 px-4 py-2.5 text-sm text-gray-700 hover:text-orange-600 hover:bg-orange-50"
                                                    >
                                                        <KeyRound className="h-4 w-4" />
                                                        <span>Forgot Password</span>
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Mobile Menu Button */}
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="lg:hidden p-1.5 rounded-lg text-gray-700 hover:bg-orange-50 transition-all duration-200"
                            >
                                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                <div className={`lg:hidden transition-all duration-300 overflow-hidden ${isMobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
                    }`}>
                    <div className="bg-white border-t border-gray-100 px-4 py-4 shadow-lg">

                        {/* Mobile Search */}
                        <div className="mb-4">
                            <form onSubmit={handleSearch} className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search for jobs, skills..."
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-sm"
                                />
                            </form>
                        </div>

                        <div className="space-y-2">
                            {navItems.map((item, index) => (
                                <div key={index}>
                                    <button
                                        onClick={() => setActiveDropdown(activeDropdown === index ? null : index)}
                                        className="flex items-center justify-between w-full text-left px-3 py-2.5 text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg text-sm font-medium transition-all duration-200"
                                    >
                                        <span>{item.name}</span>
                                        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${activeDropdown === index ? 'rotate-180' : ''
                                            }`} />
                                    </button>
                                    {activeDropdown === index && (
                                        <div className="pl-4 mt-2 space-y-1">
                                            {item.dropdown.map((subItem, subIndex) => (
                                                <button
                                                    key={subIndex}
                                                    onClick={() => handleNavigation(subItem.path)}
                                                    className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors duration-200"
                                                >
                                                    <subItem.icon className="h-4 w-4" />
                                                    <span>{subItem.name}</span>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}

                            <div className="pt-4 mt-4 border-t border-gray-100 space-y-3">
                                <button
                                    onClick={() => handleNavigation('/help')}
                                    className="w-full flex items-center space-x-3 px-3 py-2.5 text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg text-sm font-medium transition-all duration-200"
                                >
                                    <HelpCircle className="h-4 w-4" />
                                    <span>Help & Support</span>
                                </button>
                                <button
                                    onClick={() => handleNavigation('/notifications')}
                                    className="w-full flex items-center space-x-3 px-3 py-2.5 text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg text-sm font-medium transition-all duration-200"
                                >
                                    <Bell className="h-4 w-4" />
                                    <span>Notifications</span>
                                    {notifications.filter(n => n.unread).length > 0 && (
                                        <span className="ml-auto bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full">
                                            {notifications.filter(n => n.unread).length}
                                        </span>
                                    )}
                                </button>
                                <button
                                    onClick={() => handleNavigation('/profile')}
                                    className="w-full flex items-center space-x-3 px-3 py-2.5 text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg text-sm font-medium transition-all duration-200"
                                >
                                    <User className="h-4 w-4" />
                                    <span>Profile</span>
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