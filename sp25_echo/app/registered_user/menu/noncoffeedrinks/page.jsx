'use client'

import supabase from "@/app/config/supabaseClient"
import { useEffect, useState } from 'react'
import Reg_menunav from "../reg_menunav"
import { useCart } from "@/app/config/CartContext";
import NonCoffeeCards from "../NonCoffeeCards"
import {AnimatePresence, motion} from "framer-motion";

export default function NonCoffeeDrinks() {

    const [fetchError, setFetchError] = useState(null)
    const [nonCoffeeDrinks, setNonCoffeeDrinks] = useState([])
    const { addToCart } = useCart()

    // Pop-up Card consts
    const [popUp, setPopUp] = useState(false)
    const [selectedItem, setSelectedItem] = useState(null)
    const [selectedSize, setSelectedSize] = useState(null)
    const [availableSizes, setAvailableSizes] = useState([])
    const [customization, setCustomization] = useState('') 

    useEffect(() => {

        // Retrieves and stores data, otherwise displays error message
        const fetchNonCoffee = async () => {
            const { data: drinks, error: drinksError } = await supabase
                .from('menu_items')
                .select()
                .eq('category', 'coffee_alternative')

            if (drinksError) {
                console.error("Fetch error:", drinksError)
                setFetchError("Could not fetch coffee alternative drink items")
                setNonCoffeeDrinks([])
                return
            }

            const { data: sizes, error: sizesError } = await supabase
                .from('menu_item_sizes')
                .select("*")

            if (sizesError) {
                console.error("Size fetch error:", sizesError)
            }

            const drinksWithPrices = drinks.map(drink => {
                const drinkSizes = sizes.filter(size => size.menu_item_id === drink.id);
                const minPrice = drinkSizes.length > 0
                    ? Math.min(...drinkSizes.map(size => size.price))
                    : drink.price; // Default to item price if no sizes exist

                return { ...drink, lowestPrice: minPrice }; // ✅ Add lowest price field
            });

            setNonCoffeeDrinks(drinksWithPrices)
            setFetchError(null)

        }

        fetchNonCoffee()

    }, [])

    const openPopUp = async (item) => {
        setSelectedItem(item)

        const { data: sizes, error } = await supabase
            .from('menu_item_sizes')
            .select("*")
            .eq('menu_item_id', item.id)

        if (error) {
            console.error("Size fetch error:", error)
            setAvailableSizes([])
        } else {
            setAvailableSizes(
                sizes.sort((a, b) => parseInt(a.size) - parseInt(b.size))
            )
            setSelectedSize(sizes[0])
        }

        setPopUp(true)
    }

    const closePopUp = () => {
        setSelectedItem(null)
        setSelectedSize(null)
        setAvailableSizes([])
        setPopUp(false)
        setCustomization('')
    }

    const addItemToCart = () => {
        if (!selectedItem || !selectedSize) return;

        const cartItem = {
            id: selectedItem.id,
            name: selectedItem.name,
            size: selectedSize.size, // ✅ Store selected size
            price: selectedSize.price, // ✅ Store selected price
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

            {nonCoffeeDrinks.length > 0 ? (
                <div className="menu">
                    <div className="menu-grid">
                        <AnimatePresence>
                            {nonCoffeeDrinks.map((item, index) => (
                                <motion.div
                                    key={item.id}
                                    onClick={() => openPopUp(item)}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.05, duration: 0.3 }}
                                    whileHover={{ scale: 1.02, opacity: 0.95}}
                                >
                                    <NonCoffeeCards nonCoffeeDrinks={item} />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            ) : (
                <p className="no-drinks-found-error text-center">No drinks found.</p>
            )}
            
            <AnimatePresence>
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

                            {availableSizes.length > 0 && (
                                <div>
                                    <label>Select Size:</label>
                                    <select
                                        className="size-selection"
                                        value={selectedSize?.id || ""}
                                        onChange={(e) => {
                                            const size = availableSizes.find(s => s.id === e.target.value)
                                            setSelectedSize(size)
                                        }}
                                    >
                                        {availableSizes.map(size => (
                                            <option key={size.id} value={size.id}>
                                                {size.size} - ${size.price.toFixed(2)}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}
                            
                            {/* Customization Textarea */}
                            <br /><label>Customizations (Optional): </label>
                            <textarea className="customizationBox" onChange={(e) => setCustomization(e.target.value)} value={customization} placeholder="Enter your customizations here..."/><br />

                            <h3 className="price">-- ${selectedSize ? selectedSize.price.toFixed(2) : "0.00"} --</h3>

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
            </AnimatePresence>
        </motion.main>
    );
}