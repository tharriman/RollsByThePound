'use client'

import supabase from "@/app/config/supabaseClient";
import { useEffect, useState } from 'react'
import Menunav from "../menunav"
import { motion } from "framer-motion";

{/*The Bakery's Menu Cards*/}
import BakeryCards from "../BakeryCards"

export default function Bakery() {

    const [fetchError, setFetchError] = useState(null)

    const [bakery, setBakery] = useState(null)
   
    useEffect(() => {

        {/*Retrieves and stores data, otherwise displays error message*/}
        const fetchBakery = async () => {
            const { data, error } = await supabase
            .from('menu_items')
            .select()
                .eq('category', 'bakery')

            if (error) {
                setFetchError("Could not fetch bakery items")
                setBakery(null)
                console.log(error)
            }

            if (data) {
                setBakery(data)
                setFetchError(null)
            }
        }

        fetchBakery()
    
    }, [])

    return (
        <motion.main
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="max-h-full pb-[100px]"
        >

            <h2 className="ready-to-order">Ready to Place an Order? <a href="/login">Login</a> or <a href="/signup">Sign Up!</a></h2>
      
            <Menunav />

            <div className="menu"></div>
                
                {fetchError && (<p>fetchError</p>)}
                
                {bakery && (
                    <div className="menu">
                        <div className="menu-grid">
                            {bakery.map(bakery => (
                            <BakeryCards key={bakery.id} bakery={bakery} />
                            ))}
                        </div> 
                    </div>
                )}

        </motion.main>
    );
}