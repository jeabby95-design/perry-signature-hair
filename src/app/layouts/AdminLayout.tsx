import { Link, Outlet, useLocation } from "react-router";
import {
  LayoutDashboard,
  Calendar,
  Users,
  ClipboardList,
  CheckCircle,
  Image,
  Gift,
  Bell,
  Settings,
  Menu,
  X,
  LogOut,
  Home,
} from "lucide-react";
import { useState } from "react";

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Booking Requests", href: "/admin/booking-requests", icon: ClipboardList },
  { name: "Confirmed Bookings", href: "/admin/confirmed-bookings", icon: CheckCircle },
  { name: "Stylists", href: "/admin/stylists", icon: Users },
  { name: "Gallery", href: "/admin/gallery", icon: Image },
  { name: "Loyalty Program", href: "/admin/loyalty", icon: Gift },
  { name: "Calendar", href: "/admin/calendar", icon: Calendar },
  { name: "Notifications", href: "/admin/notifications", icon: Bell },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-800">
            <Link to="/admin" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg" />
              <span className="font-bold text-white">Perry Admin</span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
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
                      ? "bg-gradient-to-r from-amber-600 to-orange-600 text-white"
                      : "text-gray-400 hover:bg-gray-800 hover:text-white"
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
          <div className="p-4 border-t border-gray-800 space-y-2">
            <Link
              to="/"
              className="flex items-center space-x-3 px-4 py-3 text-gray-400 hover:bg-gray-800 hover:text-white rounded-lg transition-colors"
            >
              <Home className="w-5 h-5" />
              <span className="font-medium">Back to Site</span>
            </Link>
            <button className="flex items-center space-x-3 px-4 py-3 text-gray-400 hover:bg-gray-800 hover:text-white rounded-lg transition-colors w-full">
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

            <div className="flex-1 max-w-2xl mx-auto px-4">
              <input
                type="search"
                placeholder="Search bookings, clients, stylists..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
                <Bell className="w-6 h-6" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full" />
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-900">Admin User</p>
                  <p className="text-xs text-gray-500">admin@perry.com</p>
                </div>
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
