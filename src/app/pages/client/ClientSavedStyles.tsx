import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Heart, Calendar, Trash2 } from "lucide-react";
import { Link } from "react-router";
import { toast } from "sonner";

const savedStyles = [
  {
    id: "1",
    image: "https://images.unsplash.com/photo-1723541622232-a71e59b7adf2?w=400",
    service: "Knotless Braids",
    stylist: "Keisha Davis",
    description: "Medium-sized knotless braids with beads",
    savedDate: "2026-03-25",
  },
  {
    id: "2",
    image: "https://images.unsplash.com/photo-1673470907547-1c0c6a996095?w=400",
    service: "Ghana Weave",
    stylist: "Tiana Richards",
    description: "Curved cornrow pattern",
    savedDate: "2026-03-20",
  },
  {
    id: "3",
    image: "https://images.unsplash.com/photo-1690561115659-bfdb29e0007d?w=400",
    service: "Dread Retwist",
    stylist: "Jasmine Parker",
    description: "Fresh dread retwist with natural look",
    savedDate: "2026-03-15",
  },
  {
    id: "4",
    image: "https://images.unsplash.com/photo-1624823574478-acf031dec181?w=400",
    service: "Natural Hair Twists",
    stylist: "Keisha Davis",
    description: "Two-strand twists on natural hair",
    savedDate: "2026-03-10",
  },
  {
    id: "5",
    image: "https://images.unsplash.com/photo-1613730317928-246094cb6a82?w=400",
    service: "Fulani Braids",
    stylist: "Nia Johnson",
    description: "Fulani braids with beads and accessories",
    savedDate: "2026-03-05",
  },
  {
    id: "6",
    image: "https://images.unsplash.com/photo-1712821125588-d4dd891b043a?w=400",
    service: "Natural Hair Styling",
    stylist: "Tiana Richards",
    description: "Styled natural afro hair",
    savedDate: "2026-02-28",
  },
];

export default function ClientSavedStyles() {
  const handleRemove = (styleId: string) => {
    toast.error("Style removed from saved");
  };

  const handleBookStyle = (style: typeof savedStyles[0]) => {
    toast.success(`Redirecting to booking with ${style.service} selected`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Saved Styles</h1>
          <p className="text-gray-600 mt-1">Your favorite hairstyles and inspiration</p>
        </div>
        <Badge className="bg-teal-100 text-teal-700">
          {savedStyles.length} saved
        </Badge>
      </div>

      {savedStyles.length === 0 ? (
        <Card className="p-12">
          <div className="text-center">
            <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No saved styles yet
            </h3>
            <p className="text-gray-600 mb-4">
              Browse our gallery and save your favorite styles
            </p>
            <Link to="/client/gallery">
              <Button className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700">
                Browse Gallery
              </Button>
            </Link>
          </div>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedStyles.map((style) => (
            <Card key={style.id} className="overflow-hidden group">
              <div className="relative aspect-[3/4] overflow-hidden">
                <img
                  src={style.image}
                  alt={style.service}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-4 left-4 right-4">
                    <Button
                      onClick={() => handleBookStyle(style)}
                      className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700"
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Book This Style
                    </Button>
                  </div>
                </div>
                <button
                  onClick={() => handleRemove(style.id)}
                  className="absolute top-4 right-4 bg-white/90 hover:bg-white p-2 rounded-full transition-colors"
                >
                  <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                </button>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1">{style.service}</h3>
                <p className="text-sm text-gray-600 mb-2">by {style.stylist}</p>
                <p className="text-sm text-gray-700 mb-3">{style.description}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>
                    Saved {new Date(style.savedDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                  <button
                    onClick={() => handleRemove(style.id)}
                    className="text-red-600 hover:text-red-700 flex items-center"
                  >
                    <Trash2 className="w-3 h-3 mr-1" />
                    Remove
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Tips Card */}
      <Card className="p-6 bg-gradient-to-br from-teal-50 to-cyan-50 border-teal-200">
        <h3 className="font-bold text-gray-900 mb-2">Tips</h3>
        <ul className="text-sm text-gray-700 space-y-2">
          <li>• Save styles from the gallery or upload your own inspiration</li>
          <li>• Click "Book This Style" to auto-fill the booking form</li>
          <li>• Share saved styles with your stylist for reference</li>
          <li>• Organize your favorites for easy booking</li>
        </ul>
      </Card>
    </div>
  );
}
