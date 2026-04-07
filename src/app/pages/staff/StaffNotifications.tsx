import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import {
  ClipboardList,
  Calendar,
  AlertCircle,
  Trash2,
  CheckCircle,
  CheckCheck,
  MessageSquare,
} from "lucide-react";
import { toast } from "sonner";

interface Notification {
  id: string;
  type: "booking" | "reschedule" | "cancellation" | "message" | "alert";
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
    title: "New Booking Assigned",
    message: "You have been assigned a new booking with Jessica Brown for Ghana Weave on April 5th at 10:00 AM",
    time: "5 minutes ago",
    read: false,
    actionable: true,
  },
  {
    id: "2",
    type: "reschedule",
    title: "Reschedule Request",
    message: "Amara Okafor has requested to reschedule her appointment from April 6th to April 8th",
    time: "1 hour ago",
    read: false,
    actionable: true,
  },
  {
    id: "3",
    type: "message",
    title: "Client Message",
    message: "Zara Ahmed sent you a message about her upcoming appointment",
    time: "2 hours ago",
    read: true,
    actionable: true,
  },
  {
    id: "4",
    type: "alert",
    title: "Reminder: Tomorrow's Appointments",
    message: "You have 3 appointments scheduled for tomorrow. Please review your schedule.",
    time: "3 hours ago",
    read: true,
    actionable: false,
  },
  {
    id: "5",
    type: "cancellation",
    title: "Booking Cancelled",
    message: "Emma Thompson has cancelled her appointment scheduled for April 9th",
    time: "5 hours ago",
    read: true,
    actionable: false,
  },
];

const notificationIcons = {
  booking: { icon: ClipboardList, color: "text-purple-600", bgColor: "bg-purple-100" },
  reschedule: { icon: Calendar, color: "text-blue-600", bgColor: "bg-blue-100" },
  cancellation: { icon: AlertCircle, color: "text-red-600", bgColor: "bg-red-100" },
  message: { icon: MessageSquare, color: "text-green-600", bgColor: "bg-green-100" },
  alert: { icon: AlertCircle, color: "text-amber-600", bgColor: "bg-amber-100" },
};

export default function StaffNotifications() {
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
          <p className="text-gray-600 mt-1">Stay updated with your bookings and messages</p>
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
          <p className="text-3xl font-bold text-purple-600 mt-2">{unreadCount}</p>
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
            {
              mockNotifications.filter((n) => n.time.includes("ago") && !n.time.includes("day"))
                .length
            }
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
                !notification.read ? "bg-purple-50/50" : ""
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
                          <Badge className="bg-purple-500 text-white">New</Badge>
                        )}
                        {notification.actionable && (
                          <Badge variant="outline" className="border-purple-500 text-purple-700">
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
                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
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
