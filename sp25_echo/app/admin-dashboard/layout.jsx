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
            const {
                data: { user },
                error: userError,
            } = await supabase.auth.getUser();

            if (userError || !user) {
                router.push("/login");
                setLoading(false);
                return;
            }

            const { data: profile, error: profileError } = await supabase
                .from("users")
                .select("role")
                .eq("id", user.id)
                .single();

            if (profileError || !profile || profile.role !== "admin") {
                router.push("/");
                setLoading(false);
                return;
            }

            setIsAdmin(true);
            setLoading(false);
        };

        checkAdmin();
    }, [router]);

    if (loading) return <p>Loading...</p>

    return isAdmin ? <>{children}</> : null
}
