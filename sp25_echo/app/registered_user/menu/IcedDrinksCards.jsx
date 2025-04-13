const IcedDrinksCards = ({ iced_drinks }) => {
    return (
        <div className="regCards">
            <img src={iced_drinks.image_url} alt={iced_drinks.name} className="menu-image" />
            <h2 className="menuItems">{iced_drinks.name} </h2>
            <h3>{iced_drinks.description}</h3>
            <h3 className="menuCardPrice">-- ${iced_drinks.lowestPrice.toFixed(2)} --</h3>
            <p>{iced_drinks.size}</p>
        </div> 
    )
}
    
export default IcedDrinksCards