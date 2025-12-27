import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export default async function middleware(req: NextRequest) {
  const { pathname, origin } = req.nextUrl;
  const token = req.cookies.get("__token")?.value;

  if (!token) {
    if (pathname === "/") {
      return NextResponse.next();
    }

    return NextResponse.redirect(new URL("/", origin));
  }

  try {
    const { payload } = await jwtVerify(token, secret);

    if (!payload.role || typeof payload.role !== "string") {
      return NextResponse.redirect(new URL("/", origin));
    }

    const rolePath = `/${payload.role}`;

    if (pathname === "/") {
      return NextResponse.redirect(new URL(rolePath, origin));
    }

    if (!pathname.startsWith(rolePath)) {
      return NextResponse.redirect(new URL(rolePath, origin));
    }

    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/", origin));
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
