import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@repo/database";
import type { ApiResponse, PaginatedResponse, NotificationFilters } from "@repo/types";
import type { Notification } from "@repo/database";

// GET /api/notifications - List all notifications with pagination and filters
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get("page") || "1");
        const pageSize = parseInt(searchParams.get("pageSize") || "20");
        const type = searchParams.get("type") as NotificationFilters["type"];
        const channel = searchParams.get("channel") as NotificationFilters["channel"];
        const sent = searchParams.get("sent");
        const fromDate = searchParams.get("fromDate");
        const toDate = searchParams.get("toDate");
        const paymentId = searchParams.get("paymentId");

        const skip = (page - 1) * pageSize;

        const where: Record<string, unknown> = {};

        if (type) where.type = type;
        if (channel) where.channel = channel;
        if (sent !== null && sent !== undefined) where.sent = sent === "true";
        if (paymentId) where.paymentId = paymentId;

        if (fromDate || toDate) {
            where.createdAt = {};
            if (fromDate) {
                (where.createdAt as Record<string, Date>).gte = new Date(fromDate);
            }
            if (toDate) {
                (where.createdAt as Record<string, Date>).lte = new Date(toDate);
            }
        }

        const [notifications, total] = await Promise.all([
            prisma.notification.findMany({
                where,
                skip,
                take: pageSize,
                orderBy: { createdAt: "desc" },
                include: {
                    payment: {
                        include: {
                            borrower: {
                                include: {
                                    client: {
                                        select: { id: true, name: true },
                                    },
                                },
                            },
                        },
                    },
                },
            }),
            prisma.notification.count({ where }),
        ]);

        const response: ApiResponse<PaginatedResponse<Notification>> = {
            success: true,
            data: {
                items: notifications,
                total,
                page,
                pageSize,
                totalPages: Math.ceil(total / pageSize),
            },
        };

        return NextResponse.json(response);
    } catch (error) {
        console.error("Error fetching notifications:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch notifications" },
            { status: 500 }
        );
    }
}

// POST /api/notifications - Create a notification log manually
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        if (!body.paymentId || !body.type || !body.channel || !body.recipientType) {
            return NextResponse.json(
                { success: false, error: "Payment ID, type, channel, and recipient type are required" },
                { status: 400 }
            );
        }

        // Verify payment exists
        const payment = await prisma.payment.findUnique({
            where: { id: body.paymentId },
        });

        if (!payment) {
            return NextResponse.json(
                { success: false, error: "Payment not found" },
                { status: 404 }
            );
        }

        const notification = await prisma.notification.create({
            data: {
                paymentId: body.paymentId,
                type: body.type,
                channel: body.channel,
                recipientType: body.recipientType,
                recipientName: body.recipientName,
                recipientContact: body.recipientContact,
                message: body.message,
                sent: body.sent ?? false,
                sentAt: body.sent ? new Date() : null,
                error: body.error,
            },
        });

        const response: ApiResponse<Notification> = {
            success: true,
            data: notification,
            message: "Notification logged successfully",
        };

        return NextResponse.json(response, { status: 201 });
    } catch (error) {
        console.error("Error creating notification:", error);
        return NextResponse.json(
            { success: false, error: "Failed to create notification" },
            { status: 500 }
        );
    }
}
