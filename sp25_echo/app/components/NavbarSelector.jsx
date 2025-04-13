"use client"; // Ensures this is a Client Component

import { useEffect, useState } from "react";
import { useAuth } from "@/app/config/AuthContext";
import supabase from "@/app/config/supabaseClient";
import Navbar from "@/app/components/navbar";
import Reg_Navbar from "@/app/registered_user/components/reg_navbar";
import Admin_Navbar from "@/app/admin-dashboard/components/admin_navbar";

export default function NavbarSelector() {
    const { user, loading } = useAuth();
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const fetchAdminStatus = async () => {
            if (!user) {
                setIsAdmin(false)
                return;
            }

            const { data, error } = await supabase
                .from("users")
                .select("role")
                .eq("id", user.id)
                .single();

            if (error) {
                console.error("Error fetching admin status:", error);
                return;
            }

            setIsAdmin(data.role === "admin");
        };

        fetchAdminStatus();
    }, [user]);

    if (loading) return null; // Prevent flickering while checking auth

    if (isAdmin) return <Admin_Navbar />;
    if (user) return <Reg_Navbar />;
    return <Navbar />;
}
