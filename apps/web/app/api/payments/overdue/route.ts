import { NextResponse } from "next/server";
import { prisma } from "@repo/database";
import type { ApiResponse, N8nDuePaymentsResponse } from "@repo/types";

// GET /api/payments/overdue - Get all overdue payments (for n8n)
export async function GET() {
    try {
        const now = new Date();

        // Get all pending payments with due date in the past
        const payments = await prisma.payment.findMany({
            where: {
                status: "PENDING",
                dueDate: {
                    lt: now,
                },
            },
            include: {
                borrower: {
                    include: {
                        client: true,
                    },
                },
            },
            orderBy: { dueDate: "asc" },
        });

        // Update status to OVERDUE for these payments
        await prisma.payment.updateMany({
            where: {
                id: { in: payments.map((p) => p.id) },
                status: "PENDING",
            },
            data: {
                status: "OVERDUE",
            },
        });

        // Format response for n8n
        const formattedPayments: N8nDuePaymentsResponse["payments"] = await Promise.all(
            payments.map(async (payment) => {
                const daysOverdue = Math.ceil(
                    (now.getTime() - payment.dueDate.getTime()) / (1000 * 60 * 60 * 24)
                );

                // Try to find client-specific overdue template, fall back to global
                const template = await prisma.template.findFirst({
                    where: {
                        type: "OVERDUE",
                        active: true,
                        OR: [
                            { clientId: payment.borrower.clientId },
                            { clientId: null },
                        ],
                    },
                    orderBy: { clientId: "desc" }, // Prefer client-specific
                });

                return {
                    id: payment.id,
                    amount: Number(payment.amount),
                    dueDate: payment.dueDate.toISOString(),
                    daysUntilDue: -daysOverdue, // Negative to indicate overdue
                    borrower: {
                        name: payment.borrower.name,
                        email: payment.borrower.email,
                        phone: payment.borrower.phone || undefined,
                        whatsapp: payment.borrower.whatsapp || undefined,
                    },
                    client: {
                        name: payment.borrower.client.name,
                        email: payment.borrower.client.email,
                        phone: payment.borrower.client.phone || undefined,
                        whatsapp: payment.borrower.client.whatsapp || undefined,
                    },
                    template: template
                        ? {
                            subject: template.subject || undefined,
                            body: template.body,
                        }
                        : undefined,
                };
            })
        );

        const response: ApiResponse<N8nDuePaymentsResponse> = {
            success: true,
            data: {
                payments: formattedPayments,
            },
        };

        return NextResponse.json(response);
    } catch (error) {
        console.error("Error fetching overdue payments:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch overdue payments" },
            { status: 500 }
        );
    }
}
