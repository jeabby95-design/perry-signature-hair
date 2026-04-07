import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Scissors,
  ImageIcon,
  CreditCard,
  Star,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../../firebase/auth-context";
import { getBookingById, updateBookingStatus } from "../../firebase/firestore";
import { FIXED_DEPOSIT_GBP, startDepositCheckout } from "../../firebase/stripe";
import type { Booking, BookingStatus } from "../../types/domain";

const statusConfig: Record<BookingStatus, string> = {
  pending: "bg-amber-100 text-amber-800",
  quoted: "bg-purple-100 text-purple-800",
  confirmed: "bg-green-100 text-green-800",
  completed: "bg-blue-100 text-blue-800",
  declined: "bg-gray-100 text-gray-800",
  cancelled: "bg-red-100 text-red-800",
};

export default function ClientBookingDetail() {
  const { user } = useAuth();
  const { id } = useParams();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [updating, setUpdating] = useState(false);

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

        if (user && row.clientId !== user.uid) {
          toast.error("You do not have access to this booking.");
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

  const remainingBalance = useMemo(() => {
    if (!booking?.quoteAmount) {
      return 0;
    }
    return Math.max(0, booking.quoteAmount - FIXED_DEPOSIT_GBP);
  }, [booking]);

  const handleReschedule = () => {
    toast.info("Reschedule flow can be added once scheduling backend is enabled.");
  };

  async function handleCancel() {
    if (!booking) {
      return;
    }

    if (["cancelled", "declined", "completed"].includes(booking.status)) {
      toast.error("This booking can no longer be cancelled.");
      return;
    }

    setUpdating(true);
    try {
      await updateBookingStatus(booking.id, "cancelled");
      setBooking({ ...booking, status: "cancelled" });
      toast.success("Booking cancelled.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to cancel booking.";
      toast.error(message);
    } finally {
      setUpdating(false);
    }
  }

  async function handlePayDeposit() {
    if (!booking || !user) {
      toast.error("Please sign in to continue.");
      return;
    }

    if (booking.depositPaid) {
      toast.success("Deposit already paid.");
      return;
    }

    if (!booking.quoteAmount || booking.status === "declined" || booking.status === "cancelled") {
      toast.error("This booking is not ready for deposit payment.");
      return;
    }

    setProcessingPayment(true);
    try {
      await startDepositCheckout({
        bookingId: booking.id,
        userId: user.uid,
        customerEmail: booking.email,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to start payment.";
      toast.error(message);
    } finally {
      setProcessingPayment(false);
    }
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
          <Link to="/client/bookings">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Booking Details</h1>
            <p className="text-gray-600 mt-1">Booking #{booking.id}</p>
          </div>
        </div>
        <Badge className={`${statusConfig[booking.status]} capitalize`}>{booking.status}</Badge>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Appointment Details */}
          <Card className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Appointment Details
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-600 mb-1">Date</p>
                <p className="font-medium text-gray-900">
                  {new Date(booking.preferredDate).toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Time</p>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 text-gray-400 mr-2" />
                  <p className="font-medium text-gray-900">{booking.preferredTime}</p>
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
                    ? "I Provide Hair"
                    : "Salon Provides Hair"}
                </Badge>
              </div>
            </div>
          </Card>

          {/* Your Stylist */}
          <Card className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <User className="w-5 h-5 mr-2" />
              Your Stylist
            </h2>
            <div className="flex items-center space-x-4">
              <img
                src="https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=100"
                alt={booking.stylistName || "Assigned stylist"}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <p className="font-semibold text-gray-900">
                  {booking.stylistName || "Stylist pending assignment"}
                </p>
                <div className="flex items-center mt-1">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500 mr-1" />
                  <span className="text-sm text-gray-500">Rating available after reviews.</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Your Notes */}
          <Card className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Your Notes</h2>
            <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{booking.notes || "No notes provided."}</p>
          </Card>

          {/* Actions */}
          <Card className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Manage Booking</h2>
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={handleReschedule}
                className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Reschedule
              </Button>
              {booking.status === "completed" && (
                <Link to="/client/reviews">
                  <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                    <Star className="w-4 h-4 mr-2" />
                    Leave Review
                  </Button>
                </Link>
              )}
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={updating || ["cancelled", "declined", "completed"].includes(booking.status)}
                className="border-red-300 text-red-600 hover:bg-red-50"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel Booking
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
              Your Reference
            </h2>
            {booking.imageUrl ? (
              <>
                <img
                  src={booking.imageUrl}
                  alt="Reference style"
                  className="w-full rounded-lg border border-gray-200"
                />
                <p className="text-sm text-gray-600 text-center mt-3">Your desired hairstyle</p>
              </>
            ) : (
              <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <ImageIcon className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">No reference image uploaded.</p>
              </div>
            )}
          </Card>

          {/* Payment Summary */}
          <Card className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <CreditCard className="w-5 h-5 mr-2" />
              Payment Summary
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Service Total</span>
                <span className="font-bold text-gray-900">£{booking.quoteAmount || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Deposit Paid</span>
                <Badge className={booking.depositPaid ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}>
                  {booking.depositPaid ? `£${booking.depositAmount}` : "Pending"}
                </Badge>
              </div>
              <div className="border-t border-gray-200 pt-3 flex items-center justify-between">
                <span className="font-semibold text-gray-900">Remaining Balance</span>
                <span className="text-2xl font-bold text-teal-600">£{remainingBalance}</span>
              </div>
              <Button
                onClick={() => void handlePayDeposit()}
                disabled={
                  processingPayment ||
                  booking.depositPaid ||
                  !booking.quoteAmount ||
                  ["declined", "cancelled"].includes(booking.status)
                }
                className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700"
              >
                {booking.depositPaid ? "Deposit Paid" : `Pay £${FIXED_DEPOSIT_GBP} Deposit`}
              </Button>
              <p className="text-xs text-gray-500 text-center">
                Deposit is required before booking is confirmed.
              </p>
            </div>
          </Card>

          {/* Policies */}
          <Card className="p-6 bg-blue-50 border-blue-200">
            <h3 className="font-bold text-gray-900 mb-2">Booking Policies</h3>
            <ul className="text-sm text-gray-700 space-y-2">
              <li>• Free cancellation up to 48 hours before</li>
              <li>• Deposit is non-refundable within 48 hours</li>
              <li>• Please arrive 10 minutes early</li>
              <li>• Bring your own hair if specified</li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
