import { ImageWithFallback } from "./figma/ImageWithFallback";

const services = [
  {
    name: "Wash and Go",
    description: "Natural texture definition and styling",
    image: "https://images.unsplash.com/photo-1613730317928-246094cb6a82?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
  },
  {
    name: "Wash and Blow Dry",
    description: "Professional blow out and styling",
    image: "https://images.unsplash.com/photo-1624823574478-acf031dec181?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
  },
  {
    name: "Weave (Sew In)",
    description: "Quality sew-in installations",
    image: "https://images.unsplash.com/flagged/photo-1572257576373-27db3d60edaa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
  },
  {
    name: "Weave (Closure)",
    description: "Natural-looking closure installations",
    image: "https://images.unsplash.com/photo-1651446152855-884e9af68dfc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
  },
  {
    name: "Knotless Braids",
    description: "Gentle, lightweight braiding",
    image: "https://images.unsplash.com/photo-1673470907547-1c0c6a996095?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
  },
  {
    name: "Traditional Braids",
    description: "Classic box braids in various sizes",
    image: "https://images.unsplash.com/photo-1723541622232-a71e59b7adf2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
  },
  {
    name: "Twists",
    description: "Two-strand and passion twists",
    image: "https://images.unsplash.com/photo-1712821125588-d4dd891b043a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
  },
  {
    name: "Dread Retwists",
    description: "Professional loc maintenance",
    image: "https://images.unsplash.com/photo-1690561115659-bfdb29e0007d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
  },
  {
    name: "Natural Hair Twists",
    description: "Protective styling for natural hair",
    image: "https://images.unsplash.com/photo-1664629153252-9eb12c921438?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
  },
  {
    name: "Natural Hair Braids",
    description: "Cornrows and natural braiding",
    image: "https://images.unsplash.com/photo-1651446924721-57593c3a4e52?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
  },
  {
    name: "Ghana Weave",
    description: "Intricate feed-in braids",
    image: "https://images.unsplash.com/photo-1673470907547-1c0c6a996095?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
  },
  {
    name: "Fulani Braids",
    description: "Traditional tribal braiding style",
    image: "https://images.unsplash.com/photo-1624823574478-acf031dec181?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
  },
];

export default function Services() {
  return (
    <section id="services" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Services</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            From braids to weaves, twists to locs - we specialize in all types of afro hair styling
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <div
              key={index}
              className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
            >
              <div className="relative h-48 overflow-hidden">
                <ImageWithFallback
                  src={service.image}
                  alt={service.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-lg text-gray-900 mb-2">{service.name}</h3>
                <p className="text-sm text-gray-600">{service.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
