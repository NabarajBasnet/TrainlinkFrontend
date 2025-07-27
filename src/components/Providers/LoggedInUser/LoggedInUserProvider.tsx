'use client';

import React, { createContext, useContext, useEffect, useState } from "react";

type UserProps = {
    children: React.ReactNode
}

const UserContext = createContext<any>(null);

const LoggedInUserProvider = ({ children }: UserProps) => {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refetch, setRefetch] = useState(false);

    const getLoggedInRootUserDetails = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/logged-in-user`, {
                credentials: 'include',
            });

            const responseBody = await response.json();
            if (response.ok) {
                setUser(responseBody.user);
            } else {
                setUser(null);
            }
        } catch (error) {
            console.error("Error fetching user details:", error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getLoggedInRootUserDetails();
    }, [refetch]);

    return (
        <UserContext.Provider value={{ user, loading, refetch, setRefetch }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    return useContext(UserContext);
};

export default LoggedInUserProvider;