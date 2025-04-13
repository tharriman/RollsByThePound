"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import supabase from "@/app/config/supabaseClient";

export default function ResetPassword() {
    const router = useRouter();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handlePasswordReset = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        setError("");

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            setLoading(false);
            return;
        }

        const { error } = await supabase.auth.updateUser({
            password
        });

        setLoading(false);

        if (error) {
            setError(error.message);
        } else {
            setMessage("Password updated successfully. Redirecting...");
            setTimeout(() => router.push("/login"), 3000);
        }
    };

    return (
        <main className="flex flex-col items-center justify-center h-screen">
            <div className="p-6 bg-white shadow-lg rounded-lg w-full max-w-md">
                <h1 className="text-3xl text-center">Set a New Password</h1>

                {message && <p className="text-green-500 text-center">{message}</p>}
                {error && <p className="text-red-500 text-center">{error}</p>}

                <form onSubmit={handlePasswordReset} className="space-y-4">
                    <label className="block">New Password:</label>
                    <input
                        type="password"
                        className="w-full p-2 border-b-2 border-gray-300"
                        placeholder="Enter new password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <label className="block">Confirm Password:</label>
                    <input
                        type="password"
                        className="w-full p-2 border-b-2 border-gray-300"
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />

                    <button
                        type="submit"
                        className="w-full py-3 bg-stone-500 text-white rounded-md hover:bg-stone-400"
                        disabled={loading}
                    >
                        {loading ? "Updating Password..." : "Reset Password"}
                    </button>
                </form>
            </div>
        </main>
    );
}
