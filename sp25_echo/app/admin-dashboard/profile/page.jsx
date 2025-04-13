'use client'
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import supabase from "@/app/config/supabaseClient";
export default function Profile() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
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

    function toggleDialog() {
        const dialog = document.getElementById("change-password-dialog");
        if (dialog) {
            if (dialog.open) {
                dialog.close();
            } else {
                dialog.showModal();
            }
        }
    }
    useEffect(() => {
        async function getUserData() {
            const {data: userData, error: userError} = await supabase.auth.getUser();
            if (userError || !userData?.user) {
                await router.push("/login");
            }

            setUser(userData.user);

            const {data: userProfile, error: profileError} = await supabase
                .from("users")
                .select("first_name, last_name, email")
                .eq("id", userData.user.id)
                .single();

            if (profileError) {
                console.error("Error fetching user profile:", profileError.message);
            }

            setFirstName(userProfile.first_name);
            setLastName(userProfile.last_name);
            setEmail(userProfile.email);
        }

        getUserData();
    }, [router]);


    return (
        <main className="flex flex-col items-center justify-start h-screen">
            <div className="p-6 bg-white shadow-lg rounded-lg w-full max-w-md">
                <h1 className="text-4xl text-center">Profile</h1>
                <h1 className="text-3xl text-center"> { "First Name: " + firstName}</h1>
                <h1 className="text-3xl text-center"> {"Last Name: " + lastName} </h1>
                <h1 className="text-3xl text-center"> {"Email: " + email} </h1>
                <div className="flex justify-center mt-4">

                    <button
                        className="w-full py-3 bg-stone-500 text-white rounded-md hover:bg-stone-400"
                        onClick={toggleDialog}
                    >
                        Change Password
                    </button>
                </div>
                <dialog id="change-password-dialog" >
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
                                type="show-modal"
                                onClick={toggleDialog}
                                className="w-full py-3 bg-stone-500 text-white rounded-md hover:bg-stone-400"
                                disabled={loading}
                            >Cancel</button>
                            <button
                                type="submit"
                                className="w-full py-3 bg-stone-500 text-white rounded-md hover:bg-stone-400"
                                disabled={loading}
                            >
                                {loading ? "Updating Password..." : "Reset Password"}
                            </button>
                        </form>
                    </div>
                </dialog>

            </div>
        </main>
    );
}