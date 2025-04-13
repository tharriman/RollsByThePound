'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function MenuRedirect() {
    const router = useRouter();

    useEffect(() => {
        router.replace('/registered_user/menu/bakery'); // Default to Bakery
    }, [router]);

    return (
        <main className="flex justify-center items-center h-screen">
            <p className="text-lg font-semibold">Loading menu...</p>
        </main>
    );
}
