import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@repo/database";
import type { CreateBorrowerInput, ApiResponse, PaginatedResponse } from "@repo/types";
import type { Borrower } from "@repo/database";

// GET /api/borrowers - List all borrowers with pagination
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get("page") || "1");
        const pageSize = parseInt(searchParams.get("pageSize") || "10");
        const search = searchParams.get("search") || "";
        const clientId = searchParams.get("clientId");

        const skip = (page - 1) * pageSize;

        const where: Record<string, unknown> = {};

        if (search) {
            where.OR = [
                { name: { contains: search, mode: "insensitive" } },
                { email: { contains: search, mode: "insensitive" } },
            ];
        }

        if (clientId) {
            where.clientId = clientId;
        }

        const [borrowers, total] = await Promise.all([
            prisma.borrower.findMany({
                where,
                skip,
                take: pageSize,
                orderBy: { createdAt: "desc" },
                include: {
                    client: {
                        select: { id: true, name: true, email: true },
                    },
                    _count: {
                        select: { payments: true },
                    },
                },
            }),
            prisma.borrower.count({ where }),
        ]);

        const response: ApiResponse<PaginatedResponse<Borrower>> = {
            success: true,
            data: {
                items: borrowers,
                total,
                page,
                pageSize,
                totalPages: Math.ceil(total / pageSize),
            },
        };

        return NextResponse.json(response);
    } catch (error) {
        console.error("Error fetching borrowers:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch borrowers" },
            { status: 500 }
        );
    }
}

// POST /api/borrowers - Create a new borrower
export async function POST(request: NextRequest) {
    try {
        const body: CreateBorrowerInput = await request.json();

        // Validate required fields
        if (!body.clientId || !body.name || !body.email) {
            return NextResponse.json(
                { success: false, error: "Client ID, name, and email are required" },
                { status: 400 }
            );
        }

        // Check if client exists
        const client = await prisma.client.findUnique({
            where: { id: body.clientId },
        });

        if (!client) {
            return NextResponse.json(
                { success: false, error: "Client not found" },
                { status: 404 }
            );
        }

        const borrower = await prisma.borrower.create({
            data: {
                clientId: body.clientId,
                name: body.name,
                email: body.email,
                phone: body.phone,
                whatsapp: body.whatsapp,
            },
            include: {
                client: {
                    select: { id: true, name: true },
                },
            },
        });

        const response: ApiResponse<Borrower> = {
            success: true,
            data: borrower,
            message: "Borrower created successfully",
        };

        return NextResponse.json(response, { status: 201 });
    } catch (error) {
        console.error("Error creating borrower:", error);
        return NextResponse.json(
            { success: false, error: "Failed to create borrower" },
            { status: 500 }
        );
    }
}
