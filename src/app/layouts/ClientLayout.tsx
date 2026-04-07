import { Link, Outlet, useLocation } from "react-router";
import {
  LayoutDashboard,
  Calendar,
  Gift,
  Star,
  Heart,
  Image as ImageIcon,
  Bell,
  Settings,
  Menu,
  X,
  LogOut,
  Home,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";

const navigation = [
  { name: "Overview", href: "/client", icon: LayoutDashboard },
  { name: "My Bookings", href: "/client/bookings", icon: Calendar },
  { name: "Loyalty & Rewards", href: "/client/loyalty", icon: Gift },
  { name: "Reviews & Ratings", href: "/client/reviews", icon: Star },
  { name: "Saved Styles", href: "/client/saved-styles", icon: Heart },
  { name: "Gallery", href: "/client/gallery", icon: ImageIcon },
  { name: "Notifications", href: "/client/notifications", icon: Bell },
  { name: "Settings", href: "/client/settings", icon: Settings },
];

export default function ClientLayout() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  // Mock client info - in production, this would come from auth context
  const client = {
    name: "Sarah Johnson",
    email: "sarah.j@email.com",
    avatar: "SJ",
    points: 650,
    tier: "Gold",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-teal-900 to-cyan-900 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-teal-800">
            <Link to="/client" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-lg" />
              <span className="font-bold text-white">My Account</span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-teal-300 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Client Info */}
          <div className="p-6 border-b border-teal-800">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold">
                {client.avatar}
              </div>
              <div>
                <p className="font-medium text-white">{client.name}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-xs bg-yellow-500 text-yellow-900 px-2 py-0.5 rounded-full font-semibold">
                    {client.tier}
                  </span>
                  <span className="text-xs text-teal-300">{client.points} pts</span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-gradient-to-r from-teal-600 to-cyan-600 text-white"
                      : "text-teal-200 hover:bg-teal-800 hover:text-white"
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Bottom Actions */}
          <div className="p-4 border-t border-teal-800 space-y-2">
            <Link
              to="/"
              className="flex items-center space-x-3 px-4 py-3 text-teal-200 hover:bg-teal-800 hover:text-white rounded-lg transition-colors"
            >
              <Home className="w-5 h-5" />
              <span className="font-medium">Back to Home</span>
            </Link>
            <button className="flex items-center space-x-3 px-4 py-3 text-teal-200 hover:bg-teal-800 hover:text-white rounded-lg transition-colors w-full">
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200 h-16">
          <div className="flex items-center justify-between h-full px-6">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-600 hover:text-gray-900"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div className="flex-1 max-w-md mx-auto px-4">
              <input
                type="search"
                placeholder="Search styles, services..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
                <Bell className="w-6 h-6" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center space-x-3 hover:bg-gray-100 rounded-lg p-2"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold">
                    {client.avatar}
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-gray-900">{client.name}</p>
                    <p className="text-xs text-gray-500">{client.tier} Member</p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>
                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
                    <Link
                      to="/client/settings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Account Settings
                    </Link>
                    <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
