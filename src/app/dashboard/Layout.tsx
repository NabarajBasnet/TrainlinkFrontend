import React from "react"
import DashboardClientLayout from "./ClientLayout"

type ClientLayoutProps = {
    children: React.ReactNode
}

export async function generateMetadata() {
    return {
        title: 'Dashboard | Trainlink'
    }
}

export default function DashboardLayout({ children }: ClientLayoutProps) {
    console.log("🚨 Dashboard layout.tsx rendered");

    return (
        <div>
            <DashboardClientLayout>
                {children}
            </DashboardClientLayout>
        </div>
    )
}
