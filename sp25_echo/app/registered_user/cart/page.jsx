'use client'

import { useCart } from "@/app/config/CartContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

export default function Cart() {
    const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
    const router = useRouter();

    const [itemToDelete, setItemToDelete] = useState(null);
    const [showClearConfirm, setShowClearConfirm] = useState(false);

    const handleCheckout = () => {
        if (cart.length === 0) return;
        localStorage.setItem("checkoutCart", JSON.stringify(cart));
        router.push("/registered_user/checkout");
    };

    const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

    return (
        <motion.main
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
        >
            <h1 className="text-3xl p-4 m-0 mb-2">Your Cart</h1>

            {cart.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center p-10 cart-empty-message rounded-lg"
                >
                    <h2 className="text-xl font-semibold mb-2">🛒 Looks like your cart is empty</h2>
                    <p className="mb-4">Hungry? Add something from the menu to get started.</p>
                    <Link href="/registered_user/menu">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
                        >
                            Browse Menu
                        </motion.button>
                    </Link>
                </motion.div>
            ) : (
                <div className="cart-table">
                    {/* Table Header */}
                    <div className="cart-row cart-header">
                        <span>Item</span>
                        <span>Price</span>
                        <span className="text-center">Quantity</span>
                        <span>Total</span>
                        <span>Remove</span>
                    </div>


                      {cart.map((item, index) => (
                        <div key={index} className="cart-row">
                            <span className="cart-item">{item.name} ({item.size})</span>
                            <span>${item.price.toFixed(2)}</span>

                            <span className="text-center">
                                <input
                                    type="number"
                                    value={item.quantity}
                                    min="1"
                                    onChange={(e) => updateQuantity(item.id, item.size, parseInt(e.target.value))}
                                    className="cart-quantity-input"
                                />
                            </span>

                            <span className="cart-total">${(item.price * item.quantity).toFixed(2)}</span>

                            <button onClick={() => removeFromCart(item.id, item.size)} className="remove-button">
                                <Trash2 size={20} />
                            </button>
                        </div>
                    ))}

                   {/*<AnimatePresence>*/}
                   {/*     {cart.map((item) => (*/}
                    {/*<motion.div
                                key={item.id + item.size}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                                className="cart-row"
                            >
                                <span className="cart-item">{item.name} ({item.size})<br/>
                                <p className="customization">{item.custom}</p></span>
                                <span>${item.price.toFixed(2)}</span>
                                <span>
                  <motion.input
                      key={item.quantity}
                      type="number"
                      value={item.quantity}
                      min="1"
                      onChange={(e) =>
                         updateQuantity(item.id, item.size, parseInt(e.target.value))
                      }
                      className="cart-quantity-input"
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.2 }}
                 />
             </span>
                                <motion.span
                                    key={item.price * item.quantity}
                                    initial={{ opacity: 0.5 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.2 }}
                                    className="cart-total"
                                >
                                    ${(item.price * item.quantity).toFixed(2)}
                                </motion.span>
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                        wwwwwwwww        <Trash2 size={20} />                                         777777777777777
                                </motion.button>
                            </motion.div>
                        ))}
                    </AnimatePwwwwwwresence>


                    {/* Grand Total Row */}
                    <div className="cart-row cart-footer">
                        <span>Total:</span>
                        <span></span>
                        <span></span>
                        <motion.span
                            key={cartTotal}
                            className="cart-grand-total"
                            initial={{ scale: 0.95, opacity: 0.7 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.3 }}
                        >
                            ${cartTotal.toFixed(2)}
                        </motion.span>
                        <motion.span whileHover={{ scale: 1.05 }}>
                            <button
                                onClick={() => setShowClearConfirm(true)}
                                className="clear-cart-button"
                            >
                                Clear Cart
                            </button>
                        </motion.span>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={handleCheckout}
                        className="checkout-button"
                    >
                        Proceed to Checkout
                    </motion.button>
                </div>
            )}

            {/* Remove Single Item Confirmation Modal */}
            <AnimatePresence>
                {itemToDelete && (
                    <motion.div
                        className="modal-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="modal"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <h3 className="text-xl mb-4">Remove <strong>{itemToDelete.name}</strong> from cart?</h3>
                            <div className="modal-actions flex justify-center gap-4">
                                <button onClick={() => setItemToDelete(null)} className="cancel-btn">Cancel</button>
                                <button
                                    onClick={() => {
                                        removeFromCart(itemToDelete.id, itemToDelete.size);
                                        setItemToDelete(null);
                                    }}
                                    className="confirm-btn"
                                >
                                    Yes, Remove
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Clear Entire Cart Confirmation Modal */}
            <AnimatePresence>
                {showClearConfirm && (
                    <motion.div
                        className="modal-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="modal"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <h3 className="text-xl mb-4">Clear your entire cart?</h3>
                            <div className="modal-actions flex justify-center gap-4">
                                <button onClick={() => setShowClearConfirm(false)} className="cancel-btn">Cancel</button>
                                <button
                                    onClick={() => {
                                        clearCart();
                                        setShowClearConfirm(false);
                                    }}
                                    className="confirm-btn"
                                >
                                    Yes, Clear
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.main>
    );
}
