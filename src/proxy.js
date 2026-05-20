import { NextResponse } from "next/server";
import { auth } from "./lib/auth";
import { headers } from "next/headers";

export async function proxy(request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const { pathname } = request.nextUrl;
  const isAuthPage = pathname === "/login" || pathname === "/register";

  if (isAuthPage) {
    if (session) {
      return NextResponse.redirect(new URL("/my-profile", request.url));
    }
    return;
  }

  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: [
    "/my-bookings",
    "/my-listings",
    "/add-room",
    "/my-profile",
    "/login",
    "/register",
  ],
};
