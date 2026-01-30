import { NextResponse } from "next/server";
import { verifyToken } from "./lib/auth";

export function middleware(req) {
  const token = req.cookies.get("token")?.value;

  const url = req.nextUrl.clone();

  // Protected user routes
  const protectedRoutes = ["/dashboard", "/profile", "/jobs/create"];

  if (protectedRoutes.some((route) => url.pathname.startsWith(route))) {
    if (!token) {
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
    if (
      pathname.startsWith("/dashboard/recruiter") &&
      decoded.role !== "recruiter"
    ) {
      return NextResponse.redirect(new URL("/dashboard/user", req.url));
    }
  }
  const decoded = verifyToken(token);
  if (req.nextUrl.pathname.startsWith("/dashboard/user/profile")) {
    if (decoded.role !== "user") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  if (req.nextUrl.pathname.startsWith("/dashboard/recruiter/profile/")) {
    if (decoded.role !== "recruiter") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  // Admin routes
  if (url.pathname.startsWith("/admin")) {
    if (!token) {
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }

    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== "admin") {
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // "/dashboard/:path*",
    // "/profile/:path*",
    // "/jobs/create",
    // "/admin/:path*",
  ],
};
