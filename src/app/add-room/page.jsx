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
  RiCheckLine,
  RiCheckboxCircleFill,
  RiCheckboxCircleLine,
  RiFocus3Line,
  RiHotelLine,
  RiImageLine,
  RiLightbulbLine,
  RiMapPinLine,
  RiMoneyDollarCircleLine,
  RiSparklingLine,
  RiStackLine,
  RiTimeLine,
  RiUserLine,
} from "react-icons/ri";
import { authClient } from "@/lib/auth-client";
import AnimatedCounter from "../Components/AnimatedCounter";

const listingTips = [
  "Clear name + short description help people book faster.",
  "Good photo = more clicks. Use a bright, wide shot of the room.",
  "Set capacity to match real seats — avoids awkward no-shows.",
  "Pick amenities guests actually get; keeps reviews honest.",
];

const LISTING_FIELD_COUNT = 6;

const surfaceCard =
  "overflow-hidden rounded-3xl border border-stone-200/90 bg-white/90 shadow-sm ring-1 ring-stone-900/5";

function FormSectionHeader({ icon: Icon, title, description, step }) {
  return (
    <div className="flex gap-4">
      <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 ring-1 ring-indigo-100">
        <Icon className="size-5" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-base font-semibold text-stone-900">{title}</h3>
          {step ? (
            <span className="rounded-full bg-stone-100 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-stone-500">
              Step {step}
            </span>
          ) : null}
        </div>
        <p className="mt-1 text-sm leading-relaxed text-stone-500">
          {description}
        </p>
      </div>
    </div>
  );
}

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
    "Wi-Fi",
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

    const { data: tokenData } = await authClient.token();

    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/rooms`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenData?.token}`,
      },
      body: JSON.stringify(roomDetails),
    });

    const data = await res.json();
    console.log("data", data, "token", tokenData?.accessToken);

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
      toast.danger("Failed to create room instance");
    }
  };

  const fieldGroupClassName = "flex flex-col gap-2";
  const labelClassName = "text-sm font-medium text-stone-800";
  const inputClassName =
    "w-full h-11 rounded-xl border border-stone-200/90 bg-stone-50/80 pl-11 pr-4 text-sm text-stone-900 shadow-sm transition-[border-color,box-shadow,background-color] placeholder:text-stone-400 hover:border-stone-300 hover:bg-white focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/15";
  const textAreaClassName =
    "w-full min-h-28 resize-y rounded-xl border border-stone-200/90 bg-stone-50/80 py-3.5 pl-11 pr-4 text-sm leading-relaxed text-stone-900 shadow-sm transition-[border-color,box-shadow,background-color] placeholder:text-stone-400 hover:border-stone-300 hover:bg-white focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/15";
  const hintClassName = "text-xs leading-relaxed text-stone-500";
  const sectionPanelClassName =
    "space-y-6 rounded-2xl border border-stone-200/80 bg-stone-50/40 p-5 sm:p-6";

  const showRoomPreview = !previewError && isValidImageSrc(previewUrl);
  const userAvatarSrc = isValidImageSrc(user?.image) ? user.image.trim() : null;
  const previewTitle = previewName.trim() || "Your room name";

  return (
    <section className="min-h-screen bg-linear-to-tl from-indigo-100/50 via-white to-violet-50">
      <div className="relative overflow-hidden border-b border-indigo-100/60 bg-linear-to-br from-indigo-100/50 via-white to-violet-50">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 top-0 size-72 rounded-full bg-indigo-300/25 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-20 left-1/3 size-56 rounded-full bg-violet-200/30 blur-3xl"
        />
        <div className="container relative mx-auto px-4 py-12 lg:py-16">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl space-y-4">
              <p className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-700 ring-1 ring-indigo-100">
                <RiSparklingLine className="size-3.5" />
                Host a space
              </p>
              <h1 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
                List a Focus Space
              </h1>
              <p className="text-base leading-relaxed text-stone-600 sm:text-lg">
                Share a quiet room with others. Edit or remove your listing
                anytime.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 lg:shrink-0">
              <div className="rounded-xl border border-white/80 bg-white/80 px-6 py-4 shadow-sm ring-1 ring-indigo-100/80 backdrop-blur-sm">
                <p className="text-2xl font-bold text-stone-900">
                  <AnimatedCounter
                    target={LISTING_FIELD_COUNT}
                    duration={1600}
                  />
                </p>
                <p className="text-xs font-medium uppercase tracking-wide text-stone-500">
                  Fields to complete
                </p>
              </div>
              <div className="rounded-xl border border-white/80 bg-white/80 px-6 py-4 shadow-sm ring-1 ring-indigo-100/80 backdrop-blur-sm">
                <p className="text-2xl font-bold text-indigo-600">
                  <AnimatedCounter value="2 min" duration={1400} />
                </p>
                <p className="text-xs font-medium uppercase tracking-wide text-stone-500">
                  Avg. setup
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 lg:py-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4 lg:gap-10">
          <aside className="order-2 space-y-5 lg:order-1 lg:col-span-1 lg:sticky lg:top-24 lg:self-start">
            <div className={surfaceCard}>
              <div className="relative aspect-4/3 bg-stone-100">
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
                    src="https://placehold.net/400x600.png"
                    alt={user?.name ?? "Host"}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full flex-col items-center justify-center gap-2 p-4 text-center">
                    <span className="flex size-10 items-center justify-center rounded-2xl bg-white text-indigo-500 shadow-sm ring-1 ring-stone-200/90">
                      <RiImageLine className="size-5" />
                    </span>
                    <p className="text-xs font-medium text-stone-500">
                      Paste image URL to preview
                    </p>
                  </div>
                )}
                <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-stone-900/25 via-transparent to-transparent" />
              </div>
              <div className="flex items-center gap-3 border-t border-stone-200/90 bg-white/80 p-4 backdrop-blur-sm">
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
                  <p className="truncate text-sm font-semibold text-stone-900">
                    {previewTitle}
                  </p>
                  <p className="text-xs text-stone-500">Live preview</p>
                </div>
              </div>
            </div>

            <div className={`${surfaceCard} p-5`}>
              <div className="mb-4 flex items-center gap-3">
                <span className="flex size-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 ring-1 ring-indigo-100">
                  <RiLightbulbLine className="size-4" />
                </span>
                <h2 className="text-sm font-semibold text-stone-900">
                  Listing tips
                </h2>
              </div>
              <ul className="space-y-3.5">
                {listingTips.map((tip) => (
                  <li
                    key={tip}
                    className="flex gap-3 text-xs leading-relaxed text-stone-600"
                  >
                    <RiCheckboxCircleFill className="mt-0.5 shrink-0 size-4 text-indigo-500" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            <p className="hidden items-center justify-center gap-2 rounded-2xl border border-dashed border-indigo-200/80 bg-indigo-50/40 px-4 py-3 text-xs font-medium text-indigo-700 lg:flex">
              <RiTimeLine className="size-4 shrink-0" />
              About 2 min to publish
            </p>
          </aside>

          <form
            onSubmit={onSubmit}
            className={`${surfaceCard} order-1 lg:order-2 lg:col-span-3`}
          >
            <div className="border-b border-stone-200/90 bg-linear-to-r from-indigo-50/80 via-white to-violet-50/50 px-6 py-6 sm:px-8">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-indigo-600">
                New listing
              </p>
              <h2 className="mt-1 text-xl font-bold tracking-tight text-stone-900 sm:text-2xl">
                Room details
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-stone-600">
                Fill in the basics guests see when browsing spaces. All fields
                marked required must be completed before publishing.
              </p>
            </div>

            <div className="space-y-6 p-6 sm:p-8">
              <div className={sectionPanelClassName}>
                <FormSectionHeader
                  icon={RiHotelLine}
                  step={1}
                  title="Identity & presentation"
                  description="Name, description, and cover image for your listing card."
                />
                <div className="space-y-5 pt-2">
                  <TextField
                    name="name"
                    isRequired
                    className={fieldGroupClassName}
                  >
                    <Label className={labelClassName}>Room name</Label>
                    <div className="relative">
                      <RiHotelLine className="pointer-events-none absolute left-3.5 top-1/2 z-10 size-[18px] -translate-y-1/2 text-stone-400" />
                      <Input
                        placeholder="e.g. QuietHub Alcove"
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
                      <RiAlignLeft className="pointer-events-none absolute left-3.5 top-4 z-10 size-[18px] text-stone-400" />
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
                    <Label className={labelClassName}>Cover image URL</Label>
                    <div className="relative">
                      <RiImageLine className="pointer-events-none absolute left-3.5 top-1/2 z-10 size-[18px] -translate-y-1/2 text-stone-400" />
                      <Input
                        type="url"
                        placeholder="https://images.yourroom.com/photo-..."
                        className={inputClassName}
                        value={previewUrl}
                        onChange={(e) => {
                          setPreviewUrl(e.target.value);
                          setPreviewError(false);
                        }}
                      />
                    </div>
                    <p className={hintClassName}>
                      Use a wide, well-lit photo. Preview updates as you type.
                    </p>
                    <FieldError className="text-sm font-medium text-rose-600" />
                  </TextField>
                </div>
              </div>

              <div className={sectionPanelClassName}>
                <FormSectionHeader
                  icon={RiMapPinLine}
                  step={2}
                  title="Location & pricing"
                  description="Help guests find your space and understand hourly cost."
                />
                <div className="grid grid-cols-1 gap-5 pt-2 sm:grid-cols-3">
                  <TextField
                    name="floor"
                    isRequired
                    className={fieldGroupClassName}
                  >
                    <Label className={labelClassName}>Floor</Label>
                    <div className="relative">
                      <RiStackLine className="pointer-events-none absolute left-3.5 top-1/2 z-10 size-[18px] -translate-y-1/2 text-stone-400" />
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
                      <RiUserLine className="pointer-events-none absolute left-3.5 top-1/2 z-10 size-[18px] -translate-y-1/2 text-stone-400" />
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
                    <Label className={labelClassName}>Hourly rate (USD)</Label>
                    <div className="relative">
                      <RiMoneyDollarCircleLine className="pointer-events-none absolute left-3.5 top-1/2 z-10 size-[18px] -translate-y-1/2 text-stone-400" />
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

              <div className={sectionPanelClassName}>
                <FormSectionHeader
                  icon={RiCheckboxCircleLine}
                  step={3}
                  title="Amenities"
                  description="Select everything included with this space."
                />
                <div className="grid grid-cols-1 gap-2.5 pt-2 sm:grid-cols-2">
                  {amenityOptions.map((option) => (
                    <label
                      key={option}
                      className="flex cursor-pointer select-none items-center gap-3 rounded-xl border border-stone-200/90 bg-white px-4 py-3.5 text-sm font-medium text-stone-800 shadow-sm transition-all hover:border-indigo-200 hover:shadow-md hover:shadow-indigo-100/30 has-checked:border-indigo-400 has-checked:bg-indigo-50/80 has-checked:ring-1 has-checked:ring-indigo-200/80"
                    >
                      <input
                        type="checkbox"
                        name="amenities"
                        value={option}
                        className="peer sr-only"
                      />
                      <span className="flex size-5 shrink-0 items-center justify-center rounded-md border border-stone-300 bg-white transition-colors peer-checked:border-indigo-500 peer-checked:[&_svg]:opacity-100">
                        <RiCheckLine
                          className="size-3.5 text-indigo-600 opacity-0 transition-opacity"
                          aria-hidden
                        />
                      </span>
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 border-t border-stone-200/90 bg-stone-50/60 px-6 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8">
              <div className="space-y-0.5">
                <p className="text-sm font-medium text-stone-800">
                  Ready to publish?
                </p>
                <p className="text-xs text-stone-500">
                  Your listing appears on browse immediately after submit.
                </p>
              </div>
              <Button
                type="submit"
                className="h-11 w-full rounded-full bg-stone-900 px-8 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 hover:shadow-md sm:w-auto"
              >
                List focus space
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default AddRoomPage;
