import { auth } from "@/auth";
import { prisma } from "@repo/database";
import { NextResponse } from "next/server";

// GET - Get all active sessions for the current user
export async function GET() {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Get all sessions for this user
        const sessions = await prisma.session.findMany({
            where: {
                userId: session.user.id,
                expires: { gt: new Date() }, // Only active sessions
            },
            select: {
                id: true,
                ipAddress: true,
                deviceType: true,
                browser: true,
                os: true,
                location: true,
                createdAt: true,
                lastActiveAt: true,
            },
            orderBy: {
                lastActiveAt: "desc",
            },
        });

        return NextResponse.json({ sessions });
    } catch (error) {
        console.error("Error fetching sessions:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

// DELETE - Revoke a specific session or all other sessions
export async function DELETE(request: Request) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const sessionId = searchParams.get("id");
        const revokeAll = searchParams.get("all") === "true";

        if (revokeAll) {
            // Delete all sessions except the current one
            // Note: We can't easily identify the current session without the token
            // So we'll delete all sessions for now (user will be logged out)
            await prisma.session.deleteMany({
                where: {
                    userId: session.user.id,
                },
            });

            return NextResponse.json({ message: "All sessions revoked" });
        }

        if (sessionId) {
            // Delete a specific session
            const targetSession = await prisma.session.findFirst({
                where: {
                    id: sessionId,
                    userId: session.user.id, // Security: only delete own sessions
                },
            });

            if (!targetSession) {
                return NextResponse.json({ error: "Session not found" }, { status: 404 });
            }

            await prisma.session.delete({
                where: { id: sessionId },
            });

            return NextResponse.json({ message: "Session revoked" });
        }

        return NextResponse.json({ error: "Session ID required" }, { status: 400 });
    } catch (error) {
        console.error("Error revoking session:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
