import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@repo/database";

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

// Helper to parse user agent
function parseUserAgent(userAgent: string | null): {
    deviceType: string;
    browser: string;
    os: string;
} {
    if (!userAgent) return { deviceType: "unknown", browser: "unknown", os: "unknown" };

    // Simple browser detection
    let browser = "unknown";
    if (userAgent.includes("Chrome")) browser = "Chrome";
    else if (userAgent.includes("Firefox")) browser = "Firefox";
    else if (userAgent.includes("Safari")) browser = "Safari";
    else if (userAgent.includes("Edge")) browser = "Edge";
    else if (userAgent.includes("Opera")) browser = "Opera";

    // Simple OS detection
    let os = "unknown";
    if (userAgent.includes("Windows")) os = "Windows";
    else if (userAgent.includes("Mac")) os = "macOS";
    else if (userAgent.includes("Linux")) os = "Linux";
    else if (userAgent.includes("Android")) os = "Android";
    else if (userAgent.includes("iPhone") || userAgent.includes("iPad")) os = "iOS";

    // Device type
    let deviceType = "desktop";
    if (userAgent.includes("Mobile") || userAgent.includes("Android")) deviceType = "mobile";
    else if (userAgent.includes("Tablet") || userAgent.includes("iPad")) deviceType = "tablet";

    return { deviceType, browser, os };
}

const authConfig: NextAuthConfig = {
    // Use Prisma adapter for OAuth providers (optional)
    // Note: Credentials provider uses JWT, not database sessions
    adapter: PrismaAdapter(prisma) as any,

    session: {
        // IMPORTANT: Credentials provider REQUIRES JWT strategy
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },

    pages: {
        signIn: "/login",
        error: "/login",
    },

    providers: [
        Credentials({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials, request) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Missing credentials");
                }

                const email = credentials.email as string;
                const password = credentials.password as string;

                // Find user by email
                const user = await prisma.user.findUnique({
                    where: { email },
                });

                if (!user) {
                    throw new Error("Invalid credentials");
                }

                // Check if user is active
                if (!user.isActive) {
                    throw new Error("Account is disabled");
                }

                // Verify password
                const isPasswordValid = await bcrypt.compare(password, user.password);

                if (!isPasswordValid) {
                    throw new Error("Invalid credentials");
                }

                // Get IP address from request headers
                const forwarded = request.headers.get("x-forwarded-for");
                const ip = forwarded ? forwarded.split(",")[0] : request.headers.get("x-real-ip") || "unknown";
                const userAgent = request.headers.get("user-agent");
                const deviceInfo = parseUserAgent(userAgent);

                // Update last login info
                await prisma.user.update({
                    where: { id: user.id },
                    data: {
                        lastLoginAt: new Date(),
                        lastLoginIp: ip || undefined,
                    },
                });

                // Store session info in database for "active sessions" tracking
                // This is separate from NextAuth session management
                try {
                    await prisma.session.create({
                        data: {
                            sessionToken: `credentials-${user.id}-${Date.now()}`,
                            userId: user.id,
                            expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
                            ipAddress: ip || undefined,
                            userAgent: userAgent || undefined,
                            deviceType: deviceInfo.deviceType,
                            browser: deviceInfo.browser,
                            os: deviceInfo.os,
                        },
                    });
                } catch (e) {
                    // Session tracking is optional, don't fail auth
                    console.warn("Failed to create session tracking record:", e);
                }

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    image: user.image,
                    role: user.role,
                    clientId: user.clientId,
                    isActive: user.isActive,
                };
            },
        }),
    ],

    callbacks: {
        async signIn({ user }) {
            // User must be active
            if ("isActive" in user && !user.isActive) {
                return false;
            }
            return true;
        },

        async jwt({ token, user }) {
            // First time jwt callback is called, user object is available
            if (user) {
                token.id = user.id;
                token.role = user.role as "ADMIN" | "CLIENT";
                token.clientId = user.clientId ?? null;
            }
            return token;
        },

        async session({ session, token }) {
            // Add custom fields to session from JWT token
            if (token) {
                session.user.id = token.id as string;
                session.user.role = token.role as "ADMIN" | "CLIENT";
                session.user.clientId = token.clientId as string | null;
            }
            return session;
        },

        async redirect({ url, baseUrl }) {
            // Handle role-based redirects
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

const nextAuth = NextAuth(authConfig);

export const handlers: typeof nextAuth.handlers = nextAuth.handlers;
export const signIn: typeof nextAuth.signIn = nextAuth.signIn;
export const signOut: typeof nextAuth.signOut = nextAuth.signOut;
export const auth: typeof nextAuth.auth = nextAuth.auth;
