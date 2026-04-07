import { ImageWithFallback } from "./figma/ImageWithFallback";

export default function Hero() {
  return (
    <section id="home" className="pt-16 bg-gradient-to-br from-amber-50 to-orange-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Premium Afro Hair Styling in West Bromwich
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Expert stylists specializing in braids, twists, weaves, and natural hair care.
              Book your appointment today and experience the Perry Signature difference.
            </p>
            <a
              href="#book"
              className="inline-block bg-gradient-to-r from-amber-600 to-orange-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-amber-700 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl"
            >
              Book Now
            </a>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1673470907547-1c0c6a996095?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600"
              alt="Beautiful braided hairstyle"
              className="rounded-2xl shadow-xl w-full h-72 object-cover"
            />
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1723541622232-a71e59b7adf2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600"
              alt="Stylish braids"
              className="rounded-2xl shadow-xl w-full h-72 object-cover mt-8"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
