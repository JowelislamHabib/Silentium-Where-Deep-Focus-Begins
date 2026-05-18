"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@heroui/react";
import { motion } from "motion/react";
import { RiSearchLine, RiAddCircleLine } from "react-icons/ri";

const Counter = ({ targetValue }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const numericTarget = parseInt(targetValue.replace(/[^0-9]/g, ""), 10);
    let start = 0;
    const duration = 2000;
    const startTime = performance.now();

    const updateCount = (currentTime) => {
      const elapsedTime = currentTime - startTime;
      if (elapsedTime >= duration) {
        setCount(numericTarget);
        return;
      }

      const progress = elapsedTime / duration;
      const easeOutQuad = progress * (2 - progress);
      const nextCount = Math.floor(easeOutQuad * numericTarget);

      setCount(nextCount);
      requestAnimationFrame(updateCount);
    };

    requestAnimationFrame(updateCount);
  }, [targetValue]);

  const suffix = targetValue.replace(/[0-9,]/g, "");
  const hasComma = targetValue.includes(",");

  return (
    <span>
      {hasComma ? count.toLocaleString() : count}
      {suffix}
    </span>
  );
};

const Banner = () => {
  const stats = [
    {
      value: "1,200+",
      label: "Hours Studied",
      emojiSrc: "/emojis/hourglass-3d.png",
      emojiFallback: "⏳",
      positionClass: "left-0 top-1/2 -translate-y-1/2 -translate-x-1/2",
      yOffset: [-6, 6],
      delay: 0,
    },
    {
      value: "350+",
      label: "Rooms Reserved",
      emojiSrc: "/emojis/house.png",
      emojiFallback: "🏢",
      positionClass: "right-0 top-0 translate-x-1/2 -translate-y-1/2",
      yOffset: [5, -5],
      delay: 0.4,
    },
    {
      value: "98%",
      label: "Satisfaction",
      emojiSrc: "/emojis/heart-3d.png",
      emojiFallback: "✨",
      positionClass: "left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2",
      yOffset: [-4, 4],
      delay: 0.8,
    },
  ];

  return (
    <section className="bg-stone-50 overflow-hidden">
      <div className="container mx-auto py-16 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-5 flex flex-col gap-6">
            <h1 className="text-4xl font-bold text-gray-900">
              Find Your Perfect Study Space
            </h1>

            <p className="text-base text-gray-500 font-medium">
              Browse and book quiet, private study rooms in your library. List
              your own space and earn while helping others focus.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/rooms" className="w-full sm:w-auto">
                <Button className="w-full h-12 bg-indigo-500 text-white rounded-full text-base font-medium hover:bg-indigo-600 transition-colors duration-150 flex items-center justify-center gap-2 shadow-sm">
                  <RiSearchLine className="text-lg" />
                  <span>Explore Rooms</span>
                </Button>
              </Link>

              <Link href="/list-your-space" className="w-full sm:w-auto">
                <Button className="w-full h-12 border border-stone-200 bg-stone-100 text-gray-900 rounded-full text-base font-medium hover:bg-stone-200 transition-colors duration-150 flex items-center justify-center gap-2 shadow-sm">
                  <RiAddCircleLine className="text-lg" />
                  <span>List Your Space</span>
                </Button>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-7 px-16 lg:px-24">
            <div className="relative w-full h-96">
              <Image
                src="/heroImage.jpg"
                alt="Study room"
                fill
                priority
                className="object-cover rounded-xl"
              />

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
                  className={`absolute ${stat.positionClass} bg-stone-50/80 backdrop-blur-md border border-stone-200 rounded-full p-4 flex items-center gap-4 min-w-48 z-10`}
                >
                  <div className="w-12 h-12 bg-stone-100/50 rounded-full flex items-center justify-center border border-stone-200 flex-shrink-0 relative overflow-hidden">
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
                  <div className="flex flex-col">
                    <span className="text-gray-900 font-bold text-base">
                      <Counter targetValue={stat.value} />
                    </span>
                    <span className="text-gray-500 text-xs font-medium">
                      {stat.label}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;
