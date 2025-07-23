'use client';

import { useDispatch, useSelector } from "react-redux";
import { toggleAdminSidebar } from "@/states/slicer";
import { Menu } from "lucide-react";

const Header = () => {
    const dispatch = useDispatch();

    return (
        <div className="w-full sticky top-0 flex items-center justify-between p-4 dark:bg-gray-900 bg-white shadow">
            <div>
                <button onClick={() => dispatch(toggleAdminSidebar())}>
                    <Menu />
                </button>
            </div>
            <div>
                <h1>Trainlink</h1>
            </div>
            <div>
                <h1>Account</h1>
            </div>
        </div>
    )
}
export default Header;
