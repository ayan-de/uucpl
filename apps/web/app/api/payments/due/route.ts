import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@repo/database";
import type { ApiResponse, N8nDuePaymentsResponse } from "@repo/types";

// GET /api/payments/due - Get payments due within specified days (for n8n)
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const days = parseInt(searchParams.get("days") || "7");

        const now = new Date();
        const futureDate = new Date();
        futureDate.setDate(now.getDate() + days);

        // Get all pending payments due within the specified days
        const payments = await prisma.payment.findMany({
            where: {
                status: "PENDING",
                dueDate: {
                    gte: now,
                    lte: futureDate,
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

        // Format response for n8n
        const formattedPayments: N8nDuePaymentsResponse["payments"] = await Promise.all(
            payments.map(async (payment) => {
                const daysUntilDue = Math.ceil(
                    (payment.dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
                );

                // Determine template type based on days until due
                let templateType: "REMINDER_7_DAY" | "REMINDER_3_DAY" | "REMINDER_1_DAY";
                if (daysUntilDue <= 1) {
                    templateType = "REMINDER_1_DAY";
                } else if (daysUntilDue <= 3) {
                    templateType = "REMINDER_3_DAY";
                } else {
                    templateType = "REMINDER_7_DAY";
                }

                // Try to find client-specific template, fall back to global
                const template = await prisma.template.findFirst({
                    where: {
                        type: templateType,
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
                    daysUntilDue,
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
        console.error("Error fetching due payments:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch due payments" },
            { status: 500 }
        );
    }
}
