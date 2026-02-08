import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@repo/database";
import type { CreateClientInput, UpdateClientInput, ApiResponse, PaginatedResponse } from "@repo/types";
import type { Client } from "@repo/database";

// GET /api/clients - List all clients with pagination
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get("page") || "1");
        const pageSize = parseInt(searchParams.get("pageSize") || "10");
        const search = searchParams.get("search") || "";

        const skip = (page - 1) * pageSize;

        const where = search
            ? {
                OR: [
                    { name: { contains: search, mode: "insensitive" as const } },
                    { email: { contains: search, mode: "insensitive" as const } },
                ],
            }
            : {};

        const [clients, total] = await Promise.all([
            prisma.client.findMany({
                where,
                skip,
                take: pageSize,
                orderBy: { createdAt: "desc" },
                include: {
                    _count: {
                        select: { borrowers: true },
                    },
                },
            }),
            prisma.client.count({ where }),
        ]);

        const response: ApiResponse<PaginatedResponse<Client>> = {
            success: true,
            data: {
                items: clients,
                total,
                page,
                pageSize,
                totalPages: Math.ceil(total / pageSize),
            },
        };

        return NextResponse.json(response);
    } catch (error) {
        console.error("Error fetching clients:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch clients" },
            { status: 500 }
        );
    }
}

// POST /api/clients - Create a new client
export async function POST(request: NextRequest) {
    try {
        const body: CreateClientInput = await request.json();

        // Validate required fields
        if (!body.name || !body.email) {
            return NextResponse.json(
                { success: false, error: "Name and email are required" },
                { status: 400 }
            );
        }

        // Check if email already exists
        const existingClient = await prisma.client.findUnique({
            where: { email: body.email },
        });

        if (existingClient) {
            return NextResponse.json(
                { success: false, error: "A client with this email already exists" },
                { status: 409 }
            );
        }

        const client = await prisma.client.create({
            data: {
                name: body.name,
                email: body.email,
                phone: body.phone,
                whatsapp: body.whatsapp,
            },
        });

        const response: ApiResponse<Client> = {
            success: true,
            data: client,
            message: "Client created successfully",
        };

        return NextResponse.json(response, { status: 201 });
    } catch (error) {
        console.error("Error creating client:", error);
        return NextResponse.json(
            { success: false, error: "Failed to create client" },
            { status: 500 }
        );
    }
}
