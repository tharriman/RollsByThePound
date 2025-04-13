export default function AboutUs() {
    return (
        <main className="flex flex-col items-center justify-start h-screen">
            <div className="p-6 bg-white shadow-lg rounded-lg w-full about-us-card">
                <h1 className="text-3xl text-center"> About Us </h1>
                <h2 className="block mb-2 about-us-text">
                We're not your average bakery. <span className="text-black">Rolls by the Pound </span> is dedicated to crafting exceptional rolls using only the finest ingredients.
                Baked fresh daily, our rolls are sold by weight, ensuring you get exactly the amount you need. Taste the difference quality makes, one pound at a time.
                </h2>
                <h1 className="text-3xl text-center"> Developed by: </h1>
                <h2 className="block mt-2 text-lg">Tyler Harriman</h2>
                <h2 className="block mt-2 text-lg">Abdinasir Aidrus</h2>
                <h2 className="block mt-2 text-lg">Chanel Elmurr</h2>
                <h2 className="block mt-2 text-lg">Paul Moskalyuk</h2>
                <h2 className="block mt-2 text-lg">Chris Stickney</h2>
                <h2 className="block mt-2 text-lg">Stanley Pierre-Canel</h2>
            </div> 
        </main>
    );
}
