'use client'

import Image from "next/image";
import Link from "next/link";
import Logo from './cinnamon-roll.png'
import { useAuth } from "@/app/config/AuthContext";
import { useState } from "react";
import {AnimatePresence, motion} from "framer-motion";

export default function Navbar() {

    const [isNavbarOpen, setIsNavbarOpen] = useState(false);

    const { user, loading } = useAuth();

    if (loading || user) return null;

    const toggleMenu = ()=> {

        setIsNavbarOpen(!isNavbarOpen);
        console.log("here");
    }

     return (
        <nav>
            {/* Logo */}
            <div>
                <Link href={'/'}>
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
                <Link href={'/'}>Home</Link>
                <Link href={'/about-us'}>About Us</Link>
                <Link href={'/menu'}>Menu</Link>
                <Link href={'/login'}>Login</Link>
                <Link href={'/signup'}>Sign Up</Link>
            </div>

             {/* mobile menu */}
            <AnimatePresence>
                {isNavbarOpen && (
                    <motion.div
                        initial={{ y: -200, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -200, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                        className="md:hidden absolute left-0 top-28 p-10 w-full flex flex-col mt-4 bg-stone-500 z-10 rounded-md"
                    >
                        <Link className="text-white pb-3" href={'/'} onClick={toggleMenu}>Home</Link>
                        <Link className="text-white pb-3" href={'/about-us'} onClick={toggleMenu}>About Us</Link>
                        <Link className="text-white pb-3" href={'/menu'} onClick={toggleMenu}>Menu</Link>
                        <Link className="text-white pb-3" href={'/login'} onClick={toggleMenu}>Login</Link>
                        <Link className="text-white pb-3" href={'/signup'} onClick={toggleMenu}>Sign Up</Link>
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