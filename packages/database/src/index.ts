// Re-export Prisma client instance
export { prisma } from "./client";

// Re-export all Prisma types for convenience
export type {
    // Auth models
    User,
    Account,
    Session,
    VerificationToken,
    UserRole,
    // Business models
    Client,
    Borrower,
    Payment,
    Notification,
    Template,
    // Enums
    PaymentStatus,
    NotificationType,
    NotificationChannel,
    RecipientType,
    TemplateType,
} from "@prisma/client";

// Re-export Prisma namespace for advanced usage
export { Prisma } from "@prisma/client";
