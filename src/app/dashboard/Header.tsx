'use client';

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { RiSidebarUnfoldLine, RiSidebarFoldLine } from "react-icons/ri";
import { useTheme } from "next-themes";
import { useDispatch, useSelector } from "react-redux";
import { toggleAdminSidebar } from "@/states/slicer";
import { Sun, Moon } from "lucide-react";
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

const Header = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const clientSidebar = useSelector((state: any) => state.rtkreducer.sidebarMinimized);
    const [darkMode, setDarkMode] = useState(false);
    const [mounted, setMounted] = useState(false);

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

    return (
        <div className="w-full sticky top-0 flex items-center justify-between p-4 dark:bg-gray-900 bg-white shadow">
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
            <div></div>
            <div>
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
            </div>
        </div>
    )
}

export default Header;