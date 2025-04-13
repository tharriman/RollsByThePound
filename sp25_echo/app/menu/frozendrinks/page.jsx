'use client'

import supabase from "@/app/config/supabaseClient";
import { useEffect, useState } from 'react'
import Menunav from "../menunav"

{/*The Frozen Drinks's Menu Cards*/}
import FrozenDrinksCards from "../FrozenDrinksCards"

export default function FrozenDrinks() {

    const [fetchError, setFetchError] = useState(null)
    const [frozen_drinks, setFrozenDrinks] = useState(null)

    useEffect(() => {

        {/*Retrieves and stores data, otherwise displays error message*/}
        const fetchFrozen = async () => {
            const { data, error } = await supabase
                .from('menu_items')
                .select()
                .eq('category', 'frozen_drinks')

            if (error) {
                setFetchError("Could not fetch frozen drink items")
                setFrozenDrinks(null)
                console.log(error)
            }

            if (data) {
                setFrozenDrinks(data)
                setFetchError(null)
            }
        }

        fetchFrozen()
 
    }, [])

    return (
        <main className="max-h-full pb-[100px]">

            <h2 className="ready-to-order">Ready to Place an Order? <a href="/login">Login</a> or <a href="/signup">Sign Up!</a></h2>
    
            <Menunav />

            <div className="menu"></div>
                
                {fetchError && (<p>fetchError</p>)}

                {/* Read Menu Items from Supabase */}
 
                {frozen_drinks && (
                    <div className="menu">
                        <div className="menu-grid">
                            {frozen_drinks.map(frozen_drinks => (
                            <FrozenDrinksCards key={frozen_drinks.id} frozen_drinks={frozen_drinks} />
                            ))}
                        </div> 
                    </div>
                )}

        </main>
    );
}