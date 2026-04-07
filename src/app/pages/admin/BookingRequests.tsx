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
import { Eye, Filter } from "lucide-react";
import { toast } from "sonner";
import { getAllBookings } from "../../firebase/firestore";
import type { Booking, BookingStatus } from "../../types/domain";

const statusConfig: Record<BookingStatus, { label: string; className: string }> = {
  pending: { label: "Pending", className: "bg-yellow-100 text-yellow-800" },
  quoted: { label: "Quoted", className: "bg-blue-100 text-blue-800" },
  confirmed: { label: "Confirmed", className: "bg-green-100 text-green-800" },
  declined: { label: "Declined", className: "bg-red-100 text-red-800" },
  completed: { label: "Completed", className: "bg-purple-100 text-purple-800" },
  cancelled: { label: "Cancelled", className: "bg-gray-100 text-gray-800" },
};

export default function BookingRequests() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<BookingStatus | "all">("all");

  useEffect(() => {
    async function loadBookings() {
      try {
        const rows = await getAllBookings();
        setBookings(rows);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to load bookings.";
        toast.error(message);
      } finally {
        setLoading(false);
      }
    }

    void loadBookings();
  }, []);

  const filteredBookings = useMemo(() => {
    if (filter === "all") {
      return bookings;
    }
    return bookings.filter((booking) => booking.status === filter);
  }, [bookings, filter]);

  const pendingCount = bookings.filter((booking) => booking.status === "pending").length;
  const quotedCount = bookings.filter((booking) => booking.status === "quoted").length;
  const confirmedCount = bookings.filter(
    (booking) => booking.status === "confirmed",
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Booking Requests</h1>
          <p className="text-gray-600 mt-1">
            Manage client booking requests and send quotes
          </p>
        </div>
        <Button className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700">
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
      </div>

      <Card className="p-4">
        <div className="flex space-x-2">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            onClick={() => setFilter("all")}
            className={filter === "all" ? "bg-gradient-to-r from-amber-600 to-orange-600" : ""}
          >
            All ({bookings.length})
          </Button>
          <Button
            variant={filter === "pending" ? "default" : "outline"}
            onClick={() => setFilter("pending")}
            className={filter === "pending" ? "bg-gradient-to-r from-amber-600 to-orange-600" : ""}
          >
            Pending ({pendingCount})
          </Button>
          <Button
            variant={filter === "quoted" ? "default" : "outline"}
            onClick={() => setFilter("quoted")}
            className={filter === "quoted" ? "bg-gradient-to-r from-amber-600 to-orange-600" : ""}
          >
            Quoted ({quotedCount})
          </Button>
          <Button
            variant={filter === "confirmed" ? "default" : "outline"}
            onClick={() => setFilter("confirmed")}
            className={filter === "confirmed" ? "bg-gradient-to-r from-amber-600 to-orange-600" : ""}
          >
            Confirmed ({confirmedCount})
          </Button>
        </div>
      </Card>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Client Name</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Requested Stylist</TableHead>
              <TableHead>Date/Time</TableHead>
              <TableHead>Hair Option</TableHead>
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
                  No bookings found for this filter.
                </TableCell>
              </TableRow>
            ) : (
              filteredBookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-medium">{booking.id}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-gray-900">{booking.clientName}</p>
                      <p className="text-sm text-gray-500">{booking.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{booking.service}</p>
                      {booking.size && booking.length && (
                        <p className="text-sm text-gray-500">
                          {booking.size} / {booking.length}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{booking.stylistName || "Not assigned"}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">
                        {new Date(booking.preferredDate).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-500">{booking.preferredTime}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {booking.hairProvided === "client"
                        ? "Client Provides"
                        : "Salon Provides"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={statusConfig[booking.status].className}>
                      {statusConfig[booking.status].label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Link to={`/admin/booking-requests/${booking.id}`}>
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
