'use client';

import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

type ClientLayoutProps = {
    children: React.ReactNode;
};

const DashboardClientLayout = ({ children }: ClientLayoutProps) => {
    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-white dark:bg-gray-800 border-r">
                <Sidebar />
            </aside>

            {/* Main content area */}
            <div className="flex flex-col flex-1">
                <Header />
                <main className="p-4">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default DashboardClientLayout;
