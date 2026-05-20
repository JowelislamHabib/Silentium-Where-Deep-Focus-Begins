"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Avatar, Button } from "@heroui/react";
import {
  RiAddLine,
  RiArrowRightLine,
  RiBuildingLine,
  RiCalendarCheckLine,
  RiDoorOpenLine,
  RiLogoutBoxLine,
  RiMailLine,
  RiMoneyDollarCircleLine,
  RiPencilLine,
  RiSparklingLine,
  RiTimeLine,
  RiUserLine,
} from "react-icons/ri";
import { authClient } from "@/lib/auth-client";
import { formatDisplayTime } from "@/lib/booking-time";
import AnimatedCounter from "@/app/Components/AnimatedCounter";
import { UserUpdate } from "@/app/Components/UserUpdate";

const surfaceCard =
  "overflow-hidden rounded-3xl border border-stone-200/90 bg-white/90 shadow-sm ring-1 ring-stone-900/5";

const formatDisplayDate = (date) => {
  if (!date) return "";
  const parsed = new Date(`${date}T12:00:00`);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
};

const formatMemberSince = (date) => {
  if (!date) return null;
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
};

const quickLinks = [
  {
    href: "/my-bookings",
    label: "My bookings",
    description: "View, reschedule, or cancel sessions",
    icon: RiCalendarCheckLine,
  },
  {
    href: "/rooms",
    label: "Browse rooms",
    description: "Find your next focus space",
    icon: RiDoorOpenLine,
  },
  {
    href: "/my-listings",
    label: "My listings",
    description: "Manage spaces you host",
    icon: RiBuildingLine,
  },
  {
    href: "/add-room",
    label: "List a room",
    description: "Share a focus space with others",
    icon: RiAddLine,
  },
];

const MyProfilePage = () => {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const [bookings, setBookings] = useState([]);
  const [listingCount, setListingCount] = useState(0);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);

  useEffect(() => {
    if (!user?.id) {
      setIsLoadingStats(false);
      return;
    }

    let cancelled = false;

    const loadStats = async () => {
      setIsLoadingStats(true);
      try {
        const base = process.env.NEXT_PUBLIC_SERVER_URL;
        const [bookingsRes, listingsRes] = await Promise.all([
          fetch(`${base}/my-bookings/${user.id}`, { cache: "no-store" }),
          fetch(`${base}/my-listings/${user.id}`, { cache: "no-store" }),
        ]);

        if (cancelled) return;

        const bookingsData = await bookingsRes.json();
        const listingsData = await listingsRes.json();

        setBookings(Array.isArray(bookingsData) ? bookingsData : []);
        setListingCount(
          Array.isArray(listingsData) ? listingsData.length : 0,
        );
      } catch {
        if (!cancelled) {
          setBookings([]);
          setListingCount(0);
        }
      } finally {
        if (!cancelled) setIsLoadingStats(false);
      }
    };

    loadStats();

    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/login");
    router.refresh();
  };

  const totalSpent = bookings.reduce(
    (sum, booking) => sum + (Number(booking.totalCost) || 0),
    0,
  );
  const recentBookings = bookings.slice(0, 3);
  const memberSince = formatMemberSince(user?.createdAt);

  const stats = [
    {
      label: "Active bookings",
      value: bookings.length,
      icon: RiCalendarCheckLine,
      accent: "text-stone-900",
    },
    {
      label: "Listed rooms",
      value: listingCount,
      icon: RiBuildingLine,
      accent: "text-indigo-600",
    },
    {
      label: "Total spent",
      value: totalSpent,
      icon: RiMoneyDollarCircleLine,
      accent: "text-indigo-600",
      isCurrency: true,
    },
  ];

  return (
    <section className="min-h-screen bg-[radial-gradient(circle_at_12%_0%,rgba(129,140,248,0.1),transparent_40%),radial-gradient(circle_at_88%_100%,rgba(167,139,250,0.08),transparent_38%),linear-gradient(180deg,#f8faff_0%,#fafaf9_50%,#ffffff_100%)]">
      <div className="relative overflow-hidden border-b border-indigo-100/60 bg-linear-to-br from-indigo-100/50 via-white to-violet-50">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 top-0 size-72 rounded-full bg-indigo-300/25 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-16 left-1/4 size-56 rounded-full bg-violet-200/25 blur-3xl"
        />
        <div className="container relative mx-auto px-4 py-12 lg:py-16">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex min-w-0 items-start gap-5 sm:items-center">
              <Avatar className="size-20 shrink-0 rounded-full border-4 border-white shadow-md ring-2 ring-indigo-100 sm:size-24">
                {user?.image ? (
                  <Avatar.Image
                    src={user.image}
                    alt={user?.name ?? "Profile"}
                    referrerPolicy="no-referrer"
                  />
                ) : null}
                <Avatar.Fallback className="bg-indigo-100 text-2xl font-bold text-indigo-700">
                  {user?.name?.charAt(0) ?? "?"}
                </Avatar.Fallback>
              </Avatar>
              <div className="min-w-0 space-y-3">
                <p className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-indigo-700 shadow-sm ring-1 ring-indigo-100">
                  <RiSparklingLine className="size-3.5" />
                  Your profile
                </p>
                <h1 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
                  {isPending ? "Loading…" : (user?.name ?? "Guest")}
                </h1>
                <p className="flex max-w-md items-center gap-2 text-sm text-stone-600">
                  <RiMailLine className="size-4 shrink-0 text-indigo-500" />
                  <span className="truncate">
                    {user?.email ?? "Sign in to view your profile"}
                  </span>
                </p>
                {memberSince && (
                  <p className="text-xs font-medium text-stone-500">
                    Member since {memberSince}
                  </p>
                )}
              </div>
            </div>

            <div className="flex shrink-0 flex-wrap items-center gap-2">
              <UserUpdate
                user={user}
                isOpen={isUpdateOpen}
                onOpenChange={setIsUpdateOpen}
                customTrigger={
                  <Button
                    onPress={() => setIsUpdateOpen(true)}
                    className="flex h-11 items-center gap-2 rounded-full bg-stone-900 px-5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 hover:shadow-md"
                  >
                    <RiPencilLine className="size-4" />
                    Edit profile
                  </Button>
                }
              />
              <Button
                onPress={handleLogout}
                className="flex h-11 items-center gap-2 rounded-full border border-stone-200 bg-white px-5 text-sm font-semibold text-stone-800 shadow-sm transition-all hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700"
              >
                <RiLogoutBoxLine className="size-4" />
                Sign out
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 lg:py-12">
        <div className="mb-10 grid gap-3 sm:grid-cols-3">
          {stats.map(({ label, value, icon: Icon, accent, isCurrency }) => (
            <div
              key={label}
              className="rounded-2xl border border-white/80 bg-white/80 px-6 py-5 shadow-sm ring-1 ring-indigo-100/80 backdrop-blur-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className={`text-2xl font-bold ${accent}`}>
                    {isLoadingStats ? (
                      "—"
                    ) : isCurrency ? (
                      <AnimatedCounter
                        target={value}
                        prefix="$"
                        decimals={2}
                        duration={2000}
                      />
                    ) : (
                      <AnimatedCounter target={value} duration={1800} />
                    )}
                  </p>
                  <p className="mt-1 text-xs font-medium uppercase tracking-wide text-stone-500">
                    {label}
                  </p>
                </div>
                <span className="flex size-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 ring-1 ring-indigo-100">
                  <Icon className="size-5" />
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mb-10">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold tracking-tight text-stone-900">
                Quick actions
              </h2>
              <p className="mt-1 text-sm text-stone-500">
                Jump to bookings, rooms, or hosting tools.
              </p>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {quickLinks.map(({ href, label, description, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="group flex items-center justify-between gap-4 rounded-2xl border border-stone-200/90 bg-white/90 p-5 shadow-sm ring-1 ring-stone-900/5 transition-all hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md hover:shadow-indigo-100/40"
              >
                <div className="flex min-w-0 items-start gap-4">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 ring-1 ring-indigo-100 transition-colors group-hover:bg-indigo-100">
                    <Icon className="size-5" />
                  </span>
                  <div>
                    <p className="font-semibold text-stone-900">{label}</p>
                    <p className="mt-0.5 text-sm leading-relaxed text-stone-500">
                      {description}
                    </p>
                  </div>
                </div>
                <RiArrowRightLine className="size-5 shrink-0 text-stone-300 transition-all group-hover:translate-x-0.5 group-hover:text-indigo-600" />
              </Link>
            ))}
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
          <div className={surfaceCard}>
            <div className="flex items-center justify-between gap-3 border-b border-stone-200/90 bg-stone-50/40 px-6 py-4">
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-stone-900">
                  Recent bookings
                </h2>
                <p className="mt-0.5 text-xs text-stone-500">
                  Latest sessions on your account
                </p>
              </div>
              {bookings.length > 0 && (
                <Link
                  href="/my-bookings"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 transition-colors hover:text-indigo-700"
                >
                  View all
                  <RiArrowRightLine className="size-3.5" />
                </Link>
              )}
            </div>

            {isLoadingStats ? (
              <div className="space-y-3 p-6">
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className="h-20 animate-pulse rounded-2xl bg-stone-100"
                  />
                ))}
              </div>
            ) : recentBookings.length === 0 ? (
              <div className="grid place-items-center gap-4 px-6 py-12 text-center">
                <span className="flex size-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 ring-1 ring-indigo-100">
                  <RiCalendarCheckLine className="size-7" />
                </span>
                <div>
                  <p className="font-semibold text-stone-900">No bookings yet</p>
                  <p className="mt-1 text-sm text-stone-500">
                    Reserve a focus room to see sessions here.
                  </p>
                </div>
                <Link
                  href="/rooms"
                  className="inline-flex h-11 items-center justify-center rounded-full bg-stone-900 px-6 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700"
                >
                  Browse rooms
                </Link>
              </div>
            ) : (
              <ul className="divide-y divide-stone-100">
                {recentBookings.map((booking) => {
                  const room = booking.room ?? {};
                  const roomName =
                    room.name ?? booking.roomName ?? "Focus space";
                  const roomImage =
                    room.image ||
                    "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=200";

                  return (
                    <li key={booking._id}>
                      <Link
                        href="/my-bookings"
                        className="flex items-center gap-4 p-4 transition-colors hover:bg-indigo-50/30 sm:p-5"
                      >
                        <div className="relative size-16 shrink-0 overflow-hidden rounded-2xl bg-stone-100 ring-1 ring-stone-200/80">
                          <Image
                            src={roomImage}
                            alt={roomName}
                            fill
                            unoptimized
                            sizes="64px"
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-semibold text-stone-900">
                            {roomName}
                          </p>
                          <p className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-stone-500">
                            <span className="inline-flex items-center gap-1">
                              <RiCalendarCheckLine className="size-3.5 text-indigo-500" />
                              {formatDisplayDate(booking.date)}
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <RiTimeLine className="size-3.5 text-indigo-500" />
                              {formatDisplayTime(booking.startTime)} –{" "}
                              {formatDisplayTime(booking.endTime)}
                            </span>
                          </p>
                        </div>
                        <p className="shrink-0 text-sm font-bold text-indigo-600">
                          ${Number(booking.totalCost).toFixed(2)}
                        </p>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <div className={surfaceCard}>
            <div className="border-b border-stone-200/90 bg-linear-to-r from-indigo-50/60 via-white to-violet-50/30 px-6 py-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-stone-900">
                    Account details
                  </h2>
                  <p className="mt-0.5 text-xs text-stone-500">
                    Info shown across bookings & listings
                  </p>
                </div>
                <Button
                  onPress={() => setIsUpdateOpen(true)}
                  className="h-9 rounded-full border border-indigo-100 bg-white px-3 text-xs font-semibold text-indigo-700 shadow-sm hover:bg-indigo-50"
                  variant="light"
                >
                  <RiPencilLine className="size-3.5" />
                  Edit
                </Button>
              </div>
            </div>
            <dl className="divide-y divide-stone-100">
              {[
                {
                  icon: RiUserLine,
                  label: "Full name",
                  value: user?.name ?? "—",
                },
                {
                  icon: RiMailLine,
                  label: "Email",
                  value: user?.email ?? "—",
                  breakAll: true,
                },
                ...(memberSince
                  ? [
                      {
                        icon: RiSparklingLine,
                        label: "Member since",
                        value: memberSince,
                      },
                    ]
                  : []),
              ].map(({ icon: Icon, label, value, breakAll }) => (
                <div
                  key={label}
                  className="flex items-start gap-3 px-6 py-4"
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 ring-1 ring-indigo-100">
                    <Icon className="size-4" />
                  </span>
                  <div className="min-w-0">
                    <dt className="text-[10px] font-semibold uppercase tracking-[0.12em] text-stone-400">
                      {label}
                    </dt>
                    <dd
                      className={`mt-1 font-medium text-stone-800 ${breakAll ? "break-all" : ""}`}
                    >
                      {value}
                    </dd>
                  </div>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <p className="mt-10 text-center">
          <Link
            href="/"
            className="text-sm font-medium text-stone-500 transition-colors hover:text-stone-800"
          >
            ← Back to home
          </Link>
        </p>
      </div>
    </section>
  );
};

export default MyProfilePage;
