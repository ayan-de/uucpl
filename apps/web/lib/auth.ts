import { auth } from "@/auth";
import { redirect } from "next/navigation";

/**
 * Get the current session (server-side)
 * Returns null if not authenticated
 */
export async function getSession() {
    return await auth();
}

/**
 * Require authentication (server-side)
 * Redirects to login if not authenticated
 */
export async function requireAuth() {
    const session = await auth();

    if (!session) {
        redirect("/login");
    }

    return session;
}

/**
 * Require admin role (server-side)
 * Redirects to login if not authenticated
 * Redirects to dashboard if not admin
 */
export async function requireAdmin() {
    const session = await auth();

    if (!session) {
        redirect("/login");
    }

    if (session.user.role !== "ADMIN") {
        redirect("/dashboard?error=unauthorized");
    }

    return session;
}

/**
 * Require client role (server-side)
 * Redirects to login if not authenticated
 */
export async function requireClient() {
    const session = await auth();

    if (!session) {
        redirect("/login");
    }

    if (session.user.role !== "CLIENT") {
        redirect("/admin");
    }

    return session;
}

/**
 * Check if user is authenticated (server-side)
 * Does not redirect
 */
export async function isAuthenticated(): Promise<boolean> {
    const session = await auth();
    return !!session;
}

/**
 * Check if user is admin (server-side)
 * Does not redirect
 */
export async function isAdmin(): Promise<boolean> {
    const session = await auth();
    return session?.user?.role === "ADMIN";
}
