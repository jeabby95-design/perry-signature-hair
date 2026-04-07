import { useEffect, useMemo, useState } from "react";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Gift, TrendingUp, Star, Sparkles, Calendar } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../../firebase/auth-context";
import { getBookingsForClient, redeemLoyaltyPoints } from "../../firebase/firestore";
import type { Booking } from "../../types/domain";

interface Reward {
  id: string;
  name: string;
  points: number;
  description: string;
  available: boolean;
}

const rewards: Reward[] = [
  {
    id: "1",
    name: "£5 Off Any Service",
    points: 100,
    description: "Redeem 100 points for £5 off your next booking",
    available: true,
  },
  {
    id: "2",
    name: "£12 Off Any Service",
    points: 200,
    description: "Redeem 200 points for £12 off your next booking",
    available: true,
  },
  {
    id: "3",
    name: "Free Add-On Service",
    points: 500,
    description: "Free wash, treatment, or blow dry",
    available: true,
  },
  {
    id: "4",
    name: "£25 Off Premium Service",
    points: 1000,
    description: "£25 off any service over £100",
    available: false,
  },
];

function getTier(points: number) {
  if (points >= 500) {
    return { name: "Gold", discount: "10%", nextThreshold: null };
  }
  if (points >= 200) {
    return { name: "Silver", discount: "5%", nextThreshold: 500 };
  }
  return { name: "Bronze", discount: "0%", nextThreshold: 200 };
}

export default function ClientLoyalty() {
  const { user, profile, refreshProfile } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [redeemingId, setRedeemingId] = useState<string | null>(null);

  useEffect(() => {
    async function loadLoyaltyData() {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const rows = await getBookingsForClient(user.uid);
        setBookings(rows);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unable to load loyalty data.";
        toast.error(message);
      } finally {
        setLoading(false);
      }
    }

    void loadLoyaltyData();
  }, [user]);

  const currentPoints = profile?.points ?? 0;
  const tier = getTier(currentPoints);

  const tierInfo = useMemo(
    () => [
      {
        name: "Bronze",
        range: "0-199 points",
        discount: "0%",
        color: "from-orange-400 to-amber-500",
        current: tier.name === "Bronze",
      },
      {
        name: "Silver",
        range: "200-499 points",
        discount: "5%",
        color: "from-gray-300 to-gray-400",
        current: tier.name === "Silver",
      },
      {
        name: "Gold",
        range: "500+ points",
        discount: "10%",
        color: "from-yellow-400 to-amber-500",
        current: tier.name === "Gold",
      },
    ],
    [tier.name],
  );

  const pointsHistory = useMemo(() => {
    return bookings
      .filter((booking) => booking.status === "completed" && (booking.quoteAmount ?? 0) > 0)
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
      .slice(0, 12)
      .map((booking) => ({
        date: booking.updatedAt,
        description: `Booking: ${booking.service}`,
        points: Math.round(booking.quoteAmount ?? 0),
        type: "earned" as const,
      }));
  }, [bookings]);

  const progressWidth = useMemo(() => {
    if (tier.name === "Gold") {
      return 100;
    }

    if (tier.name === "Silver") {
      return Math.min(100, Math.round((currentPoints / 500) * 100));
    }

    return Math.min(100, Math.round((currentPoints / 200) * 100));
  }, [currentPoints, tier.name]);

  async function handleRedeem(reward: Reward) {
    if (!user) {
      toast.error("Please sign in to redeem rewards.");
      return;
    }

    if (currentPoints < reward.points) {
      toast.error(`Not enough points. You need ${reward.points - currentPoints} more points.`);
      return;
    }

    setRedeemingId(reward.id);
    try {
      await redeemLoyaltyPoints(user.uid, reward.points);
      await refreshProfile();
      toast.success(`Redeemed: ${reward.name}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to redeem reward.";
      toast.error(message);
    } finally {
      setRedeemingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Loyalty & Rewards</h1>
        <p className="text-gray-600 mt-1">Earn points and unlock exclusive benefits</p>
      </div>

      {/* Points Summary */}
      <Card className="p-6 bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm text-gray-600 mb-2">Your Points Balance</p>
            <p className="text-5xl font-bold text-gray-900">{currentPoints}</p>
            <div className="flex items-center space-x-2 mt-3">
              <Badge className="bg-yellow-500 text-yellow-900 border-0">
                <Star className="w-3 h-3 mr-1" />
                {tier.name} Tier
              </Badge>
              <span className="text-sm text-gray-600">{tier.discount} discount on all services</span>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="bg-gradient-to-br from-yellow-400 to-amber-500 p-8 rounded-2xl text-white text-center">
              <Gift className="w-12 h-12 mx-auto mb-2" />
              <p className="text-sm">Tier Benefits</p>
              <p className="text-2xl font-bold mt-1">{tier.discount} Off</p>
            </div>
          </div>
        </div>

        {/* Progress to Next Tier - Already at Gold */}
        <div className="mt-6 p-4 bg-white rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Tier Progress</span>
            {tier.nextThreshold ? (
              <span className="text-sm text-gray-600 font-semibold">
                {Math.max(0, tier.nextThreshold - currentPoints)} points to next tier
              </span>
            ) : (
              <span className="text-sm text-green-600 font-semibold">✓ Top Tier Reached!</span>
            )}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-yellow-500 to-amber-500 h-3 rounded-full"
              style={{ width: `${progressWidth}%` }}
            />
          </div>
          <p className="text-xs text-gray-600 mt-2">
            {tier.nextThreshold
              ? "Keep earning points to unlock the next discount tier."
              : "You're enjoying the highest tier benefits! Keep earning points."}
          </p>
        </div>
      </Card>

      {/* Tier Information */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Loyalty Tiers</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {tierInfo.map((tier) => (
            <Card
              key={tier.name}
              className={`p-6 ${tier.current ? "ring-2 ring-yellow-500" : ""}`}
            >
              <div
                className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${tier.color} mb-4`}
              >
                <Star className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg">{tier.name}</h3>
              <p className="text-sm text-gray-600 mt-1">{tier.range}</p>
              <div className="mt-4">
                <p className="text-2xl font-bold text-gray-900">{tier.discount}</p>
                <p className="text-sm text-gray-600">discount on services</p>
              </div>
              {tier.current && (
                <Badge className="mt-4 bg-yellow-500 text-yellow-900">Your Tier</Badge>
              )}
            </Card>
          ))}
        </div>
      </div>

      {/* Available Rewards */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Available Rewards</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {rewards.map((reward) => (
            <Card key={reward.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <Sparkles className="w-5 h-5 text-purple-600" />
                    <h3 className="font-bold text-gray-900">{reward.name}</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{reward.description}</p>
                  <div className="flex items-center space-x-3">
                    <Badge
                      className={
                        reward.available
                          ? "bg-purple-100 text-purple-700"
                          : "bg-gray-100 text-gray-700"
                      }
                    >
                      {reward.points} points
                    </Badge>
                    {reward.available && currentPoints >= reward.points && (
                      <Badge className="bg-green-100 text-green-700">Can Redeem</Badge>
                    )}
                  </div>
                </div>
              </div>
              <Button
                onClick={() => void handleRedeem(reward)}
                disabled={!reward.available || currentPoints < reward.points}
                className="w-full mt-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {redeemingId === reward.id
                  ? "Redeeming..."
                  : currentPoints >= reward.points
                    ? "Redeem Now"
                    : "Not Enough Points"}
              </Button>
            </Card>
          ))}
        </div>
      </div>

      {/* Points History */}
      <Card>
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Points History</h2>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Points</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pointsHistory.map((item) => (
              <TableRow key={`${item.date}-${item.description}`}>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span>
                      {new Date(item.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="font-medium text-gray-900">{item.description}</TableCell>
                <TableCell>
                  <Badge className="bg-green-100 text-green-700">{item.type}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <span className="font-bold text-green-600">+{item.points}</span>
                </TableCell>
              </TableRow>
            ))}
            {!loading && pointsHistory.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-gray-600 py-8">
                  Complete bookings to earn and track loyalty points.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      {/* How to Earn Points */}
      <Card className="p-6 bg-gradient-to-br from-teal-50 to-cyan-50 border-teal-200">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2" />
          How to Earn Points
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex items-start space-x-3">
            <div className="bg-teal-600 text-white rounded-lg p-2">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Book Appointments</p>
              <p className="text-sm text-gray-600">£1 spent = 1 point</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="bg-purple-600 text-white rounded-lg p-2">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Refer Friends</p>
              <p className="text-sm text-gray-600">+30 points per referral</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="bg-pink-600 text-white rounded-lg p-2">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Birthday Bonus</p>
              <p className="text-sm text-gray-600">+25 points on your birthday</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="bg-amber-600 text-white rounded-lg p-2">
              <Star className="w-5 h-5" />
            </div>
            <div>
              <p className="font-medium text-gray-900">First Booking</p>
              <p className="text-sm text-gray-600">+20 welcome points</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
