import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Switch } from "../../components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import {
  Building,
  CreditCard,
  Bell,
  Mail,
  Clock,
  Shield,
  Save,
} from "lucide-react";
import { toast } from "sonner";

export default function SettingsPage() {
  const handleSave = (section: string) => {
    toast.success(`${section} settings saved successfully`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your business settings and preferences</p>
      </div>

      <Tabs defaultValue="business" className="space-y-6">
        <TabsList>
          <TabsTrigger value="business">Business Details</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="booking">Booking</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        {/* Business Details */}
        <TabsContent value="business" className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <Building className="w-5 h-5 mr-2" />
              Business Information
            </h2>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="businessName">Business Name</Label>
                  <Input id="businessName" defaultValue="Perry Signature Hair" />
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" defaultValue="info@perrysignaturehair.co.uk" />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" type="tel" defaultValue="+44 121 555 1234" />
                </div>
                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input id="website" defaultValue="www.perrysignaturehair.co.uk" />
                </div>
              </div>

              <div>
                <Label htmlFor="address">Business Address</Label>
                <Textarea
                  id="address"
                  defaultValue="123 High Street, West Bromwich, West Midlands, B70 6XX"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="description">Business Description</Label>
                <Textarea
                  id="description"
                  defaultValue="Premium afro hair styling salon specializing in braids, weaves, and natural hair care. Located in the heart of West Bromwich."
                  rows={4}
                />
              </div>

              <Button
                onClick={() => handleSave("Business")}
                className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              Opening Hours
            </h2>
            <div className="space-y-3">
              {[
                { day: "Monday", hours: "9:00 AM - 7:00 PM" },
                { day: "Tuesday", hours: "9:00 AM - 7:00 PM" },
                { day: "Wednesday", hours: "9:00 AM - 7:00 PM" },
                { day: "Thursday", hours: "9:00 AM - 7:00 PM" },
                { day: "Friday", hours: "9:00 AM - 7:00 PM" },
                { day: "Saturday", hours: "8:00 AM - 8:00 PM" },
                { day: "Sunday", hours: "10:00 AM - 6:00 PM" },
              ].map((day) => (
                <div key={day.day} className="flex items-center space-x-4">
                  <div className="w-32">
                    <Label>{day.day}</Label>
                  </div>
                  <Input defaultValue={day.hours} className="flex-1" />
                  <Switch defaultChecked />
                </div>
              ))}
            </div>
            <Button onClick={() => handleSave("Opening hours")} className="mt-4">
              Save Hours
            </Button>
          </Card>
        </TabsContent>

        {/* Payment Settings */}
        <TabsContent value="payment" className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <CreditCard className="w-5 h-5 mr-2" />
              Payment Configuration
            </h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="depositAmount">Standard Deposit Amount (£)</Label>
                <Input id="depositAmount" type="number" defaultValue="15" />
                <p className="text-sm text-gray-500 mt-1">
                  Amount required to confirm bookings
                </p>
              </div>

              <div>
                <Label htmlFor="currency">Currency</Label>
                <Select defaultValue="gbp">
                  <SelectTrigger id="currency">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gbp">GBP (£)</SelectItem>
                    <SelectItem value="usd">USD ($)</SelectItem>
                    <SelectItem value="eur">EUR (€)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="border-t border-gray-200 pt-4 mt-6">
                <h3 className="font-semibold text-gray-900 mb-4">Stripe Integration</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="stripePublishable">Stripe Publishable Key</Label>
                    <Input
                      id="stripePublishable"
                      type="password"
                      placeholder="pk_live_..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="stripeSecret">Stripe Secret Key</Label>
                    <Input id="stripeSecret" type="password" placeholder="sk_live_..." />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                    <div>
                      <p className="font-medium text-green-900">Stripe Connected</p>
                      <p className="text-sm text-green-700">
                        Payment processing is active
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Disconnect
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Accept Cash Payments</p>
                  <p className="text-sm text-gray-600">
                    Allow clients to pay in person
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <Button
                onClick={() => handleSave("Payment")}
                className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Payment Settings
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
                  <p className="font-medium text-gray-900">New Booking Requests</p>
                  <p className="text-sm text-gray-600">
                    Get notified when clients submit booking requests
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Payment Received</p>
                  <p className="text-sm text-gray-600">
                    Get notified when deposits are paid
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Quote Accepted</p>
                  <p className="text-sm text-gray-600">
                    Get notified when clients accept quotes
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Booking Reminders</p>
                  <p className="text-sm text-gray-600">
                    Get reminders about upcoming appointments
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Stylist Updates</p>
                  <p className="text-sm text-gray-600">
                    Get notified when stylists update availability
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <Mail className="w-5 h-5 mr-2" />
              Email Notifications
            </h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="adminEmail">Admin Email</Label>
                <Input
                  id="adminEmail"
                  type="email"
                  defaultValue="admin@perrysignaturehair.co.uk"
                />
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Daily Summary</p>
                  <p className="text-sm text-gray-600">
                    Receive daily email with booking summary
                  </p>
                </div>
                <Switch />
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Weekly Reports</p>
                  <p className="text-sm text-gray-600">
                    Receive weekly performance reports
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <Button onClick={() => handleSave("Notification")}>
                Save Notification Settings
              </Button>
            </div>
          </Card>
        </TabsContent>

        {/* Booking Settings */}
        <TabsContent value="booking" className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Booking Configuration</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="bookingWindow">Booking Window (days in advance)</Label>
                <Input id="bookingWindow" type="number" defaultValue="30" />
                <p className="text-sm text-gray-500 mt-1">
                  How far in advance clients can book
                </p>
              </div>

              <div>
                <Label htmlFor="minNotice">Minimum Notice (hours)</Label>
                <Input id="minNotice" type="number" defaultValue="24" />
                <p className="text-sm text-gray-500 mt-1">
                  Minimum time before appointment that bookings are allowed
                </p>
              </div>

              <div>
                <Label htmlFor="cancellationWindow">Cancellation Window (hours)</Label>
                <Input id="cancellationWindow" type="number" defaultValue="48" />
                <p className="text-sm text-gray-500 mt-1">
                  Time before appointment when free cancellation is allowed
                </p>
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Auto-Approve Bookings</p>
                  <p className="text-sm text-gray-600">
                    Automatically confirm bookings without manual review
                  </p>
                </div>
                <Switch />
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Allow Same-Day Bookings</p>
                  <p className="text-sm text-gray-600">
                    Enable clients to book appointments for today
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <Button onClick={() => handleSave("Booking")}>Save Booking Settings</Button>
            </div>
          </Card>
        </TabsContent>

        {/* Security */}
        <TabsContent value="security" className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              Security Settings
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
            <h2 className="text-xl font-bold text-gray-900 mb-6">Two-Factor Authentication</h2>
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

          <Card className="p-6 border-red-200 bg-red-50">
            <h2 className="text-xl font-bold text-red-900 mb-4">Danger Zone</h2>
            <div className="space-y-3">
              <Button variant="outline" className="w-full border-red-300 text-red-600 hover:bg-red-100">
                Export All Data
              </Button>
              <Button variant="outline" className="w-full border-red-300 text-red-600 hover:bg-red-100">
                Delete All Data
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
