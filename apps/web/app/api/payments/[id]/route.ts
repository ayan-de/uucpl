import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@repo/database";
import type { UpdatePaymentInput, ApiResponse, N8nPaymentWebhookPayload } from "@repo/types";
import type { Payment } from "@repo/database";

interface RouteParams {
    params: Promise<{ id: string }>;
}

// GET /api/payments/[id] - Get a single payment
export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;

        const payment = await prisma.payment.findUnique({
            where: { id },
            include: {
                borrower: {
                    include: {
                        client: true,
                    },
                },
                notifications: {
                    orderBy: { createdAt: "desc" },
                    take: 10,
                },
            },
        });

        if (!payment) {
            return NextResponse.json(
                { success: false, error: "Payment not found" },
                { status: 404 }
            );
        }

        const response: ApiResponse<Payment> = {
            success: true,
            data: payment,
        };

        return NextResponse.json(response);
    } catch (error) {
        console.error("Error fetching payment:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch payment" },
            { status: 500 }
        );
    }
}

// PATCH /api/payments/[id] - Update a payment (including marking as paid)
export async function PATCH(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        const body: UpdatePaymentInput = await request.json();

        const existingPayment = await prisma.payment.findUnique({
            where: { id },
            include: {
                borrower: {
                    include: { client: true },
                },
            },
        });

        if (!existingPayment) {
            return NextResponse.json(
                { success: false, error: "Payment not found" },
                { status: 404 }
            );
        }

        // Build update data
        const updateData: Record<string, unknown> = {};

        if (body.amount !== undefined) updateData.amount = body.amount;
        if (body.dueDate) updateData.dueDate = new Date(body.dueDate);
        if (body.caseId !== undefined) updateData.caseId = body.caseId;
        if (body.notes !== undefined) updateData.notes = body.notes;
        if (body.status) updateData.status = body.status;

        // If marking as paid, set paidDate
        if (body.status === "PAID" && !existingPayment.paidDate) {
            updateData.paidDate = body.paidDate ? new Date(body.paidDate) : new Date();
        }

        const payment = await prisma.payment.update({
            where: { id },
            data: updateData,
            include: {
                borrower: {
                    include: {
                        client: true,
                    },
                },
            },
        });

        // If payment was marked as PAID, trigger n8n webhook
        if (body.status === "PAID" && existingPayment.status !== "PAID") {
            const webhookUrl = process.env.N8N_WEBHOOK_URL;
            if (webhookUrl) {
                const webhookPayload: N8nPaymentWebhookPayload = {
                    paymentId: payment.id,
                    action: "payment_received",
                    amount: Number(payment.amount),
                    borrowerName: payment.borrower.name,
                    borrowerEmail: payment.borrower.email,
                    borrowerPhone: payment.borrower.phone || undefined,
                    clientName: payment.borrower.client.name,
                    clientEmail: payment.borrower.client.email,
                    clientPhone: payment.borrower.client.phone || undefined,
                    dueDate: payment.dueDate.toISOString(),
                    paidDate: payment.paidDate?.toISOString(),
                };

                // Fire and forget - don't wait for webhook response
                fetch(`${webhookUrl}/payment-received`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(webhookPayload),
                }).catch((err) => console.error("Failed to trigger n8n webhook:", err));
            }
        }

        const response: ApiResponse<Payment> = {
            success: true,
            data: payment,
            message: body.status === "PAID" ? "Payment marked as paid" : "Payment updated successfully",
        };

        return NextResponse.json(response);
    } catch (error) {
        console.error("Error updating payment:", error);
        return NextResponse.json(
            { success: false, error: "Failed to update payment" },
            { status: 500 }
        );
    }
}

// DELETE /api/payments/[id] - Delete a payment
export async function DELETE(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;

        const existingPayment = await prisma.payment.findUnique({
            where: { id },
        });

        if (!existingPayment) {
            return NextResponse.json(
                { success: false, error: "Payment not found" },
                { status: 404 }
            );
        }

        await prisma.payment.delete({
            where: { id },
        });

        return NextResponse.json({
            success: true,
            message: "Payment deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting payment:", error);
        return NextResponse.json(
            { success: false, error: "Failed to delete payment" },
            { status: 500 }
        );
    }
}
