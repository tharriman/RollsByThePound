import supabase from "@/app/config/supabaseClient";

export async function signUpUser(firstName, lastName, email, password) {
    // Step 1: Create user in Supabase Auth
    const { data, error } = await supabase.auth.signUp({
        email,
        password
    });

    if (error) {
        console.error("Error signing up:", error.message);
        return { success: false, error: error.message };
    }

    const userId = data.user?.id;
    if (!userId) {
        return { success: false, error: "User ID missing" };
    }

    // Step 2: Insert additional user data into "users" table
    const { error: insertError } = await supabase.from("users").insert([
        {
            id: userId,
            first_name: firstName,
            last_name: lastName,
            email: email
        }
    ]);

    if (insertError) {
        console.error("Error adding user to users table:", insertError.message);
        return { success: false, error: insertError.message };
    }

    const { data: session, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password
    });

    if (loginError) {
        return { success: false, error: loginError.message };
    }

    return { success: true, userId, session };
}
