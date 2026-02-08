import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@repo/database";
import type { UpdateBorrowerInput, ApiResponse } from "@repo/types";
import type { Borrower } from "@repo/database";

interface RouteParams {
    params: Promise<{ id: string }>;
}

// GET /api/borrowers/[id] - Get a single borrower
export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;

        const borrower = await prisma.borrower.findUnique({
            where: { id },
            include: {
                client: {
                    select: { id: true, name: true, email: true, phone: true },
                },
                payments: {
                    orderBy: { dueDate: "desc" },
                    take: 10,
                },
                _count: {
                    select: { payments: true },
                },
            },
        });

        if (!borrower) {
            return NextResponse.json(
                { success: false, error: "Borrower not found" },
                { status: 404 }
            );
        }

        const response: ApiResponse<Borrower> = {
            success: true,
            data: borrower,
        };

        return NextResponse.json(response);
    } catch (error) {
        console.error("Error fetching borrower:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch borrower" },
            { status: 500 }
        );
    }
}

// PATCH /api/borrowers/[id] - Update a borrower
export async function PATCH(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        const body: UpdateBorrowerInput = await request.json();

        const existingBorrower = await prisma.borrower.findUnique({
            where: { id },
        });

        if (!existingBorrower) {
            return NextResponse.json(
                { success: false, error: "Borrower not found" },
                { status: 404 }
            );
        }

        const borrower = await prisma.borrower.update({
            where: { id },
            data: {
                ...(body.name && { name: body.name }),
                ...(body.email && { email: body.email }),
                ...(body.phone !== undefined && { phone: body.phone }),
                ...(body.whatsapp !== undefined && { whatsapp: body.whatsapp }),
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
            message: "Borrower updated successfully",
        };

        return NextResponse.json(response);
    } catch (error) {
        console.error("Error updating borrower:", error);
        return NextResponse.json(
            { success: false, error: "Failed to update borrower" },
            { status: 500 }
        );
    }
}

// DELETE /api/borrowers/[id] - Delete a borrower
export async function DELETE(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;

        const existingBorrower = await prisma.borrower.findUnique({
            where: { id },
        });

        if (!existingBorrower) {
            return NextResponse.json(
                { success: false, error: "Borrower not found" },
                { status: 404 }
            );
        }

        await prisma.borrower.delete({
            where: { id },
        });

        return NextResponse.json({
            success: true,
            message: "Borrower deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting borrower:", error);
        return NextResponse.json(
            { success: false, error: "Failed to delete borrower" },
            { status: 500 }
        );
    }
}
