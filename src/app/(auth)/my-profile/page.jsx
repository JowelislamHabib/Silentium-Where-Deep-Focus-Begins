"use client";

import React, { useState } from "react";
import {
  LuUser,
  LuCalendar,
  LuHistory,
  LuSettings,
  LuLogOut,
  LuMapPin,
  LuCreditCard,
  LuBell,
  LuChevronRight,
  LuCompass,
} from "react-icons/lu";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import Image from "next/image";

const ProfileDashboard = () => {
  const { data: session } = authClient.useSession();
  const user = session?.user;
  console.log(user);

  const [activeTab, setActiveTab] = useState("overview");

  const stats = [
    { label: "Active Trips", value: "3", icon: <LuCompass /> },
    { label: "Past Travels", value: "12", icon: <LuHistory /> },
    { label: "Total Spent", value: "$4,250", icon: <LuCreditCard /> },
  ];

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="container mx-auto px-6 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="w-full lg:w-80 space-y-4">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="size-14 rounded-xl overflow-hidden border-2 border-sky-100">
                <Image
                  height={48}
                  width={48}
                  src={user?.image}
                  alt={user?.name}
                  className="object-cover"
                />
              </div>
              <div>
                <h2 className="font-bold text-slate-900 uppercase tracking-tight leading-none">
                  {user?.name}
                </h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">
                  {user?.id}
                </p>
              </div>
            </div>

            <nav className="bg-white border border-slate-200 rounded-xl p-2 shadow-sm">
              {[
                { id: "overview", label: "Dashboard", icon: <LuUser /> },
                { id: "bookings", label: "My Bookings", icon: <LuCalendar /> },
                { id: "history", label: "Trip History", icon: <LuHistory /> },
                { id: "settings", label: "Settings", icon: <LuSettings /> },
              ].map((item) => (
                <button
                  key={item?.id}
                  onClick={() => setActiveTab(item?.id)}
                  className={`w-full flex items-center justify-between px-4 py-3.5 rounded-lg transition-all ${
                    activeTab === item?.id
                      ? "bg-sky-600 text-white shadow-lg shadow-sky-100"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sml">{item?.icon}</span>
                    <span className="text-sm font-bold uppercase tracking-widest">
                      {item?.label}
                    </span>
                  </div>
                  <LuChevronRight
                    size={14}
                    className={
                      activeTab === item?.id ? "opacity-100" : "opacity-0"
                    }
                  />
                </button>
              ))}

              <div className="my-2 border-t border-slate-100" />

              <button className="w-full flex items-center gap-3 px-4 py-3.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-all">
                <LuLogOut size={20} />
                <span className="text-sm font-bold uppercase tracking-widest">
                  Logout
                </span>
              </button>
            </nav>
          </aside>

          <main className="flex-1 space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 uppercase tracking-tighter">
                  Account {activeTab}
                </h1>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">
                  Welcome back to your travel hub
                </p>
              </div>
              <button className="relative p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 hover:text-sky-600 transition-all">
                <LuBell size={20} />
                <span className="absolute top-2 right-2 size-2 bg-rose-500 rounded-full border-2 border-white" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {stats.map((stat, i) => (
                <div
                  key={i}
                  className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between group hover:border-sky-200 transition-colors"
                >
                  <div>
                    <p className="text-[10px] font-bold uppercase text-slate-400 tracking-widest mb-1">
                      {stat?.label}
                    </p>
                    <p className="text-3xl font-bold text-slate-900">
                      {stat?.value}
                    </p>
                  </div>
                  <div className="size-12 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center text-sml group-hover:bg-sky-50 group-hover:text-sky-600 transition-all">
                    {stat?.icon}
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">
                  Recent Activity
                </h3>
                <button className="text-[10px] font-bold text-sky-600 uppercase tracking-widest hover:underline">
                  View Full Report
                </button>
              </div>

              <div className="p-2">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="flex items-center justify-between p-6 hover:bg-slate-50 rounded-lg transition-all group"
                  >
                    <div className="flex items-center gap-5">
                      <div className="size-16 rounded-lg bg-slate-200 overflow-hidden">
                        <div className="w-full h-full bg-slate-300 animate-pulse" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 uppercase tracking-tight">
                          Destination Name Placeholder
                        </p>
                        <div className="flex items-center gap-2 text-slate-400 mt-1">
                          <LuMapPin size={12} />
                          <span className="text-[10px] font-bold uppercase tracking-widest">
                            Country
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-slate-900">$0.00</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">
                        Confirmed
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default ProfileDashboard;
