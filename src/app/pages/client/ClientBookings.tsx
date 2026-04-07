import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Calendar, Clock, Eye, RotateCcw, X, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { getBookingsForClient, updateBookingStatus } from "../../firebase/firestore";
import { useAuth } from "../../firebase/auth-context";
import type { Booking, BookingStatus } from "../../types/domain";

const statusConfig = {
  pending: { label: "Pending", className: "bg-amber-100 text-amber-800" },
  confirmed: { label: "Confirmed", className: "bg-green-100 text-green-800" },
  completed: { label: "Completed", className: "bg-blue-100 text-blue-800" },
  cancelled: { label: "Cancelled", className: "bg-red-100 text-red-800" },
  quoted: { label: "Quoted", className: "bg-purple-100 text-purple-800" },
  declined: { label: "Declined", className: "bg-gray-100 text-gray-800" },
};

const fallbackImage =
  "https://images.unsplash.com/photo-1723541622232-a71e59b7adf2?w=100";

const nonPaymentBadgeStatuses: BookingStatus[] = ["cancelled", "declined"];

export default function ClientBookings() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBookings() {
      if (!user) {
        return;
      }

      try {
        const rows = await getBookingsForClient(user.uid);
        setBookings(rows);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unable to load bookings.";
        toast.error(message);
      } finally {
        setLoading(false);
      }
    }

    void loadBookings();
  }, [user]);

  const upcomingBookings = useMemo(
    () => bookings.filter((booking) => ["pending", "quoted", "confirmed"].includes(booking.status)),
    [bookings],
  );

  const pastBookings = useMemo(
    () => bookings.filter((booking) => booking.status === "completed"),
    [bookings],
  );

  const cancelledBookings = useMemo(
    () => bookings.filter((booking) => ["cancelled", "declined"].includes(booking.status)),
    [bookings],
  );

  async function handleCancel(bookingId: string) {
    try {
      await updateBookingStatus(bookingId, "cancelled");
      setBookings((previous) =>
        previous.map((booking) =>
          booking.id === bookingId ? { ...booking, status: "cancelled" } : booking,
        ),
      );
      toast.success("Booking cancelled.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to cancel booking.";
      toast.error(message);
    }
  }

  const BookingCard = ({
    booking,
    showActions,
  }: {
    booking: Booking;
    showActions: "upcoming" | "past" | "cancelled";
  }) => (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex space-x-4">
        <img
          src={booking.imageUrl || fallbackImage}
          alt={booking.service}
          className="w-20 h-20 rounded-lg object-cover"
        />
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">{booking.service}</h3>
              <p className="text-sm text-gray-600 mt-1">
                with {booking.stylistName || "Pending assignment"}
              </p>
              <div className="flex items-center space-x-4 mt-2">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="w-4 h-4 mr-1" />
                  {new Date(booking.preferredDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="w-4 h-4 mr-1" />
                  {booking.preferredTime}
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-gray-900">£{booking.quoteAmount || 0}</p>
              <Badge className={`mt-2 ${statusConfig[booking.status].className}`}>
                {statusConfig[booking.status].label}
              </Badge>
              {!nonPaymentBadgeStatuses.includes(booking.status) && (
                <div className="mt-2">
                  {booking.depositPaid ? (
                    <Badge className="bg-green-100 text-green-700">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Deposit Paid
                    </Badge>
                  ) : (
                    <Badge className="bg-red-100 text-red-700">Deposit Pending</Badge>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="flex space-x-2 mt-4">
            <Link to={`/client/bookings/${booking.id}`}>
              <Button variant="outline" size="sm">
                <Eye className="w-4 h-4 mr-1" />
                View Details
              </Button>
            </Link>
            {showActions === "upcoming" && (
              <>
                <Button variant="outline" size="sm">
                  <Calendar className="w-4 h-4 mr-1" />
                  Reschedule
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => void handleCancel(booking.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <X className="w-4 h-4 mr-1" />
                  Cancel
                </Button>
              </>
            )}
            {showActions === "past" && (
              <Link to="/#book">
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700"
                >
                  <RotateCcw className="w-4 h-4 mr-1" />
                  Rebook
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </Card>
  );

  const totalSpent = bookings.reduce((sum, booking) => sum + (booking.quoteAmount || 0), 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
        <p className="text-gray-600 mt-1">View and manage your appointments</p>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        <Card className="p-6">
          <p className="text-sm text-gray-600">Upcoming</p>
          <p className="text-3xl font-bold text-teal-600 mt-2">{upcomingBookings.length}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-gray-600">Completed</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{pastBookings.length}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-gray-600">Cancelled</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{cancelledBookings.length}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-gray-600">Total Spent</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">£{totalSpent}</p>
        </Card>
      </div>

      <Tabs defaultValue="upcoming" className="space-y-6">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming ({upcomingBookings.length})</TabsTrigger>
          <TabsTrigger value="past">Past ({pastBookings.length})</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled ({cancelledBookings.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          {loading ? (
            <Card className="p-6 text-gray-600">Loading bookings...</Card>
          ) : upcomingBookings.length === 0 ? (
            <Card className="p-12">
              <div className="text-center">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No upcoming bookings</h3>
                <p className="text-gray-600 mb-4">Ready to book your next appointment?</p>
                <Link to="/#book">
                  <Button className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700">
                    Book Now
                  </Button>
                </Link>
              </div>
            </Card>
          ) : (
            upcomingBookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} showActions="upcoming" />
            ))
          )}
        </TabsContent>

        <TabsContent value="past" className="space-y-4">
          {pastBookings.map((booking) => (
            <BookingCard key={booking.id} booking={booking} showActions="past" />
          ))}
        </TabsContent>

        <TabsContent value="cancelled" className="space-y-4">
          {cancelledBookings.map((booking) => (
            <BookingCard key={booking.id} booking={booking} showActions="cancelled" />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
