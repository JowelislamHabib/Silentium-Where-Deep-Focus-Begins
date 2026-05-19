"use client";

import React, { useState } from "react";
import Image from "next/image";
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
import {
  RiAlignLeft,
  RiCheckboxCircleFill,
  RiFocus3Line,
  RiHotelLine,
  RiImageLine,
  RiLightbulbLine,
  RiMoneyDollarCircleLine,
  RiSparklingLine,
  RiStackLine,
  RiTimeLine,
  RiUserLine,
} from "react-icons/ri";
import { authClient } from "@/lib/auth-client";

const listingTips = [
  "Clear name + short description help people book faster.",
  "Good photo = more clicks. Use a bright, wide shot of the room.",
  "Set capacity to match real seats — avoids awkward no-shows.",
  "Pick amenities guests actually get; keeps reviews honest.",
];

const cardClassName =
  "overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm";

function isValidImageSrc(src) {
  if (!src || typeof src !== "string") return false;
  const trimmed = src.trim();
  if (trimmed.startsWith("/")) return trimmed.length > 1;
  if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) {
    return false;
  }
  try {
    new URL(trimmed);
    return true;
  } catch {
    return false;
  }
}

const AddRoomPage = () => {
  const router = useRouter();
  const [previewUrl, setPreviewUrl] = useState("");
  const [previewName, setPreviewName] = useState("");
  const [previewError, setPreviewError] = useState(false);

  const amenityOptions = [
    "Whiteboard",
    "Projector",
    "Wi‑Fi",
    "Power Outlets",
    "Quiet Zone",
    "Air Conditioning",
  ];

  const { data: session } = authClient.useSession();
  const user = session?.user;

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
      creatorId: user?.id,
      createdBy: user?.name,
      creatorEmail: user?.email,
      creatorAvatar: user?.image,
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

  const formClassName =
    "order-1 overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm lg:order-2";
  const fieldGroupClassName = "flex flex-col gap-2";
  const labelClassName = "text-sm font-medium text-gray-900";
  const inputClassName =
    "w-full h-12 rounded border border-stone-200 bg-white pl-12 pr-4 text-sm text-gray-900 transition-colors placeholder:text-gray-500 focus:border-indigo-500 focus:bg-white";
  const textAreaClassName =
    "w-full resize-none rounded border border-stone-200 bg-white py-4 pl-12 pr-4 text-sm leading-relaxed text-gray-900 transition-colors placeholder:text-gray-500 focus:border-indigo-500";
  const sectionClassName = "space-y-6";
  const sectionTitleClassName = "text-base font-semibold text-gray-900";
  const sectionHintClassName = "text-sm text-gray-500";

  const showRoomPreview = !previewError && isValidImageSrc(previewUrl);
  const userAvatarSrc = isValidImageSrc(user?.image) ? user.image.trim() : null;
  const previewTitle = previewName.trim() || "Your room name";

  return (
    <section className="min-h-screen bg-stone-50">
      <div className="border-b border-stone-200 bg-indigo-50">
        <div className="container mx-auto px-4 py-12 lg:py-16">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-4">
              <p className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase text-indigo-500 ring-1 ring-stone-200">
                <RiSparklingLine className="text-base text-indigo-500" />
                Host a space
              </p>
              <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                List a Focus Space
              </h1>
              <p className="text-base text-gray-500 sm:text-lg">
                Share a quiet room with others. Edit or remove your listing
                anytime.
              </p>
            </div>

            <div className="flex flex-wrap gap-4 lg:shrink-0">
              <div className="rounded-lg border border-stone-200 bg-white px-6 py-4 shadow-sm">
                <p className="text-2xl font-bold text-gray-900">
                  {amenityOptions.length}
                </p>
                <p className="text-xs font-medium uppercase text-gray-500">
                  Amenities
                </p>
              </div>
              <div className="rounded-lg border border-stone-200 bg-white px-6 py-4 shadow-sm">
                <p className="text-2xl font-bold text-indigo-500">2 min</p>
                <p className="text-xs font-medium uppercase text-gray-500">
                  Avg. setup
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4 lg:gap-8">
          <aside className="order-2 space-y-4 lg:order-1 lg:col-span-1 lg:sticky lg:top-24 lg:self-start">
            <div className={cardClassName}>
              <div className="relative aspect-video bg-stone-100">
                {showRoomPreview ? (
                  <Image
                    src={previewUrl}
                    alt={previewTitle}
                    fill
                    unoptimized
                    className="object-cover"
                    onError={() => setPreviewError(true)}
                  />
                ) : userAvatarSrc ? (
                  <Image
                    src="https://images.unsplash.com/photo-1622653533660-a1538fe8424c"
                    alt={user?.name ?? "Host"}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full flex-col items-center justify-center gap-2 p-4 text-center">
                    <span className="flex items-center justify-center rounded bg-white p-2 text-indigo-500 shadow-sm ring-1 ring-stone-200">
                      <RiImageLine className="text-base" />
                    </span>
                    <p className="text-xs font-medium text-gray-500">
                      Paste image URL to preview
                    </p>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-3 border-t border-stone-200 p-3">
                {userAvatarSrc ? (
                  <span className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full ring-2 ring-white">
                    <Image
                      src={userAvatarSrc}
                      alt=""
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </span>
                ) : (
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-500">
                    <RiFocus3Line className="text-base" />
                  </span>
                )}
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-gray-900">
                    {previewTitle}
                  </p>
                  <p className="text-xs text-gray-500">Live preview</p>
                </div>
              </div>
            </div>

            <div className={`${cardClassName} p-4`}>
              <div className="mb-3 flex items-center gap-3">
                <span className="flex items-center justify-center rounded bg-indigo-50 p-2 text-indigo-500">
                  <RiLightbulbLine className="text-base" />
                </span>
                <h2 className="text-sm font-semibold text-gray-900">
                  Listing tips
                </h2>
              </div>
              <ul className="space-y-3">
                {listingTips.map((tip) => (
                  <li
                    key={tip}
                    className="flex gap-3 text-xs leading-relaxed text-gray-500"
                  >
                    <RiCheckboxCircleFill className="shrink-0 text-base text-indigo-500" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            <p className="hidden items-center gap-2 text-xs text-gray-500 lg:flex">
              <RiTimeLine className="text-base text-indigo-500" />
              About 2 min to publish
            </p>
          </aside>

          <form
            onSubmit={onSubmit}
            className={`${formClassName} lg:col-span-3`}
          >
            <div className="border-b border-stone-200 bg-stone-50 px-6 py-5 sm:px-8">
              <h2 className="text-lg font-semibold text-gray-900">
                Room details
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Fill in the basics guests see when browsing spaces.
              </p>
            </div>

            <div className="space-y-8 p-6 sm:p-8">
              <div className={sectionClassName}>
                <TextField
                  name="name"
                  isRequired
                  className={fieldGroupClassName}
                >
                  <Label className={labelClassName}>Room Name</Label>
                  <div className="relative">
                    <RiHotelLine className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-lg text-gray-500" />
                    <Input
                      placeholder="e.g. Silentium Alcove"
                      className={inputClassName}
                      value={previewName}
                      onChange={(e) => setPreviewName(e.target.value)}
                    />
                  </div>
                  <FieldError className="text-sm font-medium text-rose-500" />
                </TextField>

                <TextField
                  name="description"
                  isRequired
                  className={fieldGroupClassName}
                >
                  <Label className={labelClassName}>Description</Label>
                  <div className="relative">
                    <RiAlignLeft className="pointer-events-none absolute left-4 top-4 z-10 text-lg text-gray-500" />
                    <TextArea
                      placeholder="Lighting, acoustics, seating, and what makes this room great for focus."
                      rows={4}
                      className={textAreaClassName}
                    />
                  </div>
                  <FieldError className="text-sm font-medium text-rose-500" />
                </TextField>

                <TextField
                  name="image"
                  type="url"
                  isRequired
                  className={fieldGroupClassName}
                >
                  <Label className={labelClassName}>Image URL</Label>
                  <div className="relative">
                    <RiImageLine className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-lg text-gray-500" />
                    <Input
                      type="url"
                      placeholder="https://images.unsplash.com/photo-..."
                      className={inputClassName}
                      value={previewUrl}
                      onChange={(e) => {
                        setPreviewUrl(e.target.value);
                        setPreviewError(false);
                      }}
                    />
                  </div>
                  <p className={sectionHintClassName}>
                    Updates the live preview as you type.
                  </p>
                  <FieldError className="text-sm font-medium text-rose-500" />
                </TextField>
              </div>

              <div
                className={`${sectionClassName} border-t border-stone-200 pt-8`}
              >
                <div>
                  <h3 className={sectionTitleClassName}>Location & pricing</h3>
                  <p className={`mt-1 ${sectionHintClassName}`}>
                    Help guests find and book your space.
                  </p>
                </div>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                  <TextField
                    name="floor"
                    isRequired
                    className={fieldGroupClassName}
                  >
                    <Label className={labelClassName}>Floor</Label>
                    <div className="relative">
                      <RiStackLine className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-lg text-gray-500" />
                      <Input
                        placeholder="3rd Floor"
                        className={inputClassName}
                      />
                    </div>
                    <FieldError className="text-sm font-medium text-rose-500" />
                  </TextField>

                  <TextField
                    name="capacity"
                    type="number"
                    isRequired
                    className={fieldGroupClassName}
                  >
                    <Label className={labelClassName}>Capacity</Label>
                    <div className="relative">
                      <RiUserLine className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-lg text-gray-500" />
                      <Input
                        type="number"
                        min="1"
                        placeholder="2"
                        className={inputClassName}
                      />
                    </div>
                    <FieldError className="text-sm font-medium text-rose-500" />
                  </TextField>

                  <TextField
                    name="hourlyRate"
                    type="number"
                    isRequired
                    className={fieldGroupClassName}
                  >
                    <Label className={labelClassName}>Hourly Rate ($)</Label>
                    <div className="relative">
                      <RiMoneyDollarCircleLine className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-lg text-gray-500" />
                      <Input
                        type="number"
                        min="0"
                        placeholder="5"
                        className={inputClassName}
                      />
                    </div>
                    <FieldError className="text-sm font-medium text-rose-500" />
                  </TextField>
                </div>
              </div>

              <div
                className={`${sectionClassName} border-t border-stone-200 pt-8`}
              >
                <div>
                  <h3 className={sectionTitleClassName}>Amenities</h3>
                  <p className={`mt-1 ${sectionHintClassName}`}>
                    Select everything included with this space.
                  </p>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {amenityOptions.map((option) => (
                    <label
                      key={option}
                      className="flex cursor-pointer select-none items-center gap-4 rounded-lg border border-stone-200 bg-stone-50 px-4 py-4 text-sm font-medium text-gray-900 transition-colors hover:border-indigo-500 hover:bg-indigo-50 has-[:checked]:border-indigo-500 has-[:checked]:bg-indigo-50"
                    >
                      <input
                        type="checkbox"
                        name="amenities"
                        value={option}
                        className="h-4 w-4 shrink-0 rounded border-stone-200 text-indigo-500 accent-indigo-500"
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 border-t border-stone-200 bg-stone-50 px-6 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8">
              <p className="text-sm text-gray-500">
                Visible on browse after publish
              </p>
              <Button
                type="submit"
                className="h-12 w-full rounded-full bg-indigo-500 px-8 text-sm font-semibold text-white transition-colors hover:bg-indigo-600 sm:w-auto"
              >
                List Focus Space
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default AddRoomPage;
