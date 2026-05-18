import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  RiArrowLeftLine,
  RiCheckboxCircleLine,
  RiMapPinLine,
  RiUserLine,
} from "react-icons/ri";
import BookingButton from "@/app/Components/BookingButton";
import { Card } from "@heroui/react";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const RoomDetails = async ({ params }) => {
  const { id } = await params;
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/rooms/${id}`,
    {},
  );
  const room = await res.json();

  const capacity = room?.capacity ?? 1;

  const session = await auth.api.getSession({
    headers: await headers(), // you need to pass the headers object.
  });
  const user = session?.user;
  const isOwner = user?.id === room?.creatorId;
  console.log(isOwner);

  return (
    <section className="min-h-screen bg-stone-50">
      <div className="relative overflow-hidden border-b border-indigo-100/60 bg-gradient-to-br from-indigo-100/50 via-white to-violet-50">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-12 top-0 size-48 rounded-full bg-indigo-300/20 blur-3xl"
        />
        <div className="container relative mx-auto px-4 py-5">
          <Link
            href="/rooms"
            className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/70 px-4 py-2 text-sm font-medium text-stone-600 shadow-sm backdrop-blur-sm transition-colors hover:border-indigo-200 hover:text-indigo-600"
          >
            <RiArrowLeftLine className="size-4" />
            All focus spaces
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 lg:py-14">
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(320px,380px)] lg:gap-12">
          <article className="space-y-8">
            <div className="relative overflow-hidden rounded-2xl bg-stone-200 shadow-md ring-1 ring-stone-900/5">
              <div className="relative aspect-[16/10] w-full sm:aspect-[16/9]">
                <Image
                  src={
                    room.image ||
                    "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800"
                  }
                  alt={room.name}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/50 via-transparent to-transparent" />
              </div>

              {room.floor && (
                <span className="absolute bottom-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-stone-800 shadow-sm backdrop-blur-sm">
                  <RiMapPinLine className="size-3.5 text-indigo-600" />
                  {room.floor}
                </span>
              )}
            </div>

            <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm ring-1 ring-stone-900/5 sm:p-8">
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-stone-100 pb-6">
                <div className="space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
                    Focus space
                  </p>
                  <h1 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
                    {room.name}
                  </h1>
                </div>

                <span className="inline-flex items-center gap-2 rounded-full bg-stone-50 px-4 py-2.5 text-sm font-medium text-stone-700 ring-1 ring-stone-200/80">
                  <RiUserLine className="size-4 text-indigo-600" />
                  {capacity} {capacity === 1 ? "seat" : "seats"}
                </span>
              </div>

              {room.description && (
                <div className="border-b border-stone-100 py-6">
                  <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-stone-400">
                    About this space
                  </h2>
                  <p className="text-base leading-relaxed text-stone-600">
                    {room.description}
                  </p>
                </div>
              )}

              {room.amenities?.length > 0 && (
                <div className={room.description ? "pt-6" : "py-6"}>
                  <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-stone-400">
                    What&apos;s included
                  </h2>
                  <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {room.amenities.map((amenity) => (
                      <li
                        key={amenity}
                        className="flex items-center gap-2.5 rounded-full bg-stone-50 px-4 py-2.5 text-sm text-stone-700 ring-1 ring-stone-200/60"
                      >
                        <RiCheckboxCircleLine className="size-4 shrink-0 text-indigo-500" />
                        {amenity}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </article>
          <div className="lg:pt-2">
            <BookingButton room={room} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default RoomDetails;
