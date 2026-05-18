import { RiSearchLine, RiFilter3Line } from "react-icons/ri";
import RoomCard from "../Components/RoomCard";

const RoomsPage = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/rooms`, {});
  const rooms = await res.json();

  console.log("amienities", rooms);

  return (
    <section className="bg-stone-50 min-h-screen">
      <div className="container mx-auto py-16 px-4">
        <div className="mb-12 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Explore Available Focus Spaces
          </h1>
          <p className="text-base text-gray-500 max-w-2xl mx-auto">
            Discover quiet study rooms, private pods, and high-productivity
            spaces designed for deep focus sessions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1">
            <div className="bg-stone-100 rounded-xl p-6 shadow-sm sticky top-24 space-y-6">
              <div className="flex items-center gap-2 pb-3 border-b border-stone-200">
                <span className="text-indigo-500">
                  <RiFilter3Line className="text-lg" />
                </span>
                <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
              </div>

              <div className="space-y-3">
                <span className="text-xs font-medium text-gray-500 uppercase">
                  Search by name
                </span>
                <div className="flex items-center gap-2 bg-stone-50 border border-stone-200 rounded-lg px-3 h-11 focus-within:border-indigo-500">
                  <span className="text-gray-500">
                    <RiSearchLine className="text-lg" />
                  </span>
                  <input
                    type="text"
                    placeholder="e.g., Quiet Pod"
                    className="w-full bg-transparent text-sm text-gray-900 placeholder-gray-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <span className="text-xs font-medium text-gray-500 uppercase block">
                  Amenities
                </span>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 text-sm text-gray-700 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-stone-200 text-indigo-500"
                    />
                    <span>Whiteboard</span>
                  </label>
                </div>
              </div>

              <div className="space-y-3">
                <span className="text-xs font-medium text-gray-500 uppercase block">
                  Hourly rate (USD)
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <span className="text-xs text-gray-500">Min</span>
                    <input
                      type="number"
                      placeholder="0"
                      min="0"
                      className="w-full h-11 px-3 bg-stone-50 border border-stone-200 rounded-lg text-sm text-gray-900 focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs text-gray-500">Max</span>
                    <input
                      type="number"
                      placeholder="Any"
                      min="0"
                      className="w-full h-11 px-3 bg-stone-50 border border-stone-200 rounded-lg text-sm text-gray-900 focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </aside>

          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {rooms.map((room) => (
                <RoomCard key={room._id} room={room} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RoomsPage;
