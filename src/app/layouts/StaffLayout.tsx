import { Link, Outlet, useLocation } from "react-router";
import {
  LayoutDashboard,
  Calendar,
  ClipboardList,
  Bell,
  Clock,
  Menu,
  X,
  LogOut,
  Home,
} from "lucide-react";
import { useState } from "react";

const navigation = [
  { name: "My Schedule", href: "/staff", icon: LayoutDashboard },
  { name: "My Bookings", href: "/staff/bookings", icon: ClipboardList },
  { name: "Availability", href: "/staff/availability", icon: Calendar },
  { name: "Notifications", href: "/staff/notifications", icon: Bell },
];

export default function StaffLayout() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Mock stylist info - in production, this would come from auth context
  const stylist = {
    name: "Keisha Davis",
    email: "keisha.davis@perry.com",
    avatar: "KD",
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
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-purple-900 to-indigo-900 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-purple-800">
            <Link to="/staff" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg" />
              <span className="font-bold text-white">Stylist Portal</span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-purple-300 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Stylist Info */}
          <div className="p-6 border-b border-purple-800">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                {stylist.avatar}
              </div>
              <div>
                <p className="font-medium text-white">{stylist.name}</p>
                <p className="text-sm text-purple-300">{stylist.email}</p>
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
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                      : "text-purple-200 hover:bg-purple-800 hover:text-white"
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
          <div className="p-4 border-t border-purple-800 space-y-2">
            <Link
              to="/"
              className="flex items-center space-x-3 px-4 py-3 text-purple-200 hover:bg-purple-800 hover:text-white rounded-lg transition-colors"
            >
              <Home className="w-5 h-5" />
              <span className="font-medium">Back to Site</span>
            </Link>
            <button className="flex items-center space-x-3 px-4 py-3 text-purple-200 hover:bg-purple-800 hover:text-white rounded-lg transition-colors w-full">
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

            <div className="flex items-center space-x-4 ml-auto">
              <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
                <Bell className="w-6 h-6" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                  {stylist.avatar}
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-900">{stylist.name}</p>
                  <p className="text-xs text-gray-500">Stylist</p>
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
