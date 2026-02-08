import { NextResponse } from "next/server";
import { prisma } from "@repo/database";
import type { ApiResponse, DashboardStats } from "@repo/types";

// GET /api/dashboard - Get dashboard statistics
export async function GET() {
    try {
        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const [
            totalClients,
            totalBorrowers,
            totalPayments,
            pendingPayments,
            overduePayments,
            paidPayments,
            pendingAmount,
            paidAmount,
            notificationsToday,
            notificationsThisMonth,
        ] = await Promise.all([
            prisma.client.count(),
            prisma.borrower.count(),
            prisma.payment.count(),
            prisma.payment.count({ where: { status: "PENDING" } }),
            prisma.payment.count({ where: { status: "OVERDUE" } }),
            prisma.payment.count({ where: { status: "PAID" } }),
            prisma.payment.aggregate({
                where: { status: { in: ["PENDING", "OVERDUE"] } },
                _sum: { amount: true },
            }),
            prisma.payment.aggregate({
                where: { status: "PAID" },
                _sum: { amount: true },
            }),
            prisma.notification.count({
                where: {
                    sent: true,
                    sentAt: { gte: startOfToday },
                },
            }),
            prisma.notification.count({
                where: {
                    sent: true,
                    sentAt: { gte: startOfMonth },
                },
            }),
        ]);

        const stats: DashboardStats = {
            totalClients,
            totalBorrowers,
            totalPayments,
            pendingPayments,
            overduePayments,
            paidPayments,
            totalAmountDue: Number(pendingAmount._sum.amount || 0),
            totalAmountPaid: Number(paidAmount._sum.amount || 0),
            notificationsSentToday: notificationsToday,
            notificationsSentThisMonth: notificationsThisMonth,
        };

        const response: ApiResponse<DashboardStats> = {
            success: true,
            data: stats,
        };

        return NextResponse.json(response);
    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch dashboard stats" },
            { status: 500 }
        );
    }
}
