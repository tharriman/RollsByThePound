'use client'

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/app/config/CartContext";
import supabase from "@/app/config/supabaseClient";

export default function OrderConfirmation() {
    const { clearCart } = useCart()
    const [ order, setOrder ] = useState(null)
    const [orderItems, setOrderItems] = useState([])
    const [orderFetched, setOrderFetched] = useState(false)
    const router = useRouter()

    useEffect(() => {
        if (orderFetched) return;

        const fetchOrderDetails = async () => {
            const lastOrderId = localStorage.getItem("lastOrderId");

            if (!lastOrderId) {
                console.warn("No lastOrderId found. Redirecting to home...");
                router.push('/');
                return;
            }

            const { data: orderData, error: orderError } = await supabase
                .from("orders")
                .select("id, order_name, total_price, order_date, payment_method")
                .eq("id", lastOrderId)
                .single();

            if (orderError || !orderData) {
                console.error("Order fetch error:", orderError);
                router.push('/');
                return;
            }

            setOrder(orderData);

            const { data: itemsData, error: itemsError } = await supabase
                .from("order_items")
                .select(`
                    id,
                    order_id,
                    quantity,
                    price,
                    menu_items(name),
                    menu_item_sizes(size),
                    customization_entry
                `)
                .eq("order_id", lastOrderId);

            if (itemsError) {
                console.error("Order items fetch error:", itemsError);
                return;
            }

            setOrderItems(itemsData || []);

            if (clearCart) {
                clearCart();
            }

            localStorage.removeItem("lastOrderId");
            setOrderFetched(true);
        };

        fetchOrderDetails();
    }, [clearCart, router, orderFetched]);

    return (
        <main className="order-confirmation-container">
            {order ? (
                <>
                    <h1 className="rounded-lg text-3xl p-6 m-0 mb-2">Thank You for Your Order!</h1>
                    <div className="order-confirmation-details">
                        <p>Your order has been placed successfully!</p>
                        <p><strong>Order ID:</strong> {order.id}</p>
                        <p><strong>Order Name:</strong> {order.order_name}</p>
                        <p>
                            <strong>Order Time:</strong>{" "}
                            {order.order_date
                                ? new Date(order.order_date).toLocaleString("en-US", {
                                    month: "2-digit",
                                    day: "2-digit",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: true
                                })
                                : "ASAP"}
                        </p>
                        <p><strong>Payment Method: </strong>{order.payment_method}</p>

                        {/* Order Summary */}
                        <h2 className="order-confirmation-summary-title">Order Summary:</h2>
                        <div className="order-confirmation-summary rounded-br-lg rounded-bl-lg">
                            {orderItems.length > 0 ? (
                                orderItems.map((item, index) => (
                                    <div key={index} className="order-confirmation-item">
                                        <span>{item.menu_items?.name} {item.size ? `(${item.size})` : ""} <br /> 
                                            <p className="customization">{item.customization_entry}</p></span>
                                        <span>Qty: {item.quantity}</span>
                                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                ))
                            ) : (
                                <p>No items found in this order.</p>
                            )}
                            <h3 className="order-confirmation-total">Total: ${order.total_price.toFixed(2)}</h3>
                        </div>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="order-actions">
                        <button onClick={() => router.push("/registered_user/menu")} className="menu-button">
                            Back to Menu
                        </button>
                        <button onClick={() => router.push("/registered_user")} className="home-button">
                            Home
                        </button>
                    </div>
                </>
            ) : (
                <p>Loading order details...</p>
            )}
        </main>
    );
}