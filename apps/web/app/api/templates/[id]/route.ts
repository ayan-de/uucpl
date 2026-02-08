import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@repo/database";
import type { UpdateTemplateInput, ApiResponse } from "@repo/types";
import type { Template } from "@repo/database";

interface RouteParams {
    params: Promise<{ id: string }>;
}

// GET /api/templates/[id] - Get a single template
export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;

        const template = await prisma.template.findUnique({
            where: { id },
            include: {
                client: {
                    select: { id: true, name: true },
                },
            },
        });

        if (!template) {
            return NextResponse.json(
                { success: false, error: "Template not found" },
                { status: 404 }
            );
        }

        const response: ApiResponse<Template> = {
            success: true,
            data: template,
        };

        return NextResponse.json(response);
    } catch (error) {
        console.error("Error fetching template:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch template" },
            { status: 500 }
        );
    }
}

// PATCH /api/templates/[id] - Update a template
export async function PATCH(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        const body: UpdateTemplateInput = await request.json();

        const existingTemplate = await prisma.template.findUnique({
            where: { id },
        });

        if (!existingTemplate) {
            return NextResponse.json(
                { success: false, error: "Template not found" },
                { status: 404 }
            );
        }

        const template = await prisma.template.update({
            where: { id },
            data: {
                ...(body.subject !== undefined && { subject: body.subject }),
                ...(body.body !== undefined && { body: body.body }),
                ...(body.active !== undefined && { active: body.active }),
            },
            include: {
                client: {
                    select: { id: true, name: true },
                },
            },
        });

        const response: ApiResponse<Template> = {
            success: true,
            data: template,
            message: "Template updated successfully",
        };

        return NextResponse.json(response);
    } catch (error) {
        console.error("Error updating template:", error);
        return NextResponse.json(
            { success: false, error: "Failed to update template" },
            { status: 500 }
        );
    }
}

// DELETE /api/templates/[id] - Delete a template
export async function DELETE(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;

        const existingTemplate = await prisma.template.findUnique({
            where: { id },
        });

        if (!existingTemplate) {
            return NextResponse.json(
                { success: false, error: "Template not found" },
                { status: 404 }
            );
        }

        await prisma.template.delete({
            where: { id },
        });

        return NextResponse.json({
            success: true,
            message: "Template deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting template:", error);
        return NextResponse.json(
            { success: false, error: "Failed to delete template" },
            { status: 500 }
        );
    }
}
