import { useEffect, useMemo, useState } from "react";
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
import { Input } from "../../components/ui/input";
import { Gift, TrendingUp, Users, Star, Plus, Minus } from "lucide-react";
import { toast } from "sonner";
import {
  adjustUserPoints,
  getBookingsForClient,
  getClientUsers,
} from "../../firebase/firestore";
import type { UserProfile } from "../../types/domain";

interface Client {
  id: string;
  name: string;
  email: string;
  points: number;
  tier: "bronze" | "silver" | "gold";
  totalSpent: number;
  bookings: number;
}

const tierConfig = {
  bronze: {
    name: "Bronze",
    minPoints: 0,
    maxPoints: 199,
    color: "bg-orange-100 text-orange-800",
    discount: "0%",
  },
  silver: {
    name: "Silver",
    minPoints: 200,
    maxPoints: 499,
    color: "bg-gray-200 text-gray-800",
    discount: "5%",
  },
  gold: {
    name: "Gold",
    minPoints: 500,
    maxPoints: Infinity,
    color: "bg-yellow-100 text-yellow-800",
    discount: "10%",
  },
};

const rewards = [
  { points: 100, value: "£5 discount", description: "£5 off any service" },
  { points: 200, value: "£12 discount", description: "£12 off any service" },
  { points: 500, value: "Free add-on", description: "Free wash or treatment" },
];

function getTier(points: number): "bronze" | "silver" | "gold" {
  if (points >= 500) {
    return "gold";
  }
  if (points >= 200) {
    return "silver";
  }
  return "bronze";
}

export default function LoyaltyProgram() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);

  useEffect(() => {
    async function loadClients() {
      try {
        const clientProfiles = await getClientUsers();
        const rows = await Promise.all(
          clientProfiles.map(async (profile: UserProfile) => {
            const bookings = await getBookingsForClient(profile.uid);
            const totalSpent = bookings
              .filter((booking) => booking.status === "completed")
              .reduce((sum, booking) => sum + (booking.quoteAmount ?? 0), 0);

            return {
              id: profile.uid,
              name: profile.fullName,
              email: profile.email,
              points: profile.points ?? 0,
              tier: getTier(profile.points ?? 0),
              totalSpent,
              bookings: bookings.length,
            } as Client;
          }),
        );

        setClients(rows.sort((a, b) => b.points - a.points));
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unable to load loyalty data.";
        toast.error(message);
      } finally {
        setLoading(false);
      }
    }

    void loadClients();
  }, []);

  async function handleAdjustPoints(client: Client, amount: number) {
    try {
      await adjustUserPoints(client.id, amount);
      setClients((previous) =>
        previous.map((row) => {
          if (row.id !== client.id) {
            return row;
          }

          const nextPoints = Math.max(0, row.points + amount);
          return {
            ...row,
            points: nextPoints,
            tier: getTier(nextPoints),
          };
        }),
      );

      const action = amount > 0 ? "added to" : "removed from";
      toast.success(`${Math.abs(amount)} points ${action} ${client.name}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to adjust points.";
      toast.error(message);
    }
  }

  function handleSaveSettings() {
    setSavingSettings(true);
    setTimeout(() => {
      setSavingSettings(false);
      toast.success("Program settings UI saved. Wire this to Firestore config when ready.");
    }, 500);
  }

  const totalMembers = clients.length;
  const totalPoints = useMemo(() => clients.reduce((sum, c) => sum + c.points, 0), [clients]);
  const goldMembers = useMemo(() => clients.filter((c) => c.tier === "gold").length, [clients]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Loyalty Program</h1>
        <p className="text-gray-600 mt-1">Manage client rewards and loyalty tiers</p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Members</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{totalMembers}</p>
            </div>
            <div className="bg-gradient-to-br from-amber-400 to-orange-500 p-3 rounded-xl">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Points</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{totalPoints}</p>
            </div>
            <div className="bg-gradient-to-br from-amber-400 to-orange-500 p-3 rounded-xl">
              <Gift className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Gold Members</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{goldMembers}</p>
            </div>
            <div className="bg-gradient-to-br from-amber-400 to-orange-500 p-3 rounded-xl">
              <Star className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Points</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {totalMembers === 0 ? 0 : Math.round(totalPoints / totalMembers)}
              </p>
            </div>
            <div className="bg-gradient-to-br from-amber-400 to-orange-500 p-3 rounded-xl">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Tier Information */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Loyalty Tiers</h2>
          <div className="space-y-4">
            {Object.entries(tierConfig).map(([key, tier]) => (
              <div key={key} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <Badge className={tier.color}>{tier.name}</Badge>
                  <span className="text-sm font-medium text-gray-900">{tier.discount} off</span>
                </div>
                <p className="text-sm text-gray-600">
                  {tier.minPoints} - {tier.maxPoints === Infinity ? "∞" : tier.maxPoints} points
                </p>
              </div>
            ))}
          </div>
        </Card>

        {/* Rewards */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Available Rewards</h2>
          <div className="space-y-4">
            {rewards.map((reward, idx) => (
              <div key={idx} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">{reward.value}</span>
                  <Badge className="bg-amber-100 text-amber-800">{reward.points} pts</Badge>
                </div>
                <p className="text-sm text-gray-600">{reward.description}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Program Settings */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Program Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Points per £1</label>
              <Input type="number" defaultValue="1" className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">First Booking Bonus</label>
              <Input type="number" defaultValue="20" className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Referral Bonus</label>
              <Input type="number" defaultValue="30" className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Birthday Bonus</label>
              <Input type="number" defaultValue="25" className="mt-1" />
            </div>
            <Button
              onClick={handleSaveSettings}
              disabled={savingSettings}
              className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
            >
              Save Settings
            </Button>
          </div>
        </Card>
      </div>

      {/* Client Points Table */}
      <Card>
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Client Points</h2>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Points Balance</TableHead>
              <TableHead>Tier</TableHead>
              <TableHead>Total Spent</TableHead>
              <TableHead>Bookings</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.map((client) => (
              <TableRow key={client.id}>
                <TableCell className="font-medium text-gray-900">{client.name}</TableCell>
                <TableCell className="text-gray-600">{client.email}</TableCell>
                <TableCell>
                  <span className="font-bold text-gray-900">{client.points}</span>
                  <span className="text-sm text-gray-500"> points</span>
                </TableCell>
                <TableCell>
                  <Badge className={tierConfig[client.tier].color}>
                    {tierConfig[client.tier].name}
                  </Badge>
                </TableCell>
                <TableCell className="font-medium">£{client.totalSpent}</TableCell>
                <TableCell>{client.bookings}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => void handleAdjustPoints(client, 50)}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => void handleAdjustPoints(client, -50)}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {!loading && clients.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-600">
                  No client profiles found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
