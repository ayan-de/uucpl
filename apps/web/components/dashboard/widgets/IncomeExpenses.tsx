"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Avatar from "@mui/material/Avatar";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { EmptyState } from "../EmptyState";

interface IncomeData {
  income: { value: string; change: number };
  expenses: { value: string; change: number };
  profit: { value: string; change: number };
  totalBalance: { value: string; change: number };
}

interface IncomeExpensesProps {
  queryKey?: string[];
  queryFn?: () => Promise<IncomeData | null>;
}

const defaultQueryFn = async (): Promise<IncomeData> => {
  await new Promise((resolve) => setTimeout(resolve, 850));
  return {
    income: { value: "$42,845", change: 12.5 },
    expenses: { value: "$18,234", change: -5.3 },
    profit: { value: "$24,611", change: 18.2 },
    totalBalance: { value: "$459.10", change: -42.9 },
  };
};

export function IncomeExpenses({
  queryKey = ["income-expenses"],
  queryFn = defaultQueryFn,
}: IncomeExpensesProps) {
  const [tabValue, setTabValue] = useState(0);

  const { data } = useSuspenseQuery({
    queryKey,
    queryFn,
    staleTime: 30 * 1000,
  });

  if (!data) {
    return (
      <EmptyState
        title="No financial data"
        description="Income/expense data unavailable"
        className="h-full"
      />
    );
  }

  const tabs = [
    { label: "Income", data: data.income },
    { label: "Expenses", data: data.expenses },
    { label: "Profit", data: data.profit },
  ];

  const activeTab = tabs[tabValue];

  return (
    <Card sx={{ height: "100%" }}>
      <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
        {/* Tabs */}
        <Tabs
          value={tabValue}
          onChange={(_, newValue) => setTabValue(newValue)}
          sx={{
            mb: 2,
            minHeight: 32,
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 600,
              fontSize: 11,
              minWidth: "auto",
              minHeight: 28,
              px: 1.5,
              py: 0.5,
              borderRadius: 1,
              mr: 0.5,
              color: "text.secondary",
            },
            "& .Mui-selected": {
              bgcolor: "primary.main",
              color: "white !important",
            },
            "& .MuiTabs-indicator": {
              display: "none",
            },
          }}
        >
          {tabs.map((tab, index) => (
            <Tab key={index} label={tab.label} />
          ))}
        </Tabs>

        {/* Active Tab Content */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" fontWeight={700} color="text.primary" sx={{ mb: 0.5 }}>
            {activeTab?.data.value}
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              color: (activeTab?.data.change ?? 0) >= 0 ? "success.main" : "error.main",
            }}
          >
            {(activeTab?.data.change ?? 0) >= 0 ? (
              <TrendingUpIcon sx={{ fontSize: 14, mr: 0.5 }} />
            ) : (
              <TrendingDownIcon sx={{ fontSize: 14, mr: 0.5 }} />
            )}
            <Typography variant="caption" fontWeight={600} fontSize={11}>
              {(activeTab?.data.change ?? 0) >= 0 ? "+" : ""}
              {activeTab?.data.change}% from last month
            </Typography>
          </Box>
        </Box>

        {/* Divider with Total Balance */}
        <Box
          sx={{
            pt: 2,
            borderTop: 1,
            borderColor: "divider",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Avatar sx={{ bgcolor: "success.light", width: 32, height: 32 }}>
              <AccountBalanceWalletIcon sx={{ color: "success.dark", fontSize: 16 }} />
            </Avatar>
            <Box>
              <Typography variant="caption" color="text.secondary" fontSize={10}>
                Total Balance
              </Typography>
              <Typography variant="body2" fontWeight={600} color="text.primary" fontSize={12}>
                {data.totalBalance.value}
              </Typography>
            </Box>
          </Box>
          <Typography
            variant="caption"
            fontWeight={600}
            fontSize={11}
            sx={{ color: data.totalBalance.change >= 0 ? "success.main" : "error.main" }}
          >
            {data.totalBalance.change >= 0 ? "+" : ""}
            {data.totalBalance.change}%
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
