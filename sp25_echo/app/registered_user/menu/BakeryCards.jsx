{/*Retrieves information from the bakery table in Supabase*/}
const BakeryCards = ({ bakery }) => {
    return (
        <div className="regCards">
            <img src={bakery.image_url} alt={bakery.name} className="menu-image" />
            <h2 className="menuItems">{bakery.name} </h2>
            <h3>{bakery.description}</h3>
            <h3 className="menuCardPrice">-- ${bakery.price.toFixed(2)} --</h3>
        </div> 
    )
}
    
export default BakeryCards