{/*Retrieves information from the coffee_alternatives table in Supabase*/}
const NonCoffeeCards = ({ coffee_alternatives }) => {
    return (
        <div className="menu-grid-cards">
            <img src={coffee_alternatives.image_url} alt={coffee_alternatives.name} className="menu-image" />
            <h2 className="menuItems">{coffee_alternatives.name} </h2>
            <h3>{coffee_alternatives.description}</h3>
            <h3 className="menuCardPrice">-- ${coffee_alternatives.price.toFixed(2)} --</h3>
        </div> 
    )
}
    
export default NonCoffeeCards