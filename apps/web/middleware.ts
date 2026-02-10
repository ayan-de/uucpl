import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

/**
 * Middleware using the lightweight auth config only.
 * This avoids bundling Prisma, bcrypt, and other heavy server-side
 * dependencies into the Edge Function, keeping it under the 1 MB limit.
 *
 * All route-protection logic is handled by the `authorized` callback
 * defined in auth.config.ts.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default NextAuth(authConfig).auth as any;

export const config = {
    // Match all routes except static files
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|public).*)",
    ],
};
