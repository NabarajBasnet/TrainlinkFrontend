import React from 'react'
type SonnerToasterProps = {
    children: React.ReactNode
}
import { Toaster } from "@/components/ui/sonner"

export default function SonnerToastProvider({ children }: SonnerToasterProps) {
    return (
        <html lang="en">
            <head />
            <body>
                <main>{children}</main>
                <Toaster />
            </body>
        </html>
    )
}