"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import {
  RiArrowLeftLine,
  RiArrowRightLine,
  RiDoubleQuotesL,
  RiStarFill,
} from "react-icons/ri";

const testimonials = [
  {
    id: 1,
    name: "Maya R.",
    role: "Final Year Student",
    quote:
      "Booking used to take too long. Now I find the right room in minutes and spend time on revision, not searching.",
    avatar: 5,
    rating: 5,
  },
  {
    id: 2,
    name: "Arif H.",
    role: "Room Host",
    quote:
      "The host panel made schedule management easy. Idle hours now turn into recurring bookings every week.",
    avatar: 12,
    rating: 5,
  },
  {
    id: 3,
    name: "Sarah J.",
    role: "Graduate Researcher",
    quote:
      "QuietHub helped me lock a quiet room before exam week. My study consistency improved within the first month.",
    avatar: 32,
    rating: 5,
  },
  {
    id: 4,
    name: "Daniel K.",
    role: "Group Study Lead",
    quote:
      "We compare amenities and capacity in one place, then book as a team. No more back-and-forth in group chats.",
    avatar: 68,
    rating: 4,
  },
  {
    id: 5,
    name: "Lina M.",
    role: "Campus Tutor",
    quote:
      "Reliable room details mean fewer surprises for my sessions. Students arrive prepared and on time.",
    avatar: 47,
    rating: 5,
  },
];

const getVisibleSlides = (startIndex) =>
  Array.from({ length: 3 }, (_, offset) => {
    const index = (startIndex + offset) % testimonials.length;
    return { ...testimonials[index], slideKey: `${startIndex}-${offset}` };
  });

const SuccessStoriesCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const goNext = useCallback(() => {
    setActiveIndex((current) => (current + 1) % testimonials.length);
  }, []);

  const goPrev = useCallback(() => {
    setActiveIndex(
      (current) => (current - 1 + testimonials.length) % testimonials.length,
    );
  }, []);

  useEffect(() => {
    const timer = setInterval(goNext, 6000);
    return () => clearInterval(timer);
  }, [goNext]);

  const visibleSlides = getVisibleSlides(activeIndex);

  return (
    <div>
      <div className="grid grid-cols-1 gap-7 md:grid-cols-2 xl:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {visibleSlides.map((item) => (
            <motion.article
              key={item.slideKey}
              layout
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="flex flex-col rounded-3xl border border-stone-200/90 bg-white/90 p-6 shadow-sm ring-1 ring-stone-900/5"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="relative size-14 shrink-0 overflow-hidden rounded-full border-2 border-indigo-100 ring-2 ring-white">
                    <Image
                      src={`https://i.pravatar.cc/150?img=${item.avatar}`}
                      alt={item.name}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-stone-900">
                      {item.name}
                    </p>
                    <p className="truncate text-xs text-indigo-600">
                      {item.role}
                    </p>
                  </div>
                </div>
                <RiDoubleQuotesL className="size-7 shrink-0 text-indigo-200" />
              </div>

              <div className="mt-4 flex gap-0.5">
                {Array.from({ length: 5 }).map((_, starIndex) => (
                  <RiStarFill
                    key={starIndex}
                    className={`size-3.5 ${
                      starIndex < item.rating
                        ? "text-amber-400"
                        : "text-stone-200"
                    }`}
                  />
                ))}
              </div>

              <p className="text-sm leading-relaxed text-stone-600">
                {item.quote}
              </p>
            </motion.article>
          ))}
        </AnimatePresence>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {testimonials.map((item, index) => (
            <button
              key={item.id}
              type="button"
              aria-label={`Show testimonial from ${item.name}`}
              onClick={() => setActiveIndex(index)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                index === activeIndex
                  ? "w-8 bg-indigo-600"
                  : "w-2.5 bg-stone-300 hover:bg-indigo-300"
              }`}
            />
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Previous testimonials"
            onClick={goPrev}
            className="inline-flex size-11 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-700 shadow-sm transition-colors hover:border-indigo-200 hover:text-indigo-700"
          >
            <RiArrowLeftLine className="size-5" />
          </button>
          <button
            type="button"
            aria-label="Next testimonials"
            onClick={goNext}
            className="inline-flex size-11 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-700 shadow-sm transition-colors hover:border-indigo-200 hover:text-indigo-700"
          >
            <RiArrowRightLine className="size-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessStoriesCarousel;
