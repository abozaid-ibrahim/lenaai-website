"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

import { Menu, X, Globe, AlertTriangle } from "lucide-react";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";

import {
  getClientid,
  removeClientId,
} from "@/components/services/clientCookies";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { useI18n } from "@/app/context/translate-api";

const Header = () => {
  const { t } = useI18n();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const ci = Cookies.get("client_id");

  const initiateLogout = () => {
    setShowLogoutConfirm(true);
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  const confirmLogout = () => {
    Cookies.remove("client_id");
    setShowLogoutConfirm(false);
    toast.success("Logout Successful");
    window.location.reload();
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  return (

    <>
      {/* Logout Confirmation Popup */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
            {/* Popup container */}
            <div className="bg-white rounded-lg shadow-lg p-6 w-80 m-4 animate-fade-in">
              <div className="flex flex-col items-center text-center mb-4">
                <div className="bg-red-100 p-3 rounded-full mb-4">
                  <AlertTriangle className="h-6 w-6 text-red-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Are you sure?</h3>
                <p className="text-gray-600 mt-2">You will be logged out of your account</p>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button 
                  onClick={cancelLogout}
                  className="flex-1 py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md font-medium transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmLogout}
                  className="flex-1 py-2 px-4 bg-primary hover:bg-primary/90 text-white rounded-md font-medium transition-colors"
                >
                  Log Out
                </button>
              </div>
            </div>

    <header className="bg-primary text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold flex items-center">
            <span className="mr-2">AI Efficiency Hub</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="hover:text-blue-200 transition-colors">
              {t.header.home}
            </Link>
            <Link
              href="/dashbord"
              className="hover:text-blue-200 transition-colors"
            >
              {t.header.clientDashboard}
            </Link>
            <Link href="" className="hover:text-blue-200 transition-colors">
              {t.header.jobOpportunities}
            </Link>
            <Link href="" className="hover:text-blue-200 transition-colors">
              {t.header.allProperties}
            </Link>
          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <LanguageSwitcher />
            {/* <Link href="/dashbord" className="text-white border border-blue-400 px-5 py-1.5 rounded-full hover:border-blue-200 hover:text-blue-200 transition-all duration-300">
              Signup
            </Link> */}
            {!ci ? (
              <Link
                href="/auth/login"
                className="text-yellow-400 border border-yellow-400 px-5 py-1.5 rounded-full hover:border-yellow-200 hover:text-yellow-200 transition-all duration-300"
              >
                {t.login}
              </Link>
            ) : (
              <button
                onClick={handleLogout}
                className="text-yellow-400 border border-yellow-400 px-5 py-1.5 rounded-full hover:border-yellow-200 hover:text-yellow-200 transition-all duration-300"
              >
                Logout
              </button>
            )}

          </div>
      )}

      <header className="bg-primary text-white shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            {/* Logo */}
            <Link href="/" className="text-xl font-bold flex items-center">
              <span className="mr-2">AI Efficiency Hub</span>
            </Link>


      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-primary border-t border-blue-700">
          <div className="container mx-auto px-4 py-3">
            <nav className="flex flex-col space-y-3">
              <Link
                href="/"
                className="hover:text-blue-200 transition-colors py-2"
              >
                {t.header.home}

              </Link>
              <Link
                href="/dashbord"
                className="hover:text-blue-200 transition-colors"
              >
                {t.header.clientDashboard}
              </Link>

              <Link
                href=""
                className="hover:text-blue-200 transition-colors py-2"
              >
                {t.header.jobOpportunities}
              </Link>
              <Link
                href=""
                className="hover:text-blue-200 transition-colors py-2"
              >
                {t.header.allProperties}

              </Link>
            </nav>

            {/* Action Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              {!ci ? (
                <Link
                  href="/auth/login"
                  className="text-yellow-400 border border-yellow-400 px-5 py-1.5 rounded-full hover:border-yellow-200 hover:text-yellow-200 transition-all duration-300"
                >
                  Sign In
                </Link>
              ) : (
                <button
                  onClick={initiateLogout}
                  className="text-yellow-400 border border-yellow-400 px-5 py-1.5 rounded-full hover:border-yellow-200 hover:text-yellow-200 transition-all duration-300"
                >
                  Logout
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button className="md:hidden text-white" onClick={toggleMenu}>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-primary border-t border-blue-700">
            <div className="container mx-auto px-4 py-3">
              <nav className="flex flex-col space-y-3">
                <Link
                  href="/"
                  className="hover:text-blue-200 transition-colors py-2"
                >
                  Home
                </Link>
                <Link
                  href="/dashbord"
                  className="hover:text-blue-200 transition-colors py-2"
                >
                  Client Dashboard
                </Link>
                <Link
                  href=""
                  className="hover:text-blue-200 transition-colors py-2"
                >
                  Job Opportunities
                </Link>
                <Link
                  href=""
                  className="hover:text-blue-200 transition-colors py-2"
                >
                  All Properties
                </Link>
                <div className="flex items-center space-x-3 pt-2">
                  {!ci ? (
                    <>
                      <Link
                        href="/auth/signup"
                        className="text-white border border-blue-400 px-5 py-1.5 rounded-full hover:border-blue-200 hover:text-blue-200 transition-all duration-300"
                      >
                        Sign Up
                      </Link>
                      <Link
                        href="/auth/login"
                        className="text-yellow-400 border border-yellow-400 px-5 py-1.5 rounded-full hover:border-yellow-200 hover:text-yellow-200 transition-all duration-300"
                      >
                        Sign In
                      </Link>
                    </>
                  ) : (
                    <button
                      onClick={initiateLogout}
                      className="text-yellow-400 border border-yellow-400 px-5 py-1.5 rounded-full hover:border-yellow-200 hover:text-yellow-200 transition-all duration-300"
                    >
                      Logout
                    </button>
                  )}
                </div>
              </nav>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;