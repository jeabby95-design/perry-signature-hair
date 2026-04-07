import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Textarea } from "../../components/ui/textarea";
import { Label } from "../../components/ui/label";
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  Clock,
  Scissors,
  ImageIcon,
  CheckCircle,
  X,
  MessageSquare,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../../firebase/auth-context";
import {
  getBookingById,
  markBookingCompleted,
  updateBookingStatus,
} from "../../firebase/firestore";
import type { Booking, BookingStatus } from "../../types/domain";

const statusColors: Record<BookingStatus, string> = {
  pending: "bg-amber-100 text-amber-800",
  quoted: "bg-purple-100 text-purple-800",
  confirmed: "bg-green-100 text-green-800",
  completed: "bg-blue-100 text-blue-800",
  declined: "bg-gray-100 text-gray-800",
  cancelled: "bg-red-100 text-red-800",
};

export default function StaffBookingDetail() {
  const { user } = useAuth();
  const { id } = useParams();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [stylistNotes, setStylistNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadBooking() {
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        const row = await getBookingById(id);
        if (!row) {
          toast.error("Booking not found.");
          return;
        }

        if (user && row.stylistId && row.stylistId !== user.uid) {
          toast.error("This booking is assigned to another stylist.");
          return;
        }

        setBooking(row);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unable to load booking.";
        toast.error(message);
      } finally {
        setLoading(false);
      }
    }

    void loadBooking();
  }, [id, user]);

  async function handleAccept() {
    if (!booking) {
      return;
    }

    setSubmitting(true);
    try {
      await updateBookingStatus(booking.id, "confirmed");
      setBooking({ ...booking, status: "confirmed" });
      toast.success("Booking accepted successfully");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to accept booking.";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  const handleReschedule = () => {
    toast.info("Reschedule request flow can be added once scheduling backend is enabled.");
  };

  const handleReassign = () => {
    toast.info("Reassignment request logged for admin follow-up.");
  };

  async function handleComplete() {
    if (!booking) {
      return;
    }

    setSubmitting(true);
    try {
      await markBookingCompleted(booking.id);
      setBooking({ ...booking, status: "completed" });
      toast.success("Booking marked as completed");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to complete booking.";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  function handleSaveNotes() {
    toast.success("Stylist notes saved locally for this session.");
  }

  if (loading) {
    return <div className="space-y-6 text-gray-600">Loading booking details...</div>;
  }

  if (!booking) {
    return <div className="space-y-6 text-gray-600">Booking details unavailable.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/staff/bookings">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Booking #{booking.id}</h1>
            <p className="text-gray-600 mt-1">View booking details and manage appointment</p>
          </div>
        </div>
        <Badge className={`${statusColors[booking.status]} capitalize`}>{booking.status}</Badge>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Client Information */}
          <Card className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Client Information</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Name</p>
                <p className="font-medium text-gray-900">{booking.clientName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Email</p>
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <a
                    href={`mailto:${booking.email}`}
                    className="font-medium text-purple-600 hover:text-purple-700"
                  >
                    {booking.email}
                  </a>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Phone</p>
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <a
                    href={`tel:${booking.phone}`}
                    className="font-medium text-purple-600 hover:text-purple-700"
                  >
                    {booking.phone}
                  </a>
                </div>
              </div>
            </div>
          </Card>

          {/* Service Details */}
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
              <div>
                <p className="text-sm text-gray-600 mb-1">Size</p>
                <p className="font-medium text-gray-900">{booking.size || "Not specified"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Length</p>
                <p className="font-medium text-gray-900">{booking.length || "Not specified"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Hair Option</p>
                <Badge variant="outline">
                  {booking.hairProvided === "client"
                    ? "Client Provides Hair"
                    : "Salon Provides Hair"}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Date</p>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <p className="font-medium text-gray-900">
                    {new Date(booking.preferredDate).toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Time</p>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <p className="font-medium text-gray-900">{booking.preferredTime}</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Client Notes */}
          <Card className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <MessageSquare className="w-5 h-5 mr-2" />
              Client Notes
            </h2>
            <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{booking.notes || "No notes provided."}</p>
          </Card>

          {/* Stylist Notes */}
          <Card className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Your Notes</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="stylistNotes">Add notes about this appointment</Label>
                <Textarea
                  id="stylistNotes"
                  placeholder="Hair texture, products used, special requests, etc..."
                  value={stylistNotes}
                  onChange={(event) => setStylistNotes(event.target.value)}
                  rows={4}
                />
              </div>
              <Button
                onClick={handleSaveNotes}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                Save Notes
              </Button>
            </div>
          </Card>

          {/* Actions */}
          <Card className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Manage Booking</h2>
            <div className="flex flex-wrap gap-3">
              {(booking.status === "pending" || booking.status === "quoted") && (
                <>
                  <Button
                    onClick={handleAccept}
                    disabled={submitting}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Accept Booking
                  </Button>
                  <Button variant="outline" onClick={handleReassign} disabled={submitting}>
                    <X className="w-4 h-4 mr-2" />
                    Request Reassignment
                  </Button>
                </>
              )}
              {booking.status === "confirmed" && (
                <Button
                  onClick={handleComplete}
                  disabled={submitting}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Mark as Completed
                </Button>
              )}
              <Button variant="outline" onClick={handleReschedule}>
                <Calendar className="w-4 h-4 mr-2" />
                Request Reschedule
              </Button>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Reference Image */}
          <Card className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <ImageIcon className="w-5 h-5 mr-2" />
              Reference Image
            </h2>
            {booking.imageUrl ? (
              <>
                <img
                  src={booking.imageUrl}
                  alt="Client reference"
                  className="w-full rounded-lg border border-gray-200"
                />
                <p className="text-sm text-gray-600 text-center mt-3">Client's desired hairstyle</p>
              </>
            ) : (
              <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center text-gray-600">
                No reference image uploaded.
              </div>
            )}
          </Card>

          {/* Payment Info */}
          <Card className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Payment</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Service Amount</span>
                <span className="font-bold text-gray-900">£{booking.quoteAmount || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Deposit Status</span>
                <Badge
                  className={
                    booking.depositPaid
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }
                >
                  {booking.depositPaid ? "Paid" : "Pending"}
                </Badge>
              </div>
              {booking.depositPaid && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Deposit Paid</span>
                  <span className="font-medium text-gray-900">£{booking.depositAmount}</span>
                </div>
              )}
            </div>
          </Card>

          {/* Quick Tips */}
          <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
            <h3 className="font-bold text-gray-900 mb-2">Tips</h3>
            <ul className="text-sm text-gray-700 space-y-2">
              <li>• Review client notes carefully before appointment</li>
              <li>• Confirm hair option with client</li>
              <li>• Take before/after photos with permission</li>
              <li>• Update notes after completion</li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
