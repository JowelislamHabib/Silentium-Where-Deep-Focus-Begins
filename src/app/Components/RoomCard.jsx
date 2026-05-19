"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button, Separator } from "@heroui/react";
import {
  RiArrowRightLine,
  RiCheckboxCircleLine,
  RiMapPinLine,
  RiUserLine,
} from "react-icons/ri";

const RoomCard = ({ room }) => {
  const visibleAmenities = room?.amenities?.slice(0, 2) || [];
  const extraAmenitiesCount = (room?.amenities?.length || 0) - 2;
  const capacity = room?.capacity ?? 1;
  const hourlyRate = Number(room?.hourlyRate) || 0;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm ring-1 ring-stone-900/5 transition-all duration-200 hover:border-indigo-200 hover:shadow-md hover:ring-indigo-100">
      <Link
        href={`/rooms/${room?._id}`}
        className="relative block overflow-hidden"
      >
        <div className="relative aspect-4/3 w-full bg-stone-100">
          <Image
            src={room?.image}
            alt={room?.name}
            fill
            unoptimized
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900/40 via-transparent to-transparent" />
        </div>

        <span className="absolute right-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-sm font-bold text-indigo-600 shadow-sm backdrop-blur-sm">
          ${hourlyRate}
          <span className="text-[10px] font-medium text-stone-500">/hr</span>
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <Link href={`/rooms/${room?._id}`} className="space-y-2">
          <h2 className="line-clamp-1 text-lg font-semibold text-stone-900 transition-colors group-hover:text-indigo-700">
            {room?.name}
          </h2>

          <p className="line-clamp-2 text-sm leading-relaxed text-stone-500">
            {room?.description}
          </p>
        </Link>
        <div className="mt-4 flex flex-wrap justify-between items-center gap-2 text-xs text-stone-600 ">
          <Separator className="my-1" />
          {room?.floor && (
            <span className="inline-flex items-center gap-1.5 text-sm rounded-full bg-stone-50 px-3 py-1.5  ">
              <RiMapPinLine className="size-3.5 text-indigo-600" />
              {room.floor}
            </span>
          )}
          <span className="inline-flex items-center gap-1.5 text-sm rounded-full bg-stone-50 px-3 py-1.5 ">
            <RiUserLine className="size-3.5 text-indigo-600" />
            {capacity} {capacity === 1 ? "seat" : "seats"}
          </span>
          <Separator className="my-1" />
        </div>
        {visibleAmenities.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {visibleAmenities.map((amenity) => (
              <span
                key={amenity}
                className="inline-flex items-center gap-1 rounded-full border border-stone-200 bg-stone-50 px-2 py-0.5 text-xs font-medium text-stone-600"
              >
                <RiCheckboxCircleLine className="size-3 text-indigo-500" />
                {amenity}
              </span>
            ))}
            {extraAmenitiesCount > 0 && (
              <span className="rounded-full border border-dashed border-stone-300 px-2 py-0.5 text-xs font-medium text-stone-500">
                +{extraAmenitiesCount}
              </span>
            )}
          </div>
        )}

        <div className="mt-auto pt-5">
          <Link href={`/rooms/${room?._id}`} className="block">
            <Button className="flex h-11 w-full items-center justify-center gap-2 rounded-full bg-indigo-600 text-sm font-semibold text-white shadow-sm shadow-indigo-600/20 transition-all hover:bg-indigo-700 group-hover:shadow-md">
              View space
              <RiArrowRightLine className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Button>
          </Link>
        </div>
      </div>
    </article>
  );
};

export default RoomCard;
