import { Link } from "react-router";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
          404
        </h1>
        <p className="text-2xl font-semibold text-gray-900 mt-4">Page not found</p>
        <p className="text-gray-600 mt-2 mb-8">
          Sorry, we couldn't find the page you're looking for.
        </p>
        <Link
          to="/"
          className="inline-flex items-center space-x-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white px-6 py-3 rounded-lg hover:from-amber-700 hover:to-orange-700 transition-all"
        >
          <Home className="w-5 h-5" />
          <span>Go back home</span>
        </Link>
      </div>
    </div>
  );
}
