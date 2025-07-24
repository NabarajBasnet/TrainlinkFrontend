'use client';

import Footer from "@/components/pages/Footer";
import MainNavbar from "@/components/pages/Navbar";
import React from "react";
import { usePathname } from "next/navigation";

export default function RootClientLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    const hideLayout = pathname.startsWith("/dashboard") || pathname.startsWith("/auth");

    return (
        <div>
            {!hideLayout && <MainNavbar />}
            {children}
            {!hideLayout && <Footer />}
        </div>
    );
}
