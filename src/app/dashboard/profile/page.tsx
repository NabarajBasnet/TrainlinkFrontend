'use client';


// UI & Icon imports
import { User } from 'lucide-react'
import { Card } from "@/components/ui/card";

// Hooks and utilities
import { useUser } from "@/components/Providers/LoggedInUser/LoggedInUserProvider";

const ProfileCSR = () => {

    const { user, loading } = useUser();
    console.log(user, loading)

    return (
        <div className="w-full flex items-center justify-center p-4">
            <Card>
                <User />
            </Card>
        </div>
    )
}

export default ProfileCSR;
