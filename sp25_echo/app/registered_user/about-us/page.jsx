export default function AboutUs() {
    return (
        <main className="flex flex-col items-center justify-start h-screen">
            <div className="p-6 bg-white shadow-lg rounded-lg w-full about-us-card">
                <h1 className="text-3xl text-center"> About Us </h1>
                <h2 className="block mb-2 about-us-text">
                We're not your average bakery. <span className="text-black">Rolls by the Pound </span> is dedicated to crafting exceptional rolls using only the finest ingredients.
                Baked fresh daily, our rolls are sold by weight, ensuring you get exactly the amount you need. Taste the difference quality makes, one pound at a time.
                </h2>
            </div> 
        </main>
    );
}
