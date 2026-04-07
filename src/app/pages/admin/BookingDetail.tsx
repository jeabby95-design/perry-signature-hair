import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router";
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
import { Badge } from "../../components/ui/badge";
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  User,
  Scissors,
  ImageIcon,
  Send,
  X,
} from "lucide-react";
import { toast } from "sonner";
import {
  getBookingById,
  getStaffUsers,
  sendQuoteForBooking,
  updateBookingStatus,
} from "../../firebase/firestore";
import type { Booking, UserProfile } from "../../types/domain";

export default function BookingDetail() {
  const { id } = useParams();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [staffUsers, setStaffUsers] = useState<UserProfile[]>([]);
  const [selectedStylistId, setSelectedStylistId] = useState("");
  const [quoteAmount, setQuoteAmount] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadData() {
      if (!id) {
        return;
      }

      try {
        const [bookingRow, staffRows] = await Promise.all([
          getBookingById(id),
          getStaffUsers(),
        ]);

        if (!bookingRow) {
          toast.error("Booking not found.");
          return;
        }

        setBooking(bookingRow);
        setStaffUsers(staffRows);
        setSelectedStylistId(bookingRow.stylistId ?? staffRows[0]?.uid ?? "");
        setQuoteAmount(bookingRow.quoteAmount ? String(bookingRow.quoteAmount) : "");
        setNotes(bookingRow.adminNotes ?? "");
      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to load booking.";
        toast.error(message);
      }
    }

    void loadData();
  }, [id]);

  const selectedStylist = useMemo(
    () => staffUsers.find((staffUser) => staffUser.uid === selectedStylistId),
    [selectedStylistId, staffUsers],
  );

  async function handleSendQuote() {
    if (!booking?.id) {
      return;
    }

    if (!selectedStylist || !selectedStylistId) {
      toast.error("Please assign a stylist first.");
      return;
    }

    if (!quoteAmount) {
      toast.error("Please enter a quote amount.");
      return;
    }

    setSubmitting(true);
    try {
      await sendQuoteForBooking(booking.id, {
        quoteAmount: Number(quoteAmount),
        stylistId: selectedStylistId,
        stylistName: selectedStylist.fullName,
        adminNotes: notes,
      });

      setBooking({
        ...booking,
        status: "quoted",
        stylistId: selectedStylistId,
        stylistName: selectedStylist.fullName,
        quoteAmount: Number(quoteAmount),
        adminNotes: notes,
      });

      toast.success(`Quote sent to ${booking.clientName}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to send quote.";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDecline() {
    if (!booking?.id) {
      return;
    }

    setSubmitting(true);
    try {
      await updateBookingStatus(booking.id, "declined");
      setBooking({ ...booking, status: "declined" });
      toast.success("Booking request declined.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to decline booking.";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  if (!booking) {
    return (
      <div className="space-y-6">
        <p className="text-gray-600">Loading booking details...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/admin/booking-requests">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Booking Request #{booking.id}</h1>
            <p className="text-gray-600 mt-1">Review and respond to booking request</p>
          </div>
        </div>
        <Badge className="bg-yellow-100 text-yellow-800 capitalize">{booking.status}</Badge>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <User className="w-5 h-5 mr-2" />
              Client Information
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Full Name</p>
                <p className="font-medium text-gray-900">{booking.clientName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Email</p>
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <p className="font-medium text-gray-900">{booking.email}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Phone</p>
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <p className="font-medium text-gray-900">{booking.phone}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Preferred Date & Time</p>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <p className="font-medium text-gray-900">
                    {new Date(booking.preferredDate).toLocaleDateString()} {booking.preferredTime}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Scissors className="w-5 h-5 mr-2" />
              Service Details
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Service</p>
                <p className="font-medium text-gray-900">{booking.service}</p>
              </div>
              {booking.size && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">Size</p>
                  <p className="font-medium text-gray-900">{booking.size}</p>
                </div>
              )}
              {booking.length && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">Length</p>
                  <p className="font-medium text-gray-900">{booking.length}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-600 mb-1">Hair Option</p>
                <Badge variant="outline">
                  {booking.hairProvided === "client"
                    ? "Client Provides Hair"
                    : "Salon Provides Hair"}
                </Badge>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm text-gray-600 mb-1">Stylist Requested</p>
                <p className="font-medium text-gray-900">{booking.stylistName || "No preference"}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Additional Notes</h2>
            <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{booking.notes || "No notes provided."}</p>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Admin Actions</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="stylist">Assign Stylist</Label>
                <Select value={selectedStylistId} onValueChange={setSelectedStylistId}>
                  <SelectTrigger id="stylist">
                    <SelectValue placeholder="Select stylist" />
                  </SelectTrigger>
                  <SelectContent>
                    {staffUsers.map((staffUser) => (
                      <SelectItem key={staffUser.uid} value={staffUser.uid}>
                        {staffUser.fullName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="quote">Quote Amount (£)</Label>
                <Input
                  id="quote"
                  type="number"
                  placeholder="Enter quote amount"
                  value={quoteAmount}
                  onChange={(event) => setQuoteAmount(event.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="adminNotes">Internal Notes (Optional)</Label>
                <Textarea
                  id="adminNotes"
                  placeholder="Add internal notes about this booking..."
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  rows={3}
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <Button
                  onClick={handleSendQuote}
                  disabled={submitting}
                  className="flex-1 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Send Quote
                </Button>
                <Button
                  variant="outline"
                  onClick={handleDecline}
                  disabled={submitting}
                  className="border-red-300 text-red-600 hover:bg-red-50"
                >
                  <X className="w-4 h-4 mr-2" />
                  Decline
                </Button>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <ImageIcon className="w-5 h-5 mr-2" />
              Reference Images
            </h2>
            {booking.imageUrl ? (
              <div className="space-y-4">
                <img
                  src={booking.imageUrl}
                  alt="Client reference"
                  className="w-full rounded-lg border border-gray-200"
                />
                <p className="text-sm text-gray-600 text-center">
                  Client's desired hairstyle reference
                </p>
              </div>
            ) : (
              <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">No image uploaded</p>
              </div>
            )}
          </Card>

          <Card className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
            <h3 className="font-bold text-gray-900 mb-2">Quick Tips</h3>
            <ul className="text-sm text-gray-700 space-y-2">
              <li>• Review client's image and notes carefully</li>
              <li>• Standard deposit is £15</li>
              <li>• Staff earnings are 55% per booking</li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
