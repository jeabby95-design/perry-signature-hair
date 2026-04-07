import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import {
  Calendar,
  Gift,
  Star,
  AlertCircle,
  Trash2,
  CheckCircle,
  CheckCheck,
} from "lucide-react";
import { toast } from "sonner";

interface Notification {
  id: string;
  type: "booking" | "reward" | "review" | "reminder" | "alert";
  title: string;
  message: string;
  time: string;
  read: boolean;
  actionable: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "booking",
    title: "Booking Confirmed",
    message: "Your appointment for Knotless Braids with Keisha Davis on April 5th at 10:00 AM has been confirmed.",
    time: "2 days ago",
    read: false,
    actionable: true,
  },
  {
    id: "2",
    type: "reward",
    title: "New Reward Available",
    message: "Congratulations! You've unlocked a £12 Off reward. Redeem it on your next booking.",
    time: "3 days ago",
    read: false,
    actionable: true,
  },
  {
    id: "3",
    type: "reminder",
    title: "Appointment Reminder",
    message: "Your appointment with Keisha Davis is coming up in 2 days (April 5th at 10:00 AM).",
    time: "5 days ago",
    read: true,
    actionable: false,
  },
  {
    id: "4",
    type: "review",
    title: "Review Request",
    message: "How was your recent appointment? Share your experience and help others.",
    time: "1 week ago",
    read: true,
    actionable: true,
  },
  {
    id: "5",
    type: "alert",
    title: "Points Earned",
    message: "You've earned 120 loyalty points from your recent booking!",
    time: "1 week ago",
    read: true,
    actionable: false,
  },
];

const notificationIcons = {
  booking: { icon: Calendar, color: "text-teal-600", bgColor: "bg-teal-100" },
  reward: { icon: Gift, color: "text-purple-600", bgColor: "bg-purple-100" },
  review: { icon: Star, color: "text-amber-600", bgColor: "bg-amber-100" },
  reminder: { icon: AlertCircle, color: "text-blue-600", bgColor: "bg-blue-100" },
  alert: { icon: CheckCircle, color: "text-green-600", bgColor: "bg-green-100" },
};

export default function ClientNotifications() {
  const handleMarkAsRead = (notificationId: string) => {
    toast.success("Marked as read");
  };

  const handleDelete = (notificationId: string) => {
    toast.error("Notification deleted");
  };

  const handleMarkAllAsRead = () => {
    toast.success("All notifications marked as read");
  };

  const unreadCount = mockNotifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600 mt-1">Stay updated with your bookings and rewards</p>
        </div>
        <Button variant="outline" onClick={handleMarkAllAsRead}>
          <CheckCheck className="w-4 h-4 mr-2" />
          Mark All as Read
        </Button>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card className="p-6">
          <p className="text-sm text-gray-600">Total</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{mockNotifications.length}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-gray-600">Unread</p>
          <p className="text-3xl font-bold text-teal-600 mt-2">{unreadCount}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-gray-600">Actionable</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {mockNotifications.filter((n) => n.actionable).length}
          </p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-gray-600">This Week</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {mockNotifications.filter((n) => n.time.includes("days") || n.time.includes("hours")).length}
          </p>
        </Card>
      </div>

      {/* Notifications List */}
      <Card className="divide-y divide-gray-200">
        {mockNotifications.map((notification) => {
          const iconConfig = notificationIcons[notification.type];
          const Icon = iconConfig.icon;

          return (
            <div
              key={notification.id}
              className={`p-6 hover:bg-gray-50 transition-colors ${
                !notification.read ? "bg-teal-50/50" : ""
              }`}
            >
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-xl ${iconConfig.bgColor}`}>
                  <Icon className={`w-6 h-6 ${iconConfig.color}`} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-1">
                        <h3 className="font-semibold text-gray-900">{notification.title}</h3>
                        {!notification.read && (
                          <Badge className="bg-teal-500 text-white">New</Badge>
                        )}
                        {notification.actionable && (
                          <Badge variant="outline" className="border-teal-500 text-teal-700">
                            Action Required
                          </Badge>
                        )}
                      </div>
                      <p className="text-gray-700 mb-2">{notification.message}</p>
                      <p className="text-sm text-gray-500">{notification.time}</p>
                    </div>

                    <div className="flex space-x-2 ml-4">
                      {!notification.read && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleMarkAsRead(notification.id)}
                        >
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(notification.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {notification.actionable && (
                    <div className="mt-3 flex space-x-2">
                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700"
                      >
                        View Details
                      </Button>
                      <Button size="sm" variant="outline">
                        Dismiss
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </Card>

      {/* Empty State */}
      {mockNotifications.length === 0 && (
        <Card className="p-12">
          <div className="text-center">
            <CheckCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">All caught up!</h3>
            <p className="text-gray-600">You have no new notifications</p>
          </div>
        </Card>
      )}
    </div>
  );
}
