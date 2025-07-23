"use client"

import { Provider } from "react-redux"
import store from "@/states/store"
import React from "react"

type RTKProviderProps = {
    children: React.ReactNode
}

const ReactReduxProvider = ({ children }: RTKProviderProps) => {
    return (
        <Provider store={store}>
            {children}
        </Provider>
    )
}

export default ReactReduxProvider
