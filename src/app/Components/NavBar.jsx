"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Avatar, Button, Dropdown } from "@heroui/react";
import {
  RiAddCircleLine,
  RiCalendarScheduleLine,
  RiHomeLine,
  RiLogoutBoxLine,
  RiSearchLine,
  RiSparklingLine,
  RiStackLine,
  RiUserAddLine,
  RiUserLine,
} from "react-icons/ri";

const dropdownItemClass =
  "rounded-xl px-2 py-1 outline-none transition-colors data-[hover=true]:bg-indigo-50/80 data-[focus-visible=true]:bg-indigo-50/80";

const dropdownIconBoxClass =
  "flex size-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 ring-1 ring-indigo-100";

const mobileNavIconBoxClass =
  "flex size-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 ring-1 ring-indigo-100";

import { authClient } from "@/lib/auth-client";

function MobileMenuButton({ isOpen, onToggle }) {
  return (
    <button
      type="button"
      aria-label={isOpen ? "Close menu" : "Open menu"}
      aria-expanded={isOpen}
      onClick={onToggle}
      className="relative flex size-11 items-center justify-center rounded-full border border-stone-200/90 bg-white shadow-sm ring-1 ring-stone-900/5 transition-colors hover:border-indigo-200 hover:bg-indigo-50/50 md:hidden"
    >
      <span className="sr-only">{isOpen ? "Close menu" : "Open menu"}</span>
      <span className="relative block h-3.5 w-5">
        <span
          className={`absolute left-0 block h-0.5 w-5 rounded-full bg-stone-900 transition-all duration-300 ease-out ${
            isOpen ? "top-1.5 rotate-45" : "top-0"
          }`}
        />
        <span
          className={`absolute left-0 top-1.5 block h-0.5 w-5 rounded-full bg-stone-900 transition-all duration-300 ease-out ${
            isOpen ? "scale-x-0 opacity-0" : "scale-x-100 opacity-100"
          }`}
        />
        <span
          className={`absolute left-0 block h-0.5 w-5 rounded-full bg-stone-900 transition-all duration-300 ease-out ${
            isOpen ? "top-1.5 -rotate-45" : "top-3"
          }`}
        />
      </span>
    </button>
  );
}

const LOGO_WIDTH = 714;
const LOGO_HEIGHT = 268;

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
    `rounded-full px-4 py-2 font-sans text-sm font-semibold no-underline transition-all duration-200 ${
      pathname === path
        ? "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-100"
        : "text-stone-600 hover:bg-white hover:text-stone-900"
    }`;

  const closeMobileMenu = () => setIsOpen(false);

  const mobileNavLinkClass = (path) =>
    `flex w-full items-center gap-3 rounded-2xl border px-3 py-3 no-underline transition-all duration-200 ${
      pathname === path
        ? "border-indigo-200 bg-indigo-50/80 shadow-sm ring-1 ring-indigo-100"
        : "border-stone-200/80 bg-white hover:border-indigo-200 hover:bg-indigo-50/40"
    }`;

  const primaryMobileLinks = [
    { href: "/", label: "Home", icon: RiHomeLine, sub: "Back to landing" },
    { href: "/rooms", label: "Rooms", icon: RiSearchLine, sub: "Browse study spaces" },
  ];

  const authMobileLinks = user
    ? [
        {
          href: "/add-room",
          label: "Add Room",
          icon: RiAddCircleLine,
          sub: "List a new space",
        },
        {
          href: "/my-listings",
          label: "My Listings",
          icon: RiStackLine,
          sub: "Manage your rooms",
        },
        {
          href: "/my-bookings",
          label: "My Bookings",
          icon: RiCalendarScheduleLine,
          sub: "Upcoming reservations",
        },
      ]
    : [];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/80 bg-white/60 backdrop-blur-xl">
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          <Link
            href="/"
            className="inline-flex shrink-0 items-center no-underline transition-opacity hover:opacity-90"
          >
            <Image
              src="/Silentium.png"
              alt="Silentium"
              width={LOGO_WIDTH}
              height={LOGO_HEIGHT}
              priority
              className="h-9 w-auto sm:h-10"
            />
          </Link>

          <div className="hidden items-center gap-2 rounded-full border border-stone-200/80 bg-white/80 p-1 shadow-sm md:flex">
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

          <div className="hidden md:flex items-center gap-4">
            {!user ? (
              <div className="flex items-center gap-2">
                <Link href="/login" className={navLinkClass("/login")}>
                  Sign In
                </Link>

                <Link href="/register">
                  <Button className="flex items-center gap-2 rounded-full bg-stone-900 px-4 py-2 font-sans text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-indigo-700 hover:shadow-md">
                    <RiUserAddLine className="text-lg" />
                    Create account
                  </Button>
                </Link>
              </div>
            ) : (
              <>
                <div className="h-6 w-px bg-stone-200" />

                <Dropdown placement="bottom-end">
                  <Dropdown.Trigger className="rounded-full outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-indigo-500/25">
                    <div className="flex cursor-pointer items-center gap-2.5 rounded-full border border-stone-200/90 bg-white/90 py-1.5 pl-3 pr-1.5 shadow-sm ring-1 ring-stone-900/5 transition-all hover:border-indigo-200 hover:shadow-md sm:gap-3 sm:pl-4">
                      <p className="hidden max-w-36 truncate text-sm font-semibold text-stone-900 lg:block">
                        {user?.name || "Account"}
                      </p>

                      <Avatar className="size-10 shrink-0 rounded-full border-2 border-white object-cover shadow-sm ring-1 ring-indigo-100">
                        <Avatar.Image
                          referrerPolicy="no-referrer"
                          alt={user?.name}
                          src={user?.image}
                        />
                        <Avatar.Fallback className="bg-indigo-50 text-sm font-semibold text-indigo-700">
                          {user?.name?.charAt(0) ?? "S"}
                        </Avatar.Fallback>
                      </Avatar>
                    </div>
                  </Dropdown.Trigger>

                  <Dropdown.Popover className="w-72 overflow-hidden rounded-2xl border border-stone-200/90 bg-white/95 p-0 shadow-xl shadow-indigo-100/35 ring-1 ring-stone-900/5 backdrop-blur-xl">
                    <div className="border-b border-stone-200/90 bg-linear-to-r from-indigo-50/90 via-white to-violet-50/50 px-4 py-4">
                      <p className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-indigo-600">
                        <RiSparklingLine className="size-3" />
                        Signed in
                      </p>
                      <div className="mt-3 flex items-center gap-3">
                        <Avatar className="size-11 shrink-0 rounded-full border-2 border-white shadow-sm ring-1 ring-indigo-100">
                          <Avatar.Image
                            referrerPolicy="no-referrer"
                            alt={user?.name}
                            src={user?.image}
                          />
                          <Avatar.Fallback className="bg-indigo-100 text-sm font-semibold text-indigo-700">
                            {user?.name?.charAt(0) ?? "S"}
                          </Avatar.Fallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-stone-900">
                            {user?.name || "Silentium member"}
                          </p>
                          <p className="truncate text-xs text-stone-500">
                            {user?.email || "user@example.com"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <Dropdown.Menu className="gap-0.5 p-2">
                      <Dropdown.Item
                        key="profile"
                        className={dropdownItemClass}
                        textValue="Account"
                      >
                        <Link
                          href="/my-profile"
                          className="flex w-full items-center gap-3 py-1.5 no-underline"
                        >
                          <span className={dropdownIconBoxClass}>
                            <RiUserLine className="size-[18px]" />
                          </span>
                          <span>
                            <span className="block text-sm font-semibold text-stone-900">
                              My profile
                            </span>
                            <span className="block text-xs text-stone-500">
                              Account & preferences
                            </span>
                          </span>
                        </Link>
                      </Dropdown.Item>
                    </Dropdown.Menu>

                    <div className="border-t border-stone-200/90 bg-stone-50/50 p-3">
                      <Button
                        type="button"
                        onPress={handleLogout}
                        className="flex h-10 w-full items-center justify-center gap-2 rounded-full border border-stone-200 bg-white text-sm font-semibold text-stone-900 shadow-sm transition-all hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700"
                      >
                        <RiLogoutBoxLine className="size-[18px]" />
                        Sign out
                      </Button>
                    </div>
                  </Dropdown.Popover>
                </Dropdown>
              </>
            )}
          </div>

          <MobileMenuButton
            isOpen={isOpen}
            onToggle={() => setIsOpen((open) => !open)}
          />
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              key="mobile-menu"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden border-t border-stone-200/90 md:hidden"
            >
              <div className="space-y-5 bg-linear-to-b from-indigo-50/40 via-white to-white px-1 py-6">
                <p className="px-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-indigo-600">
                  Menu
                </p>

                <nav className="flex flex-col gap-2.5">
                  {[...primaryMobileLinks, ...authMobileLinks].map(
                    (item, index) => {
                      const Icon = item.icon;
                      return (
                        <motion.div
                          key={item.href}
                          initial={{ opacity: 0, x: -12 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{
                            delay: 0.05 + index * 0.04,
                            duration: 0.25,
                          }}
                        >
                          <Link
                            href={item.href}
                            onClick={closeMobileMenu}
                            className={mobileNavLinkClass(item.href)}
                          >
                            <span className={mobileNavIconBoxClass}>
                              <Icon className="size-5" />
                            </span>
                            <span className="min-w-0 text-left">
                              <span className="block text-sm font-semibold text-stone-900">
                                {item.label}
                              </span>
                              <span className="block text-xs text-stone-500">
                                {item.sub}
                              </span>
                            </span>
                          </Link>
                        </motion.div>
                      );
                    },
                  )}
                </nav>

                {!user ? (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.25 }}
                    className="flex flex-col gap-3 border-t border-stone-200/90 pt-5"
                  >
                    <p className="px-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-stone-500">
                      Account
                    </p>
                    <Link
                      href="/login"
                      onClick={closeMobileMenu}
                      className="flex h-11 items-center justify-center rounded-full border border-stone-200 bg-white text-sm font-semibold text-stone-900 no-underline shadow-sm transition-colors hover:border-indigo-200 hover:bg-indigo-50/50"
                    >
                      Sign in
                    </Link>
                    <Link
                      href="/register"
                      onClick={closeMobileMenu}
                      className="flex h-11 items-center justify-center gap-2 rounded-full bg-stone-900 text-sm font-semibold text-white no-underline shadow-sm transition-colors hover:bg-indigo-700"
                    >
                      <RiUserAddLine className="size-[18px]" />
                      Create account
                    </Link>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.25 }}
                    className="space-y-3 border-t border-stone-200/90 pt-5"
                  >
                    <div className="flex items-center gap-3 rounded-2xl border border-indigo-100 bg-white/90 px-3 py-3 shadow-sm ring-1 ring-indigo-100/80">
                      <Avatar className="size-11 shrink-0 rounded-full border-2 border-white ring-1 ring-indigo-100">
                        <Avatar.Image
                          referrerPolicy="no-referrer"
                          alt={user?.name}
                          src={user?.image}
                        />
                        <Avatar.Fallback className="bg-indigo-50 text-sm font-semibold text-indigo-700">
                          {user?.name?.charAt(0) ?? "S"}
                        </Avatar.Fallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-indigo-600">
                          <RiSparklingLine className="size-3" />
                          Signed in
                        </p>
                        <p className="truncate text-sm font-semibold text-stone-900">
                          {user?.name || "Silentium member"}
                        </p>
                      </div>
                    </div>

                    <Link
                      href="/my-profile"
                      onClick={closeMobileMenu}
                      className={mobileNavLinkClass("/my-profile")}
                    >
                      <span className={mobileNavIconBoxClass}>
                        <RiUserLine className="size-5" />
                      </span>
                      <span className="min-w-0 text-left">
                        <span className="block text-sm font-semibold text-stone-900">
                          My profile
                        </span>
                        <span className="block text-xs text-stone-500">
                          Account & preferences
                        </span>
                      </span>
                    </Link>

                    <Button
                      type="button"
                      onPress={() => {
                        closeMobileMenu();
                        handleLogout();
                      }}
                      className="flex h-11 w-full items-center justify-center gap-2 rounded-full border border-stone-200 bg-white text-sm font-semibold text-stone-900 shadow-sm transition-all hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700"
                    >
                      <RiLogoutBoxLine className="size-[18px]" />
                      Sign out
                    </Button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default NavBar;
