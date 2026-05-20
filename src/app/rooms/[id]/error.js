"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RiArrowLeftLine, RiHome4Line, RiHotelLine } from "react-icons/ri";
import { Button } from "@heroui/react";

export default function RoomError({ error, reset, unstable_retry }) {
  const retry = unstable_retry ?? reset;

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="relative flex min-h-[calc(100vh-10rem)] items-center justify-center overflow-hidden bg-stone-50 px-4">
      <div className="relative z-10 mx-auto flex max-w-lg flex-col items-center gap-8 text-center">
        <h1 className="font-heading text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">
          Something went wrong
        </h1>
        <p className="text-sm leading-relaxed text-stone-500 sm:text-base">
          {error?.message || "We could not load this focus space."}
        </p>
        <nav className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:justify-center">
          <Button
            type="button"
            onClick={() => retry()}
            className="inline-flex h-11 items-center justify-center rounded-full bg-indigo-600 px-6 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
          >
            Try again
          </Button>
          <Link
            href="/rooms"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-stone-200 bg-white px-6 text-sm font-medium text-stone-700 shadow-sm ring-1 ring-stone-900/5 transition-colors hover:border-indigo-200 hover:text-indigo-700"
          >
            <RiHotelLine className="size-4" aria-hidden />
            Browse rooms
          </Link>
        </nav>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-stone-400 transition-colors hover:text-indigo-600"
        >
          <RiArrowLeftLine className="size-4" aria-hidden />
          <RiHome4Line className="size-4" aria-hidden />
          Back to home
        </Link>
      </div>
    </section>
  );
}
