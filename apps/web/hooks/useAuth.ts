"use client";

import { useSession, signOut as nextAuthSignOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export function useAuth() {
    const { data: session, status } = useSession();
    const router = useRouter();

    const isLoading = status === "loading";
    const isAuthenticated = status === "authenticated";
    const isAdmin = session?.user?.role === "ADMIN";
    const isClient = session?.user?.role === "CLIENT";

    const signOut = async () => {
        await nextAuthSignOut({ redirect: false });
        router.push("/login");
    };

    const requireAuth = () => {
        if (!isLoading && !isAuthenticated) {
            router.push("/login");
        }
    };

    const requireAdmin = () => {
        if (!isLoading && !isAuthenticated) {
            router.push("/login");
        } else if (!isLoading && !isAdmin) {
            router.push("/dashboard?error=unauthorized");
        }
    };

    return {
        session,
        user: session?.user ?? null,
        status,
        isLoading,
        isAuthenticated,
        isAdmin,
        isClient,
        signOut,
        requireAuth,
        requireAdmin,
    };
}
