'use client'

import {use, useEffect, useState} from "react";
import supabase from "@/app/config/supabaseClient";
import { useRouter } from "next/navigation";

export default function AdminLayout( { children }) {
    const [loading, setLoading] = useState(true)
    const [isAdmin, setIsAdmin] = useState(false)
    const router = useRouter()

    useEffect(() => {
        const checkAdmin = async () => {
            const { data: { user } } = await supabase.auth.getUser()

            if (!user || !user.email.endsWith("@rollsbythepound.com")) {
                router.push("/login")
            } else {
                setIsAdmin(true)
            }

            setLoading(false)
        }

        checkAdmin()
    }, [router]);

    if (loading) return <p>Loading...</p>

    return isAdmin ? <>{children}</> : null
}