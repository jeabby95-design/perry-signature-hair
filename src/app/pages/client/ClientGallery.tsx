import { useState } from "react";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Heart, Calendar, Filter } from "lucide-react";
import { toast } from "sonner";

const galleryItems = [
  {
    id: "1",
    image: "https://images.unsplash.com/photo-1723541622232-a71e59b7adf2?w=400",
    service: "Knotless Braids",
    stylist: "Keisha Davis",
    tags: ["braids", "knotless", "medium"],
    saved: true,
  },
  {
    id: "2",
    image: "https://images.unsplash.com/photo-1673470907547-1c0c6a996095?w=400",
    service: "Ghana Weave",
    stylist: "Tiana Richards",
    tags: ["braids", "ghana weave", "cornrows"],
    saved: false,
  },
  {
    id: "3",
    image: "https://images.unsplash.com/photo-1690561115659-bfdb29e0007d?w=400",
    service: "Dread Retwist",
    stylist: "Jasmine Parker",
    tags: ["dreads", "natural"],
    saved: true,
  },
  {
    id: "4",
    image: "https://images.unsplash.com/photo-1624823574478-acf031dec181?w=400",
    service: "Natural Hair Twists",
    stylist: "Keisha Davis",
    tags: ["twists", "natural hair"],
    saved: false,
  },
  {
    id: "5",
    image: "https://images.unsplash.com/photo-1613730317928-246094cb6a82?w=400",
    service: "Fulani Braids",
    stylist: "Nia Johnson",
    tags: ["braids", "fulani", "accessories"],
    saved: true,
  },
  {
    id: "6",
    image: "https://images.unsplash.com/photo-1712821125588-d4dd891b043a?w=400",
    service: "Natural Hair Styling",
    stylist: "Tiana Richards",
    tags: ["natural hair", "afro"],
    saved: false,
  },
];

const categories = ["All", "Braids", "Twists", "Weaves", "Natural Hair", "Dreads"];

export default function ClientGallery() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [savedItems, setSavedItems] = useState(
    new Set(galleryItems.filter((item) => item.saved).map((item) => item.id))
  );

  const filteredItems =
    selectedCategory === "All"
      ? galleryItems
      : galleryItems.filter((item) =>
          item.tags.some((tag) => tag.toLowerCase().includes(selectedCategory.toLowerCase()))
        );

  const handleToggleSave = (itemId: string) => {
    const newSaved = new Set(savedItems);
    if (newSaved.has(itemId)) {
      newSaved.delete(itemId);
      toast.error("Removed from saved styles");
    } else {
      newSaved.add(itemId);
      toast.success("Saved to your collection");
    }
    setSavedItems(newSaved);
  };

  const handleBookStyle = (item: typeof galleryItems[0]) => {
    toast.success(`Booking ${item.service} with ${item.stylist}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gallery</h1>
          <p className="text-gray-600 mt-1">Browse our latest hairstyles and get inspired</p>
        </div>
        <Button variant="outline">
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
      </div>

      {/* Category Filter */}
      <Card className="p-4">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className={
                selectedCategory === category
                  ? "bg-gradient-to-r from-teal-600 to-cyan-600"
                  : ""
              }
            >
              {category}
            </Button>
          ))}
        </div>
      </Card>

      {/* Gallery Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <Card key={item.id} className="overflow-hidden group">
            <div className="relative aspect-[3/4] overflow-hidden">
              <img
                src={item.image}
                alt={item.service}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute bottom-4 left-4 right-4">
                  <Button
                    onClick={() => handleBookStyle(item)}
                    className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Book This Style
                  </Button>
                </div>
              </div>
              <button
                onClick={() => handleToggleSave(item.id)}
                className="absolute top-4 right-4 bg-white/90 hover:bg-white p-2 rounded-full transition-colors"
              >
                <Heart
                  className={`w-5 h-5 ${
                    savedItems.has(item.id)
                      ? "text-red-500 fill-red-500"
                      : "text-gray-600"
                  }`}
                />
              </button>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-900">{item.service}</h3>
              <p className="text-sm text-gray-600 mt-1">by {item.stylist}</p>
              <div className="flex flex-wrap gap-1 mt-3">
                {item.tags.map((tag, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="p-6">
          <p className="text-sm text-gray-600">Total Styles</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{galleryItems.length}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-gray-600">Your Saved</p>
          <p className="text-3xl font-bold text-teal-600 mt-2">{savedItems.size}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-gray-600">Categories</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{categories.length - 1}</p>
        </Card>
      </div>
    </div>
  );
}
