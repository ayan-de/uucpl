import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@repo/database";
import type { CreatePaymentInput, ApiResponse, PaginatedResponse, PaymentFilters } from "@repo/types";
import type { Payment } from "@repo/database";

// GET /api/payments - List all payments with pagination and filters
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get("page") || "1");
        const pageSize = parseInt(searchParams.get("pageSize") || "10");
        const status = searchParams.get("status") as PaymentFilters["status"];
        const borrowerId = searchParams.get("borrowerId");
        const clientId = searchParams.get("clientId");
        const fromDate = searchParams.get("fromDate");
        const toDate = searchParams.get("toDate");

        const skip = (page - 1) * pageSize;

        const where: Record<string, unknown> = {};

        if (status) {
            where.status = status;
        }

        if (borrowerId) {
            where.borrowerId = borrowerId;
        }

        if (clientId) {
            where.borrower = { clientId };
        }

        if (fromDate || toDate) {
            where.dueDate = {};
            if (fromDate) {
                (where.dueDate as Record<string, Date>).gte = new Date(fromDate);
            }
            if (toDate) {
                (where.dueDate as Record<string, Date>).lte = new Date(toDate);
            }
        }

        const [payments, total] = await Promise.all([
            prisma.payment.findMany({
                where,
                skip,
                take: pageSize,
                orderBy: { dueDate: "asc" },
                include: {
                    borrower: {
                        include: {
                            client: {
                                select: { id: true, name: true, email: true },
                            },
                        },
                    },
                },
            }),
            prisma.payment.count({ where }),
        ]);

        const response: ApiResponse<PaginatedResponse<Payment>> = {
            success: true,
            data: {
                items: payments,
                total,
                page,
                pageSize,
                totalPages: Math.ceil(total / pageSize),
            },
        };

        return NextResponse.json(response);
    } catch (error) {
        console.error("Error fetching payments:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch payments" },
            { status: 500 }
        );
    }
}

// POST /api/payments - Create a new payment
export async function POST(request: NextRequest) {
    try {
        const body: CreatePaymentInput = await request.json();

        // Validate required fields
        if (!body.borrowerId || !body.amount || !body.dueDate) {
            return NextResponse.json(
                { success: false, error: "Borrower ID, amount, and due date are required" },
                { status: 400 }
            );
        }

        // Check if borrower exists
        const borrower = await prisma.borrower.findUnique({
            where: { id: body.borrowerId },
            include: { client: true },
        });

        if (!borrower) {
            return NextResponse.json(
                { success: false, error: "Borrower not found" },
                { status: 404 }
            );
        }

        const payment = await prisma.payment.create({
            data: {
                borrowerId: body.borrowerId,
                amount: body.amount,
                dueDate: new Date(body.dueDate),
                caseId: body.caseId,
                notes: body.notes,
                status: "PENDING",
            },
            include: {
                borrower: {
                    include: {
                        client: {
                            select: { id: true, name: true },
                        },
                    },
                },
            },
        });

        const response: ApiResponse<Payment> = {
            success: true,
            data: payment,
            message: "Payment created successfully",
        };

        return NextResponse.json(response, { status: 201 });
    } catch (error) {
        console.error("Error creating payment:", error);
        return NextResponse.json(
            { success: false, error: "Failed to create payment" },
            { status: 500 }
        );
    }
}
