'use client'

import supabase from "@/app/config/supabaseClient"
import { useEffect, useState } from 'react'
import Reg_menunav from "../reg_menunav"
import BakeryCards from "../BakeryCards"
import { useCart } from "@/app/config/CartContext";
import {AnimatePresence, motion} from "framer-motion";
import NonCoffeeCards from "@/app/registered_user/menu/NonCoffeeCards";

export default function Bakery() {

    const { addToCart } = useCart()

    const [fetchError, setFetchError] = useState(null);
    const [bakery, setBakery] = useState([]); // ✅ Start as an empty array

    const [popUp, setPopUp] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null); // ✅ Store selected item

    const [customization, setCustomization] = useState('')

    // Function to open pop-up with selected item
    const openPopUp = (item) => {
        setSelectedItem(item);
        setPopUp(true);
    };

    // Function to close pop-up
    const closePopUp = () => {
        setSelectedItem(null);
        setPopUp(false);
        setCustomization('')
    };

    useEffect(() => {
        const fetchBakery = async () => {
            const { data, error } = await supabase
                .from('menu_items')
                .select()
                .eq('category', 'bakery');

            if (error) {
                console.error("Fetch error:", error);
                setFetchError("Could not fetch bakery items");
                setBakery([]);
                return;
            }

            setBakery(data);
            setFetchError(null);
        };

        fetchBakery();
    }, []);

    const addItemToCart = () => {
        if (!selectedItem) return; // ✅ No need to check for `selectedSize`

        const cartItem = {
            id: selectedItem.id,
            name: selectedItem.name,
            price: selectedItem.price, // ✅ Use `selectedItem.price` directly
            quantity: 1,
            custom: customization
        };

        addToCart(cartItem); // ✅ Add item to cart
        closePopUp(); // ✅ Close pop-up after adding to cart
    };


    return (
        <motion.main
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="max-h-full pb-[100px]"
        >
            <Reg_menunav />

            {fetchError && (<p>{fetchError}</p>)}

            {/* Display Bakery Items */}
            {bakery.length > 0 ? (
                <div className="menu">
                    <div className="menu-grid">
                        <AnimatePresence>
                            {bakery.map((item, index) => (
                                <motion.div
                                    key={item.id}
                                    onClick={() => openPopUp(item)}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.05, duration: 0.3 }}
                                    whileHover={{ scale: 1.02, opacity: 0.95}}
                                >
                                    <BakeryCards bakery={item} />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            ) : (
                <p className="no-drinks-found-error text-center">No bakery items found.</p>
            )}

            {/* Pop-Up Card (Only Shows When Open) */}
            {popUp && selectedItem && (
                <motion.div
                    className="popUpCard"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className="overlay"
                        onClick={closePopUp}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    />
                       <motion.div
                           className="popUpContent"
                           initial={{ scale: 0.8, opacity: 0, x: "-50%", y: "-50%" }}
                           animate={{ scale: 1, opacity: 1, x: "-50%", y: "-50%" }}
                           exit={{ scale: 0.8, opacity: 0, x: "-50%", y: "-50%" }}
                           transition={{ duration: 0.3 }}
                           style={{
                               position: "fixed",
                               top: "50%",
                               left: "50%",
                           }}
                       >

                       <h2>{selectedItem.name}</h2>
                        <h3>{selectedItem.description}</h3>
                        {/* Customization Textarea */}
                        <br /><label>Customizations (Optional): </label>
                        <textarea className="customizationBox" onChange={(e) => setCustomization(e.target.value)} value={customization} placeholder="Enter your customizations here..."/><br />
                        <h3 className="price">-- ${selectedItem.price.toFixed(2)} --</h3>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="addToCart"
                            onClick={addItemToCart}
                        >
                            Add To Cart
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="closePopUp"
                            onClick={closePopUp}
                        >
                            Close
                        </motion.button>
                    </motion.div>
                </motion.div>
            )}
        </motion.main>
    );
}
