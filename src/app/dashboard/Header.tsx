'use client';

import { RiSidebarUnfoldLine, RiSidebarFoldLine } from "react-icons/ri";
import { useTheme } from "next-themes";
import { useDispatch, useSelector } from "react-redux";
import { toggleAdminSidebar } from "@/states/slicer";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

const Header = () => {
    const dispatch = useDispatch();
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

    return (
        <div className="w-full sticky top-0 flex items-center justify-between p-4 dark:bg-gray-900 bg-white shadow">
            <div>
                <button
                    onClick={() => dispatch(toggleAdminSidebar())}
                    className="p-2 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                    {clientSidebar ? (
                        <RiSidebarUnfoldLine className="w-6 h-6 text-orange-600" />
                    ) : (
                        <RiSidebarFoldLine className="w-6 h-6 text-orange-600" />
                    )}
                </button>
            </div>
            <div>

            </div>
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
