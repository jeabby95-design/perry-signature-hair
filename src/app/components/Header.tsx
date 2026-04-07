import { Link } from "react-router";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              Perry Signature Hair
            </h1>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#home" className="text-gray-700 hover:text-amber-600 transition-colors">
              Home
            </a>
            <a href="#services" className="text-gray-700 hover:text-amber-600 transition-colors">
              Services
            </a>
            <a href="#book" className="text-gray-700 hover:text-amber-600 transition-colors">
              Book Appointment
            </a>
            <a href="#contact" className="text-gray-700 hover:text-amber-600 transition-colors">
              Contact
            </a>
            <div className="flex items-center space-x-3">
              <Link
                to="/client"
                className="px-4 py-2 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-lg hover:from-teal-700 hover:to-cyan-700 transition-all"
              >
                My Account
              </Link>
              <Link
                to="/staff"
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all"
              >
                Staff
              </Link>
              <Link
                to="/admin"
                className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                Admin
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}