import { MapPin, Phone, Mail, Instagram, Facebook } from "lucide-react";

export default function Footer() {
  return (
    <footer id="contact" className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-12">
          <div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent mb-4">
              Perry Signature Hair
            </h3>
            <p className="text-gray-400">
              Premium afro hair styling in the heart of West Bromwich.
              Expert care for your natural beauty.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-4">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
                <p className="text-gray-400">
                  123 High Street<br />
                  West Bromwich<br />
                  West Midlands, B70 6XX
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-amber-400 flex-shrink-0" />
                <a href="tel:+441215551234" className="text-gray-400 hover:text-white transition-colors">
                  +44 121 555 1234
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-amber-400 flex-shrink-0" />
                <a
                  href="mailto:info@perrysignaturehair.co.uk"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  info@perrysignaturehair.co.uk
                </a>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 p-3 rounded-full hover:bg-gradient-to-r hover:from-amber-600 hover:to-orange-600 transition-all"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 p-3 rounded-full hover:bg-gradient-to-r hover:from-amber-600 hover:to-orange-600 transition-all"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>
            <div className="mt-6">
              <h5 className="font-medium mb-2">Opening Hours</h5>
              <p className="text-gray-400 text-sm">
                Mon - Fri: 9:00 AM - 7:00 PM<br />
                Saturday: 8:00 AM - 8:00 PM<br />
                Sunday: 10:00 AM - 6:00 PM
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} Perry Signature Hair. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
