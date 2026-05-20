"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  RiAddCircleLine,
  RiBuildingLine,
  RiCalendarCheckLine,
  RiDoorOpenLine,
  RiFacebookFill,
  RiHomeLine,
  RiHotelLine,
  RiInformationLine,
  RiInstagramLine,
  RiLinkedinFill,
  RiTwitterXLine,
} from "react-icons/ri";
import { authClient } from "@/lib/auth-client";

const LOGO_WIDTH = 714;
const LOGO_HEIGHT = 268;

const Footer = () => {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const usefulLinks = [
    { href: "/", label: "Home", icon: RiHomeLine },
    { href: "/rooms", label: "Rooms", icon: RiHotelLine },
    { href: "/about", label: "About", icon: RiInformationLine },
  ];

  const privateRoutes = [
    { href: "/add-room", label: "Add Room", icon: RiAddCircleLine },
    { href: "/my-listings", label: "My Listings", icon: RiBuildingLine },
    { href: "/my-bookings", label: "My Bookings", icon: RiCalendarCheckLine },
    { href: "/rooms", label: "Room Details", icon: RiDoorOpenLine },
  ];

  const socialLinks = [
    { href: "https://facebook.com", label: "Facebook", icon: RiFacebookFill },
    { href: "https://x.com", label: "X", icon: RiTwitterXLine },
    { href: "https://linkedin.com", label: "LinkedIn", icon: RiLinkedinFill },
    {
      href: "https://instagram.com",
      label: "Instagram",
      icon: RiInstagramLine,
    },
  ];

  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-indigo-100/80 bg-[radial-gradient(circle_at_20%_0%,rgba(129,140,248,0.14),transparent_42%),radial-gradient(circle_at_80%_100%,rgba(167,139,250,0.12),transparent_40%),linear-gradient(180deg,#f8faff_0%,#ffffff_55%,#f5f3ff_100%)]">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-16 top-0 size-56 rounded-full bg-indigo-200/25 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-12 bottom-0 size-48 rounded-full bg-violet-200/20 blur-3xl"
      />
      <div className="container relative mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <Link
              href="/"
              className="mb-4 inline-flex transition-opacity hover:opacity-90"
            >
              <Image
                src="/QuietHub.png"
                alt="QuietHub"
                width={LOGO_WIDTH}
                height={LOGO_HEIGHT}
                className="h-8 w-auto sm:h-9"
              />
            </Link>
            <p className="mb-4 text-sm leading-relaxed text-stone-500">
              Book distraction-free study rooms in minutes. Host your own room
              and build recurring income.
            </p>
            <div className="space-y-2">
              <p className="text-sm text-stone-600">contact@QuietHub.com</p>
              <p className="text-sm text-stone-600">+1 (555) 123-4567</p>
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-lg font-semibold text-stone-900">
              Explore
            </h4>
            <ul className="space-y-3">
              {usefulLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="flex items-center gap-2 text-sm text-stone-600 transition-colors duration-150 hover:text-indigo-600"
                  >
                    <link.icon className="text-base" />
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-lg font-semibold text-stone-900">
              {user ? "Workspace" : "Private"}
            </h4>
            {!user && (
              <p className="-mt-2 mb-4 text-xs text-stone-500">
                Sign in to access
              </p>
            )}
            <ul className="space-y-3">
              {privateRoutes.map((route) => (
                <li key={route.label}>
                  <Link
                    href={route.href}
                    className="flex items-center gap-2 text-sm text-stone-600 transition-colors duration-150 hover:text-indigo-600"
                  >
                    <route.icon className="text-base" />
                    <span>{route.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-lg font-semibold text-stone-900">
              Follow updates
            </h4>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex size-10 items-center justify-center rounded-full border border-indigo-100 bg-white text-stone-500 shadow-sm transition-all duration-150 hover:border-indigo-200 hover:text-indigo-600 hover:shadow-md"
                  aria-label={social.label}
                >
                  <social.icon className="text-xl" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-indigo-100/80 pt-8 text-center sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-stone-500">
            © {currentYear} QuietHub. All rights reserved.
          </p>
          <p className="text-xs text-stone-400">
            Designed for deep focus sessions.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
