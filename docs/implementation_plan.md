# Law Firm Payment & Deadline Reminder Automation App

## Executive Summary

Based on the client's spec documents, this app automates payment reminders and deadline notifications for a law firm. The solution combines:

- **Next.js + TypeScript** for the web application (admin dashboard, API)
- **n8n** for workflow automation (scheduling, triggers, notifications)
- **PostgreSQL** for data storage
- **SMS/Email providers** for multi-channel notifications

---

## What is n8n and Where It Fits

> [!TIP]
> **n8n in Simple Terms**: Think of n8n as a visual "if this, then that" tool for developers. It's like Zapier but open-source, self-hostable, and much more powerful.

### n8n's Role in This Project

```mermaid
flowchart LR
    subgraph "Your Next.js App"
        A[Admin Dashboard] --> B[API Routes]
        B --> C[(PostgreSQL)]
    end
    
    subgraph "n8n Automation Engine"
        D[Scheduled Trigger<br/>Daily at 9 AM] --> E{Check Due Dates}
        E -->|7 days before| F[Send Reminder]
        E -->|3 days before| F
        E -->|1 day before| F
        E -->|Overdue| G[Send Alert]
        
        H[Webhook Trigger] --> I[Payment Received]
        I --> J[Notify Both Parties]
    end
    
    B <-->|Webhooks| D
    B <-->|Webhooks| H
    F --> K[Email/SMS/WhatsApp]
    G --> K
    J --> K
```

### How Next.js and n8n Communicate

| Action | Direction | Method |
|--------|-----------|--------|
| New payment recorded | Next.js → n8n | Webhook call from API route |
| Daily due date check | n8n → Next.js | Scheduled trigger fetches from API |
| Send notification | n8n → External | SMS/Email provider integration |
| Update notification status | n8n → Next.js | Webhook callback to API |

---

## Complete System Architecture

```mermaid
flowchart TB
    subgraph Frontend["Frontend (Next.js App)"]
        UI[Admin Dashboard]
        UI --> ClientMgmt[Client Management]
        UI --> PaymentTrack[Payment Tracking]
        UI --> Templates[Message Templates]
        UI --> Analytics[Analytics Dashboard]
    end
    
    subgraph Backend["Backend (Next.js API Routes)"]
        API[API Routes]
        API --> Clients["/api/clients"]
        API --> Payments["/api/payments"]
        API --> Webhooks["/api/webhooks/n8n"]
        API --> Notifications["/api/notifications"]
    end
    
    subgraph Database["Database Layer"]
        Prisma[Prisma ORM]
        Prisma --> DB[(PostgreSQL)]
    end
    
    subgraph N8N["n8n Automation Workflows"]
        WF1[Payment Due Reminder<br/>Scheduled: Daily 9 AM]
        WF2[Payment Received<br/>Trigger: Webhook]
        WF3[Overdue Notification<br/>Scheduled: Daily 10 AM]
    end
    
    subgraph External["External Services"]
        SMS[SMS Provider<br/>MSG91/Twilio]
        Email[Email Provider<br/>Gmail/SMTP]
        WA[WhatsApp API<br/>Optional]
    end
    
    Frontend --> Backend
    Backend --> Database
    Backend <--> N8N
    N8N --> External
```

---

## Recommended Tech Stack

| Layer | Technology | Why |
|-------|------------|-----|
| **Frontend** | Next.js 14+ with TypeScript | You already know it, SSR, API routes |
| **Styling** | Tailwind CSS or Vanilla CSS | Fast prototyping |
| **Database** | PostgreSQL | Robust, free, supports scheduling queries |
| **ORM** | Prisma | Type-safe, great DX with TypeScript |
| **Automation** | n8n (self-hosted via Docker) | Open-source, visual workflows, integrates with everything |
| **SMS** | MSG91 (India) or Twilio | From client spec |
| **Email** | Gmail/SMTP or SendGrid | Simple, reliable |
| **WhatsApp** | Twilio WhatsApp API | Optional, from client spec |
| **Hosting** | Vercel (Next.js) + VPS (n8n) | Easy deployment split |

---

## Database Schema Design

```mermaid
erDiagram
    CLIENTS ||--o{ BORROWERS : has
    BORROWERS ||--o{ PAYMENTS : makes
    PAYMENTS ||--o{ NOTIFICATIONS : triggers
    CLIENTS ||--o{ TEMPLATES : customizes
    
    CLIENTS {
        uuid id PK
        string name
        string email
        string phone
        string whatsapp
        datetime created_at
    }
    
    BORROWERS {
        uuid id PK
        uuid client_id FK
        string name
        string email
        string phone
        string whatsapp
        datetime created_at
    }
    
    PAYMENTS {
        uuid id PK
        uuid borrower_id FK
        decimal amount
        date due_date
        date paid_date
        enum status "pending|paid|overdue"
        string case_id
        datetime created_at
    }
    
    NOTIFICATIONS {
        uuid id PK
        uuid payment_id FK
        enum type "reminder|overdue|payment_received"
        enum channel "sms|email|whatsapp"
        string recipient_type "client|borrower"
        boolean sent
        datetime sent_at
        string message
    }
    
    TEMPLATES {
        uuid id PK
        uuid client_id FK
        enum type "7_day|3_day|1_day|overdue|payment_received"
        string subject
        text body
        boolean active
    }
```

---

## n8n Workflow Details

### Workflow 1: Daily Payment Due Reminder

```
┌─────────────────┐    ┌──────────────┐    ┌─────────────────┐    ┌──────────────┐
│  Schedule       │ -> │ HTTP Request │ -> │ Filter/Switch   │ -> │ Send SMS     │
│  (Daily 9 AM)   │    │ GET /api/    │    │ (7d/3d/1d)      │    │ Send Email   │
│                 │    │ payments/due │    │                 │    │ (Parallel)   │
└─────────────────┘    └──────────────┘    └─────────────────┘    └──────────────┘
                                                                         │
                                                                         v
                                                               ┌──────────────────┐
                                                               │ HTTP Request     │
                                                               │ POST /api/       │
                                                               │ notifications    │
                                                               │ (Log sent)       │
                                                               └──────────────────┘
```

**Logic**:

1. Runs daily at 9 AM
2. Fetches all pending payments from your Next.js API
3. Filters based on due date proximity (7 days, 3 days, 1 day)
4. Fetches client-specific message templates
5. Sends SMS/Email to BOTH client and borrower
6. Logs notification to your database

### Workflow 2: Payment Received Notification

```
┌─────────────────┐    ┌──────────────┐    ┌─────────────────┐
│  Webhook        │ -> │ Fetch Client │ -> │ Send SMS/Email  │
│  (From your     │    │ & Borrower   │    │ to BOTH parties │
│   Next.js API)  │    │ details      │    │                 │
└─────────────────┘    └──────────────┘    └─────────────────┘
```

**Trigger**: When you mark a payment as "paid" in your Next.js app, the API calls n8n webhook.

### Workflow 3: Overdue Payment Alert

```
┌─────────────────┐    ┌──────────────┐    ┌─────────────────┐    ┌──────────────┐
│  Schedule       │ -> │ HTTP Request │ -> │ Send Overdue    │ -> │ Optional:    │
│  (Daily 10 AM)  │    │ GET /api/    │    │ SMS/Email       │    │ Slack Alert  │
│                 │    │ payments/    │    │ to BOTH parties │    │ to Finance   │
│                 │    │ overdue      │    │                 │    │              │
└─────────────────┘    └──────────────┘    └─────────────────┘    └──────────────┘
```

---

## Implementation Steps

### Phase 1: Project Setup (Day 1-2)

```bash
# Create Next.js project
npx create-next-app@latest payment-reminder --typescript --tailwind --app

# Install dependencies
npm install prisma @prisma/client axios
npm install -D @types/node

# Initialize Prisma
npx prisma init
```

### Phase 2: Database Setup (Day 2-3)

1. Create PostgreSQL database (local or hosted like Supabase/Neon)
2. Define Prisma schema with tables above
3. Run migrations: `npx prisma migrate dev`

### Phase 3: API Development (Day 3-5)

Build these API routes:

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/clients` | GET, POST | Manage clients |
| `/api/borrowers` | GET, POST | Manage borrowers |
| `/api/payments` | GET, POST, PATCH | Payment CRUD |
| `/api/payments/due` | GET | Get payments due in next 7 days |
| `/api/payments/overdue` | GET | Get overdue payments |
| `/api/webhooks/n8n/payment-received` | POST | Trigger from n8n |
| `/api/notifications` | POST | Log sent notifications |
| `/api/templates` | GET, POST, PATCH | Message templates |

### Phase 4: n8n Setup (Day 5-6)

**Option A: Self-hosted (Recommended for production)**

```bash
# Using Docker
docker run -d --name n8n \
  -p 5678:5678 \
  -v ~/.n8n:/home/node/.n8n \
  n8nio/n8n
```

**Option B: n8n Cloud**

- Sign up at [n8n.cloud](https://n8n.cloud)
- Free tier available for development

### Phase 5: Build n8n Workflows (Day 6-8)

1. Import/create the 3 workflows described above
2. Configure SMS provider credentials (MSG91/Twilio)
3. Configure email provider
4. Test with sample data

### Phase 6: Frontend Dashboard (Day 8-12)

Build pages:

- `/dashboard` - Overview with stats
- `/clients` - Client management
- `/payments` - Payment tracking
- `/notifications` - History & logs
- `/templates` - Customize message templates

---

## Complete Data Flow Example

### Scenario: Payment Due in 3 Days

```mermaid
sequenceDiagram
    participant N as n8n (Scheduled)
    participant API as Next.js API
    participant DB as PostgreSQL
    participant SMS as MSG91/Twilio
    participant Email as Gmail/SMTP
    participant Client as Law Firm
    participant Borrower as Client's Customer

    N->>API: GET /api/payments/due?days=3
    API->>DB: Query payments due in 3 days
    DB-->>API: Return payment records
    API-->>N: JSON with payment + client + borrower data
    
    N->>N: Fetch message template for 3-day reminder
    N->>N: Personalize message with names, amount, date
    
    par Send to Both Parties
        N->>SMS: Send SMS to Client
        SMS-->>Client: "Reminder: Payment of ₹X due from {Borrower} on {Date}"
        N->>SMS: Send SMS to Borrower
        SMS-->>Borrower: "Reminder: Your payment of ₹X is due on {Date}"
        N->>Email: Send Email to Client
        N->>Email: Send Email to Borrower
    end
    
    N->>API: POST /api/notifications (log sent)
    API->>DB: Store notification records
```

### Scenario: Payment Received

```mermaid
sequenceDiagram
    participant Admin as Admin Dashboard
    participant API as Next.js API
    participant DB as PostgreSQL
    participant N as n8n (Webhook)
    participant SMS as MSG91/Twilio
    participant Client as Law Firm
    participant Borrower as Payer

    Admin->>API: PATCH /api/payments/{id} (status: paid)
    API->>DB: Update payment status
    API->>N: POST webhook (payment_id, amount, borrower_id)
    
    N->>API: GET /api/payments/{id}/details
    API-->>N: Full payment, client, borrower data
    
    par Notify Both
        N->>SMS: SMS to Client
        SMS-->>Client: "Payment received: ₹X from {Borrower}"
        N->>SMS: SMS to Borrower  
        SMS-->>Borrower: "Thank you! Your payment of ₹X has been received"
    end
    
    N->>API: POST /api/notifications (log)
```

---

## Project Folder Structure

```
payment-reminder/
├── app/
│   ├── page.tsx                    # Landing/Login
│   ├── dashboard/
│   │   └── page.tsx                # Main dashboard
│   ├── clients/
│   │   ├── page.tsx                # Client list
│   │   └── [id]/page.tsx           # Client details
│   ├── payments/
│   │   ├── page.tsx                # Payment list
│   │   └── [id]/page.tsx           # Payment details
│   ├── notifications/
│   │   └── page.tsx                # Notification history
│   ├── templates/
│   │   └── page.tsx                # Message templates
│   └── api/
│       ├── clients/
│       │   └── route.ts
│       ├── borrowers/
│       │   └── route.ts
│       ├── payments/
│       │   ├── route.ts
│       │   ├── due/route.ts
│       │   └── overdue/route.ts
│       ├── notifications/
│       │   └── route.ts
│       ├── templates/
│       │   └── route.ts
│       └── webhooks/
│           └── n8n/
│               └── route.ts
├── prisma/
│   └── schema.prisma
├── lib/
│   ├── prisma.ts                   # Prisma client
│   └── utils.ts
├── components/
│   ├── Dashboard/
│   ├── ClientForm/
│   ├── PaymentTable/
│   └── ...
└── n8n-workflows/                  # Export your n8n workflows as JSON
    ├── payment-due-reminder.json
    ├── payment-received.json
    └── overdue-alert.json
```

---

## User Review Required

> [!IMPORTANT]
> **Please confirm these decisions before I proceed:**

1. **Database Choice**: PostgreSQL (recommended) or would you prefer MySQL or a managed option like Supabase?

2. **n8n Hosting**:
   - Self-hosted via Docker (more control, runs on your VPS)
   - n8n Cloud (easier setup, paid after free tier)

3. **SMS Provider**: MSG91 (better for India) or Twilio (global)?

4. **Deployment Target**:
   - Next.js on Vercel + n8n on separate VPS?
   - Everything on a single VPS?

5. **Do you have existing bank integration or is payment tracking manual?**
   - If manual: Admin marks payments as received
   - If integrated: Can trigger n8n automatically from bank webhooks

---

## Verification Plan

### Development Testing

1. Create test data (mock clients, borrowers, payments)
2. Trigger n8n workflows manually and verify SMS/Email delivery
3. Check notification logs in database

### Integration Testing

1. Mark payment as "paid" in dashboard → Verify both parties receive notification
2. Wait for scheduled trigger → Verify reminder sent for due payments
3. Test template customization

### Manual Testing by User

- User will test notification delivery to their phone numbers
- User will verify dashboard UI meets requirements
- User will confirm message templates are correct

---

## Client Spec Documents Reference

![Spec Document Page 1](/home/ayande/.gemini/antigravity/brain/6ff86975-938f-40ad-a6ce-e0ecc8df620b/uploaded_media_0_1770563959229.jpg)

![Spec Document Page 2](/home/ayande/.gemini/antigravity/brain/6ff86975-938f-40ad-a6ce-e0ecc8df620b/uploaded_media_1_1770563959229.jpg)

![Spec Document Page 3](/home/ayande/.gemini/antigravity/brain/6ff86975-938f-40ad-a6ce-e0ecc8df620b/uploaded_media_2_1770563959229.jpg)
