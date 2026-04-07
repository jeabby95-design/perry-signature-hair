import { useEffect, useMemo, useState } from "react";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import {
  Calendar,
  Gift,
  Image as ImageIcon,
  Clock,
  Star,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router";
import { toast } from "sonner";
import { useAuth } from "../../firebase/auth-context";
import { getBookingsForClient, getReviewsByClient } from "../../firebase/firestore";
import type { Booking, Review } from "../../types/domain";

function getTierName(points: number) {
  if (points >= 500) {
    return "Gold";
  }
  if (points >= 200) {
    return "Silver";
  }
  return "Bronze";
}

function formatRelativeDate(isoDate: string) {
  const timestamp = new Date(isoDate).getTime();
  const diffMs = Date.now() - timestamp;
  const oneDay = 24 * 60 * 60 * 1000;

  if (diffMs < oneDay) {
    return "Today";
  }

  const days = Math.floor(diffMs / oneDay);
  if (days < 7) {
    return `${days} day${days === 1 ? "" : "s"} ago`;
  }

  return new Date(isoDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export default function ClientOverview() {
  const { user, profile } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    async function loadDashboardData() {
      if (!user) {
        return;
      }

      try {
        const [bookingRows, reviewRows] = await Promise.all([
          getBookingsForClient(user.uid),
          getReviewsByClient(user.uid),
        ]);
        setBookings(bookingRows);
        setReviews(reviewRows);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unable to load dashboard data.";
        toast.error(message);
      }
    }

    void loadDashboardData();
  }, [user]);

  const currentPoints = profile?.points ?? 0;
  const currentTier = getTierName(currentPoints);

  const upcomingBooking = useMemo(() => {
    return bookings
      .filter((booking) => ["pending", "quoted", "confirmed"].includes(booking.status))
      .sort((a, b) => a.preferredDate.localeCompare(b.preferredDate))[0];
  }, [bookings]);

  const nextReward = useMemo(() => {
    if (currentPoints >= 500) {
      return { value: "Free Add-On", subtitle: "Available Now" };
    }
    if (currentPoints >= 200) {
      return { value: "£12 Off", subtitle: "Available Now" };
    }
    if (currentPoints >= 100) {
      return { value: "£5 Off", subtitle: "Available Now" };
    }
    return { value: "£5 Off", subtitle: `${100 - currentPoints} points to unlock` };
  }, [currentPoints]);

  const recentActivity = useMemo(() => {
    const bookingEvents = bookings.slice(0, 4).map((booking) => ({
      message:
        booking.status === "completed"
          ? `Completed booking: ${booking.service}`
          : `Booking ${booking.status}: ${booking.service}`,
      time: formatRelativeDate(booking.updatedAt),
    }));

    const reviewEvents = reviews.slice(0, 2).map((review) => ({
      message: `You left a ${review.rating}-star review`,
      time: formatRelativeDate(review.createdAt),
    }));

    return [...bookingEvents, ...reviewEvents].slice(0, 6);
  }, [bookings, reviews]);

  const totalBookings = bookings.length;
  const completedBookings = bookings.filter((booking) => booking.status === "completed").length;
  const progressWidth = Math.min(100, Math.round((currentPoints / 500) * 100));

  const stats = [
    {
      name: "Loyalty Points",
      value: String(currentPoints),
      subtitle: `${currentTier} Tier`,
      icon: Gift,
      color: "from-yellow-400 to-amber-500",
    },
    {
      name: "Next Reward",
      value: nextReward.value,
      subtitle: nextReward.subtitle,
      icon: Sparkles,
      color: "from-purple-400 to-pink-500",
    },
    {
      name: "Total Bookings",
      value: String(totalBookings),
      subtitle: "All-time requests",
      icon: Calendar,
      color: "from-teal-400 to-cyan-500",
    },
    {
      name: "Completed",
      value: String(completedBookings),
      subtitle: "Finished appointments",
      icon: ImageIcon,
      color: "from-blue-400 to-indigo-500",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <Card className="p-6 bg-gradient-to-r from-teal-600 to-cyan-600 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, {profile?.fullName || "Client"}! 👋</h1>
            <p className="text-teal-100 mt-2">
              You are a {currentTier} member with rewards waiting for you
            </p>
          </div>
          <div className="hidden md:block">
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 text-center">
              <p className="text-sm text-teal-100">Your Points</p>
              <p className="text-4xl font-bold mt-1">{currentPoints}</p>
              <Badge className="mt-2 bg-yellow-500 text-yellow-900 border-0">
                {currentTier} Tier
              </Badge>
            </div>
          </div>
        </div>
      </Card>

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
                  <p className="text-sm text-gray-500 mt-1">{stat.subtitle}</p>
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
        {/* Upcoming Booking */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Upcoming Appointment</h2>
            <Badge className="bg-green-100 text-green-700 capitalize">
              {upcomingBooking?.status || "No booking"}
            </Badge>
          </div>
          {upcomingBooking ? (
            <>
              <div className="flex space-x-4">
                <img
                  src={upcomingBooking.imageUrl || "https://images.unsplash.com/photo-1723541622232-a71e59b7adf2?w=200"}
                  alt={upcomingBooking.service}
                  className="w-24 h-24 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 text-lg">{upcomingBooking.service}</h3>
                  <p className="text-gray-600 mt-1">
                    with {upcomingBooking.stylistName || "Pending assignment"}
                  </p>
                  <div className="flex items-center space-x-4 mt-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(upcomingBooking.preferredDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="w-4 h-4 mr-1" />
                      {upcomingBooking.preferredTime}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex space-x-3 mt-4 pt-4 border-t border-gray-200">
                <Button variant="outline" className="flex-1">
                  Reschedule
                </Button>
                <Link to={`/client/bookings/${upcomingBooking.id}`} className="flex-1">
                  <Button className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700">
                    View Details
                  </Button>
                </Link>
              </div>
            </>
          ) : (
            <div className="text-gray-600">No upcoming bookings yet. Use Book Now to create one.</div>
          )}
        </Card>

        {/* Quick Actions */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <Link to="/#book">
              <Button className="w-full h-20 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700">
                <div className="flex flex-col items-center">
                  <Calendar className="w-6 h-6 mb-1" />
                  <span className="text-sm">Book Now</span>
                </div>
              </Button>
            </Link>
            <Link to="/client/loyalty">
              <Button
                variant="outline"
                className="w-full h-20 border-2 border-teal-600 text-teal-700 hover:bg-teal-50"
              >
                <div className="flex flex-col items-center">
                  <Gift className="w-6 h-6 mb-1" />
                  <span className="text-sm">Redeem Points</span>
                </div>
              </Button>
            </Link>
            <Link to="/client/gallery">
              <Button variant="outline" className="w-full h-20">
                <div className="flex flex-col items-center">
                  <ImageIcon className="w-6 h-6 mb-1" />
                  <span className="text-sm">View Gallery</span>
                </div>
              </Button>
            </Link>
            <Link to="/client/saved-styles">
              <Button variant="outline" className="w-full h-20">
                <div className="flex flex-col items-center">
                  <Star className="w-6 h-6 mb-1" />
                  <span className="text-sm">Saved Styles</span>
                </div>
              </Button>
            </Link>
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-3">
          {recentActivity.map((activity, idx) => (
            <div
              key={`${activity.message}-${activity.time}`}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`w-2 h-2 rounded-full ${
                    idx === 0 ? "bg-teal-500" : "bg-gray-400"
                  }`}
                />
                <p className="text-gray-900">{activity.message}</p>
              </div>
              <span className="text-sm text-gray-500">{activity.time}</span>
            </div>
          ))}
          {recentActivity.length === 0 && (
            <div className="p-3 bg-gray-50 rounded-lg text-gray-600">No recent activity yet.</div>
          )}
        </div>
      </Card>

      {/* Loyalty Progress */}
      <Card className="p-6 bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">Loyalty Progress</h3>
          <Badge className="bg-yellow-500 text-yellow-900">{currentTier} Tier</Badge>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-700">Current Points</span>
            <span className="font-bold text-gray-900">{currentPoints} points</span>
          </div>
          <div className="w-full bg-yellow-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-yellow-500 to-amber-500 h-3 rounded-full"
              style={{ width: `${progressWidth}%` }}
            />
          </div>
          <p className="text-sm text-gray-600">
            {currentTier === "Gold"
              ? "You are in the top tier. Keep enjoying exclusive benefits."
              : "Keep earning points to unlock higher tier discounts."}
          </p>
        </div>
      </Card>
    </div>
  );
}
