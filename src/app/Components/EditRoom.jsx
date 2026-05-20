"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Button,
  FieldError,
  Input,
  Label,
  Modal,
  TextArea,
  TextField,
  toast,
} from "@heroui/react";
import {
  RiAlignLeft,
  RiCheckLine,
  RiCheckboxCircleLine,
  RiHotelLine,
  RiImageLine,
  RiMapPinLine,
  RiMoneyDollarCircleLine,
  RiPencilLine,
  RiStackLine,
  RiUserLine,
} from "react-icons/ri";
import { authClient } from "@/lib/auth-client";

const amenityOptions = [
  "Whiteboard",
  "Projector",
  "Wi-Fi",
  "Power Outlets",
  "Quiet Zone",
  "Air Conditioning",
];

const fieldGroupClassName = "flex flex-col gap-2";
const labelClassName = "text-sm font-medium text-stone-800";
const inputClassName =
  "w-full h-11 rounded-xl border border-stone-200/90 bg-stone-50/80 pl-11 pr-4 text-sm text-stone-900 shadow-sm transition-[border-color,box-shadow,background-color] placeholder:text-stone-400 hover:border-stone-300 hover:bg-white focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/15";
const textAreaClassName =
  "w-full min-h-28 resize-y rounded-xl border border-stone-200/90 bg-stone-50/80 py-3.5 pl-11 pr-4 text-sm leading-relaxed text-stone-900 shadow-sm transition-[border-color,box-shadow,background-color] placeholder:text-stone-400 hover:border-stone-300 hover:bg-white focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/15";
const sectionPanelClassName =
  "space-y-6 rounded-2xl border border-stone-200/80 bg-stone-50/40 p-5 sm:p-6";

const previewCardClassName =
  "overflow-hidden rounded-2xl border border-stone-200/90 bg-white shadow-sm ring-1 ring-stone-900/5";

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

const amenityTileClass = (isSelected) =>
  `flex w-full cursor-pointer select-none items-center gap-3 rounded-xl border px-4 py-3.5 text-left text-sm font-medium shadow-sm transition-colors ${
    isSelected
      ? "border-indigo-400 bg-indigo-50/80 text-stone-800 ring-2 ring-inset ring-indigo-200/60"
      : "border-stone-200/90 bg-white text-stone-800 hover:border-indigo-200"
  }`;

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

const EditRoom = ({ room }) => {
  const router = useRouter();

  const {
    _id,
    name = "",
    description = "",
    image = "",
    floor = "",
    capacity = "",
    hourlyRate = "",
    amenities = [],
  } = room ?? {};

  const roomAmenities = Array.isArray(amenities) ? amenities : [];

  const [selectedAmenities, setSelectedAmenities] = useState(() => [
    ...roomAmenities,
  ]);
  const [previewUrl, setPreviewUrl] = useState(() => image ?? "");
  const [previewName, setPreviewName] = useState(() => name ?? "");
  const [previewError, setPreviewError] = useState(false);

  const showRoomPreview = !previewError && isValidImageSrc(previewUrl);
  const previewTitle = previewName.trim() || "Your room name";

  const toggleAmenity = (option) => {
    setSelectedAmenities((prev) =>
      prev.includes(option)
        ? prev.filter((item) => item !== option)
        : [...prev, option],
    );
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const updatedRoom = {
      name: formData.get("name"),
      description: formData.get("description"),
      image: formData.get("image"),
      floor: formData.get("floor"),
      capacity: Number(formData.get("capacity")),
      hourlyRate: Number(formData.get("hourlyRate")),
      amenities: selectedAmenities,
      updatedAt: new Date().toISOString(),
    };

    const { data: tokenData } = await authClient.token();

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/rooms/${_id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenData?.token}`,
        },
        body: JSON.stringify(updatedRoom),
      },
    );

    const data = await res.json();
    console.log("Update response:", data);

    if (res.ok) {
      toast.success("Room updated");
      router.refresh();
    } else {
      toast.danger(data.message || "Update failed");
    }
  };

  return (
    <Modal className="w-full">
      <Button className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-indigo-600 px-5 text-sm font-medium text-white transition-colors hover:bg-indigo-700">
        <RiPencilLine className="size-4" />
        Edit
      </Button>

      <Modal.Backdrop className="bg-stone-900/40 backdrop-blur-sm">
        <Modal.Container placement="center" className="overflow-hidden">
          <Modal.Dialog
            key={_id}
            className="grid max-h-[min(90vh,720px)] w-full max-w-2xl grid-rows-[auto_minmax(0,1fr)_auto] overflow-hidden rounded-3xl border border-stone-200/90 bg-white shadow-xl shadow-indigo-100/30 ring-1 ring-stone-900/5"
          >
            <Modal.CloseTrigger className="top-5 right-5 z-20 text-stone-400 transition-colors hover:text-indigo-600" />

            <form onSubmit={onSubmit} className="contents">
              <Modal.Header className="z-10 shrink-0 flex-col items-start gap-0 overflow-hidden rounded-t-3xl border-b border-stone-200/90 bg-linear-to-r from-indigo-50/80 via-white to-violet-50/50 px-6 py-6 pr-12 sm:px-8">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-indigo-600">
                  Edit listing
                </p>
                <Modal.Heading className="mt-1 text-xl font-bold tracking-tight text-stone-900 sm:text-2xl">
                  Room details
                </Modal.Heading>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-stone-600">
                  Update the basics guests see when browsing spaces. All fields
                  marked required must be completed before saving.
                </p>
              </Modal.Header>

              <div
                className="min-h-0 overflow-y-auto overscroll-contain bg-white p-6 sm:px-8"
                onScroll={(e) => e.stopPropagation()}
              >
                <div className="space-y-6">
                  {selectedAmenities.map((amenity) => (
                    <input
                      key={amenity}
                      type="hidden"
                      name="amenities"
                      value={amenity}
                    />
                  ))}

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
                        <FieldError className="text-xs font-medium text-rose-600" />
                      </TextField>

                      <TextField
                        name="description"
                        isRequired
                        defaultValue={description}
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
                        <FieldError className="text-xs font-medium text-rose-600" />
                      </TextField>

                      <div className={previewCardClassName}>
                        <div className="relative aspect-video bg-stone-100">
                          {showRoomPreview ? (
                            <Image
                              src={previewUrl.trim()}
                              alt={previewTitle}
                              fill
                              unoptimized
                              className="object-cover"
                              onError={() => setPreviewError(true)}
                            />
                          ) : (
                            <div className="flex h-full flex-col items-center justify-center gap-2 p-4 text-center">
                              <span className="flex size-10 items-center justify-center rounded-2xl bg-white text-indigo-500 shadow-sm ring-1 ring-stone-200/90">
                                <RiImageLine className="size-5" />
                              </span>
                              <p className="text-xs font-medium text-stone-500">
                                Paste a valid image URL to preview
                              </p>
                            </div>
                          )}
                          <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-stone-900/25 via-transparent to-transparent" />
                        </div>
                        <div className="border-t border-stone-200/90 bg-white/80 px-4 py-3">
                          <p className="truncate text-sm font-semibold text-stone-900">
                            {previewTitle}
                          </p>
                          <p className="text-xs text-stone-500">Live preview</p>
                        </div>
                      </div>

                      <TextField
                        name="image"
                        isRequired
                        className={fieldGroupClassName}
                      >
                        <Label className={labelClassName}>
                          Cover image URL
                        </Label>
                        <div className="relative">
                          <RiImageLine className="pointer-events-none absolute left-3.5 top-1/2 z-10 size-[18px] -translate-y-1/2 text-stone-400" />
                          <Input
                            type="url"
                            name="image"
                            placeholder="https://images.unsplash.com/photo-..."
                            className={inputClassName}
                            value={previewUrl}
                            onChange={(e) => {
                              setPreviewUrl(e.target.value);
                              setPreviewError(false);
                            }}
                          />
                        </div>
                        <p className="text-xs leading-relaxed text-stone-500">
                          Use a wide, well-lit photo. Preview updates as you
                          type.
                        </p>
                        <FieldError className="text-xs font-medium text-rose-600" />
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
                        defaultValue={floor}
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
                        <FieldError className="text-xs font-medium text-rose-600" />
                      </TextField>

                      <TextField
                        name="capacity"
                        isRequired
                        defaultValue={String(capacity)}
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
                        <FieldError className="text-xs font-medium text-rose-600" />
                      </TextField>

                      <TextField
                        name="hourlyRate"
                        isRequired
                        defaultValue={String(hourlyRate)}
                        className={fieldGroupClassName}
                      >
                        <Label className={labelClassName}>
                          Hourly rate (USD)
                        </Label>
                        <div className="relative">
                          <RiMoneyDollarCircleLine className="pointer-events-none absolute left-3.5 top-1/2 z-10 size-[18px] -translate-y-1/2 text-stone-400" />
                          <Input
                            type="number"
                            min="0"
                            placeholder="5"
                            className={inputClassName}
                          />
                        </div>
                        <FieldError className="text-xs font-medium text-rose-600" />
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
                      {amenityOptions.map((option) => {
                        const isSelected = selectedAmenities.includes(option);
                        return (
                          <button
                            key={option}
                            type="button"
                            aria-pressed={isSelected}
                            onClick={() => toggleAmenity(option)}
                            className={amenityTileClass(isSelected)}
                          >
                            <span
                              className={`flex size-5 shrink-0 items-center justify-center rounded-md border bg-white ${
                                isSelected
                                  ? "border-indigo-500"
                                  : "border-stone-300"
                              }`}
                            >
                              <RiCheckLine
                                className={`size-3.5 text-indigo-600 transition-opacity ${
                                  isSelected ? "opacity-100" : "opacity-0"
                                }`}
                                aria-hidden
                              />
                            </span>
                            <span>{option}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              <Modal.Footer className="z-10 flex shrink-0 flex-col gap-3 overflow-hidden rounded-b-3xl border-t border-stone-200/90 bg-stone-50 px-6 py-4 sm:flex-row sm:justify-end sm:px-8">
                <Button
                  slot="close"
                  variant="flat"
                  className="h-11 flex-1 rounded-full border border-stone-200 bg-white text-sm font-semibold text-stone-800 shadow-sm transition-all hover:bg-stone-50 sm:flex-none sm:px-8"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  slot="close"
                  className="h-11 flex-1 rounded-full bg-stone-900 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 hover:shadow-md sm:flex-none sm:px-8"
                >
                  Save changes
                </Button>
              </Modal.Footer>
            </form>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
};

export default EditRoom;
