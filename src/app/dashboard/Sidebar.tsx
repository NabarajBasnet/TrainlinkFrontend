'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaHome, FaCommentDots, FaUser, FaCog, FaSignOutAlt } from 'react-icons/fa';

const Sidebar = () => {
    const router = useRouter();

    const logout = () => {
        localStorage.removeItem('token');
        router.push('/login');
    };

    const menuItems = [
        {
            label: 'Dashboard',
            path: '/dashboard',
            icon: <FaHome />,
            description: 'Overview of your activities',
        },
        {
            label: 'Messages',
            path: '/messages',
            icon: <FaCommentDots />,
            description: 'Chat with your trainer or client',
        },
        {
            label: 'My Profile',
            path: '/profile',
            icon: <FaUser />,
            description: 'View or update your personal info',
        },
        {
            label: 'Settings',
            path: '/settings',
            icon: <FaCog />,
            description: 'Change password, email, and more',
        },
        {
            label: 'Settings',
            path: '/settings',
            icon: <FaCog />,
            description: 'Change password, email, and more',
        }, {
            label: 'Settings',
            path: '/settings',
            icon: <FaCog />,
            description: 'Change password, email, and more',
        }, {
            label: 'Settings',
            path: '/settings',
            icon: <FaCog />,
            description: 'Change password, email, and more',
        }, {
            label: 'Settings',
            path: '/settings',
            icon: <FaCog />,
            description: 'Change password, email, and more',
        }, {
            label: 'Settings',
            path: '/settings',
            icon: <FaCog />,
            description: 'Change password, email, and more',
        }, {
            label: 'Settings',
            path: '/settings',
            icon: <FaCog />,
            description: 'Change password, email, and more',
        },
    ];

    return (
        <aside className="w-64 h-screen flex flex-col bg-white border-r shadow-lg">
            {/* Header */}
            <header className="text-2xl font-bold text-blue-600 p-4 border-b">
                TrainLink
            </header>

            {/* Scrollable nav content */}
            <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
                {menuItems.map((item) => (
                    <Link
                        href={item.path}
                        key={item.path}
                        className="flex flex-col hover:bg-gray-100 rounded-lg p-2 transition-all"
                    >
                        <div className="flex items-center gap-3 text-gray-800 text-base font-medium">
                            {item.icon}
                            {item.label}
                        </div>
                        <div className="text-sm text-gray-500 pl-7">{item.description}</div>
                    </Link>
                ))}
            </nav>

            {/* Footer */}
            <footer className="p-4 border-t">
                <button
                    onClick={logout}
                    className="flex items-center gap-2 text-red-600 hover:underline"
                >
                    <FaSignOutAlt />
                    Logout
                </button>
            </footer>
        </aside>
    );
};

export default Sidebar;
