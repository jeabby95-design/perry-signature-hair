import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Switch } from "../../components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { User, Bell, Lock, CreditCard, Save } from "lucide-react";
import { toast } from "sonner";

export default function ClientSettings() {
  const handleSave = (section: string) => {
    toast.success(`${section} settings updated`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your account preferences</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
        </TabsList>

        {/* Profile Settings */}
        <TabsContent value="profile" className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <User className="w-5 h-5 mr-2" />
              Personal Information
            </h2>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" defaultValue="Sarah" />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" defaultValue="Johnson" />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" defaultValue="sarah.j@email.com" />
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" type="tel" defaultValue="+44 7700 900123" />
              </div>

              <div>
                <Label htmlFor="birthday">Date of Birth</Label>
                <Input id="birthday" type="date" defaultValue="1995-06-15" />
                <p className="text-xs text-gray-500 mt-1">
                  For birthday bonus points
                </p>
              </div>

              <Button
                onClick={() => handleSave("Profile")}
                className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Hair Preferences</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="hairType">Hair Type</Label>
                <Input id="hairType" placeholder="e.g., 4C, coily, natural" />
              </div>
              <div>
                <Label htmlFor="hairLength">Current Hair Length</Label>
                <Input id="hairLength" placeholder="e.g., Shoulder length" />
              </div>
              <div>
                <Label htmlFor="allergies">Allergies or Sensitivities</Label>
                <Input id="allergies" placeholder="Any products to avoid?" />
              </div>
              <Button onClick={() => handleSave("Hair preferences")}>
                Save Preferences
              </Button>
            </div>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications" className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <Bell className="w-5 h-5 mr-2" />
              Notification Preferences
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Booking Confirmations</p>
                  <p className="text-sm text-gray-600">
                    Get notified when bookings are confirmed
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Appointment Reminders</p>
                  <p className="text-sm text-gray-600">
                    Reminders 24 hours before your appointment
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Loyalty Rewards</p>
                  <p className="text-sm text-gray-600">
                    Updates about your points and rewards
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Special Offers</p>
                  <p className="text-sm text-gray-600">
                    Exclusive deals and promotions
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">SMS Notifications</p>
                  <p className="text-sm text-gray-600">
                    Receive text message notifications
                  </p>
                </div>
                <Switch />
              </div>

              <Button onClick={() => handleSave("Notification")}>Save Preferences</Button>
            </div>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <Lock className="w-5 h-5 mr-2" />
              Password & Security
            </h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input id="currentPassword" type="password" />
              </div>

              <div>
                <Label htmlFor="newPassword">New Password</Label>
                <Input id="newPassword" type="password" />
              </div>

              <div>
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input id="confirmPassword" type="password" />
              </div>

              <Button onClick={() => handleSave("Password")}>Update Password</Button>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Two-Factor Authentication
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Enable 2FA</p>
                  <p className="text-sm text-gray-600">
                    Add an extra layer of security to your account
                  </p>
                </div>
                <Switch />
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Payment Settings */}
        <TabsContent value="payment" className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <CreditCard className="w-5 h-5 mr-2" />
              Payment Methods
            </h2>
            <div className="space-y-4">
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded flex items-center justify-center text-white text-xs font-bold">
                      VISA
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">•••• •••• •••• 4242</p>
                      <p className="text-sm text-gray-600">Expires 12/26</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-700">Default</Badge>
                </div>
              </div>

              <Button variant="outline" className="w-full">
                + Add Payment Method
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Billing History</h2>
            <div className="space-y-3">
              {[
                { date: "Apr 3, 2026", description: "Deposit - Knotless Braids", amount: "£15" },
                { date: "Mar 15, 2026", description: "Natural Hair Twists", amount: "£75" },
                { date: "Feb 28, 2026", description: "Fulani Braids", amount: "£95" },
              ].map((transaction, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900">{transaction.description}</p>
                    <p className="text-sm text-gray-600">{transaction.date}</p>
                  </div>
                  <p className="font-bold text-gray-900">{transaction.amount}</p>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
