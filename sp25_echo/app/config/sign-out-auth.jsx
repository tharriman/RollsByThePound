import supabase from "@/app/config/supabaseClient";

export async function signOutUser() {
    const { error } = await supabase.auth.signOut();
    if (error) {
        console.error("Error signing out:", error.message);
        return { success: false, error: error.message };
    }
    return { success: true };
}