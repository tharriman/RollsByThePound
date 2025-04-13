'use client'

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/app/config/CartContext";
import supabase from "@/app/config/supabaseClient";
import { DateTimePicker, DatePicker } from "@mantine/dates";
import { Select } from "@mantine/core";
import dayjs from "dayjs";

export default function CheckoutPage() {
    const [cart, setCart] = useState([]);
    const [name, setName] = useState("");
    const [orderDate, setOrderDate] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState("cash");
    const [dateForm, setDateForm] = useState(false);
    const [dateError, setDateError] = useState("");
    const [showCardForm, setShowCardForm] = useState(false);
    const [cardNumber, setCardNumber] = useState("");
    const [expirationDate, setExpirationDate] = useState("");
    const [cvv, setCvv] = useState("");
    const [errors, setErrors] = useState({});
    const [selectedDate, setSelectedDate] = useState(null)
    const [selectedTime, setSelectedTime] = useState(null)
    const router = useRouter();
    const { clearCart } = useCart();

    useEffect(() => {
        const savedCart = JSON.parse(localStorage.getItem("checkoutCart")) || [];
        setCart(savedCart);
    }, []);

    const totalAmount = cart?.reduce((total, item) => total + item.price * item.quantity, 0) || 0;

    const handlePaymentChange = (e) => {
        const selectedMethod = e.target.value;
        setPaymentMethod(selectedMethod);
        setShowCardForm(selectedMethod === "card");
    }

    const generateTimeOptions = () => {
        const times = [];
        const start = 7 * 60; // 7:00 AM in minutes
        const end = 15 * 60;  // 3:00 PM in minutes

        for (let minutes = start; minutes <= end; minutes += 15) {
            const hour = Math.floor(minutes / 60);
            const minute = minutes % 60;

            const time = dayjs().hour(hour).minute(minute).format("HH:mm");
            const label = dayjs().hour(hour).minute(minute).format("h:mm A");

            times.push(<option key={time} value={time}>{label}</option>);
        }

        return times;
    };

    // Handle date form toggle
    const handleDateForm = () => {
        setDateForm(!dateForm);
    }
    // Handle date change
    const handleDateChange = (date) => {
        const now = new Date();

        if (dayjs(date) < now) {
            setDateError("You cannot select a past date or time.");
            setOrderDate(null);
            return;
        }
        setDateError(""); // Clear the error if the date is valid
        setOrderDate(date);
    }

    const handleCardNumberChange = (e) => {
        let value = e.target.value.replace(/\D/g, "");
        if (value.length > 16) value = value.slice(0,16);
        setCardNumber(value);
    }

    const handleExpirationChange = (e) => {
        let value = e.target.value.replace(/\D/g, "");
        if (value.length > 4) value = value.slice(0,4);

        if (value.length > 2) {
            value = value.replace(/(\d{2})(\d{0,2})/, "$1/$2");
        }
        setExpirationDate(value);
    }

    const handleCvvChange = (e) => {
        let value = e.target.value.replace(/\D/g, "");
        if (value.length > 4) value = value.slice(0,4);
        setCvv(value);
    }

    const handlePlaceOrder = async (e) => {
        e.preventDefault()

        let formErrors = {}; // Object to track errors

        if (!name.trim()) {
            alert("Please enter a name for the order.");
            return;
        }
        // Validate order date
        if (dateForm) {
            if (dateForm) {
                if (!selectedDate || !selectedTime) {
                    alert("Please select a date and time for your order.");
                    return;
                }

                const now = dayjs();
                const selectedDateTime = dayjs(`${selectedDate}T${selectedTime}`);

                if (selectedDateTime.isBefore(now)) {
                    alert("You cannot select a past date or time.");
                    return;
                }
            }
        }
        if (cart.length === 0) {
            alert("Your cart is empty");
            return;
        }

        if (paymentMethod === "card") {

            if (cardNumber.length !== 16) {
                formErrors.cardNumber = "Card number must be 16 digits.";
            }
            if (!expirationDate.match(/^(0[1-9]|1[0-2])\/\d{2}$/)) {
                formErrors.expirationDate = "Expiration date must be in MM/YY format.";
            }
            if (cvv.length < 3 || cvv.length > 4) {
                formErrors.cvv = "CVV must be 3 or 4 digits.";
            }
        }

        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }

        const { data: userSession } = await supabase.auth.getUser();
        const userId = userSession?.user?.id;

        const buildOrderDateTime = () => {
            if (!selectedDate || !selectedTime) return null;
            const dateTimeString = `${selectedDate}T${selectedTime}`;
            return new Date(dateTimeString);
        };

        const orderDateObj = dateForm ? buildOrderDateTime() : new Date();

        const orderData = {
            user_id: userId,
            order_name: name,
            status: "pending",
            total_price: totalAmount,
            payment_method: paymentMethod,
            order_date: orderDateObj.toISOString()
        }

        const { data: order, error: orderError } = await supabase
            .from("orders")
            .insert([orderData])
            .select()
            .single();

        if (orderError) {
            console.error("Order error:", orderError);
            alert("Failed to place order.");
            return;
        }

        const orderId = order.id;

        const orderItems = await Promise.all(cart.map(async (item) => {
            if (!item.size) {
                return {
                    order_id: orderId,
                    menu_item_id: item.id,
                    menu_item_size_id: null,
                    quantity: item.quantity,
                    price: item.price,
                    customization_entry: item.custom,
                };
            }
            const { data: sizeData, error: sizeError } = await supabase
                .from("menu_item_sizes")
                .select("id")
                .eq("menu_item_id", item.id)
                .eq("size", item.size)
                .single();

            if (sizeError || !sizeData) {
                console.error("Size lookup error:", sizeError)
                return null
            }

            return {
                order_id: orderId,
                menu_item_id: item.id,
                menu_item_size_id: sizeData.id,
                quantity: item.quantity,
                price: item.price,
                customization_entry: item.custom,
            };
        }));

        const validOrderItems = orderItems.filter(item => item !== null);

        const { error: orderItemsError } = await supabase
            .from("order_items")
            .insert(validOrderItems)

        if (orderItemsError) {
            console.error("Order items error:", orderItemsError);
            alert("Failed to save order items.");
            return;
        }

        localStorage.setItem("lastOrderId", orderId)

        if (clearCart) {
            clearCart();
        }
        // alert("Order placed successfully!");
        router.push('/registered_user/order-confirmation');
    }

    return (
        <main className="checkout-container">
            <h1 className="text-3xl p-4 m-0 mb-2">Checkout</h1>
            <form onSubmit={handlePlaceOrder}>
                <div className="checkout-form rounded-lg rounded-br-none rounded-bl-none">
                    <div className="form-group">

                        <label>Name:</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Payment Method:</label>
                        <select value={paymentMethod} onChange={handlePaymentChange}>
                            <option value="cash">Cash</option>
                            <option value="card">Credit/Debit Card</option>
                        </select>
                    </div>

                    {showCardForm && (
                        <div className = "card-details rounded-lg ">
                            <h3 className="mt-30 mb-3" style={{fontWeight: 'bold'}}>Card Information</h3>

                            <div className="card-info-container">

                                <div className="card-number-container">
                                    <label className="credit-card-label">Card Number</label>
                                    <input type="text" value={cardNumber || ""} onChange={handleCardNumberChange} placeholder="1234 5678 9012 3456" maxLength="19" required className="credit-card-input"/>
                                    {errors.cardNumber && <p className="card-error-message">{errors.cardNumber}</p>}
                                </div>

                                <div className="name-on-card-container">
                                    <label className="credit-card-label">Name on Card</label>
                                    <input type="text" required className="credit-card-input"/>
                                </div>

                            </div>

                            <div className="expiration-cvv-container">

                                <div className="expiration-container">
                                    <label className="credit-card-label">Expiration Date</label>
                                    <input type="text" value={expirationDate || ""} onChange={handleExpirationChange} placeholder="MM/YY" style={{ width: "80%", maxWidth: "120px" }} required className="credit-card-input"/>
                                    {errors.expirationDate && <p className="card-error-message">{errors.expirationDate}</p>}
                                </div>

                                <div className="cvv-container">
                                    <label className="credit-card-label">CVV</label>
                                    <input className="credit-card-input" type="text" value={cvv || ""} onChange={handleCvvChange} placeholder="123" maxLength="4" style={{ width: "80%", maxWidth: "120px" }} required/>
                                    {errors.cvv && <p className="card-error-message">{errors.cvv}</p>}
                                </div>

                            </div>

                        </div>
                    )}

                    <div className="form-group">
                        <label className='flex items-center cursor-pointer select-none'>
                            <div className='relative'>
                                <input
                                    type='checkbox'
                                    checked= {dateForm}
                                    onChange={handleDateForm}
                                    className='sr-only'
                                />
                                <div className='box mr-4 flex h-5 w-5 items-center justify-center rounded-full border border-stroke dark:border-dark-3'>
                            <span
                                className={`h-[10px] w-[10px] rounded-full" ${
                                    orderDate ? 'bg-primary' : 'bg-white'
                                }`}
                            >
                                {' '}
                            </span>
                                </div>
                            </div>
                            Place Order for Later
                        </label>
                    </div>

                    {dateForm && (
                        <div className="card-details rounded-lg space-y-4">
                            <div className="form-group">
                                <label>Date:</label>
                                <input
                                    type="date"
                                    value={selectedDate || ""}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                    className="border p-2 rounded-md w-full"
                                    min={dayjs().format("YYYY-MM-DD")}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Time:</label>
                                <select
                                    value={selectedTime || ""}
                                    onChange={(e) => setSelectedTime(e.target.value)}
                                    className="border p-2 rounded-md w-full"
                                    required
                                >
                                    <option value="">Select time</option>
                                    {generateTimeOptions()}
                                </select>
                            </div>
                        </div>
                    )}

                </div>

                <div className="checkout-summary rounded-br-lg rounded-bl-lg">
                    <h2 className="order-summary">Order Summary</h2>
                    {cart.map((item, index) => (
                        <div key={index} className="checkout-item">
                            <span>{item.name} x {item.quantity}<br />
                            <p className="customization">{item.custom}</p></span>
                            <span>${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                    ))}

                    <h3 className="checkout-total">Total: ${totalAmount.toFixed(2)}</h3>
                </div>

                <button type="submit" className="place-order-button">
                    Place Order

                </button>
            </form>
        </main>
    )
}