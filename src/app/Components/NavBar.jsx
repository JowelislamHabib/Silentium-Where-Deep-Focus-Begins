"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Avatar, Button, Dropdown } from "@heroui/react";
import {
  RiCloseLine,
  RiLogoutBoxLine,
  RiMenuLine,
  RiUserAddLine,
  RiUserLine,
} from "react-icons/ri";

import { authClient } from "@/lib/auth-client";

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  const { data: session } = authClient.useSession();
  const user = session?.user;

  const handleLogout = async () => {
    await authClient.signOut();

    router.push("/login");
    router.refresh();
  };

  const navLinkClass = (path) =>
    `font-sans text-sm font-medium no-underline transition-colors duration-150 ${
      pathname === path
        ? "text-indigo-500 !font-bold"
        : "text-gray-500  hover:text-gray-900"
    }`;

  const mobileNavLinkClass = (path) =>
    `block font-heading font-semibold text-xl no-underline ${
      pathname === path ? "text-indigo-500 font-bold" : "text-gray-900"
    }`;

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
            <Link href="/" className={navLinkClass("/")}>
              Home
            </Link>

            <Link href="/rooms" className={navLinkClass("/rooms")}>
              Rooms
            </Link>

            {user && (
              <>
                <Link href="/add-room" className={navLinkClass("/add-room")}>
                  Add Room
                </Link>

                <Link
                  href="/my-listings"
                  className={navLinkClass("/my-listings")}
                >
                  My Listings
                </Link>

                <Link
                  href="/my-bookings"
                  className={navLinkClass("/my-bookings")}
                >
                  My Bookings
                </Link>
              </>
            )}
          </div>

          <div className="hidden md:flex items-center gap-6">
            {!user ? (
              <div className="flex items-center gap-4">
                <Link href="/login" className={navLinkClass("/login")}>
                  Sign In
                </Link>

                <Link href="/register">
                  <Button className="bg-indigo-500 text-white font-sans text-sm font-medium rounded-full px-4 py-2 transition-colors duration-150 hover:bg-indigo-600 flex items-center gap-2">
                    <RiUserAddLine className="text-lg" />
                    Register
                  </Button>
                </Link>
              </div>
            ) : (
              <>
                <div className="h-6 w-px bg-stone-200" />

                <Dropdown placement="bottom-end">
                  <Dropdown.Trigger className="outline-none">
                    <div className="rounded-full border-2 pl-4">
                      <div className="flex items-center gap-3 cursor-pointer">
                        <div className="text-right hidden lg:block">
                          <p className="font-sans font-medium text-sm text-gray-900 leading-none">
                            {user?.name || user?.email || "User"}
                          </p>
                        </div>

                        <Avatar className="w-11 h-11 border-2 border-white shadow-md ring-1 ring-zinc-100 object-cover rounded-full">
                          <Avatar.Image
                            referrerPolicy="no-referrer"
                            alt={user?.name}
                            src={user?.image}
                          />
                          <Avatar.Fallback>
                            {user?.name?.charAt(0)}
                          </Avatar.Fallback>
                        </Avatar>
                      </div>
                    </div>
                  </Dropdown.Trigger>

                  <Dropdown.Popover className="bg-stone-100 border border-stone-200 rounded-xl shadow-md p-2 w-60">
                    <div className="px-4 py-3 mb-2 bg-stone-50 rounded-lg border border-stone-200">
                      <p className="font-sans font-normal text-xs text-gray-500 mb-1">
                        Reservations Account
                      </p>

                      <p className="font-sans font-medium text-sm text-gray-900 truncate">
                        {user?.email || "user@example.com"}
                      </p>
                    </div>

                    <Dropdown.Menu className="p-0">
                      <Dropdown.Item
                        key="profile"
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
                        key="logout"
                        className="rounded-lg mt-1 border-t border-stone-200 pt-2 hover:bg-stone-50"
                      >
                        <div
                          onClick={handleLogout}
                          className="flex w-full items-center justify-between py-1 cursor-pointer"
                        >
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
              </>
            )}
          </div>

          <Button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-gray-900 bg-stone-100 rounded-full hover:bg-stone-200 transition-colors duration-150"
          >
            {isOpen ? (
              <RiCloseLine className="text-xl" />
            ) : (
              <RiMenuLine className="text-xl" />
            )}
          </Button>
        </div>

        {isOpen && (
          <div className="md:hidden bg-stone-50 border-t border-stone-200 py-8 space-y-6">
            <div className="space-y-4">
              <Link href="/" className={mobileNavLinkClass("/")}>
                Home
              </Link>

              <Link href="/rooms" className={mobileNavLinkClass("/rooms")}>
                Rooms
              </Link>

              {user && (
                <>
                  <Link
                    href="/add-room"
                    className={mobileNavLinkClass("/add-room")}
                  >
                    Add Room
                  </Link>

                  <Link
                    href="/my-listings"
                    className={mobileNavLinkClass("/my-listings")}
                  >
                    My Listings
                  </Link>

                  <Link
                    href="/my-bookings"
                    className={mobileNavLinkClass("/my-bookings")}
                  >
                    My Bookings
                  </Link>
                </>
              )}
            </div>

            {!user ? (
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
              </div>
            ) : (
              <div className="space-y-4 pt-4 border-t border-stone-200">
                <Link
                  href="/my-profile"
                  className={mobileNavLinkClass("/my-profile")}
                >
                  Account
                </Link>

                <div
                  onClick={handleLogout}
                  className="block font-heading font-semibold text-xl text-gray-500 cursor-pointer"
                >
                  Sign Out
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
