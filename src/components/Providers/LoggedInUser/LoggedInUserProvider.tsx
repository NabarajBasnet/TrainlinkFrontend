'use client';

import React, { createContext, useContext, useEffect, useState } from "react";

type UserProps = {
    children: React.ReactNode
}

const UserContext = createContext();

const LoggedInUserProvider = ({ children }: UserProps) => {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

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
    }, []);

    return (
        <UserContext.Provider value={{ user, loading }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    return useContext(UserContext);
};

export default LoggedInUserProvider;