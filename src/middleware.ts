import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Client-side auth redirect handles the actual protection in (app)/layout.tsx
// This middleware only adds basic security headers
export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Security headers
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  return response;
}

export const config = {
  matcher: [
    // Match all paths except static files and api routes
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
