'use client'

import supabase from "@/app/config/supabaseClient";
import { useEffect, useState } from 'react'
import Menunav from "../menunav"

{/*The Iced Drinks's Menu Cards*/}
import IcedDrinksCards from "../IcedDrinksCards"

export default function IcedDrinks() {

    const [fetchError, setFetchError] = useState(null)
    const [iced_drinks, setIcedDrinks] = useState(null)

    useEffect(() => {

        {/*Retrieves and stores data, otherwise displays error message*/}
        const fetchIced = async () => {
            const { data, error } = await supabase
                .from('menu_items')
                .select()
                .eq('category', 'iced_drinks')

            if (error) {
                setFetchError("Could not fetch iced drink items")
                setIcedDrinks(null)
                console.log(error)
            }

            if (data) {
                setIcedDrinks(data)
                setFetchError(null)
            }
        }

        fetchIced()
    }, [])

    return (
        <main className="max-h-full pb-[100px]">
            <h2 className="ready-to-order">Ready to Place an Order? <a href="/login">Login</a> or <a href="/signup">Sign Up!</a></h2>
            <Menunav />

            <div className="menu"></div>
                
                {fetchError && (<p>fetchError</p>)}

                {/* Read Menu Items from Supabase */}

                {iced_drinks && (
                    <div className="menu">
                        <div className="menu-grid">
                            {iced_drinks.map(iced_drinks => (
                            <IcedDrinksCards key={iced_drinks.id} iced_drinks={iced_drinks} />
                            ))}
                        </div> 
                    </div>
                )}

        </main>
    );
}