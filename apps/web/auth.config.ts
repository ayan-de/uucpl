import type { NextAuthConfig } from "next-auth";

// Extend the NextAuth types
declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            email: string;
            name: string | null;
            image: string | null;
            role: "ADMIN" | "CLIENT";
            clientId: string | null;
        };
    }

    interface User {
        id: string;
        email: string;
        name: string | null;
        image: string | null;
        role: "ADMIN" | "CLIENT";
        clientId: string | null;
        isActive: boolean;
    }
}

declare module "@auth/core/jwt" {
    interface JWT {
        id: string;
        role: "ADMIN" | "CLIENT";
        clientId: string | null;
    }
}

/**
 * Lightweight auth config used by the middleware (Edge runtime).
 * This file must NOT import any heavy dependencies (Prisma, bcrypt, etc.)
 * to keep the Edge Function bundle under the 1 MB limit.
 *
 * The Credentials provider and PrismaAdapter are added in auth.ts,
 * which is used only on the server side.
 */
export const authConfig: NextAuthConfig = {
    // providers array is intentionally empty here;
    // the full provider list (Credentials) is defined in auth.ts
    providers: [],

    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },

    pages: {
        signIn: "/login",
        error: "/login",
    },

    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const userRole = auth?.user?.role;

            const protectedRoutes = ["/dashboard", "/admin"];
            const adminRoutes = ["/admin"];

            const isProtectedRoute = protectedRoutes.some((route) =>
                nextUrl.pathname.startsWith(route)
            );
            const isAdminRoute = adminRoutes.some((route) =>
                nextUrl.pathname.startsWith(route)
            );
            const isApiRoute = nextUrl.pathname.startsWith("/api");

            // Allow API routes to pass through (they handle their own auth)
            if (isApiRoute && !nextUrl.pathname.startsWith("/api/auth")) {
                return true;
            }

            // Redirect to login if accessing protected route without auth
            if (isProtectedRoute && !isLoggedIn) {
                const loginUrl = new URL("/login", nextUrl.origin);
                loginUrl.searchParams.set("callbackUrl", nextUrl.pathname);
                return Response.redirect(loginUrl);
            }

            // Check admin access
            if (isAdminRoute && isLoggedIn) {
                if (userRole !== "ADMIN") {
                    const dashboardUrl = new URL("/dashboard", nextUrl.origin);
                    dashboardUrl.searchParams.set("error", "unauthorized");
                    return Response.redirect(dashboardUrl);
                }
            }

            // Redirect logged-in users away from login page
            if (isLoggedIn && nextUrl.pathname === "/login") {
                if (userRole === "ADMIN") {
                    return Response.redirect(new URL("/admin", nextUrl.origin));
                }
                return Response.redirect(new URL("/dashboard", nextUrl.origin));
            }

            return true;
        },

        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = user.role as "ADMIN" | "CLIENT";
                token.clientId = user.clientId ?? null;
            }
            return token;
        },

        async session({ session, token }) {
            if (token) {
                session.user.id = token.id as string;
                session.user.role = token.role as "ADMIN" | "CLIENT";
                session.user.clientId = token.clientId as string | null;
            }
            return session;
        },

        async redirect({ url, baseUrl }) {
            if (url.startsWith("/")) return `${baseUrl}${url}`;
            if (new URL(url).origin === baseUrl) return url;
            return baseUrl;
        },
    },

    events: {
        async signIn({ user }) {
            console.log(`User signed in: ${user.email}`);
        },
        async signOut() {
            console.log("User signed out");
        },
    },

    debug: process.env.NODE_ENV === "development",
};
