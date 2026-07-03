import { NextRequest, NextResponse } from "next/server";

const UNAUTHORIZED = new NextResponse("Autentisering krävs.", {
  status: 401,
  headers: { "WWW-Authenticate": 'Basic realm="Stilify"' },
});

export function proxy(request: NextRequest) {
  const expectedPassword = process.env.APP_PASSWORD;

  // Fail closed: if no password is configured, block everything rather than
  // silently leaving the app public.
  if (!expectedPassword) {
    return UNAUTHORIZED;
  }

  const expectedUser = process.env.APP_USERNAME || "stilify";
  const auth = request.headers.get("authorization");

  if (auth?.startsWith("Basic ")) {
    const decoded = atob(auth.slice("Basic ".length));
    const separatorIndex = decoded.indexOf(":");
    const user = decoded.slice(0, separatorIndex);
    const pass = decoded.slice(separatorIndex + 1);
    if (user === expectedUser && pass === expectedPassword) {
      return NextResponse.next();
    }
  }

  return UNAUTHORIZED;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|manifest.webmanifest|sw.js|icons/).*)",
  ],
};
