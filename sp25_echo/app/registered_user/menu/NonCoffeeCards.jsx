const NonCoffeeCards = ({ nonCoffeeDrinks }) => {
    return (
        <div className="regCards">
            <img src={nonCoffeeDrinks.image_url} alt={nonCoffeeDrinks.name} className="menu-image" />
            <h2 className="menuItems">{nonCoffeeDrinks.name}</h2>
            <h3>{nonCoffeeDrinks.description}</h3>
            <h3 className="menuCardPrice">-- ${nonCoffeeDrinks.lowestPrice.toFixed(2)} --</h3>
            <p>{nonCoffeeDrinks.size}</p>
        </div>
    );
};


export default NonCoffeeCards