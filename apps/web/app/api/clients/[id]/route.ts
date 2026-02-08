import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@repo/database";
import type { UpdateClientInput, ApiResponse } from "@repo/types";
import type { Client } from "@repo/database";

interface RouteParams {
    params: Promise<{ id: string }>;
}

// GET /api/clients/[id] - Get a single client
export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;

        const client = await prisma.client.findUnique({
            where: { id },
            include: {
                borrowers: {
                    include: {
                        _count: {
                            select: { payments: true },
                        },
                    },
                },
                templates: true,
                _count: {
                    select: { borrowers: true },
                },
            },
        });

        if (!client) {
            return NextResponse.json(
                { success: false, error: "Client not found" },
                { status: 404 }
            );
        }

        const response: ApiResponse<Client> = {
            success: true,
            data: client,
        };

        return NextResponse.json(response);
    } catch (error) {
        console.error("Error fetching client:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch client" },
            { status: 500 }
        );
    }
}

// PATCH /api/clients/[id] - Update a client
export async function PATCH(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        const body: UpdateClientInput = await request.json();

        // Check if client exists
        const existingClient = await prisma.client.findUnique({
            where: { id },
        });

        if (!existingClient) {
            return NextResponse.json(
                { success: false, error: "Client not found" },
                { status: 404 }
            );
        }

        // If email is being updated, check for duplicates
        if (body.email && body.email !== existingClient.email) {
            const emailExists = await prisma.client.findUnique({
                where: { email: body.email },
            });

            if (emailExists) {
                return NextResponse.json(
                    { success: false, error: "A client with this email already exists" },
                    { status: 409 }
                );
            }
        }

        const client = await prisma.client.update({
            where: { id },
            data: {
                ...(body.name && { name: body.name }),
                ...(body.email && { email: body.email }),
                ...(body.phone !== undefined && { phone: body.phone }),
                ...(body.whatsapp !== undefined && { whatsapp: body.whatsapp }),
            },
        });

        const response: ApiResponse<Client> = {
            success: true,
            data: client,
            message: "Client updated successfully",
        };

        return NextResponse.json(response);
    } catch (error) {
        console.error("Error updating client:", error);
        return NextResponse.json(
            { success: false, error: "Failed to update client" },
            { status: 500 }
        );
    }
}

// DELETE /api/clients/[id] - Delete a client
export async function DELETE(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;

        // Check if client exists
        const existingClient = await prisma.client.findUnique({
            where: { id },
        });

        if (!existingClient) {
            return NextResponse.json(
                { success: false, error: "Client not found" },
                { status: 404 }
            );
        }

        await prisma.client.delete({
            where: { id },
        });

        return NextResponse.json({
            success: true,
            message: "Client deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting client:", error);
        return NextResponse.json(
            { success: false, error: "Failed to delete client" },
            { status: 500 }
        );
    }
}
