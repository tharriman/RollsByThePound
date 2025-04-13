import Admin_Navbar from "./components/admin_navbar";
import Link from "next/link";

export default function AdminPage() {
    return (
        <main>
            <h1 className="text-3xl p-4 mb-6 admin-title">Admin Dashboard</h1>
            <div className="flex justify-center gap-32 flex-col md:flex-row max-md:gap-8 max-md:w-3/4 max-md:m-auto">
                <h1 className="text-2xl admin-link"><Link href={'/admin-dashboard/menu-management'}>Manage Menu</Link></h1>
                <h1 className="text-2xl admin-link"><Link href={'/admin-dashboard/order-management'}>Manage Orders</Link></h1>
            </div>
        </main>
    );
}