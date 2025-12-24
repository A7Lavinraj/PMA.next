import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isUserRoute = createRouteMatcher(["/user(.*)"]);
const isDriverRoute = createRouteMatcher(["/driver(.*)"]);
const isManagerRoute = createRouteMatcher(["/manager(.*)"]);
const isAdminRoute = createRouteMatcher(["/admin(.*)"]);
const isPublicRoute = createRouteMatcher(["/"]);

export default clerkMiddleware(async (auth, req) => {
  const authData = await auth();
  const userRole = authData.sessionClaims?.metadata?.role;
  const isAuthenticated = authData.isAuthenticated;

  // TODO: Should add proper type
  const getRoleDashboard = (role: any) => {
    switch (role) {
      case "user":
        return "/user";
      case "driver":
        return "/driver";
      case "manager":
        return "/manager";
      case "admin":
        return "/admin";
      default:
        return "/";
    }
  };

  if (
    isPublicRoute(req) &&
    req.nextUrl.pathname === "/" &&
    isAuthenticated &&
    userRole
  ) {
    const dashboardPath = getRoleDashboard(userRole);
    const url = new URL(dashboardPath, req.url);
    return NextResponse.redirect(url);
  }

  const redirectToRoleDashboard = () => {
    const redirectPath = getRoleDashboard(userRole);
    const url = new URL(redirectPath, req.url);
    return NextResponse.redirect(url);
  };

  if (isUserRoute(req) && userRole !== "user") {
    return redirectToRoleDashboard();
  }

  if (isDriverRoute(req) && userRole !== "driver") {
    return redirectToRoleDashboard();
  }

  if (isManagerRoute(req) && userRole !== "manager") {
    return redirectToRoleDashboard();
  }

  if (isAdminRoute(req) && userRole !== "admin") {
    return redirectToRoleDashboard();
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
