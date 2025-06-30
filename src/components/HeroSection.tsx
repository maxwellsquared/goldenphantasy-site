import ThreeJSHero from "./ThreeJSHero";
import CountdownTimer from "./CountdownTimer";

const HeroSection = () => {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Three.js Background */}
            <ThreeJSHero />

            {/* Content Overlay */}
            <div className="relative z-10 max-w-4xl text-center mx-auto px-6">
                {/* <h1 className="text-6xl md:text-8xl font-bold mb-6 text-white text-center tracking-[0.5em] font-serif">
                    GOLDEN PHANTASY
                </h1> */}
                <img src="gp-white-blur.png" />
                <h2 className="text-3xl md:text-5xl font-light mb-12 text-gray-200">
                    "blouse" featuring peter breeze
                </h2>
                <div className="fade-in">
                    <CountdownTimer />
                </div>
                {/* <p className="text-xl md:text-2xl mb-12 text-gray-300 max-w-2xl mx-auto">
                    music video out soon :)
                </p> */}

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a
                        href="https://www.eventbrite.com/e/blouse-single-release-party-tickets-1431996753839"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <button className="bg-gradient-to-r from-[#F8D7A3]  to-[#DCA64F] text-white font-semibold px-8 py-3 text-lg rounded-lg hover:from-[#D88B11] hover:to-[#9B650E] transition-all duration-400">
                            Release Party July 10 - Get Tickets
                        </button>
                    </a>
                    <a
                        href="https://goldenphantasy.bandcamp.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <button className="border-2 border-white text-white hover:bg-white hover:text-black transition-all duration-200 px-8 py-3 text-lg rounded-lg">
                            Follow on Bandcamp
                        </button>
                    </a>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
