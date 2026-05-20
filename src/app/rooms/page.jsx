"use client";

import { RiFocus3Line, RiSparklingLine } from "react-icons/ri";
import AnimatedCounter from "../Components/AnimatedCounter";
import RoomCard from "../Components/RoomCard";
import RoomsFilter from "../Components/RoomsFilter";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

const RoomsPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    amenities: [],
    minRate: searchParams.get("minRate") || "",
    maxRate: searchParams.get("maxRate") || "",
  });

  const [amenityOptions, setAmenityOptions] = useState([]);
  const [minRateGlobal, setMinRateGlobal] = useState(0);
  const [maxRateGlobal, setMaxRateGlobal] = useState(0);

  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (filters.search) params.append("search", filters.search);
        if (filters.amenities.length > 0)
          params.append("amenities", filters.amenities.join(","));
        if (filters.minRate) params.append("minRate", filters.minRate);
        if (filters.maxRate) params.append("maxRate", filters.maxRate);

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/rooms?${params.toString()}`,
        );
        const data = await res.json();
        const roomList = Array.isArray(data) ? data : [];
        setRooms(roomList);

        if (params.toString() === "") {
          const allRes = await fetch(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/rooms`,
          );
          const allData = await allRes.json();
          const allRooms = Array.isArray(allData) ? allData : [];

          const allAmenities = [
            ...new Set(allRooms.flatMap((room) => room.amenities ?? [])),
          ];
          setAmenityOptions(allAmenities.slice(0, 10));

          const rates = allRooms.map((room) => Number(room.hourlyRate) || 0);
          setMinRateGlobal(rates.length ? Math.min(...rates) : 0);
          setMaxRateGlobal(rates.length ? Math.max(...rates) : 0);
        }

        router.push(`?${params.toString()}`, { scroll: false });
      } catch (error) {
        console.error("Failed to fetch rooms:", error);
        setRooms([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, [filters.search, filters.amenities, filters.minRate, filters.maxRate]);

  const handleSearchChange = (e) => {
    setFilters({ ...filters, search: e.target.value });
  };

  const handleAmenityChange = (amenity) => {
    setFilters((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const handleMinRateChange = (e) => {
    setFilters({ ...filters, minRate: e.target.value });
  };

  const handleMaxRateChange = (e) => {
    setFilters({ ...filters, maxRate: e.target.value });
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      amenities: [],
      minRate: "",
      maxRate: "",
    });
  };

  const hasActiveFilters =
    filters.search ||
    filters.amenities.length > 0 ||
    filters.minRate ||
    filters.maxRate;

  return (
    <section className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.12),rgba(255,255,255,0.95)_36%),linear-gradient(145deg,#f8faff_0%,#ffffff_48%,#f6f3ff_100%)]">
      <div className="relative overflow-hidden border-b border-indigo-100/60 bg-[radial-gradient(circle_at_10%_0%,rgba(129,140,248,0.2),transparent_35%),linear-gradient(to_bottom_right,#f7f8ff,#ffffff,#f8f5ff)]">
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
                Find your next room
              </p>
              <h1 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
                Rooms engineered for deep work
              </h1>
              <p className="text-base leading-relaxed text-stone-600 sm:text-lg">
                Explore premium private rooms, compare amenities instantly, and
                book right away.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 lg:shrink-0">
              <div className="rounded-xl border border-white/80 bg-white/80 px-6 py-4 shadow-sm ring-1 ring-indigo-100/80 backdrop-blur-sm">
                <p className="text-2xl font-bold text-stone-900">
                  <AnimatedCounter target={rooms.length} duration={1800} />
                </p>
                <p className="text-xs font-medium uppercase tracking-wide text-stone-500">
                  Live rooms
                </p>
              </div>
              {rooms.length > 0 && (
                <div className="rounded-xl border border-white/80 bg-white/80 px-6 py-4 shadow-sm ring-1 ring-indigo-100/80 backdrop-blur-sm">
                  <p className="text-2xl font-bold text-indigo-600">
                    <AnimatedCounter
                      target={minRateGlobal}
                      prefix="$"
                      duration={1600}
                    />
                    {maxRateGlobal > minRateGlobal && (
                      <span className="text-lg text-stone-400">
                        –
                        <AnimatedCounter
                          target={maxRateGlobal}
                          prefix="$"
                          duration={1800}
                        />
                      </span>
                    )}
                  </p>
                  <p className="text-xs font-medium uppercase tracking-wide text-stone-500">
                    Hourly range
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 lg:py-12">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)] lg:gap-12">
          <RoomsFilter
            filters={filters}
            amenityOptions={amenityOptions}
            minRateGlobal={minRateGlobal}
            maxRateGlobal={maxRateGlobal}
            onSearchChange={handleSearchChange}
            onAmenityChange={handleAmenityChange}
            onMinRateChange={handleMinRateChange}
            onMaxRateChange={handleMaxRateChange}
            onClearFilters={clearFilters}
            hasActiveFilters={hasActiveFilters}
          />

          <div>
            {loading ? (
              <div className="flex flex-col items-center justify-center rounded-3xl border border-stone-200 bg-white/90 px-6 py-20 text-center shadow-sm ring-1 ring-stone-900/5">
                <div className="mb-4 size-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent"></div>
                <p className="text-sm text-stone-500">Loading study rooms...</p>
              </div>
            ) : rooms.length > 0 ? (
              <>
                <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                  <p className="text-sm text-stone-600">
                    Showing{" "}
                    <span className="font-semibold text-stone-900">
                      {rooms.length}
                    </span>{" "}
                    {rooms.length === 1 ? "room" : "rooms"}
                    {hasActiveFilters && (
                      <span className="ml-2 text-xs text-indigo-600">
                        (filtered)
                      </span>
                    )}
                  </p>
                  <span className="hidden items-center gap-1.5 text-xs font-medium text-stone-400 sm:inline-flex">
                    <RiFocus3Line className="size-3.5" />
                    Best for focused sessions
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
                  {rooms.map((room) => (
                    <RoomCard key={room._id} room={room} />
                  ))}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-stone-300 bg-white px-6 py-20 text-center ring-1 ring-stone-900/5">
                <span className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                  <RiFocus3Line className="size-7" />
                </span>
                <h2 className="text-lg font-semibold text-stone-900">
                  No rooms found
                </h2>
                <p className="mt-2 max-w-sm text-sm text-stone-500">
                  Try adjusting your filters to see more rooms.
                </p>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="mt-4 rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default RoomsPage;
