'use client'

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import supabase from "@/app/config/supabaseClient";

export default function Registered_User_Dashboard() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [firstName, setFirstName] = useState("");

    useEffect(() => {
        async function getUserData() {
            const {data: userData, error: userError} = await supabase.auth.getUser();
            if (userError || !userData?.user) {
                await router.push("/login");
            }

            setUser(userData.user);

            const {data: userProfile, error: profileError} = await supabase
                .from("users")
                .select("first_name")
                .eq("id", userData.user.id)
                .single();

            if (profileError) {
                console.error("Error fetching user profile:", profileError.message);
            }

            setFirstName(userProfile.first_name);
        }

            getUserData();
        }, [router]);

    return (
        <main>
            <h1 className="text-4xl">
                Welcome back, {firstName || "User"}!</h1>
        </main>
    );
}