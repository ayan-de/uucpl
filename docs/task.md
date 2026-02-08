# Payment Automation App - Task Breakdown

## Approved Architecture

- **Structure**: Turborepo Monorepo
- **Frontend + API**: Next.js 14+ (App Router)
- **Database**: PostgreSQL (Supabase/Neon)
- **ORM**: Prisma
- **Automation**: n8n (Railway)
- **Deployment**: Vercel (Next.js) + Railway (n8n)

---

## Phase 1: Planning & Research ✅

- [x] Analyze client spec documents
- [x] Research n8n integration
- [x] Create implementation plan
- [x] Architecture decisions (approved)

## Phase 2: Project Setup ✅

- [x] Initialize Turborepo monorepo
- [x] Configure Next.js app with TypeScript (Next.js 16 included!)
- [x] Set up shared packages (database, types)
- [x] Configure ESLint, Prettier (included in template)
- [x] Set up environment variables structure

## Phase 3: Database Setup ✅

- [x] Create PostgreSQL database (Supabase)
- [x] Define Prisma schema
  - [x] Clients table
  - [x] Borrowers table
  - [x] Payments table
  - [x] Notifications table
  - [x] Templates table
- [x] Run initial migration (`prisma db push`)
- [x] Generate Prisma client

## Phase 4: API Development ✅

- [x] `/api/clients` - CRUD (list, create, get, update, delete)
- [x] `/api/borrowers` - CRUD (list, create, get, update, delete)
- [x] `/api/payments` - CRUD + status updates (triggers n8n on paid)
- [x] `/api/payments/due` - Get due payments (for n8n)
- [x] `/api/payments/overdue` - Get overdue payments (for n8n)
- [x] `/api/webhooks/n8n` - Webhook callback endpoint
- [x] `/api/notifications` - Log notifications
- [x] `/api/templates` - Message templates CRUD
- [x] `/api/dashboard` - Dashboard statistics

## Phase 5: n8n Setup

- [ ] Install n8n (local Docker or Railway)
- [ ] Create workflow: Payment due reminder
- [ ] Create workflow: Payment received notification
- [ ] Create workflow: Overdue payment alert
- [ ] Configure SMS provider (MSG91/Twilio)
- [ ] Configure email provider

## Phase 6: Frontend Development

- [x] Tailwind CSS setup with `darkMode: 'class'`
- [x] Dark mode theme (ThemeProvider, useTheme hook, ThemeToggle)
- [ ] Dashboard page with stats
- [ ] Client management UI
- [ ] Borrower management UI
- [ ] Payment tracking UI
- [ ] Notification history
- [ ] Template editor

## Phase 7: Testing & Deployment

- [ ] Test n8n workflows
- [ ] Test notifications (SMS/Email)
- [ ] Deploy Next.js to Vercel
- [ ] Deploy n8n to Railway
- [ ] Production database setup
- [ ] Final testing
