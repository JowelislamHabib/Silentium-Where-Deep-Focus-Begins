import Link from "next/link";
import { auth } from "@/lib/auth";
import DeleteRoomButton from "../Components/DeleteRoomButton";
import { headers } from "next/headers";

const MyListingsPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const userId = session?.user?.id;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/my-listings/${userId}`,
    {
      cache: "no-store",
    },
  );

  const rooms = await res.json();

  return (
    <section className="container mx-auto py-16">
      <div className="space-y-5">
        {rooms.map((room) => (
          <div key={room._id} className="border rounded-xl p-5 bg-white">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">{room.name}</h2>

                <p className="text-gray-500">{room.floor}</p>
              </div>

              <div className="flex gap-3">
                <Link
                  href={`/edit-room/${room._id}`}
                  className="px-4 py-2 rounded-full bg-indigo-500 text-white"
                >
                  Edit
                </Link>

                <DeleteRoomButton id={room._id} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default MyListingsPage;
