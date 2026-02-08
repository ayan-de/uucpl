// Shared TypeScript types for the Payment Reminder App
// These types are used across frontend and API

// ============================================
// API Response Types
// ============================================
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

// ============================================
// Request Types for API endpoints
// ============================================

// Client
export interface CreateClientInput {
    name: string;
    email: string;
    phone?: string;
    whatsapp?: string;
}

export interface UpdateClientInput {
    name?: string;
    email?: string;
    phone?: string;
    whatsapp?: string;
}

// Borrower
export interface CreateBorrowerInput {
    clientId: string;
    name: string;
    email: string;
    phone?: string;
    whatsapp?: string;
}

export interface UpdateBorrowerInput {
    name?: string;
    email?: string;
    phone?: string;
    whatsapp?: string;
}

// Payment
export interface CreatePaymentInput {
    borrowerId: string;
    amount: number;
    dueDate: string; // ISO date string
    caseId?: string;
    notes?: string;
}

export interface UpdatePaymentInput {
    amount?: number;
    dueDate?: string;
    paidDate?: string;
    status?: "PENDING" | "PAID" | "OVERDUE";
    caseId?: string;
    notes?: string;
}

// Template
export interface CreateTemplateInput {
    clientId?: string;
    type:
    | "REMINDER_7_DAY"
    | "REMINDER_3_DAY"
    | "REMINDER_1_DAY"
    | "OVERDUE"
    | "PAYMENT_RECEIVED";
    channel: "SMS" | "EMAIL" | "WHATSAPP";
    subject?: string;
    body: string;
}

export interface UpdateTemplateInput {
    subject?: string;
    body?: string;
    active?: boolean;
}

// ============================================
// n8n Webhook Payload Types
// ============================================
export interface N8nPaymentWebhookPayload {
    paymentId: string;
    action: "payment_received" | "payment_created" | "payment_updated";
    amount: number;
    borrowerName: string;
    borrowerEmail: string;
    borrowerPhone?: string;
    clientName: string;
    clientEmail: string;
    clientPhone?: string;
    dueDate: string;
    paidDate?: string;
}

export interface N8nDuePaymentsResponse {
    payments: Array<{
        id: string;
        amount: number;
        dueDate: string;
        daysUntilDue: number;
        borrower: {
            name: string;
            email: string;
            phone?: string;
            whatsapp?: string;
        };
        client: {
            name: string;
            email: string;
            phone?: string;
            whatsapp?: string;
        };
        template?: {
            subject?: string;
            body: string;
        };
    }>;
}

// ============================================
// Dashboard Stats Types
// ============================================
export interface DashboardStats {
    totalClients: number;
    totalBorrowers: number;
    totalPayments: number;
    pendingPayments: number;
    overduePayments: number;
    paidPayments: number;
    totalAmountDue: number;
    totalAmountPaid: number;
    notificationsSentToday: number;
    notificationsSentThisMonth: number;
}

// ============================================
// Filter/Query Types
// ============================================
export interface PaymentFilters {
    status?: "PENDING" | "PAID" | "OVERDUE";
    borrowerId?: string;
    clientId?: string;
    fromDate?: string;
    toDate?: string;
    dueSoon?: boolean; // Due within 7 days
}

export interface NotificationFilters {
    type?:
    | "REMINDER_7_DAY"
    | "REMINDER_3_DAY"
    | "REMINDER_1_DAY"
    | "OVERDUE"
    | "PAYMENT_RECEIVED";
    channel?: "SMS" | "EMAIL" | "WHATSAPP";
    sent?: boolean;
    fromDate?: string;
    toDate?: string;
}
