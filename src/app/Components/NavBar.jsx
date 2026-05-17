"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Avatar, Button, Dropdown } from "@heroui/react";
import {
  RiCloseLine,
  RiLogoutBoxLine,
  RiMenuLine,
  RiUserAddLine,
  RiUserLine,
} from "react-icons/ri";

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full bg-stone-50 border-b border-stone-200">
      <div className="container mx-auto px-4">
        <div className="h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 no-underline">
            <span className="font-heading font-bold text-2xl text-gray-900">
              Silentium
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="font-sans text-sm font-medium text-indigo-500 no-underline transition-colors duration-150"
            >
              Home
            </Link>
            <Link
              href="/rooms"
              className="font-sans text-sm font-medium text-gray-500 hover:text-gray-900 no-underline transition-colors duration-150"
            >
              Rooms
            </Link>
            <Link
              href="/add-room"
              className="font-sans text-sm font-medium text-gray-500 hover:text-gray-900 no-underline transition-colors duration-150"
            >
              Add Room
            </Link>
            <Link
              href="/my-listings"
              className="font-sans text-sm font-medium text-gray-500 hover:text-gray-900 no-underline transition-colors duration-150"
            >
              My Listings
            </Link>
            <Link
              href="/my-bookings"
              className="font-sans text-sm font-medium text-gray-500 hover:text-gray-900 no-underline transition-colors duration-150"
            >
              My Bookings
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="font-sans text-sm font-medium text-gray-500 hover:text-gray-900 no-underline transition-colors duration-150"
              >
                Sign In
              </Link>
              <Button
                as={Link}
                href="/register"
                className="bg-indigo-500 text-white font-sans text-sm font-medium rounded-full px-4 py-2 transition-colors duration-150 hover:bg-indigo-600 flex items-center gap-2"
              >
                <RiUserAddLine className="text-lg" />
                Register
              </Button>
            </div>

            <div className="h-6 w-px bg-stone-200" />

            <Dropdown placement="bottom-end">
              <Dropdown.Trigger className="outline-none">
                <div className="flex items-center gap-3 cursor-pointer">
                  <div className="text-right hidden lg:block">
                    <p className="font-sans font-medium text-sm text-gray-900 leading-none">
                      User Name
                    </p>
                  </div>
                  <Avatar
                    className="w-10 h-10 border border-stone-200 rounded-full"
                    src="https://i.pravatar.cc/300"
                    name="U"
                  />
                </div>
              </Dropdown.Trigger>

              <Dropdown.Popover className="bg-stone-100 border border-stone-200 rounded-xl shadow-md p-2 w-60">
                <div className="px-4 py-3 mb-2 bg-stone-50 rounded-lg border border-stone-200">
                  <p className="font-sans font-normal text-xs text-gray-500 mb-1">
                    Reservations Account
                  </p>
                  <p className="font-sans font-medium text-sm text-gray-900 truncate">
                    user@example.com
                  </p>
                </div>

                <Dropdown.Menu className="p-0">
                  <Dropdown.Item
                    id="profile"
                    className="rounded-lg hover:bg-stone-50"
                  >
                    <Link
                      href="/my-profile"
                      className="flex w-full items-center justify-between no-underline py-1"
                    >
                      <span className="font-sans font-medium text-sm text-gray-900">
                        Account
                      </span>
                      <span className="text-gray-500">
                        <RiUserLine className="text-lg" />
                      </span>
                    </Link>
                  </Dropdown.Item>

                  <Dropdown.Item
                    id="logout"
                    className="rounded-lg mt-1 border-t border-stone-200 pt-2 hover:bg-stone-50"
                  >
                    <div className="flex w-full items-center justify-between py-1 cursor-pointer">
                      <span className="font-sans font-medium text-sm text-gray-900">
                        Sign Out
                      </span>
                      <span className="text-gray-500">
                        <RiLogoutBoxLine className="text-lg" />
                      </span>
                    </div>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown.Popover>
            </Dropdown>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-gray-900 bg-stone-100 rounded-full hover:bg-stone-200 transition-colors duration-150"
          >
            {isOpen ? (
              <RiCloseLine className="text-xl" />
            ) : (
              <RiMenuLine className="text-xl" />
            )}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden bg-stone-50 border-t border-stone-200 py-8 space-y-6">
            <div className="space-y-4">
              <Link
                href="/"
                className="block font-heading font-semibold text-xl text-indigo-500 no-underline"
              >
                Home
              </Link>
              <Link
                href="/rooms"
                className="block font-heading font-semibold text-xl text-gray-900 no-underline"
              >
                Rooms
              </Link>
              <Link
                href="/add-room"
                className="block font-heading font-semibold text-xl text-gray-900 no-underline"
              >
                Add Room
              </Link>
              <Link
                href="/my-listings"
                className="block font-heading font-semibold text-xl text-gray-900 no-underline"
              >
                My Listings
              </Link>
              <Link
                href="/my-bookings"
                className="block font-heading font-semibold text-xl text-gray-900 no-underline"
              >
                My Bookings
              </Link>
            </div>

            <div className="pt-6 border-t border-stone-200 space-y-6">
              <div className="flex flex-col gap-4">
                <Link
                  href="/login"
                  className="block text-center py-2.5 rounded-full border border-stone-200 bg-stone-100 text-gray-900 font-sans text-sm font-medium no-underline"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="block text-center py-2.5 rounded-full bg-indigo-500 text-white font-sans text-sm font-medium no-underline flex items-center justify-center gap-2"
                >
                  <RiUserAddLine className="text-lg" />
                  Register
                </Link>
              </div>

              <div className="space-y-4 pt-4 border-t border-stone-200">
                <Link
                  href="/my-profile"
                  className="block font-heading font-semibold text-xl text-gray-900 no-underline"
                >
                  Account
                </Link>
                <div className="block font-heading font-semibold text-xl text-gray-500 cursor-pointer">
                  Sign Out
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
