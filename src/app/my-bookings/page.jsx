import Image from "next/image";
import Link from "next/link";
import {
  RiCalendarCheckLine,
  RiCheckboxCircleLine,
  RiHistoryLine,
  RiMapPinLine,
  RiSparklingLine,
  RiTimeLine,
  RiUserLine,
} from "react-icons/ri";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import AnimatedCounter from "../Components/AnimatedCounter";
import RescheduleBookingButton from "../Components/RescheduleBookingButton";
import CancelBookingButton from "../Components/CancelBookingButton";
import {
  formatDisplayTime,
  isBookingBeforeToday,
  isBookingOnOrAfterToday,
  parseBookingDate,
} from "@/lib/booking-time";

export const metadata = {
  title: "My Bookings",
};

const normalizeBookingStatus = (status) => {
  const value = String(status || "confirmed").toLowerCase();
  if (value === "cancelled" || value === "canceled") return "cancelled";
  return "confirmed";
};

const getDisplayStatus = (booking) => {
  const status = normalizeBookingStatus(booking.status);
  if (status === "confirmed" && isBookingBeforeToday(booking.date)) {
    return "completed";
  }
  return status;
};

const statusBadgeStyles = {
  confirmed: "bg-emerald-50 text-emerald-700 ring-emerald-200/80",
  cancelled: "bg-rose-50 text-rose-700 ring-rose-200/80",
  completed: "bg-stone-100 text-stone-600 ring-stone-200/80",
};

const sortBookings = (bookings) =>
  [...bookings].sort((a, b) => {
    const aUpcoming =
      getDisplayStatus(a) === "confirmed" || getDisplayStatus(a) === "cancelled"
        ? isBookingOnOrAfterToday(a.date)
        : false;
    const bUpcoming =
      getDisplayStatus(b) === "confirmed" || getDisplayStatus(b) === "cancelled"
        ? isBookingOnOrAfterToday(b.date)
        : false;

    if (aUpcoming !== bUpcoming) return aUpcoming ? -1 : 1;

    const aParts = parseBookingDate(a.date);
    const bParts = parseBookingDate(b.date);
    if (!aParts || !bParts) return 0;

    const aDay = new Date(aParts.year, aParts.month - 1, aParts.day).getTime();
    const bDay = new Date(bParts.year, bParts.month - 1, bParts.day).getTime();
    return bDay - aDay;
  });

const formatDisplayDate = (date) => {
  if (!date) return "";
  const parsed = new Date(`${date}T12:00:00`);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const MyBookingsPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const { token } = await auth.api.getToken({
    headers: await headers(),
  });

  const userId = session?.user?.id;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/my-bookings/${userId}`,
    {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const bookings = await res.json();
  const bookingList = sortBookings(Array.isArray(bookings) ? bookings : []);

  const bookingStats = bookingList.reduce(
    (acc, booking) => {
      const displayStatus = getDisplayStatus(booking);
      if (displayStatus === "completed") acc.completed += 1;
      else if (displayStatus === "cancelled") acc.cancelled += 1;
      else if (
        displayStatus === "confirmed" &&
        isBookingOnOrAfterToday(booking.date)
      ) {
        acc.active += 1;
      }
      acc.totalCost += Number(booking.totalCost) || 0;
      return acc;
    },
    { active: 0, completed: 0, cancelled: 0, totalCost: 0 },
  );

  return (
    <section className="min-h-screen bg-stone-50">
      <div className="relative overflow-hidden border-b border-indigo-100/60 bg-gradient-to-br from-indigo-100/50 via-white to-violet-50">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 top-0 size-72 rounded-full bg-indigo-300/25 blur-3xl"
        />
        <div className="container relative mx-auto px-4 py-12 lg:py-16">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <div className="min-w-0 space-y-4">
              <p className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-700 ring-1 ring-indigo-100">
                <RiSparklingLine className="size-3.5" />
                Your Bookings
              </p>
              <h1 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
                My Bookings
              </h1>
              <p className="text-base leading-relaxed text-stone-600 sm:text-lg">
                Upcoming sessions you can manage — past visits stay in your
                history as completed.
              </p>
            </div>
            {bookingList.length > 0 && (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="rounded-xl border border-white/80 bg-white/80 px-5 py-4 shadow-sm ring-1 ring-indigo-100/80 backdrop-blur-sm">
                  <p className="text-2xl font-bold text-stone-900">
                    <AnimatedCounter
                      target={bookingStats.active}
                      duration={1600}
                    />
                  </p>
                  <p className="mt-1 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-stone-500">
                    <span
                      aria-hidden
                      className="size-2 shrink-0 rounded-full bg-emerald-500 shadow-[0_0_0_3px_rgba(16,185,129,0.25)]"
                    />
                    Active
                  </p>
                </div>
                <div className="rounded-xl border border-white/80 bg-white/80 px-5 py-4 shadow-sm ring-1 ring-stone-200/80 backdrop-blur-sm">
                  <p className="text-2xl font-bold text-stone-600">
                    <AnimatedCounter
                      target={bookingStats.completed}
                      duration={1800}
                    />
                  </p>
                  <p className="mt-1 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-stone-500">
                    <span
                      aria-hidden
                      className="size-2 shrink-0 rounded-full bg-stone-400"
                    />
                    Completed
                  </p>
                </div>
                <div className="rounded-xl border border-white/80 bg-white/80 px-5 py-4 shadow-sm ring-1 ring-rose-100/80 backdrop-blur-sm">
                  <p className="text-2xl font-bold text-rose-600">
                    <AnimatedCounter
                      target={bookingStats.cancelled}
                      duration={1800}
                    />
                  </p>
                  <p className="mt-1 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-stone-500">
                    <span
                      aria-hidden
                      className="size-2 shrink-0 rounded-full bg-rose-500 shadow-[0_0_0_3px_rgba(244,63,94,0.2)]"
                    />
                    Cancelled
                  </p>
                </div>
                <div className="rounded-xl border border-white/80 bg-white/80 px-5 py-4 shadow-sm ring-1 ring-indigo-100/80 backdrop-blur-sm">
                  <p className="text-2xl font-bold text-indigo-600">
                    <AnimatedCounter
                      target={bookingStats.totalCost}
                      prefix="$"
                      decimals={2}
                      duration={2200}
                    />
                  </p>
                  <p className="mt-1 text-xs font-medium uppercase tracking-wide text-stone-500">
                    Total spent
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 lg:py-12">
        {bookingList.length === 0 ? (
          <div className="grid place-items-center rounded-2xl border border-dashed border-stone-300 bg-white p-10 text-center shadow-sm ring-1 ring-stone-900/5">
            <div className="grid gap-5">
              <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                <RiCalendarCheckLine className="size-7" />
              </span>
              <h2 className="text-xl font-semibold text-stone-900">
                No bookings yet
              </h2>
              <p className="text-sm leading-relaxed text-stone-500">
                Browse focus spaces and reserve your first deep-work session.
              </p>
              <Link
                href="/rooms"
                className="mx-auto inline-flex h-11 items-center justify-center rounded-full bg-indigo-600 px-6 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
              >
                Browse rooms
              </Link>
            </div>
          </div>
        ) : (
          <ul className="grid gap-8">
            {bookingList.map((booking) => {
              const room = booking.room ?? {};
              const roomImage =
                room.image ||
                "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800";
              const roomName = room.name ?? booking.roomName ?? "Focus space";
              const roomId = room._id ?? booking.roomId;
              const floor = room.floor;
              const capacity = room.capacity ?? null;
              const amenities = Array.isArray(room.amenities)
                ? room.amenities
                : [];
              const duration =
                Number(booking.endTime?.split(":")[0] ?? 0) -
                Number(booking.startTime?.split(":")[0] ?? 0);
              const status = getDisplayStatus(booking);
              const isCompleted = status === "completed";
              const isCancelled = status === "cancelled";
              const isUpcoming = isBookingOnOrAfterToday(booking.date);
              const canReschedule =
                isCancelled || (status === "confirmed" && isUpcoming);
              const canCancel = status === "confirmed" && isUpcoming;

              return (
                <li key={booking._id}>
                  <article
                    className={`grid grid-cols-1 gap-4 overflow-hidden rounded-2xl border p-4 shadow-sm ring-1 sm:p-0 md:grid-cols-12 md:items-stretch md:gap-0 ${
                      isCompleted
                        ? "border-stone-200/80 bg-stone-50/80 ring-stone-900/5"
                        : "border-stone-200 bg-white ring-stone-900/5 transition-colors hover:border-indigo-200 hover:ring-indigo-100"
                    }`}
                  >
                    <div
                      className={`relative col-span-1 aspect-video overflow-hidden rounded-xl bg-stone-100 md:col-span-3 md:aspect-auto md:h-full md:min-h-0 md:rounded-none ${
                        isCompleted ? "opacity-80 grayscale-[0.35]" : ""
                      }`}
                    >
                      <Link
                        href={roomId ? `/rooms/${roomId}` : "/rooms"}
                        className="absolute inset-0"
                      >
                        <Image
                          src={roomImage}
                          alt={roomName}
                          fill
                          unoptimized
                          sizes="(max-width: 768px) 100vw, 25vw"
                          className="object-cover"
                        />
                      </Link>
                    </div>

                    <div className="col-span-1 grid min-w-0 gap-4 p-1 sm:p-5 md:col-span-6 md:p-6 lg:col-span-7">
                      <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
                        <div className="min-w-0 space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <p
                              className={`text-[11px] font-semibold uppercase tracking-wider ${
                                isCompleted
                                  ? "text-stone-500"
                                  : "text-indigo-600"
                              }`}
                            >
                              {isCompleted
                                ? "Past session"
                                : isCancelled
                                  ? "Cancelled session"
                                  : "Upcoming session"}
                            </p>
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold capitalize ring-1 ${statusBadgeStyles[status]}`}
                            >
                              {status}
                            </span>
                          </div>
                          <h2 className="text-lg font-semibold text-stone-900 sm:text-xl">
                            {roomId ? (
                              <Link
                                href={`/rooms/${roomId}`}
                                className="transition-colors hover:text-indigo-700"
                              >
                                {roomName}
                              </Link>
                            ) : (
                              roomName
                            )}
                          </h2>
                        </div>
                        <p className="text-right sm:text-right">
                          <span className="block text-xs font-medium uppercase tracking-wide text-stone-400">
                            Total
                          </span>
                          <span
                            className={`text-xl font-bold ${
                              isCompleted ? "text-stone-600" : "text-indigo-600"
                            }`}
                          >
                            ${Number(booking.totalCost).toFixed(2)}
                          </span>
                        </p>
                      </div>

                      <dl className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
                        <div className="flex items-center gap-2.5 rounded-lg bg-stone-50 px-3 py-2.5 ring-1 ring-stone-200/60">
                          <RiCalendarCheckLine className="size-4 shrink-0 text-indigo-500" />
                          <div>
                            <dt className="text-[10px] font-semibold uppercase tracking-wide text-stone-400">
                              Date
                            </dt>
                            <dd className="font-medium text-stone-800">
                              {formatDisplayDate(booking.date)}
                            </dd>
                          </div>
                        </div>
                        <div className="flex items-center gap-2.5 rounded-lg bg-stone-50 px-3 py-2.5 ring-1 ring-stone-200/60">
                          <RiTimeLine className="size-4 shrink-0 text-indigo-500" />
                          <div>
                            <dt className="text-[10px] font-semibold uppercase tracking-wide text-stone-400">
                              Time
                            </dt>
                            <dd className="font-medium text-stone-800">
                              {formatDisplayTime(booking.startTime)} –{" "}
                              {formatDisplayTime(booking.endTime)}
                              {duration > 0 && (
                                <span className="text-stone-500">
                                  {" "}
                                  ({duration} {duration === 1 ? "hr" : "hrs"})
                                </span>
                              )}
                            </dd>
                          </div>
                        </div>
                      </dl>

                      {(floor || capacity != null) && (
                        <div className="flex flex-wrap gap-2">
                          {floor && (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-stone-50 px-3 py-1.5 text-sm text-stone-700 ring-1 ring-stone-200/60">
                              <RiMapPinLine className="size-3.5 text-indigo-600" />
                              {floor}
                            </span>
                          )}
                          {capacity != null && (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-stone-50 px-3 py-1.5 text-sm text-stone-700 ring-1 ring-stone-200/60">
                              <RiUserLine className="size-3.5 text-indigo-600" />
                              {capacity} {capacity === 1 ? "seat" : "seats"}
                            </span>
                          )}
                        </div>
                      )}

                      {amenities.length > 0 && (
                        <div>
                          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-stone-400">
                            Included amenities
                          </p>
                          <ul className="flex flex-wrap gap-1.5">
                            {amenities.map((amenity) => (
                              <li
                                key={amenity}
                                className="inline-flex items-center gap-1 rounded-full border border-stone-200 bg-stone-50 px-2.5 py-1 text-xs font-medium text-stone-600"
                              >
                                <RiCheckboxCircleLine className="size-3 shrink-0 text-indigo-500" />
                                {amenity}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    <div
                      className={`col-span-1 flex h-full min-h-full flex-col justify-center gap-2.5 border-t p-4 sm:p-5 md:col-span-3 md:border-l md:border-t-0 md:p-6 lg:col-span-2 ${
                        isCompleted
                          ? "border-stone-200/80 bg-stone-100/60"
                          : "border-stone-100 bg-stone-50/60"
                      }`}
                    >
                      {canReschedule || canCancel ? (
                        <>
                          {canReschedule && (
                            <RescheduleBookingButton booking={booking} />
                          )}
                          {canCancel && (
                            <CancelBookingButton bookingId={booking._id} />
                          )}
                        </>
                      ) : isCompleted ? (
                        <div className="flex flex-col items-center gap-2 rounded-xl border border-stone-200/80 bg-white/70 px-4 py-5 text-center ring-1 ring-stone-200/60">
                          <span className="flex size-10 items-center justify-center rounded-full bg-green-200/80 text-green-600">
                            <RiCheckboxCircleLine
                              className="size-5"
                              aria-hidden
                            />
                          </span>
                          <p className="text-sm font-semibold text-stone-700">
                            Session completed
                          </p>
                        </div>
                      ) : null}
                    </div>
                  </article>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
};

export default MyBookingsPage;
