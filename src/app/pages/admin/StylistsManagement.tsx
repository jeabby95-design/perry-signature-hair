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
import { Label } from "../../components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import { UserPlus, Trash2, Mail, Star } from "lucide-react";
import { toast } from "sonner";
import {
  createStaffInvite,
  getBookingsForStaff,
  getStaffUsers,
  updateStaffStatus,
} from "../../firebase/firestore";
import { useAuth } from "../../firebase/auth-context";
import type { UserProfile } from "../../types/domain";

export default function StylistsManagement() {
  const { user } = useAuth();
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteName, setInviteName] = useState("");
  const [staffUsers, setStaffUsers] = useState<UserProfile[]>([]);
  const [bookingCounts, setBookingCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStaff() {
      try {
        const rows = await getStaffUsers();
        setStaffUsers(rows);

        const countsEntries = await Promise.all(
          rows.map(async (staffUser) => {
            const staffBookings = await getBookingsForStaff(staffUser.uid);
            return [staffUser.uid, staffBookings.length] as const;
          }),
        );

        setBookingCounts(Object.fromEntries(countsEntries));
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unable to load staff.";
        toast.error(message);
      } finally {
        setLoading(false);
      }
    }

    void loadStaff();
  }, []);

  async function handleInvite() {
    if (!inviteEmail || !inviteName || !user) {
      toast.error("Please enter name and email.");
      return;
    }

    try {
      await createStaffInvite({
        email: inviteEmail,
        fullName: inviteName,
        invitedBy: user.uid,
      });
      toast.success(`Invitation created for ${inviteName}.`);
      setInviteEmail("");
      setInviteName("");
      setIsInviteOpen(false);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to create invite.";
      toast.error(message);
    }
  }

  async function handleToggleStatus(staffUser: UserProfile) {
    const nextStatus = staffUser.status === "active" ? "inactive" : "active";

    try {
      await updateStaffStatus(staffUser.uid, nextStatus);
      setStaffUsers((previous) =>
        previous.map((row) =>
          row.uid === staffUser.uid ? { ...row, status: nextStatus } : row,
        ),
      );
      toast.success(`${staffUser.fullName} is now ${nextStatus}.`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to update status.";
      toast.error(message);
    }
  }

  const activeStylists = useMemo(
    () => staffUsers.filter((staffUser) => staffUser.status === "active").length,
    [staffUsers],
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Stylists Management</h1>
          <p className="text-gray-600 mt-1">Manage your team of professional stylists</p>
        </div>
        <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700">
              <UserPlus className="w-4 h-4 mr-2" />
              Invite Stylist
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite New Stylist</DialogTitle>
              <DialogDescription>
                Create a staff invite entry for onboarding.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="Enter stylist's full name"
                  value={inviteName}
                  onChange={(event) => setInviteName(event.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="stylist@example.com"
                  value={inviteEmail}
                  onChange={(event) => setInviteEmail(event.target.value)}
                />
              </div>
              <Button onClick={handleInvite} className="w-full">
                <Mail className="w-4 h-4 mr-2" />
                Create Invite
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="p-6">
          <p className="text-sm text-gray-600">Total Stylists</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{staffUsers.length}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-gray-600">Active Stylists</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{activeStylists}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-gray-600">Total Bookings</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {Object.values(bookingCounts).reduce((sum, value) => sum + value, 0)}
          </p>
        </Card>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Points</TableHead>
              <TableHead>Completed</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-600">
                  Loading stylists...
                </TableCell>
              </TableRow>
            ) : staffUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-600">
                  No staff users found.
                </TableCell>
              </TableRow>
            ) : (
              staffUsers.map((staffUser) => (
                <TableRow key={staffUser.uid}>
                  <TableCell>
                    <p className="font-medium text-gray-900">{staffUser.fullName}</p>
                  </TableCell>
                  <TableCell>{staffUser.email}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">{staffUser.role}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-amber-500 fill-amber-500 mr-1" />
                      <span className="font-medium">{staffUser.points}</span>
                    </div>
                  </TableCell>
                  <TableCell>{bookingCounts[staffUser.uid] || 0}</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        staffUser.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }
                    >
                      {staffUser.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleStatus(staffUser)}
                      >
                        {staffUser.status === "active" ? "Deactivate" : "Activate"}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleStatus(staffUser)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
