import { Bell, Search, Settings } from "lucide-react";
import React from "react";

const Nav = ({ setIsSearchOpen }) => {
  return (
    <>
      <div className="fixed top-0 left-0 right-0 bg-white z-10 px-4 py-3 shadow-sm">
        <div className="flex items-center justify-between">
          <Settings className="w-6 h-6 text-gray-600" />
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="hover:text-blue-500"
            >
              <Search className="w-6 h-6 text-gray-600" />
            </button>
            <div className="relative">
              <Bell className="w-6 h-6 text-gray-600" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                3
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Nav;
