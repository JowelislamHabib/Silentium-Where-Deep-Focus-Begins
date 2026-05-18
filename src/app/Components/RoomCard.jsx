"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button, Card } from "@heroui/react";
import { motion } from "motion/react";
import {
  RiUserLine,
  RiMoneyDollarCircleLine,
  RiMapPinLine,
  RiArrowRightLine,
} from "react-icons/ri";

const RoomCard = ({ room }) => {
  const mockRoom = room;

  const visibleAmenities = mockRoom?.amenities?.slice(0, 3) || [];
  const extraAmenitiesCount = (mockRoom?.amenities?.length || 0) - 3;

  return (
    <div className="h-full">
      <Card className="h-full bg-stone-100 rounded-xl border border-stone-200 overflow-hidden flex flex-col justify-between shadow-sm p-5 transition-all duration-200 hover:bg-indigo-50/30 hover:backdrop-blur-md hover:shadow-lg hover:border-indigo-200">
        <div>
          <div className="relative w-full h-56 overflow-hidden rounded-lg">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full relative"
            >
              <Image
                src={mockRoom?.image}
                alt={mockRoom?.name || "Focus Space"}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover"
              />
            </motion.div>
          </div>

          <div className="mt-5 space-y-4">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-gray-900">
                {mockRoom?.name}
              </h2>
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <span className="text-indigo-500">
                  <RiMapPinLine className="text-base" />
                </span>
                <span>{mockRoom?.floor}</span>
              </div>
            </div>

            <p className="text-sm text-gray-500 line-clamp-2">
              {mockRoom?.description}
            </p>

            <div className="flex items-center gap-4 py-2 border-y border-stone-200 text-sm text-gray-900">
              <div className="flex items-center gap-1.5">
                <span className="text-indigo-500">
                  <RiUserLine className="text-base" />
                </span>
                <span>{mockRoom?.capacity} seats</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-indigo-500">
                  <RiMoneyDollarCircleLine className="text-base" />
                </span>
                <span>${mockRoom?.hourlyRate}/hr</span>
              </div>
            </div>

            {mockRoom?.amenities && mockRoom?.amenities.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {visibleAmenities.map((amenity, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 bg-stone-50 border border-stone-200 text-gray-600 text-xs rounded-full"
                  >
                    {amenity}
                  </span>
                ))}
                {extraAmenitiesCount > 0 && (
                  <span className="px-2.5 py-1 bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs rounded-full">
                    +{extraAmenitiesCount} more
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="pt-4">
          <Link href={`/rooms/${mockRoom?._id}`} className="block w-full">
            <Button className="w-full h-12 bg-indigo-500 text-white rounded-full text-sm font-medium hover:bg-indigo-600 flex items-center justify-center gap-2">
              <span>View Details</span>
              <RiArrowRightLine className="text-base" />
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default RoomCard;
