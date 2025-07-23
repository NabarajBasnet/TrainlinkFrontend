'use client';

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
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';

const Sidebar = () => {
    const router = useRouter();
    const clientSidebar = useSelector((state: boolean) => state.rtkreducer.sidebarMinimized);
    const [mounted, setMounted] = useState(false);

    // Handle hydration
    useEffect(() => {
        setMounted(true);
    }, []);

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

    if (!mounted) {
        return null; // Prevent hydration mismatch
    }

    return (
        <aside className={`
            ${clientSidebar ? 'w-20' : 'w-64'} 
            transition-all duration-300 ease-in-out 
            h-screen flex flex-col 
            bg-white dark:bg-gray-900 
            border-r border-gray-200 dark:border-gray-700
        `}>
            {/* Header */}
            <header className="px-4 py-2.5 border-b border-gray-200 dark:border-gray-700">
                <div className={`
                    ${clientSidebar ? 'justify-center' : 'justify-start px-4'}
                    flex items-center h-10
                `}>
                    <span className={`
                        font-bold tracking-wide 
                        bg-gradient-to-r from-orange-500 to-orange-600 
                        bg-clip-text text-transparent
                        ${clientSidebar ? 'text-xl' : 'text-2xl'}
                    `}>
                        {clientSidebar ? 'TL' : 'TrainLink'}
                    </span>
                </div>
            </header>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
                {menuItems.map((item, index) => (
                    <Link
                        href={item.path}
                        key={index}
                        className={`
                            group flex items-center 
                            ${clientSidebar ? 'justify-center p-3' : 'p-3 gap-3'} 
                            rounded-lg transition-all duration-200
                            text-gray-700 dark:text-gray-300
                            hover:bg-orange-50 dark:hover:bg-orange-900/20
                            hover:text-orange-600 dark:hover:text-orange-400
                        `}
                        title={clientSidebar ? item.label : ''}
                    >
                        <span className="text-orange-500 dark:text-orange-400 group-hover:text-orange-600 dark:group-hover:text-orange-300 transition-colors">
                            {item.icon}
                        </span>
                        {!clientSidebar && (
                            <div className="flex-1 min-w-0">
                                <div className="font-medium text-sm text-gray-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-300 transition-colors">
                                    {item.label}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">
                                    {item.description}
                                </div>
                            </div>
                        )}
                    </Link>
                ))}
            </nav>

            {/* Footer */}
            <footer className="p-4 border-t border-gray-200 dark:border-gray-700">
                <button
                    onClick={logout}
                    className={`
                        group flex items-center 
                        ${clientSidebar ? 'justify-center p-3' : 'p-3 gap-3 w-full'} 
                        rounded-lg transition-all duration-200
                        text-gray-600 dark:text-gray-300
                        hover:text-red-600 dark:hover:text-red-400
                        hover:bg-red-50 dark:hover:bg-red-900/20
                    `}
                    title={clientSidebar ? 'Logout' : ''}
                >
                    <FaSignOutAlt className="text-lg" />
                    {!clientSidebar && (
                        <span className="text-sm font-medium">Logout</span>
                    )}
                </button>
            </footer>

            {/* Custom scrollbar styles */}
            <style jsx global>{`
                .scrollbar-thin::-webkit-scrollbar {
                    width: 6px;
                }
                .scrollbar-track-transparent::-webkit-scrollbar-track {
                    background: transparent;
                }
                .scrollbar-thumb-gray-300::-webkit-scrollbar-thumb {
                    background: #d1d5db;
                    border-radius: 3px;
                }
                .scrollbar-thumb-gray-600::-webkit-scrollbar-thumb {
                    background: #4b5563;
                    border-radius: 3px;
                }
                .scrollbar-thin::-webkit-scrollbar-thumb:hover {
                    background: #9ca3af;
                }
                .dark .scrollbar-thin::-webkit-scrollbar-thumb:hover {
                    background: #6b7280;
                }
                .line-clamp-1 {
                    overflow: hidden;
                    display: -webkit-box;
                    -webkit-line-clamp: 1;
                    -webkit-box-orient: vertical;
                }
            `}</style>
        </aside>
    );
};

export default Sidebar;