"use client";

import { useEffect, useState, Fragment } from "react";
import supabase from "@/app/config/supabaseClient";

export default function OrderManagement() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedOrderId, setExpandedOrderId] = useState(null);

    // Pagination states
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(5); // Default to 5 orders per page
    const [totalOrders, setTotalOrders] = useState(0);

    useEffect(() => {
        fetchOrders();
    }, [page, pageSize]);

    // Fetch the total number of orders (for pagination)
    const fetchTotalOrders = async () => {
        const { count, error } = await supabase
            .from("orders")
            .select("*", { count: "exact", head: true });

        if (error) {
            console.error("Error fetching total order count:", error);
        } else {
            setTotalOrders(count);
        }
    };

    // Fetch paginated orders
    const fetchOrders = async () => {
        setLoading(true);

        const start = (page - 1) * pageSize;
        const end = start + pageSize - 1;

        const { data, error } = await supabase
            .from("orders")
            .select(`
                id,
                created_at,
                total_price,
                payment_method,
                status,
                user_id,
                users(first_name, last_name),
                order_items(id, quantity, price, menu_items(name), menu_item_sizes(size))
            `)
            .range(start, end) // Apply pagination limits
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Error fetching orders:", error);
            setError("Failed to load orders.");
        } else {
            setOrders(data);
        }

        setLoading(false);
        fetchTotalOrders(); // Update total orders count
    };

    const toggleOrderDetails = (orderId) => {
        setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
    };

    const markAsComplete = async (orderId) => {
        const { error } = await supabase
            .from("orders")
            .update({ status: "completed" })
            .eq("id", orderId);

        if (error) {
            console.error("Error updating order status:", error.message);
            alert("Failed to update status: " + error.message);
        } else {
            fetchOrders();
        }
    };



    return (
        <main className="max-h-full pb-[100px]">
            <h1 className="p-6 text-4xl m-0 mb-4">Order Management</h1>

            {loading && <p>Loading orders...</p>}
            {error && <p className="text-red-500">{error}</p>}

            {/* Page Size Selector */}
            <div className="mb-4 order-pagination">
                <label className="mr-2">Orders Per Page:</label>
                <select
                    value={pageSize}
                    onChange={(e) => {
                        setPageSize(Number(e.target.value));
                        setPage(1); // Reset to first page when page size changes
                    }}
                    className="border p-2 rounded-md"
                >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={15}>15</option>
                    <option value={20}>20</option>
                </select>
            </div>

            <div className="md:overflow-x-auto sm:overflow-x-auto rounded-lg">
                <table className="w-full border-collapse border border-gray-500">
                    <thead>
                    <tr className="bg-gray-200">
                        <th className="border p-2">Order ID</th>
                        <th className="border p-2">Customer</th>
                        <th className="border p-2">Date</th>
                        <th className="border p-2">Total</th>
                        <th className="border p-2">Payment</th>
                        <th className="border p-2">Status</th>
                        <th className="border p-2">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="admin-order-history-table-rows">
                    {orders.map((order) => (
                        <Fragment key={order.id}>
                            <tr className="text-center border-b">
                                <td className="border p-2">{order.id}</td>
                                <td className="border p-2">
                                    {order.users?.first_name} {order.users?.last_name}
                                </td>
                                <td className="border p-2">{new Date(order.created_at).toLocaleString()}</td>
                                <td className="border p-2">${order.total_price.toFixed(2)}</td>
                                <td className="border p-2 capitalize">{order.payment_method}</td>
                                <td className="border p-2 capitalize">
                                    {order.status}
                                    {order.status === "pending" && (
                                        <button
                                            onClick={() => markAsComplete(order.id)}
                                            className="ml-2 bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 text-sm"
                                        >
                                            Mark as Complete
                                        </button>
                                    )}
                                </td>
                                <td className="border-none p-2">
                                    <button
                                        className="bg-blue-500 text-white px-3 py-1 rounded-md"
                                        onClick={() => toggleOrderDetails(order.id)}
                                    >
                                        {expandedOrderId === order.id ? "Hide Details" : "View Details"}
                                    </button>
                                </td>
                            </tr>

                            {expandedOrderId === order.id && (
                                <tr key={`${order.id}-details`} className="bg-gray-100">
                                    <td colSpan="7" className="p-4">
                                        <h3 className="text-lg font-bold mb-2">Order Details</h3>
                                        {order.order_items.length > 0 ? (
                                            <ul>
                                                {order.order_items.map((item) => (
                                                    <li key={item.id} className="flex justify-between border-b py-2">
                                                        <span>{item.menu_items?.name} ({item.menu_item_sizes?.size || "Regular"})</span>
                                                        <span>Qty: {item.quantity}</span>
                                                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p>No items found for this order.</p>
                                        )}
                                    </td>
                                </tr>
                            )}
                        </Fragment>
                    ))}
                    </tbody>

                </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-between items-center order-pagination-nav">
                <button
                    className="bg-gray-500 text-white px-4 py-2 rounded-md disabled:opacity-50"
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                >
                    Previous
                </button>

                <span className="pagination-page-number">
                    Page {page} of {Math.ceil(totalOrders / pageSize)}
                </span>

                <button
                    className="bg-gray-500 text-white px-4 py-2 rounded-md disabled:opacity-50"
                    onClick={() => setPage(page + 1)}
                    disabled={page * pageSize >= totalOrders}
                >
                    Next
                </button>
            </div>
        </main>
    );
}

