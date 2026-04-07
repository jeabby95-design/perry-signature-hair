import { useEffect, useMemo, useState } from "react";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Switch } from "../../components/ui/switch";
import { Label } from "../../components/ui/label";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  Clock,
  Calendar as CalendarIcon,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../../firebase/auth-context";
import {
  getUserProfileById,
  updateStaffAvailability,
} from "../../firebase/firestore";
import type { AvailabilityDay, BlockedDate } from "../../types/domain";

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const defaultAvailability: AvailabilityDay[] = [
  { day: "Monday", enabled: true, start: "9:00 AM", end: "7:00 PM" },
  { day: "Tuesday", enabled: true, start: "9:00 AM", end: "7:00 PM" },
  { day: "Wednesday", enabled: true, start: "9:00 AM", end: "7:00 PM" },
  { day: "Thursday", enabled: true, start: "9:00 AM", end: "7:00 PM" },
  { day: "Friday", enabled: true, start: "9:00 AM", end: "7:00 PM" },
  { day: "Saturday", enabled: true, start: "8:00 AM", end: "8:00 PM" },
  { day: "Sunday", enabled: true, start: "10:00 AM", end: "6:00 PM" },
];

export default function StaffAvailability() {
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date(2026, 3, 3));
  const [availability, setAvailability] = useState<AvailabilityDay[]>(defaultAvailability);
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadAvailability() {
      if (!user) {
        return;
      }

      try {
        const profile = await getUserProfileById(user.uid);
        if (!profile) {
          return;
        }

        setAvailability(profile.availability?.length ? profile.availability : defaultAvailability);
        setBlockedDates(profile.blockedDates || []);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Unable to load availability.";
        toast.error(message);
      }
    }

    void loadAvailability();
  }, [user]);

  const weekDates = useMemo(() => {
    const dates: Date[] = [];
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());

    for (let index = 0; index < 7; index += 1) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + index);
      dates.push(date);
    }

    return dates;
  }, [currentDate]);

  function navigateWeek(direction: "prev" | "next") {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (direction === "next" ? 7 : -7));
    setCurrentDate(newDate);
  }

  function handleToggleDay(index: number) {
    setAvailability((previous) => {
      const updated = [...previous];
      const day = updated[index];
      updated[index] = { ...day, enabled: !day.enabled };
      toast.success(`${day.day} ${updated[index].enabled ? "enabled" : "disabled"}`);
      return updated;
    });
  }

  async function handleSaveAvailability() {
    if (!user) {
      return;
    }

    setSaving(true);
    try {
      await updateStaffAvailability(user.uid, availability, blockedDates);
      toast.success("Availability updated successfully.");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to save availability.";
      toast.error(message);
    } finally {
      setSaving(false);
    }
  }

  function handleAddBlockedDate() {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 1);
    const dateValue = targetDate.toISOString().split("T")[0];

    setBlockedDates((previous) => {
      if (previous.some((entry) => entry.date === dateValue)) {
        toast.error("Date already blocked.");
        return previous;
      }
      return [...previous, { date: dateValue, reason: "Unavailable" }];
    });
  }

  function handleRemoveBlockedDate(dateValue: string) {
    setBlockedDates((previous) => previous.filter((entry) => entry.date !== dateValue));
    toast.success(`Removed blocked date: ${dateValue}`);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Manage Availability</h1>
        <p className="text-gray-600 mt-1">Set your working hours and block off dates</p>
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Weekly Schedule</h2>
        <div className="space-y-4">
          {availability.map((day, index) => (
            <div
              key={day.day}
              className={`flex items-center justify-between p-4 border rounded-lg ${
                day.enabled ? "border-purple-200 bg-purple-50" : "border-gray-200 bg-gray-50"
              }`}
            >
              <div className="flex items-center space-x-4 flex-1">
                <div className="w-32">
                  <Label className="font-semibold text-gray-900">{day.day}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-700">
                    {day.start} - {day.end}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Switch checked={day.enabled} onCheckedChange={() => handleToggleDay(index)} />
              </div>
            </div>
          ))}
        </div>
        <Button
          onClick={() => void handleSaveAvailability()}
          disabled={saving}
          className="mt-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
        >
          {saving ? "Saving..." : "Save Availability"}
        </Button>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Calendar View</h2>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm" onClick={() => navigateWeek("prev")}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <div className="text-center min-w-[200px]">
              <p className="font-medium text-gray-900">
                {currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={() => navigateWeek("next")}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {weekDates.map((date) => {
            const isToday = date.toDateString() === new Date().toDateString();
            const isoDate = date.toISOString().split("T")[0];
            const isBlocked = blockedDates.some((blockedDate) => blockedDate.date === isoDate);
            const dayAvailable = availability[date.getDay()]?.enabled;

            return (
              <div
                key={isoDate}
                className={`p-4 rounded-lg text-center ${
                  isToday
                    ? "bg-purple-100 border-2 border-purple-500"
                    : isBlocked
                      ? "bg-red-100 border border-red-300"
                      : dayAvailable
                        ? "bg-green-50 border border-green-200"
                        : "bg-gray-50 border border-gray-200"
                }`}
              >
                <p className="text-sm font-medium text-gray-600">{daysOfWeek[date.getDay()]}</p>
                <p className={`text-2xl font-bold mt-1 ${isToday ? "text-purple-600" : "text-gray-900"}`}>
                  {date.getDate()}
                </p>
                <p className="text-xs text-gray-600 mt-2">
                  {isBlocked ? "Blocked" : dayAvailable ? "Available" : "Off"}
                </p>
              </div>
            );
          })}
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Blocked Dates</h2>
          <Button
            onClick={handleAddBlockedDate}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Block Date
          </Button>
        </div>
        <div className="space-y-3">
          {blockedDates.map((blockedDate) => (
            <div
              key={blockedDate.date}
              className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <CalendarIcon className="w-5 h-5 text-red-600" />
                <div>
                  <p className="font-medium text-gray-900">
                    {new Date(blockedDate.date).toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                  <p className="text-sm text-gray-600">{blockedDate.reason}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveBlockedDate(blockedDate.date)}
                className="text-red-600 hover:text-red-700 hover:bg-red-100"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
          {blockedDates.length === 0 && (
            <p className="text-sm text-gray-600">No blocked dates added yet.</p>
          )}
        </div>
      </Card>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="p-6">
          <p className="text-sm text-gray-600">Available Days</p>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {availability.filter((day) => day.enabled).length}
          </p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-gray-600">Blocked Dates</p>
          <p className="text-3xl font-bold text-red-600 mt-2">{blockedDates.length}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-gray-600">Weekly Hours</p>
          <p className="text-3xl font-bold text-purple-600 mt-2">
            {availability.filter((day) => day.enabled).length * 8}
          </p>
        </Card>
      </div>
    </div>
  );
}
