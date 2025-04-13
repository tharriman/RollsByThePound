'use client'

import supabase from "@/app/config/supabaseClient";
import { useEffect, useState } from 'react'

{/*The Frozen Drinks's Menu Cards*/}
import FrozenDrinksCards from "./FrozenDrinksCards"

export default function Meunu() {

    const [fetchError, setFetchError] = useState(null)
    const [frozen_drinks, setFrozenDrinks] = useState(null)

    useEffect(() => {

        {/*Retrieves and stores data, otherwise displays error message*/}
        const fetchFrozen = async () => {
            const { data, error } = await supabase
            .from('frozen_drinks')
            .select()

            if (error) {
                setFetchError("Could not fetch bakery items")
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
        <main>
        
            <h1 className="text-3xl">Menu</h1>
            <h2>Bakery</h2>

            <div className="menu"></div>
                
                {fetchError && (<p>fetchError</p>)}

                {/* Read Menu Items from Supabase */}
 
                {frozen_drinks && (
                    <div className="bakery">
                        {/* menu nav */}
                        <div className="bakery-grid">
                            {frozen_drinks.map(frozen_drinks => (
                            <FrozenDrinksCards key={frozen_drinks.id} frozen_drinks={frozen_drinks} />
                            ))}
                        </div> 
                    </div>
                )}

        </main>
    );
}