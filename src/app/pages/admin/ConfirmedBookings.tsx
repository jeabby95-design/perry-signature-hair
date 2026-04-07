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
import { Eye, Calendar, X, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface ConfirmedBooking {
  id: string;
  clientName: string;
  service: string;
  stylist: string;
  date: string;
  time: string;
  depositPaid: boolean;
  amount: number;
}

const mockBookings: ConfirmedBooking[] = [
  {
    id: "CB001",
    clientName: "Jessica Brown",
    service: "Ghana Weave",
    stylist: "Keisha Davis",
    date: "2026-04-05",
    time: "10:00 AM",
    depositPaid: true,
    amount: 85,
  },
  {
    id: "CB002",
    clientName: "Amara Okafor",
    service: "Knotless Braids - Medium",
    stylist: "Tiana Richards",
    date: "2026-04-06",
    time: "1:00 PM",
    depositPaid: true,
    amount: 120,
  },
  {
    id: "CB003",
    clientName: "Nia Williams",
    service: "Dread Retwist",
    stylist: "Jasmine Parker",
    date: "2026-04-07",
    time: "5:00 PM",
    depositPaid: true,
    amount: 65,
  },
  {
    id: "CB004",
    clientName: "Zara Ahmed",
    service: "Natural Hair Twists",
    stylist: "Keisha Davis",
    date: "2026-04-08",
    time: "3:30 PM",
    depositPaid: false,
    amount: 75,
  },
  {
    id: "CB005",
    clientName: "Emma Thompson",
    service: "Fulani Braids",
    stylist: "Tiana Richards",
    date: "2026-04-09",
    time: "11:00 AM",
    depositPaid: true,
    amount: 95,
  },
  {
    id: "CB006",
    clientName: "Maya Johnson",
    service: "Traditional Braids - Large",
    stylist: "Jasmine Parker",
    date: "2026-04-10",
    time: "2:00 PM",
    depositPaid: true,
    amount: 80,
  },
];

export default function ConfirmedBookings() {
  const handleReschedule = (booking: ConfirmedBooking) => {
    toast.success(`Opening reschedule dialog for ${booking.clientName}`);
  };

  const handleCancel = (booking: ConfirmedBooking) => {
    toast.error(`Booking cancelled for ${booking.clientName}`);
  };

  const totalRevenue = mockBookings.reduce((sum, b) => sum + b.amount, 0);
  const paidDeposits = mockBookings.filter(b => b.depositPaid).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Confirmed Bookings</h1>
          <p className="text-gray-600 mt-1">Manage upcoming appointments</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card className="p-6">
          <p className="text-sm text-gray-600">Total Bookings</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{mockBookings.length}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-gray-600">Deposits Paid</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{paidDeposits}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-gray-600">Pending Deposits</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {mockBookings.length - paidDeposits}
          </p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-gray-600">Total Revenue</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">£{totalRevenue}</p>
        </Card>
      </div>

      {/* Bookings Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Booking ID</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Stylist</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Deposit</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockBookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell className="font-medium">{booking.id}</TableCell>
                <TableCell className="font-medium text-gray-900">
                  {booking.clientName}
                </TableCell>
                <TableCell>{booking.service}</TableCell>
                <TableCell>{booking.stylist}</TableCell>
                <TableCell>
                  {new Date(booking.date).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </TableCell>
                <TableCell>{booking.time}</TableCell>
                <TableCell className="font-medium">£{booking.amount}</TableCell>
                <TableCell>
                  {booking.depositPaid ? (
                    <Badge className="bg-green-100 text-green-700">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Paid
                    </Badge>
                  ) : (
                    <Badge className="bg-red-100 text-red-700">Pending</Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleReschedule(booking)}
                    >
                      <Calendar className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCancel(booking)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
