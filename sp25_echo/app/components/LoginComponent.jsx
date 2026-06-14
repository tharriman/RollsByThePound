"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import supabase from "@/app/config/supabaseClient";

export default function LoginComponent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const successMessage = searchParams.get("success");

    const [showToast, setShowToast] = useState(!!successMessage);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (successMessage) {
            setTimeout(() => setShowToast(false), 3000);
        }
    }, [successMessage]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        setLoading(false);

        if (error) {
            setError(error.message);
            return;
        }

        if (data.user) {
            const isAdmin = email.endsWith("@rollsbythepound.com");

            if (isAdmin) {
                router.push("/admin-dashboard");
            } else {
                router.push("/registered_user");
            }
        }
    };

    return (
        <main className="flex flex-col items-center justify-start h-screen">
            <div className="p-6 bg-white shadow-lg rounded-lg w-full max-w-md login-form">

                {showToast && (
                    <div className="fixed top-5 right-5 bg-green-500 text-white px-4 py-2 rounded-md shadow-md transition-opacity duration-500">
                        {successMessage}
                    </div>
                )}

                <form className="space-y-6" onSubmit={handleLogin}>
                    <h1 className="text-3xl text-center">Welcome Back!</h1>

                    <div>
                        <label className="block mb-2">Email</label>
                        <input
                            className="w-full p-2 border-b-2 border-gray-300"
                            name="email"
                            type="email"
                            value={email}
                            placeholder="Enter your email"
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block mb-2">Password</label>
                        <input
                            className="w-full p-2 border-b-2 border-gray-300"
                            name="password"
                            type="password"
                            value={password}
                            placeholder="Enter your password"
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="text-right text-xs mt-4">
                        <a href="/forgot-password" className="text-stone-500">Forgot password?</a>
                    </div>

                    {error && <p className="text-red-500 text-center">{error}</p>}

                    <div className="flex justify-center">
                        <button
                            type="submit"
                            className="w-full py-4 px-6 bg-stone-500 text-white rounded-md hover:bg-stone-400"
                            disabled={loading}
                        >
                            {loading ? "Logging in..." : "Login"}
                        </button>
                    </div>

                    <div className="text-center mt-4">
                        <span>New User? Sign up </span>
                        <a href="/signup" className="text-blue-500">here</a>
                    </div>
                </form>
            </div>
        </main>
    );
}
