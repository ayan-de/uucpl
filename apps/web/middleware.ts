import { auth } from "@/auth";
import { NextResponse } from "next/server";

// Routes that require authentication
const protectedRoutes = ["/dashboard", "/admin"];

// Routes that require ADMIN role
const adminRoutes = ["/admin"];

// Public routes (accessible without auth)
const publicRoutes = ["/login", "/register", "/forgot-password", "/"];

const middleware = auth((req) => {
    const { nextUrl } = req;
    const isLoggedIn = !!req.auth;
    const userRole = req.auth?.user?.role;

    const isProtectedRoute = protectedRoutes.some((route) =>
        nextUrl.pathname.startsWith(route)
    );
    const isAdminRoute = adminRoutes.some((route) =>
        nextUrl.pathname.startsWith(route)
    );
    const isPublicRoute = publicRoutes.some(
        (route) => nextUrl.pathname === route || nextUrl.pathname.startsWith("/api/auth")
    );
    const isApiRoute = nextUrl.pathname.startsWith("/api");

    // Allow API routes to pass through (they handle their own auth)
    if (isApiRoute && !nextUrl.pathname.startsWith("/api/auth")) {
        return NextResponse.next();
    }

    // Redirect to login if accessing protected route without auth
    if (isProtectedRoute && !isLoggedIn) {
        const loginUrl = new URL("/login", nextUrl.origin);
        loginUrl.searchParams.set("callbackUrl", nextUrl.pathname);
        return NextResponse.redirect(loginUrl);
    }

    // Check admin access
    if (isAdminRoute && isLoggedIn) {
        if (userRole !== "ADMIN") {
            // Redirect non-admin users to dashboard with error
            const dashboardUrl = new URL("/dashboard", nextUrl.origin);
            dashboardUrl.searchParams.set("error", "unauthorized");
            return NextResponse.redirect(dashboardUrl);
        }
    }

    // Redirect logged-in users away from login page
    if (isLoggedIn && nextUrl.pathname === "/login") {
        // Redirect based on role
        if (userRole === "ADMIN") {
            return NextResponse.redirect(new URL("/admin", nextUrl.origin));
        }
        return NextResponse.redirect(new URL("/dashboard", nextUrl.origin));
    }

    return NextResponse.next();
});

export const config = {
    // Match all routes except static files
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|public).*)",
    ],
};

// Cast through unknown to avoid TypeScript portability issues with next-auth internal types
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default middleware as any;
