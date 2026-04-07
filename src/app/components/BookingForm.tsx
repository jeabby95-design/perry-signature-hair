import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { useAuth } from "../firebase/auth-context";
import { createBooking, getStaffUsers } from "../firebase/firestore";

export default function BookingForm() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    service: "",
    size: "",
    length: "",
    stylist: "",
    additionalNotes: "",
    hairProvided: false,
    salonProvides: false,
    preferredDate: "",
    preferredTime: "",
    acceptedTerms: false,
  });

  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [stylistOptions, setStylistOptions] = useState<string[]>([]);

  const services = [
    "Wash and Go",
    "Wash and Blow Dry",
    "Weave (Sew In)",
    "Weave (Closure)",
    "Knotless Braids",
    "Traditional Braids",
    "Twists",
    "Dread Retwists",
    "Natural Hair Twists",
    "Natural Hair Braids",
    "Ghana Weave",
    "Fulani Braids",
    "Other",
  ];

  useEffect(() => {
    async function loadStylists() {
      try {
        const staffUsers = await getStaffUsers();
        setStylistOptions(staffUsers.map((staffUser) => staffUser.fullName));
      } catch {
        setStylistOptions(["Any available stylist"]);
      }
    }

    void loadStylists();
  }, []);

  useEffect(() => {
    if (!profile || !user) {
      return;
    }

    setFormData((previous) => ({
      ...previous,
      fullName: previous.fullName || profile.fullName,
      email: previous.email || user.email || "",
    }));
  }, [profile, user]);

  const sizes = ["Small", "Medium", "Large"];
  const lengths = ["Shoulder", "Mid Back", "Bum", "Leg", "Feet"];

  const serviceRequiresSize = [
    "Traditional Braids",
    "Twists",
    "Knotless Braids",
  ].includes(formData.service);

  const serviceRequiresLength = [
    "Traditional Braids",
    "Twists",
    "Knotless Braids",
    "Weave (Sew In)",
    "Weave (Closure)",
  ].includes(formData.service);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (!user || !profile) {
        toast.error("Please sign in to submit a booking request.");
        navigate("/auth?role=client&redirect=%2Fclient");
        return;
      }

      if (!formData.hairProvided && !formData.salonProvides) {
        toast.error("Please select who provides hair.");
        return;
      }

      if (!formData.acceptedTerms) {
        toast.error("You must accept the booking terms and conditions.");
        return;
      }

      const selectedStylistName = formData.stylist || undefined;
      const bookingId = await createBooking(
        {
          clientId: user.uid,
          clientName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          service: formData.service,
          stylistName: selectedStylistName,
          size: formData.size || undefined,
          length: formData.length || undefined,
          notes: formData.additionalNotes || undefined,
          hairProvided: formData.hairProvided ? "client" : "salon",
          preferredDate: formData.preferredDate,
          preferredTime: formData.preferredTime,
          termsAccepted: formData.acceptedTerms,
          disclaimerAccepted: true,
        },
        uploadedImage,
      );

      toast.success("Booking request submitted!", {
        description: `Request ${bookingId} saved. We'll review and quote within 24 hours.`,
      });

      setFormData({
        fullName: profile.fullName,
        email: user.email ?? "",
        phone: "",
        service: "",
        size: "",
        length: "",
        stylist: "",
        additionalNotes: "",
        hairProvided: false,
        salonProvides: false,
        preferredDate: "",
        preferredTime: "",
        acceptedTerms: false,
      });
      setUploadedImage(null);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to submit booking.";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedImage(e.target.files[0]);
    }
  };

  return (
    <section id="book" className="py-20 bg-gradient-to-br from-amber-50 to-orange-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Book Your Appointment</h2>
          <p className="text-lg text-gray-600">
            Fill out the form below and we'll send you a personalized quote
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-xl p-8 md:p-10 space-y-6"
        >
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="Enter your full name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="your.email@example.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+44 7XXX XXXXXX"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="service">Select Service *</Label>
            <Select
              value={formData.service}
              onValueChange={(value) => setFormData({ ...formData, service: value })}
              required
            >
              <SelectTrigger id="service">
                <SelectValue placeholder="Choose a service" />
              </SelectTrigger>
              <SelectContent>
                {services.map((service) => (
                  <SelectItem key={service} value={service}>
                    {service}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {serviceRequiresSize && (
            <div className="space-y-2">
              <Label htmlFor="size">Braid/Twist Size</Label>
              <Select
                value={formData.size}
                onValueChange={(value) => setFormData({ ...formData, size: value })}
              >
                <SelectTrigger id="size">
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent>
                  {sizes.map((size) => (
                    <SelectItem key={size} value={size}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {serviceRequiresLength && (
            <div className="space-y-2">
              <Label htmlFor="length">Hair Length</Label>
              <Select
                value={formData.length}
                onValueChange={(value) => setFormData({ ...formData, length: value })}
              >
                <SelectTrigger id="length">
                  <SelectValue placeholder="Select length" />
                </SelectTrigger>
                <SelectContent>
                  {lengths.map((length) => (
                    <SelectItem key={length} value={length}>
                      {length}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="stylist">Select Stylist (Optional)</Label>
            <Select
              value={formData.stylist}
              onValueChange={(value) => setFormData({ ...formData, stylist: value })}
            >
              <SelectTrigger id="stylist">
                <SelectValue placeholder="Any available stylist" />
              </SelectTrigger>
              <SelectContent>
                {stylistOptions.map((stylist) => (
                  <SelectItem key={stylist} value={stylist}>
                    {stylist}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Upload Desired Style (Optional)</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="cursor-pointer"
            />
            {uploadedImage && (
              <p className="text-sm text-gray-600">Selected: {uploadedImage.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              value={formData.additionalNotes}
              onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
              placeholder="Any special requests or information we should know?"
              rows={4}
            />
          </div>

          <div className="space-y-3">
            <Label>Hair Option</Label>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="hairProvided"
                checked={formData.hairProvided}
                onCheckedChange={(checked) =>
                  setFormData({
                    ...formData,
                    hairProvided: checked as boolean,
                    salonProvides: false,
                  })
                }
              />
              <label
                htmlFor="hairProvided"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I will provide hair
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="salonProvides"
                checked={formData.salonProvides}
                onCheckedChange={(checked) =>
                  setFormData({
                    ...formData,
                    salonProvides: checked as boolean,
                    hairProvided: false,
                  })
                }
              />
              <label
                htmlFor="salonProvides"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Salon should provide hair
              </label>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="date">Preferred Date *</Label>
              <Input
                id="date"
                type="date"
                required
                value={formData.preferredDate}
                onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">Preferred Time *</Label>
              <Input
                id="time"
                type="time"
                required
                value={formData.preferredTime}
                onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-3 rounded-lg border border-gray-200 p-4">
            <p className="text-sm text-gray-600">
              Booking times may vary depending on hair type and complexity.
            </p>
            <div className="flex items-start space-x-2">
              <Checkbox
                id="acceptedTerms"
                checked={formData.acceptedTerms}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, acceptedTerms: checked as boolean })
                }
                required
              />
              <label
                htmlFor="acceptedTerms"
                className="text-sm font-medium leading-5 text-gray-800"
              >
                I accept the booking terms and conditions
              </label>
            </div>
          </div>

          <Button
            type="submit"
            disabled={submitting}
            className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white py-6 text-lg"
          >
            {submitting ? "Submitting..." : "Request Booking"}
          </Button>

          <p className="text-sm text-gray-600 text-center">
            * Required fields. We'll review your request and send you a quote within 24 hours.
          </p>
        </form>
      </div>
    </section>
  );
}
