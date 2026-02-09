import { PrismaClient, UserRole, PaymentStatus, NotificationType, NotificationChannel, TemplateType } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Starting database seeding...");

    // Clear existing data (in reverse order of dependencies)
    console.log("🧹 Clearing existing data...");
    await prisma.notification.deleteMany();
    await prisma.payment.deleteMany();
    await prisma.template.deleteMany();
    await prisma.borrower.deleteMany();
    await prisma.session.deleteMany();
    await prisma.account.deleteMany();
    await prisma.user.deleteMany();
    await prisma.client.deleteMany();

    // ============================================
    // CREATE ADMIN USER
    // ============================================
    console.log("👤 Creating admin user...");
    const adminPassword = await bcrypt.hash("admin123", 12);

    const adminUser = await prisma.user.create({
        data: {
            name: "Admin User",
            email: "admin@uucpl.com",
            password: adminPassword,
            role: UserRole.ADMIN,
            isActive: true,
            emailVerified: new Date(),
        },
    });
    console.log(`✅ Admin created: ${adminUser.email}`);

    // ============================================
    // CREATE CLIENTS WITH LINKED USERS
    // ============================================
    console.log("🏢 Creating clients and their user accounts...");

    // Client 1: ABC Law Associates
    const client1 = await prisma.client.create({
        data: {
            name: "ABC Law Associates",
            email: "contact@abclaw.com",
            phone: "+91-9876543210",
            whatsapp: "+91-9876543210",
        },
    });

    const client1Password = await bcrypt.hash("client123", 12);
    const client1User = await prisma.user.create({
        data: {
            name: "ABC Law Associates",
            email: "client1@uucpl.com",
            password: client1Password,
            role: UserRole.CLIENT,
            isActive: true,
            emailVerified: new Date(),
            clientId: client1.id,
        },
    });
    console.log(`✅ Client 1 created: ${client1.name} (User: ${client1User.email})`);

    // Client 2: XYZ Legal Partners
    const client2 = await prisma.client.create({
        data: {
            name: "XYZ Legal Partners",
            email: "info@xyzlegal.com",
            phone: "+91-8765432109",
            whatsapp: "+91-8765432109",
        },
    });

    const client2Password = await bcrypt.hash("client123", 12);
    const client2User = await prisma.user.create({
        data: {
            name: "XYZ Legal Partners",
            email: "client2@uucpl.com",
            password: client2Password,
            role: UserRole.CLIENT,
            isActive: true,
            emailVerified: new Date(),
            clientId: client2.id,
        },
    });
    console.log(`✅ Client 2 created: ${client2.name} (User: ${client2User.email})`);

    // Client 3: Global Finance Services
    const client3 = await prisma.client.create({
        data: {
            name: "Global Finance Services",
            email: "support@globalfinance.com",
            phone: "+91-7654321098",
            whatsapp: "+91-7654321098",
        },
    });

    const client3Password = await bcrypt.hash("client123", 12);
    const client3User = await prisma.user.create({
        data: {
            name: "Global Finance Services",
            email: "client3@uucpl.com",
            password: client3Password,
            role: UserRole.CLIENT,
            isActive: true,
            emailVerified: new Date(),
            clientId: client3.id,
        },
    });
    console.log(`✅ Client 3 created: ${client3.name} (User: ${client3User.email})`);

    // ============================================
    // CREATE BORROWERS FOR EACH CLIENT
    // ============================================
    console.log("👥 Creating borrowers...");

    // Borrowers for Client 1
    const borrower1_1 = await prisma.borrower.create({
        data: {
            clientId: client1.id,
            name: "Rahul Sharma",
            email: "rahul.sharma@example.com",
            phone: "+91-9123456780",
            whatsapp: "+91-9123456780",
        },
    });

    const borrower1_2 = await prisma.borrower.create({
        data: {
            clientId: client1.id,
            name: "Priya Patel",
            email: "priya.patel@example.com",
            phone: "+91-9123456781",
            whatsapp: "+91-9123456781",
        },
    });

    // Borrowers for Client 2
    const borrower2_1 = await prisma.borrower.create({
        data: {
            clientId: client2.id,
            name: "Amit Kumar",
            email: "amit.kumar@example.com",
            phone: "+91-9234567890",
            whatsapp: "+91-9234567890",
        },
    });

    const borrower2_2 = await prisma.borrower.create({
        data: {
            clientId: client2.id,
            name: "Sneha Gupta",
            email: "sneha.gupta@example.com",
            phone: "+91-9234567891",
            whatsapp: "+91-9234567891",
        },
    });

    // Borrowers for Client 3
    const borrower3_1 = await prisma.borrower.create({
        data: {
            clientId: client3.id,
            name: "Vikram Singh",
            email: "vikram.singh@example.com",
            phone: "+91-9345678901",
            whatsapp: "+91-9345678901",
        },
    });

    console.log("✅ Borrowers created");

    // ============================================
    // CREATE PAYMENTS
    // ============================================
    console.log("💰 Creating payments...");

    const today = new Date();
    const sevenDaysLater = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    const threeDaysLater = new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000);
    const oneDayLater = new Date(today.getTime() + 1 * 24 * 60 * 60 * 1000);
    const threeDaysAgo = new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000);

    // Payments for Borrower 1_1 (Pending due in 7 days)
    const payment1 = await prisma.payment.create({
        data: {
            borrowerId: borrower1_1.id,
            amount: 50000.00,
            dueDate: sevenDaysLater,
            status: PaymentStatus.PENDING,
            caseId: "CASE-2024-001",
            notes: "Monthly installment for loan settlement",
        },
    });

    // Payments for Borrower 1_2 (Pending due in 3 days)
    const payment2 = await prisma.payment.create({
        data: {
            borrowerId: borrower1_2.id,
            amount: 25000.00,
            dueDate: threeDaysLater,
            status: PaymentStatus.PENDING,
            caseId: "CASE-2024-002",
            notes: "Settlement payment - Phase 1",
        },
    });

    // Payments for Borrower 2_1 (Overdue)
    const payment3 = await prisma.payment.create({
        data: {
            borrowerId: borrower2_1.id,
            amount: 75000.00,
            dueDate: threeDaysAgo,
            status: PaymentStatus.OVERDUE,
            caseId: "CASE-2024-003",
            notes: "Final settlement amount - OVERDUE",
        },
    });

    // Payments for Borrower 2_2 (Paid)
    const payment4 = await prisma.payment.create({
        data: {
            borrowerId: borrower2_2.id,
            amount: 30000.00,
            dueDate: threeDaysAgo,
            paidDate: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000),
            status: PaymentStatus.PAID,
            caseId: "CASE-2024-004",
            notes: "Court fees payment - Completed",
        },
    });

    // Payments for Borrower 3_1 (Pending due tomorrow)
    const payment5 = await prisma.payment.create({
        data: {
            borrowerId: borrower3_1.id,
            amount: 100000.00,
            dueDate: oneDayLater,
            status: PaymentStatus.PENDING,
            caseId: "CASE-2024-005",
            notes: "Urgent: Large settlement payment due",
        },
    });

    console.log("✅ Payments created");

    // ============================================
    // CREATE NOTIFICATIONS
    // ============================================
    console.log("📧 Creating notifications...");

    await prisma.notification.createMany({
        data: [
            {
                paymentId: payment1.id,
                type: NotificationType.REMINDER_7_DAY,
                channel: NotificationChannel.EMAIL,
                recipientType: "BORROWER",
                recipientName: borrower1_1.name,
                recipientContact: borrower1_1.email,
                message: `Dear ${borrower1_1.name}, This is a reminder that your payment of ₹50,000 is due in 7 days.`,
                sent: true,
                sentAt: new Date(),
            },
            {
                paymentId: payment2.id,
                type: NotificationType.REMINDER_3_DAY,
                channel: NotificationChannel.WHATSAPP,
                recipientType: "BORROWER",
                recipientName: borrower1_2.name,
                recipientContact: borrower1_2.whatsapp || borrower1_2.phone || "",
                message: `Dear ${borrower1_2.name}, Your payment of ₹25,000 is due in 3 days. Please ensure timely payment.`,
                sent: true,
                sentAt: new Date(),
            },
            {
                paymentId: payment3.id,
                type: NotificationType.OVERDUE,
                channel: NotificationChannel.EMAIL,
                recipientType: "BORROWER",
                recipientName: borrower2_1.name,
                recipientContact: borrower2_1.email,
                message: `URGENT: Dear ${borrower2_1.name}, Your payment of ₹75,000 is now OVERDUE. Please make the payment immediately.`,
                sent: true,
                sentAt: new Date(),
            },
            {
                paymentId: payment3.id,
                type: NotificationType.OVERDUE,
                channel: NotificationChannel.EMAIL,
                recipientType: "CLIENT",
                recipientName: client2.name,
                recipientContact: client2.email,
                message: `Alert: Payment of ₹75,000 from ${borrower2_1.name} is now OVERDUE.`,
                sent: true,
                sentAt: new Date(),
            },
            {
                paymentId: payment4.id,
                type: NotificationType.PAYMENT_RECEIVED,
                channel: NotificationChannel.EMAIL,
                recipientType: "CLIENT",
                recipientName: client2.name,
                recipientContact: client2.email,
                message: `Payment Received: ₹30,000 from ${borrower2_2.name} has been confirmed.`,
                sent: true,
                sentAt: new Date(),
            },
        ],
    });

    console.log("✅ Notifications created");

    // ============================================
    // CREATE TEMPLATES
    // ============================================
    console.log("📝 Creating message templates...");

    await prisma.template.createMany({
        data: [
            // Global templates
            {
                clientId: null,
                type: TemplateType.REMINDER_7_DAY,
                channel: NotificationChannel.EMAIL,
                subject: "Payment Reminder - 7 Days Until Due Date",
                body: `Dear {{borrowerName}},

This is a friendly reminder that your payment of ₹{{amount}} is due on {{dueDate}}.

Case Reference: {{caseId}}

Please ensure timely payment to avoid any late fees.

If you have already made the payment, please disregard this message.

Best regards,
{{clientName}}`,
                active: true,
            },
            {
                clientId: null,
                type: TemplateType.REMINDER_3_DAY,
                channel: NotificationChannel.EMAIL,
                subject: "Important: Payment Due in 3 Days",
                body: `Dear {{borrowerName}},

Your payment of ₹{{amount}} is due in 3 days ({{dueDate}}).

Case Reference: {{caseId}}

Please make the payment at your earliest convenience.

Best regards,
{{clientName}}`,
                active: true,
            },
            {
                clientId: null,
                type: TemplateType.REMINDER_1_DAY,
                channel: NotificationChannel.EMAIL,
                subject: "Urgent: Payment Due Tomorrow",
                body: `Dear {{borrowerName}},

URGENT: Your payment of ₹{{amount}} is due TOMORROW ({{dueDate}}).

Case Reference: {{caseId}}

Please ensure the payment is made to avoid it being marked as overdue.

Best regards,
{{clientName}}`,
                active: true,
            },
            {
                clientId: null,
                type: TemplateType.OVERDUE,
                channel: NotificationChannel.EMAIL,
                subject: "OVERDUE: Immediate Payment Required",
                body: `Dear {{borrowerName}},

Your payment of ₹{{amount}} was due on {{dueDate}} and is now OVERDUE.

Case Reference: {{caseId}}

Please make the payment immediately to avoid further action.

Best regards,
{{clientName}}`,
                active: true,
            },
            {
                clientId: null,
                type: TemplateType.PAYMENT_RECEIVED,
                channel: NotificationChannel.EMAIL,
                subject: "Payment Confirmation",
                body: `Dear {{borrowerName}},

Thank you! We have received your payment of ₹{{amount}}.

Case Reference: {{caseId}}
Payment Date: {{paidDate}}

This payment has been successfully recorded.

Best regards,
{{clientName}}`,
                active: true,
            },
            // WhatsApp templates
            {
                clientId: null,
                type: TemplateType.REMINDER_7_DAY,
                channel: NotificationChannel.WHATSAPP,
                body: `🔔 *Payment Reminder*

Dear {{borrowerName}},

Your payment of *₹{{amount}}* is due on *{{dueDate}}*.

Case: {{caseId}}

Please ensure timely payment.

- {{clientName}}`,
                active: true,
            },
            {
                clientId: null,
                type: TemplateType.OVERDUE,
                channel: NotificationChannel.WHATSAPP,
                body: `⚠️ *OVERDUE PAYMENT*

Dear {{borrowerName}},

Your payment of *₹{{amount}}* was due on *{{dueDate}}* and is now OVERDUE.

Case: {{caseId}}

Please make the payment immediately.

- {{clientName}}`,
                active: true,
            },
        ],
    });

    console.log("✅ Templates created");

    // ============================================
    // SUMMARY
    // ============================================
    console.log("\n" + "=".repeat(50));
    console.log("🎉 Seeding completed successfully!");
    console.log("=".repeat(50));
    console.log("\n📊 Created:");
    console.log("   • 1 Admin user");
    console.log("   • 3 Client users");
    console.log("   • 3 Clients");
    console.log("   • 5 Borrowers");
    console.log("   • 5 Payments");
    console.log("   • 5 Notifications");
    console.log("   • 7 Message templates");
    console.log("\n🔐 Login Credentials:");
    console.log("   ┌──────────────────────────────────────────────┐");
    console.log("   │ ADMIN                                        │");
    console.log("   │   Email: admin@uucpl.com                     │");
    console.log("   │   Password: admin123                         │");
    console.log("   ├──────────────────────────────────────────────┤");
    console.log("   │ CLIENTS                                      │");
    console.log("   │   Email: client1@uucpl.com  Password: client123 │");
    console.log("   │   Email: client2@uucpl.com  Password: client123 │");
    console.log("   │   Email: client3@uucpl.com  Password: client123 │");
    console.log("   └──────────────────────────────────────────────┘");
    console.log("\n");
}

main()
    .catch((e) => {
        console.error("❌ Error during seeding:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
