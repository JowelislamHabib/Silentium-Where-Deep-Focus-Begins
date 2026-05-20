"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Button,
  FieldError,
  Form,
  Input,
  InputGroup,
  TextField,
  toast,
} from "@heroui/react";
import {
  RiArrowRightLine,
  RiBrainLine,
  RiCalendarCheckLine,
  RiCheckboxCircleFill,
  RiEyeOffLine,
  RiEyeLine,
  RiFlashlightLine,
  RiHotelLine,
  RiImageLine,
  RiLockPasswordLine,
  RiMailLine,
  RiSparklingLine,
  RiTimeLine,
  RiUserLine,
} from "react-icons/ri";
import { authClient } from "@/lib/auth-client";

const signupBenefits = [
  {
    icon: RiHotelLine,
    title: "Book in minutes",
    text: "Find quiet rooms, compare rates, and reserve by the hour.",
  },
  {
    icon: RiCalendarCheckLine,
    title: "One dashboard",
    text: "Track upcoming sessions and history without spreadsheet chaos.",
  },
  {
    icon: RiBrainLine,
    title: "Host when ready",
    text: "List your space later — no extra signup required.",
  },
];

const trustPoints = ["Free to join", "No credit card", "Cancel anytime"];

const labelClassName = "text-sm font-medium text-stone-800";
const inputClassName =
  "w-full h-11 rounded-xl border border-stone-200/90 bg-stone-50/80 pl-11 pr-4 text-sm text-stone-900 shadow-sm transition-[border-color,box-shadow,background-color] placeholder:text-stone-400 hover:border-stone-300 hover:bg-white focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/15";

const RegisterPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const onSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    const photo = String(formData.get("photo") ?? "").trim();

    setIsSubmitting(true);

    try {
      const { error } = await authClient.signUp.email({
        name,
        email,
        password,
        image: photo,
      });

      if (error) {
        toast.danger(error.message ?? "Registration failed. Please try again.");
        return;
      }

      toast.success("Account created. Please sign in.");
      await authClient.signOut();
      router.push("/login");
    } catch {
      toast.danger("Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const signInWithGoogle = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/",
    });
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_12%_8%,rgba(129,140,248,0.18),transparent_38%),radial-gradient(circle_at_88%_92%,rgba(167,139,250,0.12),transparent_36%),linear-gradient(180deg,#f8faff_0%,#fafaf9_45%,#ffffff_100%)]">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-20 size-80 rounded-full bg-indigo-300/25 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 bottom-10 size-72 rounded-full bg-violet-200/30 blur-3xl"
      />

      <div className="container relative mx-auto flex min-h-screen items-center px-4 py-10 sm:py-14 lg:py-16">
        <div className="grid w-full items-center gap-10 lg:grid-cols-2 lg:gap-16 xl:gap-20">
          {/* Value panel — helps visitors decide quickly */}
          <div className="order-2 lg:order-1">
            <p className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-indigo-700 shadow-sm ring-1 ring-indigo-100">
              <RiSparklingLine className="size-3.5" />
              Start free today
            </p>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
              Join QuietHub and{" "}
              <span className="bg-linear-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                focus faster
              </span>
            </h1>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-stone-600">
              Students book quiet rooms in minutes. Hosts fill empty hours. One
              account does both — no separate tools.
            </p>

            <ul className="mt-8 space-y-4">
              {signupBenefits.map((item) => (
                <li
                  key={item.title}
                  className="flex gap-4 rounded-2xl border border-white/80 bg-white/70 p-4 shadow-sm ring-1 ring-stone-900/5 backdrop-blur-sm"
                >
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 ring-1 ring-indigo-100">
                    <item.icon className="size-5" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-stone-900">
                      {item.title}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-stone-500">
                      {item.text}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap gap-2">
              {trustPoints.map((point) => (
                <span
                  key={point}
                  className="inline-flex items-center gap-1.5 rounded-full border border-indigo-100 bg-indigo-50/60 px-3 py-1 text-xs font-medium text-indigo-800"
                >
                  <RiCheckboxCircleFill className="size-3.5 shrink-0 text-indigo-500" />
                  {point}
                </span>
              ))}
            </div>

            <p className="mt-6 flex items-center gap-2 text-sm text-stone-500">
              <RiTimeLine className="size-4 text-indigo-500" />
              <span>
                <strong className="font-semibold text-stone-700">
                  ~30 sec
                </strong>{" "}
                with Google · ~2 min with email
              </span>
            </p>
          </div>

          {/* Signup card */}
          <div className="order-1 lg:order-2">
            <div className="mx-auto w-full max-w-md overflow-hidden rounded-3xl border border-stone-200/90 bg-white/90 shadow-xl shadow-indigo-100/40 ring-1 ring-stone-900/5 backdrop-blur-sm">
              <div className="border-b border-stone-200/90 bg-linear-to-r from-indigo-50/80 via-white to-violet-50/40 px-6 py-6 sm:px-8">
                <h2 className="text-xl font-bold tracking-tight text-stone-900 sm:text-2xl">
                  Create your account
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-stone-600">
                  Fastest path: Google in one tap. Or use email below.
                </p>
              </div>

              <div className="space-y-5 p-6 sm:p-8">
                {/* Google first — lowest friction */}
                <div className="space-y-3">
                  <Button
                    type="button"
                    onPress={signInWithGoogle}
                    className="flex h-12 w-full items-center justify-center gap-2.5 rounded-full border border-stone-200 bg-white text-sm font-semibold text-stone-900 shadow-sm transition-all hover:border-indigo-200 hover:shadow-md"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
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
                    <RiFlashlightLine className="size-4 text-amber-500" />
                  </Button>
                  <p className="text-center text-xs text-stone-500">
                    Recommended — no password to remember
                  </p>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-stone-200" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-white px-3 text-xs font-medium text-stone-400">
                      or sign up with email
                    </span>
                  </div>
                </div>

                <Form
                  className="space-y-4"
                  onSubmit={onSubmit}
                  validationBehavior="native"
                >
                  <TextField
                    isRequired
                    name="name"
                    className="flex flex-col gap-2"
                  >
                    <span className={labelClassName}>Full name</span>
                    <div className="relative">
                      <RiUserLine className="pointer-events-none absolute left-3.5 top-1/2 size-[18px] -translate-y-1/2 text-stone-400" />
                      <Input
                        name="name"
                        placeholder="Alex Chen"
                        className={inputClassName}
                      />
                    </div>
                    <FieldError className="text-xs font-medium text-rose-600" />
                  </TextField>

                  <TextField
                    isRequired
                    name="photo"
                    className="flex flex-col gap-2"
                  >
                    <span className={labelClassName}>Avatar URL</span>
                    <div className="relative">
                      <RiImageLine className="pointer-events-none absolute left-3.5 top-1/2 size-[18px] -translate-y-1/2 text-stone-400" />
                      <Input
                        name="photo"
                        type="url"
                        placeholder="https://example.com/avatar.jpg"
                        className={inputClassName}
                      />
                    </div>
                    <FieldError className="text-xs font-medium text-rose-600" />
                  </TextField>

                  <TextField
                    isRequired
                    name="email"
                    className="flex flex-col gap-2"
                  >
                    <span className={labelClassName}>Email</span>
                    <div className="relative">
                      <RiMailLine className="pointer-events-none absolute left-3.5 top-1/2 size-[18px] -translate-y-1/2 text-stone-400" />
                      <Input
                        name="email"
                        type="email"
                        placeholder="you@university.edu"
                        className={inputClassName}
                      />
                    </div>
                    <FieldError className="text-xs font-medium text-rose-600" />
                  </TextField>

                  <TextField
                    isRequired
                    minLength={8}
                    name="password"
                    validate={(value) => {
                      if (value.length < 8) {
                        return "Password must be at least 8 characters";
                      }
                      if (!/[A-Z]/.test(value)) {
                        return "Include at least one uppercase letter";
                      }
                      if (!/[a-z]/.test(value)) {
                        return "Include at least one lowercase letter";
                      }
                      return null;
                    }}
                    className="flex flex-col gap-2"
                  >
                    <span className={labelClassName}>Password</span>
                    <InputGroup className="flex h-11 w-full items-center overflow-hidden rounded-xl border border-stone-200/90 bg-stone-50/80 shadow-sm transition-[border-color,box-shadow,background-color] focus-within:border-indigo-400 focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-500/15">
                      <div className="pl-3.5 text-stone-400">
                        <RiLockPasswordLine className="size-[18px]" />
                      </div>
                      <InputGroup.Input
                        name="password"
                        type={isVisible ? "text" : "password"}
                        placeholder="Min. 8 characters"
                        className="flex-1 border-none bg-transparent px-2 text-sm text-stone-900 outline-none"
                      />
                      <InputGroup.Suffix className="pr-2">
                        <Button
                          isIconOnly
                          size="sm"
                          variant="light"
                          type="button"
                          onPress={() => setIsVisible(!isVisible)}
                          className="min-w-0 text-stone-500"
                          aria-label={
                            isVisible ? "Hide password" : "Show password"
                          }
                        >
                          {isVisible ? (
                            <RiEyeOffLine className="size-[18px]" />
                          ) : (
                            <RiEyeLine className="size-[18px]" />
                          )}
                        </Button>
                      </InputGroup.Suffix>
                    </InputGroup>
                    <FieldError className="text-xs font-medium text-rose-600" />
                  </TextField>

                  <Button
                    type="submit"
                    isDisabled={isSubmitting}
                    className="mt-1 flex h-11 w-full items-center justify-center gap-2 rounded-full bg-stone-900 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 hover:shadow-md disabled:opacity-60"
                  >
                    {isSubmitting
                      ? "Creating account..."
                      : "Create free account"}
                    {!isSubmitting && <RiArrowRightLine className="size-4" />}
                  </Button>
                </Form>
              </div>

              <div className="border-t border-stone-200/90 bg-stone-50/50 px-6 py-4 text-center sm:px-8">
                <p className="text-sm text-stone-600">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="font-semibold text-indigo-600 hover:text-indigo-700"
                  >
                    Log in
                  </Link>
                </p>
                <Link
                  href="/rooms"
                  className="mt-2 inline-block text-xs font-medium text-stone-500 hover:text-stone-800"
                >
                  Browse rooms without signing up →
                </Link>
              </div>
            </div>

            <p className="mt-6 text-center">
              <Link
                href="/"
                className="text-sm font-medium text-stone-500 transition-colors hover:text-stone-800"
              >
                ← Back to home
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
