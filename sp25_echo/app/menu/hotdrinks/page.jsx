'use client'

import supabase from "@/app/config/supabaseClient";
import { useEffect, useState } from 'react'
import Menunav from "../menunav"

{/*The Hot Drinks's Menu Cards*/}
import HotDrinksCards from "../HotDrinksCards"

export default function HotDrinks() {

    const [fetchError, setFetchError] = useState(null)
    const [hot_drinks, setHotDrinks] = useState(null)

    useEffect(() => {

        {/*Retrieves and stores data, otherwise displays error message*/}
        const fetchHot = async () => {
            const { data, error } = await supabase
                .from('menu_items')
                .select()
                .eq('category', 'hot_drinks')

            if (error) {
                setFetchError("Could not fetch hot drink items")
                setHotDrinks(null)
                console.log(error)
            }

            if (data) {
                setHotDrinks(data)
                setFetchError(null)
            }
        }

        fetchHot()
    }, [])

    return (
        <main className="max-h-full pb-[100px]">
            <h2 className="ready-to-order">Ready to Place an Order? <a href="/login">Login</a> or <a href="/signup">Sign Up!</a></h2>
            <Menunav />

            <div className="menu"></div>
                
                {fetchError && (<p>fetchError</p>)}

                {/* Read Menu Items from Supabase */}

                {hot_drinks && (
                    <div className="menu">
                        <div className="menu-grid">
                            {hot_drinks.map(hot_drinks => (
                            <HotDrinksCards key={hot_drinks.id} hot_drinks={hot_drinks} />
                            ))}
                        </div> 
                    </div>
                )}

        </main>
    );
}