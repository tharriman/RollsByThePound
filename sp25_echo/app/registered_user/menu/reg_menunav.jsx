'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Reg_menunav() {
    const pathname = usePathname();

    // Helper to check if a link is active
    const isActive = (path) => pathname === path;

    const links = [
        { name: 'Bakery', path: '/registered_user/menu/bakery' },
        { name: 'Frozen Drinks', path: '/registered_user/menu/frozendrinks' },
        { name: 'Hot Drinks', path: '/registered_user/menu/hotdrinks' },
        { name: 'Iced Drinks', path: '/registered_user/menu/iceddrinks' },
        { name: 'Coffee Alternatives', path: '/registered_user/menu/noncoffeedrinks' },
    ];

    return (
        <nav className="menunav flex gap-4 p-4">
            {links.map((link) => (
                <Link
                    key={link.path}
                    href={link.path}
                    className={`px-3 py-1 rounded-md transition 
            ${isActive(link.path) ? 'bg-blue-500 text-white font-semibold' : 'text-gray-700 hover:bg-gray-200'}`}
                >
                    {link.name}
                </Link>
            ))}
        </nav>
    );
}

