import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@repo/database";
import type { CreateTemplateInput, ApiResponse } from "@repo/types";
import type { Template } from "@repo/database";

// GET /api/templates - List all templates
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const clientId = searchParams.get("clientId");
        const type = searchParams.get("type");
        const channel = searchParams.get("channel");
        const activeOnly = searchParams.get("activeOnly") === "true";

        const where: Record<string, unknown> = {};

        if (clientId) {
            // Include both client-specific and global templates
            where.OR = [{ clientId }, { clientId: null }];
        }
        if (type) where.type = type;
        if (channel) where.channel = channel;
        if (activeOnly) where.active = true;

        const templates = await prisma.template.findMany({
            where,
            orderBy: [{ clientId: "desc" }, { type: "asc" }, { channel: "asc" }],
            include: {
                client: {
                    select: { id: true, name: true },
                },
            },
        });

        const response: ApiResponse<Template[]> = {
            success: true,
            data: templates,
        };

        return NextResponse.json(response);
    } catch (error) {
        console.error("Error fetching templates:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch templates" },
            { status: 500 }
        );
    }
}

// POST /api/templates - Create a new template
export async function POST(request: NextRequest) {
    try {
        const body: CreateTemplateInput = await request.json();

        if (!body.type || !body.channel || !body.body) {
            return NextResponse.json(
                { success: false, error: "Type, channel, and body are required" },
                { status: 400 }
            );
        }

        // Check if client exists if clientId is provided
        if (body.clientId) {
            const client = await prisma.client.findUnique({
                where: { id: body.clientId },
            });

            if (!client) {
                return NextResponse.json(
                    { success: false, error: "Client not found" },
                    { status: 404 }
                );
            }
        }

        // Check for duplicate template (same client, type, channel)
        const existingTemplate = await prisma.template.findFirst({
            where: {
                clientId: body.clientId || null,
                type: body.type,
                channel: body.channel,
            },
        });

        if (existingTemplate) {
            return NextResponse.json(
                { success: false, error: "A template with this type and channel already exists for this client" },
                { status: 409 }
            );
        }

        const template = await prisma.template.create({
            data: {
                clientId: body.clientId || null,
                type: body.type,
                channel: body.channel,
                subject: body.subject,
                body: body.body,
                active: true,
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
            message: "Template created successfully",
        };

        return NextResponse.json(response, { status: 201 });
    } catch (error) {
        console.error("Error creating template:", error);
        return NextResponse.json(
            { success: false, error: "Failed to create template" },
            { status: 500 }
        );
    }
}
