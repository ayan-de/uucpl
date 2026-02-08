import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@repo/database";
import type { ApiResponse } from "@repo/types";

// POST /api/webhooks/n8n - Receive callbacks from n8n after sending notifications
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate webhook payload
        if (!body.paymentId || !body.type || !body.channel || !body.recipientType) {
            return NextResponse.json(
                { success: false, error: "Invalid webhook payload" },
                { status: 400 }
            );
        }

        // Log the notification
        const notification = await prisma.notification.create({
            data: {
                paymentId: body.paymentId,
                type: body.type,
                channel: body.channel,
                recipientType: body.recipientType,
                recipientName: body.recipientName || "Unknown",
                recipientContact: body.recipientContact || "",
                message: body.message || "",
                sent: body.sent ?? true,
                sentAt: body.sent ? new Date() : null,
                error: body.error || null,
            },
        });

        const response: ApiResponse<{ notificationId: string }> = {
            success: true,
            data: { notificationId: notification.id },
            message: "Notification logged successfully",
        };

        return NextResponse.json(response, { status: 201 });
    } catch (error) {
        console.error("Error processing n8n webhook:", error);
        return NextResponse.json(
            { success: false, error: "Failed to process webhook" },
            { status: 500 }
        );
    }
}

// GET /api/webhooks/n8n - Health check for n8n
export async function GET() {
    return NextResponse.json({
        success: true,
        message: "n8n webhook endpoint is active",
        timestamp: new Date().toISOString(),
    });
}
