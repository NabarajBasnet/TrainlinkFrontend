import React from "react"

type ClientLayoutProps = {
    children: React.ReactNode
}

export async function generateMetadata() {
    return {
        title: 'Dashboard | Trainlink'
    }
}

export default function DashboardLayout({ children }: ClientLayoutProps) {
    return (
        <div>
            {children}
        </div>
    )
}
