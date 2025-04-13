{/*Retrieves information from the iced_drinks table in Supabase*/}
const IcedDrinksCards = ({ iced_drinks }) => {
    return (
        <div className="menu-grid-cards">
            <img src={iced_drinks.image_url} alt={iced_drinks.name} className="menu-image" />
            <h2 className="menuItems">{iced_drinks.name} </h2>
            <h3>{iced_drinks.description}</h3>
            <h3 className="menuCardPrice">-- ${iced_drinks.price.toFixed(2)} --</h3>
        </div> 
    )
}
    
export default IcedDrinksCards