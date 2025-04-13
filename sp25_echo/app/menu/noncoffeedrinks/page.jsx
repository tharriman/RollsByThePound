'use client'

import supabase from "@/app/config/supabaseClient";
import { useEffect, useState } from 'react'
import Menunav from "../menunav"

{/*The Coffee Alternatives' Menu Cards*/}
import NonCoffeeCards from "../NonCoffeeCards"

export default function NonCoffee() {

    const [fetchError, setFetchError] = useState(null)
    const [coffee_alternatives, setNonCoffeeDrinks] = useState(null)

    useEffect(() => {

        {/*Retrieves and stores data, otherwise displays error message*/}
        const fetchNonCoffee = async () => {
            const { data, error } = await supabase
                .from('menu_items')
                .select()
                .eq('category', 'coffee_alternative')

            if (error) {
                setFetchError("Could not fetch coffee alternative items")
                setNonCoffeeDrinks(null)
                console.log(error)
            }

            if (data) {
                setNonCoffeeDrinks(data)
                setFetchError(null)
            }
        }

        fetchNonCoffee()
    }, [])

    return (
        <main className="max-h-full pb-[100px]">
            <h2 className="ready-to-order">Ready to Place an Order? <a href="/login">Login</a> or <a href="/signup">Sign Up!</a></h2>
        
            <Menunav />

            <div className="menu"></div>
                
                {fetchError && (<p>fetchError</p>)}

                {/* Read Menu Items from Supabase */}

                {coffee_alternatives && (
                    <div className="menu">
                        <div className="menu-grid">
                            {coffee_alternatives.map(coffee_alternatives => (
                            <NonCoffeeCards key={coffee_alternatives.id} coffee_alternatives={coffee_alternatives} />
                            ))}
                        </div> 
                    </div>
                )}

        </main>
    );
}