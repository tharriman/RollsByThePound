{/*Retrieves information from the hot_drinks table in Supabase*/}
const HotDrinksCards = ({ hot_drinks }) => {
    return (
        <div className="menu-grid-cards">
            <img src={hot_drinks.image_url} alt={hot_drinks.name} className="menu-image" />
            <h2 className="menuItems">{hot_drinks.name} </h2>
            <h3>{hot_drinks.description}</h3>
            <h3 className="menuCardPrice">-- ${hot_drinks.price.toFixed(2)} --</h3>
        </div> 
    )
}
    
export default HotDrinksCards