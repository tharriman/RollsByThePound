import Image from "next/image";
import CinnamonRoll from './components/rolls.jpg'
import RollsCustom from './components/rollscustom1.jpg'


export default function Home() {
  return (
    <main className="max-h-full pb-[100px]">
        <div className="welcome">
            <h1 className="text-4xl rounded-br-none rounded-bl-none pb-5 pt-12 m-0 welcome-1">Welcome to Rolls By The Pound!</h1>
            <h1 className="text-2xl rounded-none mt-0 pt-0 pb-2 m-0 ">Thanks for stopping by!</h1>
            <h1 className="text-center rounded-tl-none rounded-tr-none text-2xl m-0 pt-3 pb-12 welcome-3">
                <a  href={'/menu'}>
                Click Here to Explore Our Menu
                </a>
            </h1>

        </div>

      {/*Popular items section: */}

      <section className="popular-items pt-12 pb-16 rounded-lg bg-opacity-90 shadow-lg mt-12">
        <h2 className="text-3xl text-center mb-8">Popular Items</h2>

        <div className="flex items-center justify-center pl-[3%] pr-[3%]">
            <div className="popular-item-area shadow-lg  gap-8 flex-col pb-10 rounded-lg pl-[3%]">

          {/* Item: Signature Cinnamon Roll */}

                <div className="card w1/3 rounded-lg popular-items-card flex flex-col md:flex-row">
                <div className="h-60 flex items-center md:pl-[3%] sm:pl-[5%] xs:pl-[5%] pt-[3%]">
                <Image
                    src={CinnamonRoll}
                    alt={'Rolls cinnamon roll logo'}
                    width={300}
                    height={300}
                    quality={100}
                    className="object-cover rounded-t-lg"
                />
                </div>
                <div className="p-6">
                <h3 className="text2xl font-bold">Signature Cinnamon Roll</h3>
                <p className="text-gray-600 mt-2">
                    Our famous one-pound cinnamon roll topped with one-of-a-kind icing.
                </p>
                </div>

                </div>


          {/* Item: Roll's Custom Matcha */}

          <div className="card w1/3  popular-items-card flex flex-col md:flex-row">
            <div className="p-6">
              <h3 className="text2xl font-bold">Roll's Custom Mocha</h3>
              <p className="text-gray-600 mt-2">
                Our signature drink with white chocolate syrup.
              </p>
            </div>
            <div className="h-60 flex items-center md:pr-[3%] sm:pl-[5%]">
              <Image
                src={RollsCustom}
                alt={'Rolls matcha logo'}
                width={275}
                height={250}
                quality={100}
                className="object-cover rounded-t-lg"
              />
            </div>
          </div>
        </div>
        </div>
      </section>
        {/*Customer Review Section: */}
        {/*Customer Review Section: */}
        <section className="customer-reviews pt-12 pb-16">
            <h2 className="text-3xl text-center mb-8 text-white">Customer Reviews</h2>

            <div className="flex flex-col items-center gap-6">

                {/* Review 1 */}
                <div className="review-card p-6 rounded-lg shadow-lg bg-white bg-opacity-90 max-w-md">
                    <h3 className="text-xl font-bold">Fred P. - Columbus, Oh</h3>
                    <p className="text-gray-600 mt-2">
                        "Prices and food are great must come again"
                    </p>
                </div>

                {/* Review 2 */}
                <div className="review-card p-6 rounded-lg shadow-lg bg-white bg-opacity-90 max-w-md">
                    <h3 className="text-xl font-bold">Amber C. - New Albany, Oh</h3>
                    <p className="text-gray-600 mt-2">
                        "Lots of great choices at reasonable prices"
                    </p>
                </div>

            </div>
        </section>
    </main>
  );
}
