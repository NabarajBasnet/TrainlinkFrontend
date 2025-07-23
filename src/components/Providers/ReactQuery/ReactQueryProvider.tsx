'use client'

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

type QueryClientProps = {
    children: React.ReactNode
}

const ReactQueryClientProvider = ({ children }: QueryClientProps) => {
    const queryClient = new QueryClient()
    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    )
}

export default ReactQueryClientProvider;
