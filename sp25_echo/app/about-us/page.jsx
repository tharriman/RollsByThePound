export default function AboutUs() {
    return (
        <main className="flex flex-col items-center justify-start ">
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
            <div className="mt-10 w-full md:w-9/12 sm:pb-[50px]">
                <iframe
                    className="w-full rounded-lg"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3053.709039309633!2d-82.45266842379927!3d40.059593671499364!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88381672df4fffff%3A0x6dbc711b3b52be65!2sRolls%20By%20The%20Pound%20-%20Coffee%20and%20Treats!5e0!3m2!1sen!2sus!4v1742150973590!5m2!1sen!2sus" allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                    height={450}
                ></iframe>
            </div>
        </main>
    );
}
