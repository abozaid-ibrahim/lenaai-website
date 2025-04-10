"use client";
import React, { useState } from "react";
import { Search, Bell, User, MessageSquare, Menu } from "lucide-react";
import { LanguageSwitcher } from "../../ui/LanguageSwitcher";

const Header = () => {
  const handleMenuClick = () => {
    // Call the global toggleSidebar function
    if (typeof window !== "undefined" && window.toggleSidebar) {
      window.toggleSidebar();
    }
  };

  return (
    <header className="bg-white shadow-sm p-4  md:ml-4 flex justify-between items-center mt-2 md:mt-0">
      <div className="flex items-center gap-3">
        <div className="block lg:hidden">
          <button
            className="p-1 rounded-md hover:bg-gray-100"
            onClick={handleMenuClick}
          >
            <Menu className="h-6 w-6 text-gray-700" />
          </button>
        </div>

        <div className="relative hidden sm:block">
          <input
            type="text"
            placeholder="Search"
            className="pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
          />
          <div className="absolute left-3 top-2.5">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
        </div>
        <div className="sm:hidden">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
      </div>

      <div className="flex items-center space-x-2 sm:space-x-4">
        <LanguageSwitcher />

        <div className="relative hidden sm:block">
          <button
            className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none"
            onClick={() => (window.location.href = "")}
          >
            <MessageSquare className="h-6 w-6" />
          </button>
        </div>

        <div className="relative">
          <button
            className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none"
            onClick={() => (window.location.href = "")}
          >
            <Bell className="h-6 w-6" />
            <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
          </button>
        </div>

        <div className="flex items-center">
          <button
            className="flex items-center focus:outline-none"
            onClick={() => (window.location.href = "")}
          >
            <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="h-5 w-5 text-blue-600" />
            </div>
            <span className="ml-2 text-sm font-medium text-gray-700 hidden sm:inline">
              User123
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
