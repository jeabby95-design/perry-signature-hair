import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { Card } from "../../components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Eye, CheckCircle, Calendar, X, Filter } from "lucide-react";
import { toast } from "sonner";
import { getBookingsForStaff, updateBookingStatus } from "../../firebase/firestore";
import { useAuth } from "../../firebase/auth-context";
import type { Booking, BookingStatus } from "../../types/domain";

const statusConfig: Record<BookingStatus, { label: string; className: string }> = {
  pending: { label: "Pending", className: "bg-amber-100 text-amber-800" },
  confirmed: { label: "Confirmed", className: "bg-green-100 text-green-800" },
  completed: { label: "Completed", className: "bg-blue-100 text-blue-800" },
  cancelled: { label: "Cancelled", className: "bg-red-100 text-red-800" },
  quoted: { label: "Quoted", className: "bg-purple-100 text-purple-800" },
  declined: { label: "Declined", className: "bg-gray-100 text-gray-800" },
};

export default function StaffBookings() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<BookingStatus | "all">("all");

  useEffect(() => {
    async function loadBookings() {
      if (!user) {
        return;
      }

      try {
        const rows = await getBookingsForStaff(user.uid);
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

  async function handleAccept(bookingId: string) {
    try {
      await updateBookingStatus(bookingId, "confirmed");
      setBookings((previous) =>
        previous.map((row) =>
          row.id === bookingId ? { ...row, status: "confirmed" } : row,
        ),
      );
      toast.success("Booking accepted.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to accept booking.";
      toast.error(message);
    }
  }

  async function handleReassign(bookingId: string) {
    try {
      await updateBookingStatus(bookingId, "pending");
      toast.success("Reassignment request recorded for admin review.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to request reassignment.";
      toast.error(message);
    }
  }

  const filteredBookings = useMemo(() => {
    if (filter === "all") {
      return bookings;
    }
    return bookings.filter((booking) => booking.status === filter);
  }, [bookings, filter]);

  const totalRevenue = useMemo(
    () => bookings.reduce((sum, booking) => sum + (booking.quoteAmount || 0), 0),
    [bookings],
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
          <p className="text-gray-600 mt-1">Manage your assigned appointments</p>
        </div>
        <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
      </div>

      <Card className="p-4">
        <div className="flex flex-wrap gap-2">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            onClick={() => setFilter("all")}
            className={filter === "all" ? "bg-gradient-to-r from-purple-600 to-pink-600" : ""}
          >
            All ({bookings.length})
          </Button>
          <Button
            variant={filter === "pending" ? "default" : "outline"}
            onClick={() => setFilter("pending")}
            className={filter === "pending" ? "bg-gradient-to-r from-purple-600 to-pink-600" : ""}
          >
            Pending ({bookings.filter((booking) => booking.status === "pending").length})
          </Button>
          <Button
            variant={filter === "confirmed" ? "default" : "outline"}
            onClick={() => setFilter("confirmed")}
            className={filter === "confirmed" ? "bg-gradient-to-r from-purple-600 to-pink-600" : ""}
          >
            Confirmed ({bookings.filter((booking) => booking.status === "confirmed").length})
          </Button>
          <Button
            variant={filter === "completed" ? "default" : "outline"}
            onClick={() => setFilter("completed")}
            className={filter === "completed" ? "bg-gradient-to-r from-purple-600 to-pink-600" : ""}
          >
            Completed ({bookings.filter((booking) => booking.status === "completed").length})
          </Button>
        </div>
      </Card>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Booking ID</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-gray-600">
                  Loading bookings...
                </TableCell>
              </TableRow>
            ) : filteredBookings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-gray-600">
                  No bookings found.
                </TableCell>
              </TableRow>
            ) : (
              filteredBookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-medium">{booking.id}</TableCell>
                  <TableCell className="font-medium text-gray-900">{booking.clientName}</TableCell>
                  <TableCell>{booking.service}</TableCell>
                  <TableCell>
                    {new Date(booking.preferredDate).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </TableCell>
                  <TableCell>{booking.preferredTime}</TableCell>
                  <TableCell className="font-medium">£{booking.quoteAmount || 0}</TableCell>
                  <TableCell>
                    <Badge className={statusConfig[booking.status].className}>
                      {statusConfig[booking.status].label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Link to={`/staff/bookings/${booking.id}`}>
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
                      {booking.status === "pending" && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => void handleAccept(booking.id)}
                            className="text-green-600 hover:text-green-700 hover:bg-green-50"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Calendar className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => void handleReassign(booking.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="p-6">
          <p className="text-sm text-gray-600">Total Bookings</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{bookings.length}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-gray-600">Pending Actions</p>
          <p className="text-3xl font-bold text-amber-600 mt-2">
            {bookings.filter((booking) => booking.status === "pending").length}
          </p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-gray-600">Total Revenue</p>
          <p className="text-3xl font-bold text-green-600 mt-2">£{totalRevenue}</p>
        </Card>
      </div>
    </div>
  );
}
