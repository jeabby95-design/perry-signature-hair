import { useState } from "react";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock } from "lucide-react";

interface Booking {
  id: string;
  clientName: string;
  service: string;
  stylist: string;
  time: string;
  duration: number;
  status: "confirmed" | "pending";
}

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const timeSlots = [
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
  "6:00 PM",
  "7:00 PM",
];

const mockBookings: Booking[] = [
  {
    id: "1",
    clientName: "Jessica Brown",
    service: "Ghana Weave",
    stylist: "Keisha Davis",
    time: "10:00 AM",
    duration: 3,
    status: "confirmed",
  },
  {
    id: "2",
    clientName: "Amara Okafor",
    service: "Knotless Braids",
    stylist: "Tiana Richards",
    time: "1:00 PM",
    duration: 4,
    status: "confirmed",
  },
  {
    id: "3",
    clientName: "Nia Williams",
    service: "Dread Retwist",
    stylist: "Jasmine Parker",
    time: "3:00 PM",
    duration: 2,
    status: "pending",
  },
];

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 3, 3)); // April 3, 2026
  const [view, setView] = useState<"week" | "day">("week");

  const getWeekDates = () => {
    const dates = [];
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());

    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const weekDates = getWeekDates();

  const navigateWeek = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (direction === "next" ? 7 : -7));
    setCurrentDate(newDate);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Calendar</h1>
          <p className="text-gray-600 mt-1">Manage appointments and stylist schedules</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant={view === "week" ? "default" : "outline"}
            onClick={() => setView("week")}
            className={view === "week" ? "bg-gradient-to-r from-amber-600 to-orange-600" : ""}
          >
            Week View
          </Button>
          <Button
            variant={view === "day" ? "default" : "outline"}
            onClick={() => setView("day")}
            className={view === "day" ? "bg-gradient-to-r from-amber-600 to-orange-600" : ""}
          >
            Day View
          </Button>
        </div>
      </div>

      {/* Calendar Navigation */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <Button variant="outline" size="sm" onClick={() => navigateWeek("prev")}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-900">
              {currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Week of {weekDates[0].toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => navigateWeek("next")}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </Card>

      {/* Weekly Calendar Grid */}
      {view === "week" && (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <div className="min-w-[900px]">
              {/* Days Header */}
              <div className="grid grid-cols-8 border-b border-gray-200">
                <div className="p-4 bg-gray-50 border-r border-gray-200">
                  <Clock className="w-5 h-5 text-gray-400" />
                </div>
                {weekDates.map((date, idx) => {
                  const isToday = date.toDateString() === new Date().toDateString();
                  return (
                    <div
                      key={idx}
                      className={`p-4 text-center border-r border-gray-200 ${
                        isToday ? "bg-amber-50" : "bg-gray-50"
                      }`}
                    >
                      <p className="text-sm font-medium text-gray-600">
                        {daysOfWeek[date.getDay()]}
                      </p>
                      <p
                        className={`text-2xl font-bold mt-1 ${
                          isToday ? "text-amber-600" : "text-gray-900"
                        }`}
                      >
                        {date.getDate()}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Time Slots */}
              {timeSlots.map((time, timeIdx) => (
                <div key={timeIdx} className="grid grid-cols-8 border-b border-gray-200">
                  <div className="p-4 bg-gray-50 border-r border-gray-200 text-sm text-gray-600">
                    {time}
                  </div>
                  {weekDates.map((date, dateIdx) => {
                    const isToday = date.toDateString() === new Date().toDateString();
                    const isFriday = date.getDay() === 5 && time === "10:00 AM";
                    const booking = isFriday ? mockBookings[0] : null;

                    return (
                      <div
                        key={dateIdx}
                        className={`p-2 border-r border-gray-200 min-h-[80px] ${
                          isToday ? "bg-amber-50/30" : ""
                        }`}
                      >
                        {booking && (
                          <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white p-2 rounded-lg text-xs">
                            <p className="font-semibold">{booking.clientName}</p>
                            <p className="opacity-90">{booking.service}</p>
                            <p className="opacity-75 mt-1">{booking.stylist}</p>
                            <Badge className="mt-1 bg-white/20 text-white border-white/30">
                              {booking.duration}h
                            </Badge>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Today's Bookings List */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <CalendarIcon className="w-5 h-5 mr-2" />
          Today's Bookings
        </h2>
        <div className="space-y-3">
          {mockBookings.map((booking) => (
            <div
              key={booking.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className="text-center min-w-[80px]">
                  <p className="text-sm font-medium text-gray-500">TIME</p>
                  <p className="text-lg font-bold text-gray-900">{booking.time}</p>
                </div>
                <div className="border-l border-gray-300 pl-4">
                  <p className="font-semibold text-gray-900">{booking.clientName}</p>
                  <p className="text-sm text-gray-600">{booking.service}</p>
                  <p className="text-xs text-gray-500 mt-1">with {booking.stylist}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Badge
                  className={
                    booking.status === "confirmed"
                      ? "bg-green-100 text-green-700"
                      : "bg-amber-100 text-amber-700"
                  }
                >
                  {booking.status}
                </Badge>
                <Badge variant="outline">{booking.duration}h</Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Stylist Availability Summary */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Stylist Availability</h2>
        <div className="grid md:grid-cols-4 gap-4">
          {["Keisha Davis", "Tiana Richards", "Jasmine Parker", "Nia Johnson"].map(
            (stylist, idx) => (
              <div key={idx} className="p-4 bg-gray-50 rounded-lg">
                <p className="font-medium text-gray-900">{stylist}</p>
                <p className="text-sm text-green-600 mt-1">Available today</p>
                <p className="text-xs text-gray-500 mt-2">3 slots remaining</p>
              </div>
            )
          )}
        </div>
      </Card>
    </div>
  );
}
