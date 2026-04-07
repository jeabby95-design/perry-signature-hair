import { useState } from "react";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import { Badge } from "../../components/ui/badge";
import { Upload, Trash2, Edit, Filter } from "lucide-react";
import { toast } from "sonner";

interface GalleryItem {
  id: string;
  imageUrl: string;
  service: string;
  stylist: string;
  description: string;
  uploadDate: string;
  tags: string[];
}

const mockGalleryItems: GalleryItem[] = [
  {
    id: "1",
    imageUrl: "https://images.unsplash.com/photo-1723541622232-a71e59b7adf2?w=400",
    service: "Knotless Braids",
    stylist: "Keisha Davis",
    description: "Medium-sized knotless braids with beads",
    uploadDate: "2026-03-20",
    tags: ["braids", "knotless", "medium"],
  },
  {
    id: "2",
    imageUrl: "https://images.unsplash.com/photo-1673470907547-1c0c6a996095?w=400",
    service: "Ghana Weave",
    stylist: "Tiana Richards",
    description: "Cornrows with curved pattern",
    uploadDate: "2026-03-18",
    tags: ["braids", "ghana weave", "cornrows"],
  },
  {
    id: "3",
    imageUrl: "https://images.unsplash.com/photo-1690561115659-bfdb29e0007d?w=400",
    service: "Dread Retwist",
    stylist: "Jasmine Parker",
    description: "Fresh dread retwist with natural look",
    uploadDate: "2026-03-15",
    tags: ["dreads", "natural"],
  },
  {
    id: "4",
    imageUrl: "https://images.unsplash.com/photo-1624823574478-acf031dec181?w=400",
    service: "Natural Hair Twists",
    stylist: "Keisha Davis",
    description: "Two-strand twists on natural hair",
    uploadDate: "2026-03-12",
    tags: ["twists", "natural hair"],
  },
  {
    id: "5",
    imageUrl: "https://images.unsplash.com/photo-1613730317928-246094cb6a82?w=400",
    service: "Fulani Braids",
    stylist: "Nia Johnson",
    description: "Fulani braids with beads and accessories",
    uploadDate: "2026-03-10",
    tags: ["braids", "fulani", "accessories"],
  },
  {
    id: "6",
    imageUrl: "https://images.unsplash.com/photo-1712821125588-d4dd891b043a?w=400",
    service: "Natural Hair Styling",
    stylist: "Tiana Richards",
    description: "Styled natural afro hair",
    uploadDate: "2026-03-08",
    tags: ["natural hair", "afro"],
  },
];

export default function GalleryManagement() {
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [selectedService, setSelectedService] = useState("");
  const [description, setDescription] = useState("");

  const handleUpload = () => {
    if (!selectedService || !description) {
      toast.error("Please fill in all fields");
      return;
    }
    toast.success("Image uploaded successfully!");
    setIsUploadOpen(false);
    setSelectedService("");
    setDescription("");
  };

  const handleDelete = (item: GalleryItem) => {
    toast.error(`Image deleted from gallery`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gallery Management</h1>
          <p className="text-gray-600 mt-1">
            Showcase your team's work and inspire clients
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700">
                <Upload className="w-4 h-4 mr-2" />
                Upload Image
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload New Gallery Image</DialogTitle>
                <DialogDescription>
                  Add a new hairstyle photo to showcase your work.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <Label>Upload Image</Label>
                  <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-amber-500 transition-colors cursor-pointer">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 10MB</p>
                  </div>
                </div>
                <div>
                  <Label htmlFor="service">Service Type</Label>
                  <Select value={selectedService} onValueChange={setSelectedService}>
                    <SelectTrigger id="service">
                      <SelectValue placeholder="Select service" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="braids">Braids</SelectItem>
                      <SelectItem value="knotless">Knotless Braids</SelectItem>
                      <SelectItem value="ghana">Ghana Weave</SelectItem>
                      <SelectItem value="fulani">Fulani Braids</SelectItem>
                      <SelectItem value="twists">Twists</SelectItem>
                      <SelectItem value="dreads">Dreads</SelectItem>
                      <SelectItem value="natural">Natural Hair</SelectItem>
                      <SelectItem value="weave">Weave</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="stylist">Stylist</Label>
                  <Select>
                    <SelectTrigger id="stylist">
                      <SelectValue placeholder="Select stylist" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Keisha Davis</SelectItem>
                      <SelectItem value="2">Tiana Richards</SelectItem>
                      <SelectItem value="3">Jasmine Parker</SelectItem>
                      <SelectItem value="4">Nia Johnson</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe this hairstyle..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                  />
                </div>
                <Button onClick={handleUpload} className="w-full">
                  Upload to Gallery
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card className="p-6">
          <p className="text-sm text-gray-600">Total Images</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{mockGalleryItems.length}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-gray-600">This Month</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">8</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-gray-600">Most Popular</p>
          <p className="text-sm font-medium text-gray-900 mt-2">Knotless Braids</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-gray-600">Categories</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">8</p>
        </Card>
      </div>

      {/* Gallery Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockGalleryItems.map((item) => (
          <Card key={item.id} className="overflow-hidden group">
            <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
              <img
                src={item.imageUrl}
                alt={item.description}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="bg-white/90 hover:bg-white"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="bg-white/90 hover:bg-white text-red-600 hover:text-red-700"
                      onClick={() => handleDelete(item)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-gray-900">{item.service}</h3>
                <Badge variant="outline" className="text-xs">
                  {item.stylist.split(" ")[0]}
                </Badge>
              </div>
              <p className="text-sm text-gray-600 mb-3">{item.description}</p>
              <div className="flex flex-wrap gap-1">
                {item.tags.map((tag, idx) => (
                  <Badge key={idx} className="bg-amber-100 text-amber-800 text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-3">
                {new Date(item.uploadDate).toLocaleDateString()}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
