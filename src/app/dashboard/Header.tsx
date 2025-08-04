'use client';

import { toast } from "sonner";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet"
import { RiSidebarUnfoldLine, RiSidebarFoldLine } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { toggleAdminSidebar } from "@/states/slicer";
import { Sun, Moon, KeyRound, UserPlus, LogIn, LogOut, Settings, User, ChevronDown, CheckCircle, Info, AlertCircle, DollarSignIcon, Bell } from "lucide-react";
import { useEffect, useState } from "react";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    FaHome,
    FaCommentDots,
    FaUser,
    FaCog,
    FaSignOutAlt,
    FaDumbbell,
    FaAppleAlt,
    FaChartLine,
    FaCalendarAlt
} from 'react-icons/fa';
import { useUser } from "@/components/Providers/LoggedInUser/LoggedInUserProvider";
import { useRef } from "react";

const Header = () => {
    const userContext = useUser();
    const user = (userContext as any)?.user;
    const loading = (userContext as any)?.loading;

    const dispatch = useDispatch();
    const router = useRouter();
    const clientSidebar = useSelector((state: any) => state.rtkreducer.sidebarMinimized);
    const [darkMode, setDarkMode] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const profileRef = useRef(null);
    const notificationRef = useRef(null);

    // Theme handling
    useEffect(() => {
        setMounted(true);
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme) {
            setDarkMode(savedTheme === "dark");
        } else {
            setDarkMode(window.matchMedia("(prefers-color-scheme: dark)").matches);
        }
    }, []);

    useEffect(() => {
        if (mounted) {
            if (darkMode) {
                document.documentElement.classList.add("dark");
                localStorage.setItem("theme", "dark");
            } else {
                document.documentElement.classList.remove("dark");
                localStorage.setItem("theme", "light");
            }
        }
    }, [darkMode, mounted]);

    const toggleTheme = () => {
        setDarkMode(!darkMode);
    };

    const logout = () => {
        localStorage.removeItem('token');
        router.push('/login');
    };

    const menuItems = [
        {
            label: 'Dashboard',
            path: '/dashboard',
            icon: <FaHome className="text-lg" />,
            description: 'Overview of your activities',
        },
        {
            label: 'Messages',
            path: '/messages',
            icon: <FaCommentDots className="text-lg" />,
            description: 'Chat with your trainer or client',
        },
        {
            label: 'Profile',
            path: '/profile',
            icon: <FaUser className="text-lg" />,
            description: 'View or update personal info',
        },
        {
            label: 'Workouts',
            path: '/workouts',
            icon: <FaDumbbell className="text-lg" />,
            description: 'Training programs',
        },
        {
            label: 'Nutrition',
            path: '/nutrition',
            icon: <FaAppleAlt className="text-lg" />,
            description: 'Meal plans & tracking',
        },
        {
            label: 'Progress',
            path: '/progress',
            icon: <FaChartLine className="text-lg" />,
            description: 'Metrics & analytics',
        },
        {
            label: 'Calendar',
            path: '/calendar',
            icon: <FaCalendarAlt className="text-lg" />,
            description: 'Schedule & appointments',
        },
        {
            label: 'Settings',
            path: '/settings',
            icon: <FaCog className="text-lg" />,
            description: 'Account preferences',
        },
    ];

    const handleNavigation = (path: string) => {
        router.push(path);
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
        } catch (error: any) {
            console.log("Error: ", error);
            toast.error(error.message);
        }
    };

    function getInitials(name: string | undefined) {
        if (!name) return 'U';
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    }

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: any) => {
            if (profileRef.current && !(profileRef.current as any).contains(event.target)) {
                setShowProfile(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);


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
            icon: DollarSignIcon
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

    return (
        <div className="w-full sticky top-0 flex items-center justify-between p-3 dark:bg-gray-900 bg-white shadow z-50">
            <div>
                <button
                    onClick={() => dispatch(toggleAdminSidebar())}
                    className="p-2 hidden md:flex rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                    {clientSidebar ? (
                        <RiSidebarUnfoldLine className="w-6 h-6 text-orange-600" />
                    ) : (
                        <RiSidebarFoldLine className="w-6 h-6 text-orange-600" />
                    )}
                </button>

                <Sheet>
                    <SheetTrigger asChild>
                        <button
                            onClick={() => dispatch(toggleAdminSidebar())}
                            className="p-2 flex md:hidden rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                            {clientSidebar ? (
                                <RiSidebarUnfoldLine className="w-6 h-6 text-orange-600" />
                            ) : (
                                <RiSidebarFoldLine className="w-6 h-6 text-orange-600" />
                            )}
                        </button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-[280px] p-0">
                        {/* Header */}
                        <header className="p-4 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex items-center h-10 justify-start px-4">
                                <span className="font-bold tracking-wide bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent text-2xl">
                                    TrainLink
                                </span>
                            </div>
                        </header>

                        {/* Navigation */}
                        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
                            {menuItems.map((item, index) => (
                                <Link
                                    href={item.path}
                                    key={index}
                                    className="group flex items-center p-3 gap-3 rounded-lg transition-all duration-200 text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:text-orange-600 dark:hover:text-orange-400"
                                >
                                    <span className="text-orange-500 dark:text-orange-400 group-hover:text-orange-600 dark:group-hover:text-orange-300 transition-colors">
                                        {item.icon}
                                    </span>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-medium text-sm text-gray-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-300 transition-colors">
                                            {item.label}
                                        </div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">
                                            {item.description}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </nav>

                        {/* Footer */}
                        <footer className="p-4 border-t border-gray-200 dark:border-gray-700">
                            <button
                                onClick={logout}
                                className="group flex items-center p-3 gap-3 w-full rounded-lg transition-all duration-200 text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                            >
                                <FaSignOutAlt className="text-lg" />
                                <span className="text-sm font-medium">Logout</span>
                            </button>
                        </footer>
                    </SheetContent>
                </Sheet>
            </div>
            <div className="flex items-center space-x-4">
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

                {/* Theme Toggle */}
                <button
                    onClick={toggleTheme}
                    className="relative p-2 rounded-xl cursor-pointer bg-gray-100/80 dark:bg-gray-800/80 hover:bg-gray-200/80 dark:hover:bg-gray-700/80 transition-all duration-300 group"
                    aria-label="Toggle theme"
                >
                    <div className="relative w-5 h-5">
                        <Sun
                            className={`absolute inset-0 w-5 h-5 text-orange-500 transition-all duration-300 ${darkMode
                                ? "opacity-0 rotate-90 scale-0"
                                : "opacity-100 rotate-0 scale-100"
                                }`}
                        />
                        <Moon
                            className={`absolute inset-0 w-5 h-5 text-orange-500 transition-all duration-300 ${darkMode
                                ? "opacity-100 rotate-0 scale-100"
                                : "opacity-0 -rotate-90 scale-0"
                                }`}
                        />
                    </div>
                </button>

                {/* Profile / Account Dropdown */}
                <div className="relative" ref={profileRef}>
                    {/* Toggle Button */}
                    <button
                        onClick={() => setShowProfile(!showProfile)}
                        className="flex items-center cursor-pointer space-x-2 px-3 py-2 rounded-lg text-gray-700 hover:text-orange-600 hover:bg-orange-50 transition-all duration-200"
                    >
                        <div className="w-8 h-8 bg-orange-500 cursor-pointer rounded-full flex items-center justify-center text-white font-semibold text-sm overflow-hidden">
                            {user?.avatarUrl ? (
                                <img
                                    src={user?.avatarUrl}
                                    alt={user.fullName || 'User avatar'}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                getInitials(user?.fullName)
                            )}
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
                                            <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-semibold text-sm overflow-hidden">
                                                {user?.avatarUrl ? (
                                                    <img
                                                        src={user.avatarUrl}
                                                        alt={user.fullName || 'User avatar'}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    getInitials(user?.fullName)
                                                )}
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
                                                handleNavigation('/dashboard/profile');
                                                setShowProfile(false);
                                            }}
                                            className="w-full flex cursor-pointer items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 hover:text-orange-600 hover:bg-orange-50 transition-colors duration-200"
                                        >
                                            <User className="h-4 w-4" />
                                            <span>View Profile</span>
                                        </button>
                                        <button
                                            onClick={() => {
                                                handleNavigation('/dashboard/settings');
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
            </div>
        </div>
    )
}

export default Header;
