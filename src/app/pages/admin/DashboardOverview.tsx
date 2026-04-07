import { Card } from "../../components/ui/card";
import {
  ClipboardList,
  DollarSign,
  Users,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

const stats = [
  {
    name: "Total Bookings",
    value: "48",
    change: "+12%",
    changeType: "increase",
    icon: ClipboardList,
    description: "This week",
  },
  {
    name: "Pending Requests",
    value: "12",
    change: "3 new",
    changeType: "neutral",
    icon: Clock,
    description: "Awaiting review",
  },
  {
    name: "Revenue",
    value: "£3,240",
    change: "+18%",
    changeType: "increase",
    icon: DollarSign,
    description: "This month",
  },
  {
    name: "Active Clients",
    value: "234",
    change: "+8%",
    changeType: "increase",
    icon: Users,
    description: "Total registered",
  },
];

const recentActivity = [
  {
    type: "booking",
    message: "New booking request from Sarah Johnson",
    time: "5 minutes ago",
    icon: ClipboardList,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  {
    type: "quote",
    message: "Quote sent to Marcus Williams for Knotless Braids",
    time: "1 hour ago",
    icon: DollarSign,
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  {
    type: "payment",
    message: "Deposit received from Emma Thompson - £15",
    time: "2 hours ago",
    icon: CheckCircle,
    color: "text-emerald-600",
    bgColor: "bg-emerald-100",
  },
  {
    type: "alert",
    message: "Stylist availability updated - Keisha Davis",
    time: "3 hours ago",
    icon: AlertCircle,
    color: "text-amber-600",
    bgColor: "bg-amber-100",
  },
  {
    type: "booking",
    message: "Booking confirmed for tomorrow at 2:00 PM",
    time: "4 hours ago",
    icon: CheckCircle,
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
];

const todayBookings = [
  {
    time: "10:00 AM",
    client: "Jessica Brown",
    service: "Ghana Weave",
    stylist: "Keisha Davis",
    status: "confirmed",
  },
  {
    time: "1:00 PM",
    client: "Amara Okafor",
    service: "Knotless Braids - Medium",
    stylist: "Tiana Richards",
    status: "confirmed",
  },
  {
    time: "3:30 PM",
    client: "Zara Ahmed",
    service: "Natural Hair Twists",
    stylist: "Keisha Davis",
    status: "pending",
  },
  {
    time: "5:00 PM",
    client: "Nia Williams",
    service: "Dread Retwist",
    stylist: "Jasmine Parker",
    status: "confirmed",
  },
];

export default function DashboardOverview() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here's what's happening today.</p>
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
                  <div className="flex items-center mt-2 space-x-2">
                    <span
                      className={`text-sm font-medium ${
                        stat.changeType === "increase" ? "text-green-600" : "text-gray-600"
                      }`}
                    >
                      {stat.change}
                    </span>
                    <span className="text-sm text-gray-500">{stat.description}</span>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-amber-400 to-orange-500 p-3 rounded-xl">
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => {
              const Icon = activity.icon;
              return (
                <div key={index} className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg ${activity.bgColor}`}>
                    <Icon className={`w-5 h-5 ${activity.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{activity.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Today's Bookings */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Today's Schedule</h2>
          <div className="space-y-4">
            {todayBookings.map((booking, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="text-center">
                    <p className="text-xs font-medium text-gray-500">TIME</p>
                    <p className="text-sm font-bold text-gray-900">{booking.time}</p>
                  </div>
                  <div className="border-l border-gray-300 pl-3">
                    <p className="text-sm font-medium text-gray-900">{booking.client}</p>
                    <p className="text-xs text-gray-600">{booking.service}</p>
                    <p className="text-xs text-gray-500">with {booking.stylist}</p>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 text-xs font-medium rounded-full ${
                    booking.status === "confirmed"
                      ? "bg-green-100 text-green-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {booking.status}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Quick Stats Bar */}
      <Card className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">8</p>
            <p className="text-sm text-gray-600 mt-1">Bookings Today</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">5</p>
            <p className="text-sm text-gray-600 mt-1">Active Stylists</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">95%</p>
            <p className="text-sm text-gray-600 mt-1">Satisfaction Rate</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">£420</p>
            <p className="text-sm text-gray-600 mt-1">Today's Revenue</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
