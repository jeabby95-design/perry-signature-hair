import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import {
  ClipboardList,
  DollarSign,
  CheckCircle,
  UserCheck,
  Calendar,
  AlertCircle,
  Trash2,
  CheckCheck,
} from "lucide-react";
import { toast } from "sonner";

interface Notification {
  id: string;
  type: "booking" | "quote" | "payment" | "stylist" | "calendar" | "alert";
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
    title: "New Booking Request",
    message: "Sarah Johnson requested Knotless Braids for April 5th at 10:00 AM",
    time: "5 minutes ago",
    read: false,
    actionable: true,
  },
  {
    id: "2",
    type: "payment",
    title: "Deposit Received",
    message: "Emma Thompson paid £15 deposit for Ghana Weave booking",
    time: "1 hour ago",
    read: false,
    actionable: false,
  },
  {
    id: "3",
    type: "quote",
    title: "Quote Accepted",
    message: "Amara Okafor accepted quote of £120 for Fulani Braids",
    time: "2 hours ago",
    read: true,
    actionable: true,
  },
  {
    id: "4",
    type: "stylist",
    title: "Stylist Availability Updated",
    message: "Keisha Davis added new availability slots for next week",
    time: "3 hours ago",
    read: true,
    actionable: false,
  },
  {
    id: "5",
    type: "calendar",
    title: "Booking Reminder",
    message: "Jessica Brown's appointment is scheduled for tomorrow at 10:00 AM",
    time: "4 hours ago",
    read: true,
    actionable: false,
  },
  {
    id: "6",
    type: "alert",
    title: "Low Inventory Alert",
    message: "Hair extension stock is running low for weave services",
    time: "5 hours ago",
    read: true,
    actionable: true,
  },
  {
    id: "7",
    type: "booking",
    title: "Booking Confirmed",
    message: "Nia Williams' booking for Dread Retwist is now confirmed",
    time: "6 hours ago",
    read: true,
    actionable: false,
  },
  {
    id: "8",
    type: "stylist",
    title: "New Review Received",
    message: "Tiana Richards received a 5-star review from Zara Ahmed",
    time: "1 day ago",
    read: true,
    actionable: false,
  },
];

const notificationIcons = {
  booking: { icon: ClipboardList, color: "text-blue-600", bgColor: "bg-blue-100" },
  quote: { icon: DollarSign, color: "text-green-600", bgColor: "bg-green-100" },
  payment: { icon: CheckCircle, color: "text-emerald-600", bgColor: "bg-emerald-100" },
  stylist: { icon: UserCheck, color: "text-purple-600", bgColor: "bg-purple-100" },
  calendar: { icon: Calendar, color: "text-amber-600", bgColor: "bg-amber-100" },
  alert: { icon: AlertCircle, color: "text-red-600", bgColor: "bg-red-100" },
};

export default function NotificationsPage() {
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
          <p className="text-gray-600 mt-1">
            Stay updated with booking requests, payments, and alerts
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={handleMarkAllAsRead}>
            <CheckCheck className="w-4 h-4 mr-2" />
            Mark All as Read
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card className="p-6">
          <p className="text-sm text-gray-600">Total Notifications</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{mockNotifications.length}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-gray-600">Unread</p>
          <p className="text-3xl font-bold text-amber-600 mt-2">{unreadCount}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-gray-600">Actionable</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {mockNotifications.filter((n) => n.actionable).length}
          </p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-gray-600">Today</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {mockNotifications.filter((n) => n.time.includes("ago") && !n.time.includes("day")).length}
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
                !notification.read ? "bg-amber-50/50" : ""
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
                          <Badge className="bg-amber-500 text-white">New</Badge>
                        )}
                        {notification.actionable && (
                          <Badge variant="outline" className="border-blue-500 text-blue-700">
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
                        className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
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

      {/* Empty State (hidden when notifications exist) */}
      {mockNotifications.length === 0 && (
        <Card className="p-12">
          <div className="text-center">
            <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">All caught up!</h3>
            <p className="text-gray-600">You have no new notifications</p>
          </div>
        </Card>
      )}
    </div>
  );
}
