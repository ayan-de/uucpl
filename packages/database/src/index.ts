// Re-export Prisma client instance
export { prisma } from "./client";

// Re-export all Prisma types for convenience
export type {
    Client,
    Borrower,
    Payment,
    Notification,
    Template,
    PaymentStatus,
    NotificationType,
    NotificationChannel,
    RecipientType,
    TemplateType,
} from "@prisma/client";

// Re-export Prisma namespace for advanced usage
export { Prisma } from "@prisma/client";
