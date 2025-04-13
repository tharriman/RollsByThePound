{/*Retrieves information from the frozen_drinks table in Supabase*/}
const FrozenDrinksCards = ({ frozen_drinks }) => {
    return (
        <div className="menu-grid-cards">
            <img src={frozen_drinks.image_url} alt={frozen_drinks.name} className="menu-image" />
            <h2 className="menuItems">{frozen_drinks.name} </h2>
            <h3>{frozen_drinks.description}</h3>
            <h3 className="menuCardPrice">-- ${frozen_drinks.price.toFixed(2)} --</h3>
        </div> 
    )
}
    
export default FrozenDrinksCards