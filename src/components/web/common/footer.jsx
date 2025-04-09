import React from "react";
import Link from "next/link";
import {
  Linkedin,
  Phone,
  MapPin,
  Building,
  Handshake,
  User,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-white py-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-bold border-b border-white pb-2">
              Company Information
            </h3>
            <div className="flex items-start space-x-3">
              <Building className="mt-1 flex-shrink-0" />
              <p>
                Company Address: 505 Siac Building, ARCHPLAN Square, New
                Capital, Cairo, Egypt
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Handshake className="flex-shrink-0" />
              <p>Partnership with DREAM HOMES</p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold border-b border-white pb-2">
              Contact Details
            </h3>
            <div className="flex items-center space-x-3">
              <Phone className="flex-shrink-0" />
              <p>Contact info: 01016080323</p>
            </div>
            <div className="flex items-center space-x-3">
              <User className="flex-shrink-0" />
              <p>CTO: Aboazid Ibrahim</p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold border-b border-white pb-2">
              Connect With Us
            </h3>
            <Link
              href="https://linkedin.com"
              className="flex items-center space-x-3 hover:text-blue-200 transition-colors"
            >
              <Linkedin size={24} />
              <span>LinkedIn</span>
            </Link>
            <div className="mt-6">
              <h4 className="font-semibold mb-2">Privacy Policy</h4>
              <Link
                href="/web/privacy"
                className="text-blue-200 hover:underline"
              >
                Read our Privacy Policy
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/30 text-center">
          <p>&copy; {new Date().getFullYear()} Lena AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
