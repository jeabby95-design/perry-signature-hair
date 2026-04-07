import { Card } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import {
  Calendar,
  Clock,
  CheckCircle,
  DollarSign,
  TrendingUp,
  Star,
} from "lucide-react";

const todayBookings = [
  {
    id: "1",
    time: "10:00 AM",
    client: "Jessica Brown",
    service: "Ghana Weave",
    duration: "3 hours",
    status: "confirmed",
    amount: 85,
  },
  {
    id: "2",
    time: "2:00 PM",
    client: "Amara Okafor",
    service: "Knotless Braids - Medium",
    duration: "4 hours",
    status: "confirmed",
    amount: 120,
  },
  {
    id: "3",
    time: "7:00 PM",
    client: "Zara Ahmed",
    service: "Natural Hair Twists",
    duration: "2 hours",
    status: "pending",
    amount: 75,
  },
];

const upcomingBookings = [
  {
    date: "Tomorrow",
    client: "Sarah Johnson",
    service: "Knotless Braids",
    time: "11:00 AM",
  },
  {
    date: "Sat, Apr 5",
    client: "Emma Thompson",
    service: "Fulani Braids",
    time: "9:00 AM",
  },
  {
    date: "Mon, Apr 7",
    client: "Nia Williams",
    service: "Dread Retwist",
    time: "3:00 PM",
  },
];

const stats = [
  {
    name: "Today's Bookings",
    value: "3",
    icon: Calendar,
    color: "from-purple-400 to-pink-500",
  },
  {
    name: "This Week",
    value: "12",
    icon: CheckCircle,
    color: "from-blue-400 to-cyan-500",
  },
  {
    name: "Earnings (Month)",
    value: "£2,340",
    icon: DollarSign,
    color: "from-green-400 to-emerald-500",
  },
  {
    name: "Rating",
    value: "4.9",
    icon: Star,
    color: "from-amber-400 to-orange-500",
  },
];

export default function StaffDashboard() {
  const todayEarnings = todayBookings.reduce((sum, b) => sum + b.amount, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Schedule</h1>
        <p className="text-gray-600 mt-1">
          Welcome back, Keisha! Here's your schedule for today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.name} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <div className={`bg-gradient-to-br ${stat.color} p-3 rounded-xl`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Today's Appointments */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Today's Appointments</h2>
            <Badge className="bg-purple-100 text-purple-700">
              {todayBookings.length} bookings
            </Badge>
          </div>
          <div className="space-y-4">
            {todayBookings.map((booking) => (
              <div
                key={booking.id}
                className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100 rounded-lg"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="text-center min-w-[70px]">
                      <Clock className="w-4 h-4 text-purple-600 mx-auto mb-1" />
                      <p className="text-sm font-bold text-gray-900">{booking.time}</p>
                      <p className="text-xs text-gray-600">{booking.duration}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{booking.client}</p>
                      <p className="text-sm text-gray-600">{booking.service}</p>
                      <p className="text-sm font-medium text-green-600 mt-1">£{booking.amount}</p>
                    </div>
                  </div>
                  <Badge
                    className={
                      booking.status === "confirmed"
                        ? "bg-green-100 text-green-700"
                        : "bg-amber-100 text-amber-700"
                    }
                  >
                    {booking.status}
                  </Badge>
                </div>
                {booking.status === "pending" && (
                  <div className="flex space-x-2 mt-3">
                    <Button size="sm" className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600">
                      Accept
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      Reschedule
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <p className="font-medium text-gray-900">Today's Total</p>
              <p className="text-2xl font-bold text-green-600">£{todayEarnings}</p>
            </div>
          </div>
        </Card>

        {/* Upcoming Bookings */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Upcoming Bookings</h2>
          <div className="space-y-3">
            {upcomingBookings.map((booking, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div>
                  <p className="font-semibold text-gray-900">{booking.client}</p>
                  <p className="text-sm text-gray-600">{booking.service}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{booking.date}</p>
                  <p className="text-sm text-gray-600">{booking.time}</p>
                </div>
              </div>
            ))}
          </div>
          <Button variant="outline" className="w-full mt-4">
            View All Bookings
          </Button>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
            <Calendar className="w-5 h-5 mr-2" />
            Manage Availability
          </Button>
          <Button variant="outline">
            <CheckCircle className="w-5 h-5 mr-2" />
            View All Bookings
          </Button>
          <Button variant="outline">
            <TrendingUp className="w-5 h-5 mr-2" />
            View Earnings
          </Button>
        </div>
      </Card>
    </div>
  );
}
