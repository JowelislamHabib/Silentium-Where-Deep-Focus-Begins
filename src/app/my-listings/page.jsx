import Image from "next/image";
import Link from "next/link";
import {
  RiBuildingLine,
  RiCalendarCheckLine,
  RiCheckboxCircleLine,
  RiMapPinLine,
  RiSparklingLine,
  RiUserLine,
} from "react-icons/ri";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import AnimatedCounter from "../Components/AnimatedCounter";
import DeleteRoomButton from "../Components/DeleteRoomButton";
import EditRoom from "../Components/EditRoom";

export const metadata = {
  title: "My Listings",
};

const formatDisplayDate = (date) => {
  if (!date) return "";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return String(date);
  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const MyListingsPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const userId = session?.user?.id;

  const { token } = await auth.api.getToken({
    headers: await headers(),
  });

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/my-listings/${userId}`,
    {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const rooms = await res.json();
  const roomList = Array.isArray(rooms) ? rooms : [];
  const totalBookings = roomList.reduce(
    (sum, room) => sum + (Number(room.bookingCount) || 0),
    0,
  );

  return (
    <section className="min-h-screen bg-stone-50">
      <div className="relative overflow-hidden border-b border-indigo-100/60 bg-linear-to-br from-indigo-100/50 via-white to-violet-50">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 top-0 size-72 rounded-full bg-indigo-300/25 blur-3xl"
        />
        <div className="container relative mx-auto px-4 py-12 lg:py-16">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <div className="min-w-0 space-y-4">
              <p className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-700 ring-1 ring-indigo-100">
                <RiSparklingLine className="size-3.5" />
                Your spaces
              </p>
              <h1 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
                My Listings
              </h1>
              <p className="text-base leading-relaxed text-stone-600 sm:text-lg">
                Manage focus rooms you host — edit details or remove a listing.
              </p>
            </div>
            {roomList.length > 0 && (
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-white/80 bg-white/80 px-6 py-4 shadow-sm ring-1 ring-indigo-100/80 backdrop-blur-sm">
                  <p className="text-2xl font-bold text-stone-900">
                    <AnimatedCounter
                      target={roomList.length}
                      duration={1800}
                    />
                  </p>
                  <p className="mt-1 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-stone-500">
                    <span
                      aria-hidden
                      className="size-2 shrink-0 rounded-full bg-emerald-500 shadow-[0_0_0_3px_rgba(16,185,129,0.25)]"
                    />
                    Listed spaces
                  </p>
                </div>
                <div className="rounded-xl border border-white/80 bg-white/80 px-6 py-4 shadow-sm ring-1 ring-indigo-100/80 backdrop-blur-sm">
                  <p className="text-2xl font-bold text-indigo-600">
                    <AnimatedCounter
                      target={totalBookings}
                      duration={2000}
                    />
                  </p>
                  <p className="mt-1 text-xs font-medium uppercase tracking-wide text-stone-500">
                    Total bookings
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 lg:py-12">
        {roomList.length === 0 ? (
          <div className="grid place-items-center rounded-2xl border border-dashed border-stone-300 bg-white p-10 text-center shadow-sm ring-1 ring-stone-900/5">
            <div className="grid gap-5">
              <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                <RiBuildingLine className="size-7" />
              </span>
              <h2 className="text-xl font-semibold text-stone-900">
                No listings yet
              </h2>
              <p className="text-sm leading-relaxed text-stone-500">
                List your first focus space and start accepting reservations.
              </p>
              <Link
                href="/add-room"
                className="mx-auto inline-flex h-11 items-center justify-center rounded-full bg-indigo-600 px-6 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
              >
                Add a room
              </Link>
            </div>
          </div>
        ) : (
          <ul className="grid gap-8">
            {roomList.map((room) => {
              const roomImage =
                room.image ||
                "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800";
              const capacity = room.capacity ?? null;
              const amenities = Array.isArray(room.amenities)
                ? room.amenities
                : [];
              const hourlyRate = Number(room.hourlyRate) || 0;
              const bookingCount = Number(room.bookingCount) || 0;

              return (
                <li key={room._id}>
                  <article className="grid grid-cols-1 gap-4 overflow-hidden rounded-2xl border border-stone-200 bg-white p-4 shadow-sm ring-1 ring-stone-900/5 transition-colors hover:border-indigo-200 hover:ring-indigo-100 sm:p-0 md:grid-cols-12 md:items-stretch md:gap-0">
                    <div className="relative col-span-1 aspect-video overflow-hidden rounded-xl bg-stone-100 md:col-span-3 md:aspect-auto md:h-full md:min-h-0 md:rounded-none">
                      <Link
                        href={`/rooms/${room._id}`}
                        className="absolute inset-0"
                      >
                        <Image
                          src={roomImage}
                          alt={room.name}
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
                          <p className="text-[11px] font-semibold uppercase tracking-wider text-indigo-600">
                            Your listing
                          </p>
                          <h2 className="text-lg font-semibold text-stone-900 sm:text-xl">
                            <Link
                              href={`/rooms/${room._id}`}
                              className="transition-colors hover:text-indigo-700"
                            >
                              {room.name}
                            </Link>
                          </h2>
                        </div>
                        <p className="text-right sm:text-right">
                          <span className="block text-xs font-medium uppercase tracking-wide text-stone-400">
                            Rate
                          </span>
                          <span className="text-xl font-bold text-indigo-600">
                            ${hourlyRate.toFixed(2)}
                            <span className="text-sm font-medium text-stone-500">
                              /hr
                            </span>
                          </span>
                        </p>
                      </div>

                      {room.description && (
                        <p className="line-clamp-2 text-sm leading-relaxed text-stone-600">
                          {room.description}
                        </p>
                      )}

                      <dl className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
                        <div className="flex items-center gap-2.5 rounded-lg bg-stone-50 px-3 py-2.5 ring-1 ring-stone-200/60">
                          <RiBuildingLine className="size-4 shrink-0 text-indigo-500" />
                          <div>
                            <dt className="text-[10px] font-semibold uppercase tracking-wide text-stone-400">
                              Bookings
                            </dt>
                            <dd className="font-medium text-stone-800">
                              {bookingCount}{" "}
                              {bookingCount === 1
                                ? "reservation"
                                : "reservations"}
                            </dd>
                          </div>
                        </div>
                        {room.createdAt && (
                          <div className="flex items-center gap-2.5 rounded-lg bg-stone-50 px-3 py-2.5 ring-1 ring-stone-200/60">
                            <RiCalendarCheckLine className="size-4 shrink-0 text-indigo-500" />
                            <div>
                              <dt className="text-[10px] font-semibold uppercase tracking-wide text-stone-400">
                                Listed
                              </dt>
                              <dd className="font-medium text-stone-800">
                                {formatDisplayDate(room.createdAt)}
                              </dd>
                            </div>
                          </div>
                        )}
                      </dl>

                      {(room.floor || capacity != null) && (
                        <div className="flex flex-wrap gap-2">
                          {room.floor && (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-stone-50 px-3 py-1.5 text-sm text-stone-700 ring-1 ring-stone-200/60">
                              <RiMapPinLine className="size-3.5 text-indigo-600" />
                              {room.floor}
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
                            Amenities
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

                    <div className="col-span-1 flex h-full min-h-full flex-col justify-center gap-2.5 border-t border-stone-100 bg-stone-50/60 p-4 sm:p-5 md:col-span-3 md:border-l md:border-t-0 md:p-6 lg:col-span-2">
                      <EditRoom room={room} />
                      <DeleteRoomButton id={room._id} />
                      <Link
                        href={`/rooms/${room._id}`}
                        className="inline-flex h-11 w-full items-center justify-center rounded-full border border-stone-200 bg-white text-sm font-medium text-stone-700 transition-colors hover:border-indigo-200 hover:text-indigo-700"
                      >
                        View space
                      </Link>
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

export default MyListingsPage;
