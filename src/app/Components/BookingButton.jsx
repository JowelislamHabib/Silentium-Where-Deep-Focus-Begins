"use client";

import React, { useState } from "react";
import {
  Calendar,
  DateField,
  DatePicker,
  Label,
  Button,
  Modal,
  toast,
  Avatar,
} from "@heroui/react";
import { CalendarDate } from "@internationalized/date";
import {
  RiArrowDownSLine,
  RiCalendarCheckLine,
  RiCheckboxCircleLine,
  RiLoginBoxLine,
  RiMapPinLine,
  RiSparklingLine,
  RiUserLine,
} from "react-icons/ri";
import { authClient } from "@/lib/auth-client";
import { buildHoursOptions } from "@/lib/booking-time";
import Link from "next/link";
import { useRouter } from "next/navigation";

const fieldLabelClass = "mb-1.5 block text-sm font-medium text-stone-700";
const fieldClassName =
  "h-11 w-full rounded-xl border border-stone-200 bg-white text-sm text-stone-800 outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100";
const timeSelectClassName = `${fieldClassName} appearance-none pl-3 pr-9`;

const BookingButton = ({ room }) => {
  const roomName = room?.name || "Focus Space Pod";
  const hourlyRate = Number(room?.hourlyRate) || 0;
  const capacity = room?.capacity ?? 1;
  const floor = room?.floor;
  const amenities = room?.amenities ?? [];
  const visibleAmenities = amenities.slice(0, 3);
  const extraAmenitiesCount = amenities.length - visibleAmenities.length;

  const router = useRouter();

  const [selectedDate, setSelectedDate] = useState(
    new CalendarDate(
      new Date().getFullYear(),
      new Date().getMonth() + 1,
      new Date().getDate(),
    ),
  );

  const [startTime, setStartTime] = useState("09");
  const [endTime, setEndTime] = useState("10");
  const [note, setNote] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const hoursOptions = buildHoursOptions();

  const calculateTotalCost = () => {
    const duration = Number(endTime) - Number(startTime);

    if (duration <= 0 || isNaN(duration)) return 0;

    return duration * hourlyRate;
  };

  const computedCost = calculateTotalCost();

  const handleStartTimeChange = (newStart) => {
    setStartTime(newStart);

    if (Number(newStart) >= Number(endTime)) {
      const nextHour = (Number(newStart) + 1).toString().padStart(2, "0");

      setEndTime(nextHour === "24" ? "23" : nextHour);
    }
  };

  const { data: session } = authClient.useSession();
  const user = session?.user;

  const handleReservation = async () => {
    if (Number(startTime) >= Number(endTime)) {
      toast.danger("End time must be after start time");
      return;
    }

    if (!user) {
      toast.danger("Please sign in to book a room");
      return;
    }

    setIsLoading(true);

    const reservationData = {
      roomId: room?._id,
      roomName: room?.name,
      date: selectedDate?.toString(),
      startTime: `${startTime}:00`,
      endTime: `${endTime}:00`,
      note,
      totalCost: computedCost,
      hourlyRate: hourlyRate,
      userId: user?.id,
      userEmail: user?.email,
      userName: user?.name,
    };
    console.log(reservationData);

    const { data: tokenData } = await authClient.token();

    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/bookings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenData?.token}`,
      },
      body: JSON.stringify(reservationData),
    });

    const data = await res.json();

    if (res.ok && data?.success !== false) {
      toast.success("Reservation created", {
        actionProps: {
          children: "View Reservations",
          onPress: () => {
            router.push(`/my-bookings`);
          },
          className:
            "bg-indigo-500 text-white font-medium rounded-full text-sm normal-case px-4 py-1 hover:bg-indigo-600",
        },
        description: "Your quiet focus session reservation is active.",
      });
    } else {
      toast.danger(data.message || "Failed to create reservation");
    }
  };

  return (
    <aside className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm ring-1 ring-stone-900/5">
      <div className="border-b border-indigo-100/50 bg-gradient-to-br from-indigo-100/45 via-white to-violet-50/80 px-6 py-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
          Book this room
        </p>
        <h2 className="mt-1 line-clamp-2 text-lg font-semibold leading-snug text-stone-900">
          {roomName}
        </h2>
        <div className="mt-3 flex items-baseline gap-1.5">
          <span className="text-4xl font-bold tracking-tight text-stone-900">
            ${hourlyRate}
          </span>
          <span className="text-sm font-medium text-stone-500">/ hour</span>
        </div>
        {room?.bookingCount != null && (
          <div
            className={`mt-3 flex items-center gap-2.5 rounded-xl px-3 py-2.5 ring-1 ${
              room.bookingCount === 0
                ? "bg-emerald-50/90 ring-emerald-200/80"
                : "bg-white/90 ring-indigo-200/70 shadow-sm"
            }`}
          >
            <span
              className={`flex size-9 shrink-0 items-center justify-center rounded-full shadow-sm ring-1 ${
                room.bookingCount === 0
                  ? "bg-white text-emerald-600 ring-emerald-200/80"
                  : "bg-indigo-50 text-indigo-600 ring-indigo-100"
              }`}
            >
              {room.bookingCount === 0 ? (
                <RiSparklingLine className="size-4" aria-hidden />
              ) : (
                <RiCalendarCheckLine className="size-4" aria-hidden />
              )}
            </span>
            <div className="min-w-0">
              <p
                className={`text-[10px] font-semibold uppercase tracking-wide ${
                  room.bookingCount === 0
                    ? "text-emerald-700"
                    : "text-indigo-600"
                }`}
              >
                {room.bookingCount === 0 ? "First slot open" : "Popularity"}
              </p>
              <p className="text-sm font-semibold leading-snug text-stone-800">
                {room.bookingCount === 0
                  ? "Be the first to book this space"
                  : `${room.bookingCount} reservation${room.bookingCount === 1 ? "" : "s"} so far`}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4 px-6 py-5">
        <div className={`grid gap-3 ${floor ? "grid-cols-2" : "grid-cols-1"}`}>
          {floor && (
            <div className="flex items-center gap-2.5 rounded-full bg-stone-50 px-3 py-2.5">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white text-indigo-600 shadow-sm ring-1 ring-stone-200/80">
                <RiMapPinLine className="size-4" />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-medium uppercase text-stone-400">
                  Floor
                </p>
                <p className="truncate text-xs font-semibold text-stone-800">
                  {floor}
                </p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2.5 rounded-full bg-stone-50 px-3 py-2.5">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white text-indigo-600 shadow-sm ring-1 ring-stone-200/80">
              <RiUserLine className="size-4" />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-medium uppercase text-stone-400">
                Capacity
              </p>
              <p className="text-xs font-semibold text-stone-800">
                {capacity} {capacity === 1 ? "seat" : "seats"}
              </p>
            </div>
          </div>
        </div>

        {visibleAmenities.length > 0 && (
          <div>
            <p className="mb-2 text-xs font-medium uppercase text-stone-400">
              Includes
            </p>
            <div className="flex flex-wrap gap-1.5">
              {visibleAmenities.map((amenity) => (
                <span
                  key={amenity}
                  className="inline-flex items-center gap-1 rounded-full border border-stone-200 bg-stone-50 px-2.5 py-1 text-xs font-medium text-stone-600"
                >
                  <RiCheckboxCircleLine className="size-3.5 shrink-0 text-indigo-500" />
                  {amenity}
                </span>
              ))}
              {extraAmenitiesCount > 0 && (
                <span className="rounded-full border border-dashed border-stone-300 px-2.5 py-1 text-xs font-medium text-stone-500">
                  +{extraAmenitiesCount} more
                </span>
              )}
            </div>
          </div>
        )}

        {(room?.createdBy || room?.creatorEmail) && (
          <div className="rounded-2xl border border-stone-200 bg-stone-50/80 p-4 ring-1 ring-stone-900/5">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-stone-400">
              Listed by
            </p>
            <div className="flex items-center gap-3">
              <Avatar className="size-11 shrink-0 border-2 border-white shadow-sm ring-1 ring-stone-200/80">
                <Avatar.Image
                  referrerPolicy="no-referrer"
                  alt={room?.createdBy || "Host"}
                  src={room?.creatorAvatar}
                />
                <Avatar.Fallback className="bg-indigo-100 text-sm font-semibold text-indigo-700">
                  {room?.createdBy?.charAt(0) ?? "?"}
                </Avatar.Fallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-stone-900">
                  {room?.createdBy || "Space host"}
                </p>
                {room?.creatorEmail && (
                  <p className="truncate text-xs text-stone-500">
                    {room.creatorEmail}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        <Modal>
          {user ? (
            <Button className="group flex h-12 w-full items-center justify-center gap-2 rounded-full bg-indigo-600 text-sm font-semibold text-white shadow-md shadow-indigo-600/25 transition-all duration-200 hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-600/30 active:scale-[0.98]">
              <RiCalendarCheckLine className="size-5 transition-transform duration-200 group-hover:scale-110" />
              Reserve Space
            </Button>
          ) : (
            <Link
              href="/login"
              className="group flex h-12 w-full items-center justify-center gap-2 rounded-full bg-indigo-600 text-sm font-semibold text-white shadow-md shadow-indigo-600/25 transition-all duration-200 hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-600/30 active:scale-[0.98]"
            >
              <RiLoginBoxLine className="size-5 transition-transform duration-200 group-hover:scale-110" />
              Login to Reserve
            </Link>
          )}

          <Modal.Backdrop className="bg-black/50 backdrop-blur-sm">
            <Modal.Container placement="center">
              <Modal.Dialog className="w-full max-w-md overflow-visible rounded-2xl border border-stone-200 bg-white p-0 shadow-2xl">
                <Modal.CloseTrigger />

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleReservation();
                  }}
                >
                  <Modal.Header className="space-y-1 border-b border-stone-100 px-5 pb-4 pt-5 pr-12">
                    <Modal.Heading className="text-lg font-semibold text-stone-900">
                      Reserve Your Room
                    </Modal.Heading>
                    <p className="text-sm text-stone-500">
                      Pick a date and time slot for{" "}
                      <span className="font-medium text-stone-800">
                        {roomName}
                      </span>
                      .
                    </p>
                  </Modal.Header>

                  <Modal.Body className="space-y-4 overflow-visible px-5 py-4">
                    <DatePicker
                      className="w-full"
                      name="date"
                      value={selectedDate}
                      onChange={setSelectedDate}
                    >
                      <Label className={fieldLabelClass}>Date</Label>

                      <DateField.Group
                        fullWidth
                        className={`${fieldClassName} px-3 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100`}
                      >
                        <DateField.Input>
                          {(segment) => (
                            <DateField.Segment
                              segment={segment}
                              className="text-sm text-stone-800"
                            />
                          )}
                        </DateField.Input>

                        <DateField.Suffix>
                          <DatePicker.Trigger>
                            <DatePicker.TriggerIndicator className="text-stone-500" />
                          </DatePicker.Trigger>
                        </DateField.Suffix>
                      </DateField.Group>

                      <DatePicker.Popover className="rounded-xl border border-stone-200 bg-white p-3 shadow-xl">
                        <Calendar aria-label="Reservation Date">
                          <Calendar.Header className="mb-3 flex items-center justify-between">
                            <Calendar.YearPickerTrigger className="flex items-center gap-1 text-sm font-semibold text-stone-800">
                              <Calendar.YearPickerTriggerHeading />
                              <Calendar.YearPickerTriggerIndicator />
                            </Calendar.YearPickerTrigger>

                            <div className="flex items-center gap-1">
                              <Calendar.NavButton
                                slot="previous"
                                className="rounded-lg p-1.5 text-stone-500 hover:bg-stone-100"
                              />
                              <Calendar.NavButton
                                slot="next"
                                className="rounded-lg p-1.5 text-stone-500 hover:bg-stone-100"
                              />
                            </div>
                          </Calendar.Header>

                          <Calendar.Grid className="w-full text-center">
                            <Calendar.GridHeader className="text-xs font-medium text-stone-400">
                              {(day) => (
                                <Calendar.HeaderCell>{day}</Calendar.HeaderCell>
                              )}
                            </Calendar.GridHeader>

                            <Calendar.GridBody>
                              {(date) => (
                                <Calendar.Cell
                                  date={date}
                                  className="rounded-lg p-1.5 text-sm text-stone-800 hover:bg-indigo-50"
                                />
                              )}
                            </Calendar.GridBody>
                          </Calendar.Grid>
                        </Calendar>
                      </DatePicker.Popover>
                    </DatePicker>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className={fieldLabelClass} htmlFor="start-time">
                          Start
                        </label>
                        <div className="relative">
                          <select
                            id="start-time"
                            required
                            value={startTime}
                            onChange={(e) =>
                              handleStartTimeChange(e.target.value)
                            }
                            className={timeSelectClassName}
                          >
                            {hoursOptions.slice(0, -1).map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                          <RiArrowDownSLine
                            aria-hidden
                            className="pointer-events-none absolute right-2.5 top-1/2 size-4 -translate-y-1/2 text-stone-400"
                          />
                        </div>
                      </div>

                      <div>
                        <label className={fieldLabelClass} htmlFor="end-time">
                          End
                        </label>
                        <div className="relative">
                          <select
                            id="end-time"
                            required
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                            className={timeSelectClassName}
                          >
                            {hoursOptions.map((option) => (
                              <option
                                key={option.value}
                                value={option.value}
                                disabled={
                                  Number(option.value) <= Number(startTime)
                                }
                              >
                                {option.label}
                              </option>
                            ))}
                          </select>
                          <RiArrowDownSLine
                            aria-hidden
                            className="pointer-events-none absolute right-2.5 top-1/2 size-4 -translate-y-1/2 text-stone-400"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className={fieldLabelClass} htmlFor="booking-note">
                        Special note{" "}
                        <span className="font-normal text-stone-400">
                          (optional)
                        </span>
                      </label>
                      <textarea
                        id="booking-note"
                        name="note"
                        rows={2}
                        placeholder="Any setup needed?"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        className={`${fieldClassName} resize-none px-3 py-2.5 placeholder:text-stone-400`}
                      />
                    </div>

                    {computedCost > 0 && (
                      <div className="flex items-center justify-between rounded-full bg-stone-50 px-4 py-3 text-sm">
                        <span className="font-medium text-stone-700">
                          Total cost
                        </span>
                        <span className="text-lg font-bold text-indigo-600">
                          ${computedCost.toFixed(2)}
                        </span>
                      </div>
                    )}
                  </Modal.Body>

                  <Modal.Footer className="flex items-center justify-end gap-3 border-t border-stone-100 px-5 py-4">
                    <Button
                      slot="close"
                      className="h-10 rounded-full border-0 bg-transparent px-3 text-sm font-medium text-stone-600 hover:bg-stone-100"
                    >
                      Cancel
                    </Button>

                    <Button
                      type="submit"
                      isLoading={isLoading}
                      disabled={computedCost <= 0}
                      className={`h-10 rounded-full px-5 text-sm font-medium transition-all ${
                        computedCost > 0
                          ? "bg-indigo-600 text-white hover:bg-indigo-700"
                          : "cursor-not-allowed bg-stone-200 text-stone-400"
                      }`}
                    >
                      Confirm Reservation
                    </Button>
                  </Modal.Footer>
                </form>
              </Modal.Dialog>
            </Modal.Container>
          </Modal.Backdrop>
        </Modal>

        <p className="text-center text-xs leading-relaxed text-stone-400">
          Pick a date and hourly slot · billed by the hour
        </p>
      </div>
    </aside>
  );
};

export default BookingButton;
