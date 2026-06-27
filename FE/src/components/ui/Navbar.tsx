import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, User } from "lucide-react";
import { Button } from "./Button";
import { cn } from "../../lib/utils";

interface NavbarProps {
  isLoggedIn: boolean;
  activeRole?: string;
}

export function Navbar({ isLoggedIn, activeRole }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex">
            <div className="flex flex-shrink-0 items-center">
              <Link to="/" className="text-xl font-bold text-blue-600">
                Seapedia
              </Link>
            </div>
            <div className="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/"
                className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
              >
                Home
              </Link>
              <Link
                to="/catalog"
                className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
              >
                Catalog
              </Link>
            </div>
          </div>
          
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
            {isLoggedIn ? (
              <>
                {activeRole && (
                  <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                    {activeRole.toUpperCase()}
                  </span>
                )}
                <Link to="/dashboard">
                  <Button variant="ghost" size="sm">
                    Dashboard
                  </Button>
                </Link>
                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                  <User size={18} />
                </div>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost">Log in</Button>
                </Link>
                <Link to="/register">
                  <Button>Sign up</Button>
                </Link>
              </>
            )}
          </div>

          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={cn("sm:hidden", isMobileMenuOpen ? "block" : "hidden")}>
        <div className="space-y-1 pb-3 pt-2">
          <Link
            to="/"
            className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700"
          >
            Home
          </Link>
          <Link
            to="/catalog"
            className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700"
          >
            Catalog
          </Link>
        </div>
        <div className="border-t border-gray-200 pb-3 pt-4">
          {isLoggedIn ? (
            <div className="space-y-1">
              <div className="flex items-center px-4 mb-2">
                 {activeRole && (
                    <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                      {activeRole.toUpperCase()}
                    </span>
                  )}
              </div>
              <Link
                to="/dashboard"
                className="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
              >
                Dashboard
              </Link>
            </div>
          ) : (
            <div className="flex flex-col space-y-2 px-4">
              <Link to="/login" className="w-full">
                <Button variant="outline" className="w-full">Log in</Button>
              </Link>
              <Link to="/register" className="w-full">
                <Button className="w-full">Sign up</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
