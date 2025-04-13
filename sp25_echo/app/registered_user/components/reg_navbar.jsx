'use client'

import Image from "next/image";
import Link from "next/link";
import Logo from './cinnamon-roll.png'
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signOutUser} from "@/app/config/sign-out-auth";
import { useAuth } from "@/app/config/AuthContext";
import { useCart } from "@/app/config/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart } from 'lucide-react';

export default function Reg_Navbar() {
    const router = useRouter();
    const { user, loading } = useAuth();
    const { cart } = useCart();
    const [isNavbarOpen, setIsNavbarOpen] = useState(false);
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)

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
                <Link href={'/registered_user'}>
                    <Image
                        src={Logo}
                        alt={'Rolls cinnamon roll logo'}
                        width={70}
                        quality={100}
                        />
                </Link>
            </div>

            {/* Desktop menu */}
            <div className="hidden md:flex justify-between items-center w-3/4">

                <Link href={'/registered_user'}>Home</Link>
                <Link href={'/registered_user/about-us'}>About Us</Link>
                <Link href={'/registered_user/menu'}>Menu</Link>
                <Link href={'/registered_user/order-history'}>Order History</Link>
                <Link href={'/registered_user/profile'}>Profile</Link>

                {/* Disable button while logging out */}
                <button onClick={handleSignOut} className="mb-au signout-button">
                    Sign Out
                </button>
                <Link href={'/registered_user/cart'} className="cart-link">
                    Cart

                {totalItems > 0 && <span className="cart-badge">{totalItems}</span> }
                </Link>

            </div>

             {/* mobile menu */}
            {/*<div className={`${isNavbarOpen ? 'block': 'hidden'} md:hidden justify-between absolute left-0 top-28 p-10 h-1/2 w-full flex flex-col mt-4 bg-stone-500 transition-all duration-500 ease-in-out z-10 `}>*/}
            <AnimatePresence>
                {isNavbarOpen && (
                    <motion.div
                        initial={{ y: -200, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -200, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                        className="md:hidden absolute left-0 top-28 p-10 w-full flex flex-col mt-4 bg-stone-500 z-10"
                    >
                    <Link className="text-white pb-3" href={'/registered_user'} onClick={toggleMenu}>Home</Link>
                    <Link className="text-white pb-3" href={'/registered_user/about-us'} onClick={toggleMenu}>About Us</Link>
                    <Link className="text-white pb-3" href={'/registered_user/menu'} onClick={toggleMenu}>Menu</Link>
                    <Link className="text-white pb-3" href={'/registered_user/order-history'} onClick={toggleMenu}>Order History</Link>
                    <Link className="text-white pb-3" href={'/registered_user/profile'} onClick={toggleMenu}>Profile</Link>

                    {/* Disable button while logging out */}
                    <button onClick={handleSignOut} className="text-white text-left">
                        Sign Out
                    </button>
                    <Link href={'/registered_user/cart'} className="cart-link text-white" onClick={toggleMenu}>
                        Cart
                    {totalItems > 0 && <span className="cart-badge">{totalItems}</span> }
                    </Link>
            </motion.div>
                )}
            </AnimatePresence>

             {/* hamburger button */}
            <div className="md:hidden flex items-center gap-4">
                {/* Hamburger Button */}
                <div className="cursor-pointer relative w-8 h-8" onClick={toggleMenu}>
                    {/* Top Line */}
                    <motion.span
                        animate={isNavbarOpen ? { rotate: 45, top: '50%' } : { rotate: 0, top: '25%' }}
                        transition={{ duration: 0.3 }}
                        className="absolute left-0 w-full h-0.5 bg-black origin-center"
                    />
                    {/* Middle Line */}
                    <motion.span
                        animate={isNavbarOpen ? { opacity: 0 } : { opacity: 1, top: '50%' }}
                        transition={{ duration: 0.2 }}
                        className="absolute left-0 w-full h-0.5 bg-black origin-center"
                    />
                    {/* Bottom Line */}
                    <motion.span
                        animate={isNavbarOpen ? { rotate: -45, top: '50%' } : { rotate: 0, top: '75%' }}
                        transition={{ duration: 0.3 }}
                        className="absolute left-0 w-full h-0.5 bg-black origin-center"
                    />
                </div>

                {/* Cart Icon with Badge */}
                <Link href="/registered_user/cart" className="relative">
                    <ShoppingCart className="w-6 h-6 text-black" />
                    {totalItems > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
                            {totalItems}
                        </span>
                    )}
                </Link>
            </div>
        </nav>
    )
}