'use client';

import Image from "next/image";
import Link from "next/link";
import Logo from './cinnamon-roll.png';
import { useAuth } from "@/app/config/AuthContext";
import {signOutUser} from "@/app/config/sign-out-auth";
import {useRouter} from "next/navigation";
import { useState } from "react";
import {AnimatePresence, motion} from "framer-motion";

export default function Admin_Navbar() {
    const [isNavbarOpen, setIsNavbarOpen] = useState(false);

    const router = useRouter();

    const { user, loading } = useAuth();

    const handleSignOut = async () => {
        await signOutUser();
        router.push("/login?success=You have been logged out successfully.");
    };

    const toggleMenu = ()=> {

        setIsNavbarOpen(!isNavbarOpen);
        console.log("here");
    }

    if (loading || !user) return null;

    return (
        <nav>
            <div>
                <Link href={'/admin-dashboard'}>
                <Image
                    src={Logo}
                    alt={'Rolls cinnamon roll logo'}
                    width={70}
                    quality={100}
                    />
                </Link>
            </div>

            {/* Desktop menu */}
            <div className="hidden md:flex justify-between w-3/4">
                <Link href={'/admin-dashboard'}>Dashboard</Link>
                <Link href={'/admin-dashboard/menu-management'}>Manage Menu</Link>
                <Link href={'/admin-dashboard/order-management'}>Manage Orders</Link>
                <Link href={'/registered_user/menu'}>Menu</Link>

                <button onClick={handleSignOut} className="signout-button">
                    Sign Out
                </button>
            </div>

             {/* mobile menu */}
            <AnimatePresence>
                {isNavbarOpen && (
                    <motion.div
                        initial={{ y: -200, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -200, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                        className="md:hidden absolute left-0 top-28 p-10 w-full flex flex-col mt-4 bg-stone-500 z-10"
                    >
                        <Link className="text-white pb-3" href={'/admin-dashboard'} onClick={toggleMenu}>Dashboard</Link>
                        <Link className="text-white pb-3" href={'/admin-dashboard/menu-management'} onClick={toggleMenu}>Manage Menu</Link>
                        <Link className="text-white pb-3" href={'/admin-dashboard/order-management'} onClick={toggleMenu}>Manage Orders</Link>
                        <Link className="text-white pb-3" href={'/registered_user/menu'} onClick={toggleMenu}>View Menu</Link>

                        {/* Disable button while logging out */}
                        <button onClick={handleSignOut} className="text-white text-left">
                            Sign Out
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

             {/* hamburger button */}
            <div className="cursor-pointer md:hidden relative w-8 h-8" onClick={toggleMenu}>
                <motion.span
                    animate={
                        isNavbarOpen
                            ? { rotate: 45, top: '50%' }
                            : { rotate: 0, top: '25%' }
                    }
                    transition={{ duration: 0.3 }}
                    className="absolute left-0 w-full h-0.5 bg-black origin-center"
                />

                {/* Middle Line */}
                <motion.span
                    animate={
                        isNavbarOpen
                            ? { opacity: 0 }
                            : { opacity: 1, top: '50%' }
                    }
                    transition={{ duration: 0.2 }}
                    className="absolute left-0 w-full h-0.5 bg-black origin-center"
                />

                {/* Bottom Line */}
                <motion.span
                    animate={
                        isNavbarOpen
                            ? { rotate: -45, top: '50%' }
                            : { rotate: 0, top: '75%' }
                    }
                    transition={{ duration: 0.3 }}
                    className="absolute left-0 w-full h-0.5 bg-black origin-center"
                />
            </div>
        </nav>
    )
}
