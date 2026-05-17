"use client";
import React from "react";
import Link from "next/link";
import {
  IoMailOutline,
  IoLockClosedOutline,
  IoArrowForward,
  IoAlertCircleOutline,
} from "react-icons/io5";
import { authClient } from "@/lib/auth-client";
import { FieldError, Form, Input, TextField, toast } from "@heroui/react";

const LoginPage = () => {
  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get("email");
    const password = formData.get("password");

    const { data, error } = await authClient.signIn.email({
      email: email,
      password: password,
      callbackURL: "/",
    });

    if (error) {
      toast.danger("Authentication Failed", {
        description: error.message,
        indicator: <IoAlertCircleOutline size={20} />,
      });
    }
  };

  const signIn = async () => {
    await authClient.signIn.social({
      provider: "google",
    });
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-zinc-50 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-12">
          <div className="flex justify-center items-center gap-2 mb-4">
            <div className="h-0.5 w-8 bg-sky-900" />
            <span className="text-sm font-black uppercase text-sky-900">
              Credentials
            </span>
            <div className="h-0.5 w-8 bg-sky-900" />
          </div>
          <h1 className="text-5xl font-black text-zinc-900 uppercase leading-none">
            Welcome Back
          </h1>
          <p className="text-zinc-400 font-bold mt-4 uppercase text-sm">
            Access your global travel itinerary
          </p>
        </div>

        <div className="bg-white p-10 rounded-2xl border border-zinc-100 shadow-2xl shadow-sky-900/5">
          <Form
            className="space-y-8"
            onSubmit={onSubmit}
            validationBehavior="native"
          >
            <TextField
              isRequired
              name="email"
              validate={(value) =>
                !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)
                  ? "Invalid email format"
                  : null
              }
              className="flex flex-col gap-2"
            >
              <label className="text-sky-900 text-sm font-black uppercase ml-1">
                Email Address
              </label>
              <div className="relative flex items-center">
                <IoMailOutline className="absolute left-4 text-zinc-400 size-5 z-10" />
                <Input
                  aria-label="email"
                  name="email"
                  placeholder="NAME@EXAMPLE.COM"
                  className="w-full pl-12 pr-4 h-14 bg-zinc-50/50 border border-zinc-100 rounded-xl text-zinc-900 font-bold text-[11px] uppercase transition-all hover:border-sky-900"
                />
              </div>
              <FieldError className="text-rose-500 text-[9px] font-black uppercase ml-1" />
            </TextField>

            <TextField
              isRequired
              name="password"
              validate={(value) =>
                value.length < 8 ? "Minimum 8 characters" : null
              }
              className="flex flex-col gap-2"
            >
              <label className="text-sky-900 text-sm font-black uppercase ml-1">
                Security Password
              </label>
              <div className="relative flex items-center">
                <IoLockClosedOutline className="absolute left-4 text-zinc-400 size-5 z-10" />
                <Input
                  aria-label="Password"
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 h-14 bg-zinc-50/50 border border-zinc-100 rounded-xl text-zinc-900 transition-all hover:border-sky-900"
                />
              </div>
              <FieldError className="text-rose-500 text-[9px] font-black uppercase ml-1" />
            </TextField>

            <button
              type="submit"
              className=" cursor-pointer w-full h-16 bg-sky-900 text-white rounded-xl font-black text-[11px] uppercase flex items-center justify-center gap-3 hover:bg-sky-800 transition-all shadow-xl shadow-sky-900/20"
            >
              Secure Login
              <IoArrowForward size={16} />
            </button>
          </Form>

          <div className="relative my-10">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-100"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-4 text-zinc-300 font-black uppercase text-[9px]">
                or
              </span>
            </div>
          </div>

          <button
            onClick={() => signIn()}
            className="w-full h-14 bg-white text-zinc-900 border border-zinc-100 rounded-xl font-black text-sm uppercase flex items-center justify-center gap-3 hover:bg-zinc-50 transition-all shadow-sm cursor-pointer"
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </button>

          <div className="mt-10 text-center">
            <p className="text-zinc-400 text-sm font-bold uppercase">
              New to Odyssey?{" "}
              <Link
                href="/register"
                className="text-sky-900 font-black underline underline-offset-4 decoration-sky-900/20 hover:decoration-sky-900 transition-all"
              >
                Create Account
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/"
            className="text-zinc-400 text-sm font-black uppercase hover:text-sky-900 transition-colors"
          >
            ← Return to Hub
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
