"use client";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import DescriptionIcon from "@mui/icons-material/Description";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import SyncAltIcon from "@mui/icons-material/SyncAlt";

import {
  DashboardWidget,
  CardSkeleton,
  ChartSkeleton,
  ListSkeleton,
  StatsCard,
  RevenueChart,
  GrowthProgress,
  OrderStatistics,
  ProfileReport,
  IncomeExpenses,
  TransactionsList,
} from "@/components/dashboard";

// Mock API functions that would normally call your backend
const fetchProfitStats = async () => {
  await new Promise((resolve) => setTimeout(resolve, 600));
  return { value: "$12,628", trend: 72.8, trendLabel: "since last week" };
};

const fetchSalesStats = async () => {
  await new Promise((resolve) => setTimeout(resolve, 450));
  return { value: "$4,679", trend: 28.42, trendLabel: "since last week" };
};

const fetchPaymentsStats = async () => {
  await new Promise((resolve) => setTimeout(resolve, 700));
  return { value: "$2,456", trend: -14.82, trendLabel: "since last week" };
};

const fetchTransactionsStats = async () => {
  await new Promise((resolve) => setTimeout(resolve, 550));
  return { value: "$14,857", trend: 28.14, trendLabel: "since last week" };
};

export default function AdminDashboardPage() {
  return (
    <Box>
      {/* Page Header */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1" fontWeight={600} color="text.primary">
          Dashboard Overview
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Business performance at a glance.
        </Typography>
      </Box>

      {/* Row 1: Stats Cards */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <DashboardWidget fallback={<CardSkeleton />}>
            <StatsCard
              id="profit"
              title="Profit"
              queryKey={["stats", "profit"]}
              queryFn={fetchProfitStats}
              icon={<AttachMoneyIcon sx={{ color: "#059669" }} />}
              iconBgColor="#d1fae5"
            />
          </DashboardWidget>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <DashboardWidget fallback={<CardSkeleton />}>
            <StatsCard
              id="sales"
              title="Sales"
              queryKey={["stats", "sales"]}
              queryFn={fetchSalesStats}
              icon={<DescriptionIcon sx={{ color: "#2563eb" }} />}
              iconBgColor="#dbeafe"
            />
          </DashboardWidget>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <DashboardWidget fallback={<CardSkeleton />}>
            <StatsCard
              id="payments"
              title="Payments"
              queryKey={["stats", "payments"]}
              queryFn={fetchPaymentsStats}
              icon={<CreditCardIcon sx={{ color: "#db2777" }} />}
              iconBgColor="#fce7f3"
            />
          </DashboardWidget>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <DashboardWidget fallback={<CardSkeleton />}>
            <StatsCard
              id="transactions"
              title="Transactions"
              queryKey={["stats", "transactions"]}
              queryFn={fetchTransactionsStats}
              icon={<SyncAltIcon sx={{ color: "#0891b2" }} />}
              iconBgColor="#cffafe"
            />
          </DashboardWidget>
        </Grid>
      </Grid>

      {/* Row 2: Revenue Chart + Growth Progress */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <DashboardWidget fallback={<ChartSkeleton height="h-48" />}>
            <RevenueChart />
          </DashboardWidget>
        </Grid>
        <Grid size={{ xs: 12, lg: 4 }}>
          <DashboardWidget fallback={<CardSkeleton className="h-full" />}>
            <GrowthProgress />
          </DashboardWidget>
        </Grid>
      </Grid>

      {/* Row 3: Order Statistics + Income/Expenses + Profile Report */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <DashboardWidget fallback={<ListSkeleton items={4} />}>
            <OrderStatistics />
          </DashboardWidget>
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <DashboardWidget fallback={<CardSkeleton className="h-full" />}>
            <IncomeExpenses />
          </DashboardWidget>
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <DashboardWidget fallback={<CardSkeleton className="h-full" />}>
            <ProfileReport />
          </DashboardWidget>
        </Grid>
      </Grid>

      {/* Row 4: Transactions List */}
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, lg: 4 }}>
          <DashboardWidget fallback={<ListSkeleton items={5} />}>
            <TransactionsList />
          </DashboardWidget>
        </Grid>
      </Grid>
    </Box>
  );
}
