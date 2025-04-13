"use client";
import { useState } from "react";
import supabase from "@/app/config/supabaseClient";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        setError("");

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: "http://localhost:3000/reset-password" // Change to your deployed domain in production
        });

        setLoading(false);

        if (error) {
            setError(error.message);
        } else {
            setMessage("Password reset email sent! Check your inbox.");
        }
    };

    return (
        <main className="flex flex-col items-center justify-center h-screen">
            <div className="p-6 bg-white shadow-lg rounded-lg w-full max-w-md">
                <h1 className="text-3xl text-center">Reset Your Password</h1>

                {message && <p className="text-green-500 text-center">{message}</p>}
                {error && <p className="text-red-500 text-center">{error}</p>}

                <form onSubmit={handleResetPassword} className="space-y-4">
                    <label className="block">Enter your email:</label>
                    <input
                        type="email"
                        className="w-full p-2 border-b-2 border-gray-300"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <button
                        type="submit"
                        className="w-full py-3 bg-stone-500 text-white rounded-md hover:bg-stone-400"
                        disabled={loading}
                    >
                        {loading ? "Sending email..." : "Send Reset Link"}
                    </button>
                </form>
            </div>
        </main>
    );
}
