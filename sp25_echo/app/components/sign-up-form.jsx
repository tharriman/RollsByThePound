'use client'

import { useState } from "react";
import Link from 'next/link';
import { signUpUser } from "@/app/config/sign-up-auth";
import { useRouter } from "next/navigation";

export default function SignUp() {
    const router = useRouter();
    // State to store form input values
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // Handle form input changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        // Check if passwords match
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match!");
            setLoading(false);
            return;
        }

        // Call Supabase sign-up function
        const { success, error } = await signUpUser(
            formData.firstName,
            formData.lastName,
            formData.email,
            formData.password
        );

        setLoading(false);

        if (success) {
            router.push("/login?success=Account created successfully. Please log in to place orders.")
        } else {
            setError(error);
        }
    };

    return (
        <main>
            <div className="max-w-md mx-auto rounded signup-form">
                <form
                    className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4"
                    onSubmit={handleSubmit}
                >
                    <h1 className="text-3xl text-center py-2">Sign Up</h1>

                    {/* First Name */}
                    <div className="mb-4">
                        <label className="block text-sm font-bold mb-2" htmlFor="firstName">
                            First Name
                        </label>
                        <input
                            className={inputStyle}
                            name="firstName"
                            type="text"
                            placeholder="First Name"
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Last Name */}
                    <div className="mb-4">
                        <label className="block text-sm font-bold mb-2" htmlFor="lastName">
                            Last Name
                        </label>
                        <input
                            className={inputStyle}
                            name="lastName"
                            type="text"
                            placeholder="Last Name"
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Email */}
                    <div className="mb-4">
                        <label className="block text-sm font-bold mb-2" htmlFor="email">
                            Email
                        </label>
                        <input
                            className={inputStyle}
                            name="email"
                            type="email"
                            placeholder="test@email.com"
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Password */}
                    <div className="mb-4">
                        <label className="block text-sm font-bold mb-2" htmlFor="password">
                            Password
                        </label>
                        <input
                            className={inputStyle}
                            name="password"
                            type="password"
                            placeholder="**********"
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Confirm Password */}
                    <div className="mb-4">
                        <label className="block text-sm font-bold mb-2" htmlFor="confirmPassword">
                            Confirm Password
                        </label>
                        <input
                            className={inputStyle}
                            name="confirmPassword"
                            type="password"
                            placeholder="**********"
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Submit button */}
                    <div className="flex items-center flex-col justify-between">
                        <button
                            className="bg-stone-500 hover:bg-stone-400 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? "Signing Up..." : "Sign Up"}
                        </button>
                        {error && <p className="text-red-500 pt-2">{error}</p>}
                        {success && <p className="text-green-500 pt-2">{success}</p>}
                        <p className="pt-2">
                            Already have an account?{" "}
                            <Link className="font-bold text-sm hover:text-gray-800" href="/login">
                                Log In
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </main>
    );
}

const inputStyle =
    "shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline";

