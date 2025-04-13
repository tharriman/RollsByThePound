"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/config/AuthContext";
import supabase from "@/app/config/supabaseClient";
import { useCart } from "@/app/config/CartContext";

export default function OrderHistory() {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [expandedOrder, setExpandedOrder] = useState(null);
    const { addToCart} = useCart();

    // Pagination states
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(5); // Default 5 orders per page
    const [totalOrders, setTotalOrders] = useState(0);

    useEffect(() => {
        if (!user) return;

        const fetchTotalOrders = async () => {
            const { count, error } = await supabase
                .from("orders")
                .select("*", { count: "exact", head: true })
                .eq("user_id", user.id);

            if (!error) setTotalOrders(count);
        };

        const fetchOrderHistory = async () => {
            const start = (page - 1) * pageSize;
            const end = start + pageSize - 1;

            const { data: ordersData, error: ordersError } = await supabase
                .from("orders")
                .select("id, order_name, total_price, created_at")
                .eq("user_id", user.id)
                .order("created_at", { ascending: false })
                .range(start, end);

            if (ordersError) {
                console.error("Error fetching orders:", ordersError);
                return;
            }

            setOrders(ordersData);
        };

        fetchTotalOrders();
        fetchOrderHistory();
    }, [user, page, pageSize]);

    const fetchOrderItems = async (orderId) => {
        const { data: orderItemsData, error: orderItemsError } = await supabase
            .from("order_items")
            .select(`
                id,
                quantity,
                price,
                menu_items(name),
                menu_item_sizes(size),
                customization_entry
            `)
            .eq("order_id", orderId);

        if (orderItemsError) {
            console.error("Error fetching order items:", orderItemsError);
            return [];
        }

        return orderItemsData;
    };

    const toggleOrderDetails = async (orderId) => {
        if (expandedOrder && expandedOrder.orderId === orderId) {
            setExpandedOrder(null); // Collapse order details
        } else {
            const items = await fetchOrderItems(orderId);
            setExpandedOrder({ orderId, items }); // Expand with fetched items
        }
    };
    const reordering = async (orderId) => {
        const { data: orderItemsData, error: orderItemsError } = await supabase
            .from("order_items")
            .select(`
                id,
                quantity,
                price,
                menu_items(name),
                menu_item_sizes(size),
                customization_entry
            `)
            .eq("order_id", orderId);
        for (const item of orderItemsData){
            const cartItem = {
                id: item.id,
                name: item.menu_items.name,
                size: item.menu_item_sizes?.size || "Regular",
                price: item.price,
                quantity: item.quantity,
                custom: item.customization_entry
            }
            addToCart(cartItem);
        }
        if (orderItemsError) {
            console.error("Error fetching order items:", orderItemsError);
            return [];
        }


        return orderItemsData;
    }

    return (
        <main className="order-history-container max-h-full pb-[100px]">
            <h1 className="text-3xl p-4 mb-5">Order History</h1>

            {orders.length === 0 ? (
                <p>No orders found.</p>
            ) : (
                <div className="order-list">
                    {orders.map((order) => (
                        <div key={order.id} className="order-card border p-4 rounded-md mb-4">
                            <div className="flex justify-between flex-col md:flex-row">
                                <div>
                                    <p><strong>Order Name:</strong> {order.order_name}</p>
                                    <p><strong>Order ID:</strong> {order.id}</p>
                                    <p><strong>Total:</strong> ${order.total_price.toFixed(2)}</p>
                                    <p><strong>Date:</strong> {new Date(order.created_at).toLocaleDateString()}</p>
                                </div>
                                <div className="flex items-center ">
                                    <button
                                        className="bg-blue-500 ; text-white px-3 py-1 rounded-md"
                                        onClick={()=> reordering(order.id)}
                                    >
                                        Reorder
                                    </button>
                                    <button
                                        className="bg-blue-500 text-white px-3 py-1 rounded-md"
                                        onClick={() => toggleOrderDetails(order.id)}
                                    >
                                        {expandedOrder?.orderId === order.id ? "Hide Order Details" : "View Order Details"}
                                    </button>
                                </div>
                            </div>

                            {expandedOrder?.orderId === order.id && (
                                <div className="order-details mt-4 border-t pt-2">
                                    <h3 className="text-lg font-semibold order-history-items">Items Ordered:</h3>
                                    {expandedOrder.items.length > 0 ? (
                                        <ul>
                                            {expandedOrder.items.map((item) => (
                                                <li key={item.id} className="flex justify-between p-2 border-b ml-1 mr-1">
                                                    <span>{item.menu_items?.name} ({item.menu_item_sizes?.size || "Regular"})
                                                        <p className="customization">{item.customization_entry}</p></span>
                                                    <span>Qty: {item.quantity}</span>
                                                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p>No items found for this order.</p>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination Controls */}
            <div className="flex justify-between items-center order-history-pagination-bottom">
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
