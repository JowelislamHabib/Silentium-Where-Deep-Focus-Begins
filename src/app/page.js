import Link from "next/link";
import { RiArrowRightLine, RiSparklingLine } from "react-icons/ri";
import AnimatedCounter from "./Components/AnimatedCounter";
import Banner from "./Components/Banner";
import RoomCard from "./Components/RoomCard";
import SuccessStoriesCarousel from "./Components/SuccessStoriesCarousel";

const getRooms = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/rooms`, {
      cache: "no-store",
    });
    const data = await res.json();
    const roomList = Array.isArray(data) ? data : [];

    return roomList
      .sort((a, b) => new Date(b?.createdAt || 0) - new Date(a?.createdAt || 0))
      .slice(0, 3);
  } catch (error) {
    return [];
  }
};

export default async function Home() {
  const rooms = await getRooms();

  return (
    <main>
      <Banner />
      <section className="relative py-16 sm:py-20">
        <div className="container relative z-10 mx-auto px-4">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div className="space-y-3">
              <p className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-indigo-700 shadow-sm ring-1 ring-white">
                <RiSparklingLine className="size-3.5" />
                Available now
              </p>
              <h2 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
                Browse available study rooms
              </h2>
              <p className="max-w-2xl text-sm leading-relaxed text-stone-500 sm:text-base">
                Pick from private rooms, compare amenities, and book the room
                that matches your session style.
              </p>
            </div>
            <Link
              href="/rooms"
              className="inline-flex h-11 items-center gap-2 rounded-full border border-stone-200 bg-white px-5 text-sm font-semibold text-stone-700 shadow-sm transition-all hover:border-indigo-200 hover:text-indigo-700 hover:shadow-md"
            >
              Browse all rooms
              <RiArrowRightLine className="size-4" />
            </Link>
          </div>

          {rooms.length > 0 ? (
            <div className="grid grid-cols-1 gap-7 md:grid-cols-2 xl:grid-cols-3">
              {rooms.map((room) => (
                <RoomCard key={room?._id} room={room} />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-stone-300 bg-white px-6 py-14 text-center ring-1 ring-stone-900/5">
              <p className="text-sm text-stone-500">
                No rooms available right now. Check again soon.
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="relative overflow-hidden border-y border-indigo-100/60 bg-[radial-gradient(circle_at_10%_20%,rgba(129,140,248,0.12),transparent_42%),radial-gradient(circle_at_90%_80%,rgba(167,139,250,0.1),transparent_38%),linear-gradient(180deg,#f5f3ff_0%,#fafaf9_55%,#ffffff_100%)] py-12 sm:py-16">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-20 top-8 size-64 rounded-full bg-violet-300/20 blur-3xl"
        />
        <div className="container relative mx-auto px-4">
          <div className="mb-8">
            <div className="space-y-3">
              <p className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-indigo-700 shadow-sm ring-1 ring-white">
                <RiSparklingLine className="size-3.5" />
                Our story
              </p>
              <h2 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
                Study spaces made simple, practical, and dependable
              </h2>
              <p className="max-w-2xl text-sm leading-relaxed text-stone-500 sm:text-base">
                QuietHub built for one goal: remove booking chaos so students
                can focus faster. Every listing emphasizes clarity, quality, and
                confidence before reservation starts.
              </p>
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-[1.2fr_1fr]">
            <article className="rounded-3xl border border-stone-200/90 bg-white/90 p-6 shadow-sm ring-1 ring-stone-900/5 backdrop-blur-sm sm:p-8">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-indigo-100 bg-indigo-50/60 p-4">
                  <p className="text-sm font-semibold text-stone-900">
                    Mission
                  </p>
                  <p className="mt-2 text-sm text-stone-500">
                    Make room discovery fast and practical for real study needs.
                  </p>
                </div>
                <div className="rounded-xl border border-violet-100 bg-violet-50/60 p-4">
                  <p className="text-sm font-semibold text-stone-900">
                    Teamwork
                  </p>
                  <p className="mt-2 text-sm text-stone-500">
                    Students and hosts align schedules without communication
                    drag.
                  </p>
                </div>
              </div>
              <div className="group mt-6 overflow-hidden rounded-xl border border-stone-200">
                <img
                  src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1400&q=80"
                  alt="Modern quiet study room interior"
                  className="h-52 w-full scale-110 object-cover transition-transform duration-500 ease-out will-change-transform group-hover:scale-100"
                  loading="lazy"
                />
              </div>
            </article>
            <article className="rounded-3xl border border-indigo-100 bg-linear-to-br from-indigo-50 to-violet-50 p-6 shadow-sm ring-1 ring-indigo-100 sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">
                Snapshot
              </p>
              <div className="mt-4 space-y-3">
                <div className="rounded-xl border border-white/80 bg-white p-4">
                  <p className="text-2xl font-bold text-stone-900">
                    <AnimatedCounter value="98%" />
                  </p>
                  <p className="text-sm text-stone-500">Booking success rate</p>
                </div>
                <div className="rounded-xl border border-white/80 bg-white p-4">
                  <p className="text-2xl font-bold text-stone-900">
                    <AnimatedCounter value="100+" duration={2200} />
                  </p>
                  <p className="text-sm text-stone-500">Partner spaces</p>
                </div>
                <div className="rounded-xl border border-white/80 bg-white p-4">
                  <p className="text-2xl font-bold text-stone-900">
                    <AnimatedCounter value="20+" duration={1800} />
                  </p>
                  <p className="text-sm text-stone-500">
                    Active room categories
                  </p>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden border-y border-indigo-100/60 bg-[radial-gradient(circle_at_15%_0%,rgba(129,140,248,0.1),transparent_40%),radial-gradient(circle_at_85%_100%,rgba(167,139,250,0.08),transparent_38%),linear-gradient(180deg,#ffffff_0%,#f8faff_100%)] py-12 sm:py-16">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 top-6 size-56 rounded-full bg-indigo-200/25 blur-3xl"
        />
        <div className="container relative mx-auto px-4">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div className="space-y-3">
              <p className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-indigo-700 shadow-sm ring-1 ring-white">
                <RiSparklingLine className="size-3.5" />
                Success stories
              </p>
              <h2 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
                Real results from focused students and hosts
              </h2>
              <p className="max-w-2xl text-sm leading-relaxed text-stone-500 sm:text-base">
                Hear how QuietHub helps learners stay consistent and hosts fill
                unused hours with reliable bookings.
              </p>
            </div>
            <div className="rounded-3xl border border-indigo-100 bg-white px-5 py-4 text-center shadow-sm ring-1 ring-stone-900/5 lg:text-left">
              <p className="text-4xl font-bold text-stone-900">
                <AnimatedCounter value="90%" duration={2000} />
              </p>
              <p className="mt-1 text-sm text-stone-500">
                report better study consistency
              </p>
            </div>
          </div>
          <SuccessStoriesCarousel />
        </div>
      </section>

      <section className="py-14 sm:py-16">
        <div className="container mx-auto px-4">
          <div className="rounded-3xl border border-stone-800 bg-linear-to-br from-stone-900 to-stone-950 px-6 py-9 text-white shadow-2xl ring-1 ring-white/10 sm:px-10 sm:py-11">
            <div className="grid gap-8 lg:grid-cols-[1.2fr_auto] lg:items-center">
              <div>
                <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-indigo-100">
                  <RiSparklingLine className="size-3.5" />
                  Deep focus starts now
                </p>
                <h3 className="mt-4 max-w-2xl text-2xl font-bold tracking-tight sm:text-3xl">
                  Ready to book right room or publish your own?
                </h3>
                <p className="mt-3 max-w-2xl text-sm text-stone-300 sm:text-base">
                  Join students and hosts using QuietHub for faster booking,
                  cleaner schedules, and better outcomes each week.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/rooms"
                  className="inline-flex h-11 items-center justify-center rounded-full bg-white px-5 text-sm font-semibold text-stone-900 transition-colors hover:bg-indigo-100"
                >
                  Browse rooms
                  <RiArrowRightLine className="ml-2 size-4" />
                </Link>
                <Link
                  href="/add-room"
                  className="inline-flex h-11 items-center justify-center rounded-full border border-white/30 bg-transparent px-5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                >
                  Become host
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
