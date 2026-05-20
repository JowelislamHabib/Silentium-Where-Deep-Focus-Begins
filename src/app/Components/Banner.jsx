"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@heroui/react";
import { motion } from "motion/react";
import AnimatedCounter from "./AnimatedCounter";
import {
  RiAddCircleLine,
  RiBrainLine,
  RiCalendarScheduleLine,
  RiSearchLine,
  RiSparklingLine,
  RiTimeLine,
} from "react-icons/ri";

const Banner = () => {
  const stats = [
    {
      value: "15,000+",
      label: "Booked Study Hours",
      emojiSrc: "/emojis/hourglass-3d.png",
      emojiFallback: "⏳",
      positionClass: "left-0 top-1/2 -translate-y-1/2 -translate-x-1/2",
      yOffset: [-6, 6],
      delay: 0,
      hideOnMobile: true,
    },
    {
      value: "2,300+",
      label: "Bookings Completed",
      emojiSrc: "/emojis/house.png",
      emojiFallback: "🏢",
      positionClass: "right-0 top-0 translate-x-1/2 -translate-y-1/2",
      yOffset: [5, -5],
      delay: 0.4,
      hideOnMobile: true,
    },
    {
      value: "99%",
      label: "Student Satisfaction",
      emojiSrc: "/emojis/heart-3d.png",
      emojiFallback: "✨",
      positionClass: "bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2",
      yOffset: [-4, 4],
      delay: 0.8,
    },
  ];

  return (
    <section className="relative overflow-x-clip border-b border-indigo-100/60 bg-[radial-gradient(circle_at_12%_8%,rgba(129,140,248,0.4),transparent_34%),radial-gradient(circle_at_92%_12%,rgba(167,139,250,0.32),transparent_30%),linear-gradient(170deg,#f7f9ff_0%,#ffffff_48%,#f7f3ff_100%)]">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 top-10 size-80 rounded-full bg-indigo-300/20 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-20 bottom-0 size-72 rounded-full bg-violet-300/20 blur-3xl"
      />
      <div className="container relative mx-auto px-4 py-14 sm:py-18 lg:py-24">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-12 lg:gap-14">
          <div className="flex flex-col gap-6 lg:col-span-5">
            <p className="inline-flex w-fit items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-indigo-700 shadow-sm ring-1 ring-white">
              <RiSparklingLine className="size-3.5" />
              Premium focus platform
            </p>
            <h1 className="text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl lg:text-6xl">
              Book Quiet Spaces
              <span className="block bg-linear-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                For Deep Work
              </span>
            </h1>

            <p className="max-w-xl text-base font-medium leading-relaxed text-stone-600 sm:text-lg">
              QuietHub connects students with quiet, private study rooms across
              campus. Browse, book by the hour, or list your own space and earn.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/rooms" className="w-full sm:w-auto">
                <Button className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-stone-900 px-6 text-base font-semibold text-white shadow-sm transition-all duration-200 hover:bg-indigo-700 hover:shadow-md sm:w-auto">
                  <RiSearchLine className="text-lg" />
                  <span>Explore Rooms</span>
                </Button>
              </Link>

              <Link href="/add-room" className="w-full sm:w-auto">
                <Button className="flex h-12 w-full items-center justify-center gap-2 rounded-full border border-stone-200 bg-white/90 px-6 text-base font-semibold text-stone-900 shadow-sm backdrop-blur-sm transition-all duration-200 hover:border-indigo-200 hover:text-indigo-700 hover:shadow-md sm:w-auto">
                  <RiAddCircleLine className="text-lg" />
                  <span>List Your Room</span>
                </Button>
              </Link>
            </div>
            <ul className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm font-medium text-stone-500 sm:justify-start">
              <li className="inline-flex items-center gap-1.5">
                <RiTimeLine className="size-4 text-indigo-600" />
                Book by hour
              </li>
              <li className="inline-flex items-center gap-1.5">
                <RiCalendarScheduleLine className="size-4 text-indigo-600" />
                Flexible scheduling
              </li>
              <li className="inline-flex items-center gap-1.5">
                <RiBrainLine className="size-4 text-indigo-600" />
                Designed for deep focus
              </li>
            </ul>
          </div>

          <div className="px-0 pb-14 sm:px-8 sm:pb-8 lg:col-span-7 lg:px-16 lg:pb-0">
            <div className="relative h-80 w-full rounded-[2rem] border border-white/80 bg-white/35 p-3 shadow-2xl shadow-indigo-100/60 ring-1 ring-indigo-100/70 backdrop-blur-xl sm:h-96 lg:h-112">
              <div className="relative h-full w-full">
                <div className="group relative h-full w-full overflow-hidden rounded-[1.6rem]">
                  <div className="absolute inset-0 origin-center scale-[1.06] transition-transform duration-700 ease-out will-change-transform group-hover:scale-100">
                    <Image
                      src="/heroImage.jpg"
                      alt="Premium study room interior"
                      fill
                      priority
                      className="object-cover shadow-2xl ring-1 ring-white/70"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-stone-900/35 via-transparent to-transparent" />
                  </div>
                </div>

                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    animate={{ y: stat.yOffset }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      repeatType: "reverse",
                      ease: "easeInOut",
                      delay: stat.delay,
                    }}
                    className={`absolute ${stat.positionClass} z-20 flex max-w-[calc(100%-1rem)] items-center gap-2.5 rounded-full border border-white/80 bg-white/90 px-3 py-2.5 shadow-lg shadow-indigo-100/70 ring-1 ring-indigo-100/80 backdrop-blur-md max-sm:whitespace-nowrap sm:max-w-none sm:min-w-48 sm:gap-4 sm:p-4 ${stat.hideOnMobile ? "hidden sm:flex" : ""}`}
                  >
                    <div className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-indigo-100 bg-indigo-50/60 sm:size-12">
                      {stat.emojiSrc ? (
                        <div className="relative w-8 h-8">
                          <Image
                            src={stat.emojiSrc}
                            alt={stat.label}
                            fill
                            className="object-contain"
                            unoptimized
                          />
                        </div>
                      ) : (
                        <span className="text-2xl">{stat.emojiFallback}</span>
                      )}
                    </div>
                    <div className="flex min-w-0 flex-row flex-nowrap items-center gap-2 sm:flex-col sm:items-start sm:gap-0.5">
                      <span className="shrink-0 text-sm font-bold text-stone-900 sm:text-base">
                        <AnimatedCounter value={stat.value} />
                      </span>
                      <span className="whitespace-nowrap text-[11px] font-medium text-stone-500 sm:text-xs">
                        {stat.label}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;
