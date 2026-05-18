"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  FieldError,
  Input,
  Label,
  TextArea,
  TextField,
  toast,
} from "@heroui/react";
import { motion } from "motion/react";
import {
  RiAlignLeft,
  RiCheckboxCircleFill,
  RiHotelLine,
  RiImageLine,
  RiMoneyDollarCircleLine,
  RiStackLine,
  RiUserSharedLine,
} from "react-icons/ri";

const AddRoomPage = () => {
  const router = useRouter();

  const amenityOptions = [
    "Whiteboard",
    "Projector",
    "Wi‑Fi",
    "Power Outlets",
    "Quiet Zone",
    "Air Conditioning",
  ];

  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const { name, description, image, floor, capacity, hourlyRate } =
      Object.fromEntries(formData.entries());

    const roomDetails = {
      name,
      description,
      image,
      floor,
      capacity: Number(capacity),
      hourlyRate: Number(hourlyRate),
      amenities: formData.getAll("amenities"),
      bookingCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/rooms`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(roomDetails),
    });

    const data = await res.json();

    if (res.ok) {
      const newId = data.insertedId || data.id;
      toast.success("Space Listed", {
        actionProps: {
          children: "View Space",
          onPress: () => {
            router.push(`/rooms/${newId}`);
          },
          className:
            "bg-indigo-500 text-white font-medium rounded-full text-sm normal-case px-4 py-1",
        },
        description: "Your quiet focus session reservation listing is active.",
      });
    } else {
      toast.error("Failed to create room instance");
    }
  };

  return (
    <section className="bg-stone-50 min-h-screen relative overflow-hidden flex items-center">
      <motion.div
        animate={{
          y: [-15, 15],
          x: [-10, 10],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
        className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-50 rounded-full blur-3xl pointer-events-none z-0"
      />
      <motion.div
        animate={{
          y: [20, -20],
          x: [15, -15],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
          delay: 0.5,
        }}
        className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-50 rounded-full blur-3xl pointer-events-none z-0"
      />

      <div className="container mx-auto py-16 px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex flex-col gap-4 mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900">
            List a Focus Space
          </h1>
          <p className="text-base text-gray-500 font-medium">
            Open up quiet, private study rooms or multi-person session setups
            within your library.
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          onSubmit={onSubmit}
          className="p-8 md:p-12 space-y-8 bg-stone-100/70 backdrop-blur-md border border-stone-200 rounded-xl shadow-sm"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <TextField name="name" isRequired className="flex flex-col gap-2">
                <Label className="text-base font-semibold text-gray-900 flex items-center gap-2">
                  <RiHotelLine className="text-lg text-indigo-500" />
                  <span>Room Name</span>
                </Label>
                <Input
                  placeholder="e.g., Silentium Innovation Alcove"
                  className="rounded-lg border border-stone-200 h-12 bg-stone-50/50 font-medium text-sm px-4 text-gray-900 transition-colors focus:bg-stone-50"
                />
                <FieldError className="text-rose-500 text-sm font-medium" />
              </TextField>
            </div>

            <TextField name="floor" isRequired className="flex flex-col gap-2">
              <Label className="text-base font-semibold text-gray-900 flex items-center gap-2">
                <RiStackLine className="text-lg text-indigo-500" />
                <span>Floor Location</span>
              </Label>
              <Input
                placeholder="e.g., 3rd Floor"
                className="rounded-lg border border-stone-200 h-12 bg-stone-50/50 font-medium text-sm px-4 text-gray-900 transition-colors focus:bg-stone-50"
              />
              <FieldError className="text-rose-500 text-sm font-medium" />
            </TextField>

            <TextField
              name="capacity"
              type="number"
              isRequired
              className="flex flex-col gap-2"
            >
              <Label className="text-base font-semibold text-gray-900 flex items-center gap-2">
                <RiUserSharedLine className="text-lg text-indigo-500" />
                <span>Max Capacity</span>
              </Label>
              <Input
                type="number"
                min="1"
                placeholder="e.g., 4"
                className="rounded-lg border border-stone-200 h-12 bg-stone-50/50 font-medium text-sm px-4 text-gray-900 transition-colors focus:bg-stone-50"
              />
              <FieldError className="text-rose-500 text-sm font-medium" />
            </TextField>

            <div className="md:col-span-2">
              <TextField
                name="hourlyRate"
                type="number"
                isRequired
                className="flex flex-col gap-2"
              >
                <Label className="text-base font-semibold text-gray-900 flex items-center gap-2">
                  <RiMoneyDollarCircleLine className="text-lg text-indigo-500" />
                  <span>Hourly Rate (USD)</span>
                </Label>
                <Input
                  type="number"
                  min="0"
                  placeholder="e.g., 5"
                  className="rounded-lg border border-stone-200 h-12 bg-stone-50/50 font-medium text-sm px-4 text-gray-900 transition-colors focus:bg-stone-50"
                />
                <FieldError className="text-rose-500 text-sm font-medium" />
              </TextField>
            </div>

            <div className="md:col-span-2">
              <TextField
                name="image"
                type="url"
                isRequired
                className="flex flex-col gap-2"
              >
                <Label className="text-base font-semibold text-gray-900 flex items-center gap-2">
                  <RiImageLine className="text-lg text-indigo-500" />
                  <span>Asset Image URL</span>
                </Label>
                <Input
                  type="url"
                  placeholder="https://images.unsplash.com/your-high-res-photo"
                  className="rounded-lg border border-stone-200 h-12 bg-stone-50/50 font-medium text-sm px-4 text-gray-900 transition-colors focus:bg-stone-50"
                />
                <FieldError className="text-rose-500 text-sm font-medium" />
              </TextField>
            </div>

            <div className="md:col-span-2 flex flex-col gap-3">
              <span className="text-base font-semibold text-gray-900 flex items-center gap-2">
                <RiCheckboxCircleFill className="text-lg text-indigo-500" />
                <span>Available Amenities</span>
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-stone-50/40 border border-stone-200 p-6 rounded-lg">
                {amenityOptions.map((option) => (
                  <label
                    key={option}
                    className="flex items-center gap-3 cursor-pointer select-none text-sm font-medium text-gray-900"
                  >
                    <input
                      type="checkbox"
                      name="amenities"
                      value={option}
                      className="w-4 h-4 rounded text-indigo-500 border-stone-200 accent-indigo-500 focus:ring-0"
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="md:col-span-2">
              <TextField
                name="description"
                isRequired
                className="flex flex-col gap-2"
              >
                <Label className="text-base font-semibold text-gray-900 flex items-center gap-2">
                  <RiAlignLeft className="text-lg text-indigo-500" />
                  <span>Session Space Narrative</span>
                </Label>
                <TextArea
                  placeholder="Provide a minimal description outlining natural lighting, acoustic profiles, and architectural focus parameters..."
                  className="rounded-lg border border-stone-200 p-4 bg-stone-50/50 min-h-36 font-medium text-sm text-gray-900 leading-relaxed transition-colors focus:bg-stone-50"
                />
                <FieldError className="text-rose-500 text-sm font-medium" />
              </TextField>
            </div>
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              className="w-full h-12 bg-indigo-500 text-white font-medium rounded-full text-base hover:bg-indigo-600 shadow-sm transition-colors duration-150 flex items-center justify-center gap-2"
            >
              List Focus Space
            </Button>
          </div>
        </motion.form>
      </div>
    </section>
  );
};

export default AddRoomPage;
