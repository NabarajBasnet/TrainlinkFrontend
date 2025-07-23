'use client'

import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

type ClientLayoutProps = {
    children: React.ReactNode
}

const ClientLayout = ({ children }: ClientLayoutProps) => {
    return (
        <div>
            <div>
                <Sidebar />
            </div>

            <div>
                <Header />
            </div>
            {children}
        </div>
    );
}

export default ClientLayout;
