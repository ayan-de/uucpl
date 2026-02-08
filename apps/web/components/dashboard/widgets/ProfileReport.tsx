"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Chip from "@mui/material/Chip";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { EmptyState } from "../EmptyState";

interface ProfileReportData {
  year: number;
  totalValue: string;
  percentage: number;
  chartData: number[];
}

interface ProfileReportProps {
  queryKey?: string[];
  queryFn?: () => Promise<ProfileReportData | null>;
}

const defaultQueryFn = async (): Promise<ProfileReportData> => {
  await new Promise((resolve) => setTimeout(resolve, 700));
  return {
    year: 2021,
    totalValue: "$84,686k",
    percentage: 68.2,
    chartData: [20, 35, 28, 45, 55, 48, 60, 52, 65, 58, 70, 75],
  };
};

export function ProfileReport({
  queryKey = ["profile-report"],
  queryFn = defaultQueryFn,
}: ProfileReportProps) {
  const { data } = useSuspenseQuery({
    queryKey,
    queryFn,
    staleTime: 30 * 1000,
  });

  if (!data) {
    return (
      <EmptyState
        title="No report data"
        description="Profile report unavailable"
        className="h-full"
      />
    );
  }

  const maxValue = Math.max(...data.chartData);
  const points = data.chartData
    .map((value, index) => {
      const x = (index / (data.chartData.length - 1)) * 200;
      const y = 50 - (value / maxValue) * 40;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <Card sx={{ height: "100%" }}>
      <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 1.5,
          }}
        >
          <Typography variant="subtitle1" fontWeight={600} color="text.primary">
            Profile Report
          </Typography>
          <IconButton size="small" sx={{ p: 0.5 }}>
            <MoreVertIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Box>

        {/* Year Badge */}
        <Chip
          label={`YEAR ${data.year}`}
          size="small"
          sx={{
            bgcolor: "warning.light",
            color: "warning.dark",
            fontWeight: 600,
            fontSize: 10,
            height: 20,
            mb: 1.5,
          }}
        />

        {/* Stats */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 0.5 }}>
          <TrendingUpIcon sx={{ color: "success.main", fontSize: 14 }} />
          <Typography variant="caption" fontWeight={600} color="success.main" fontSize={11}>
            {data.percentage}%
          </Typography>
        </Box>

        <Typography variant="h5" fontWeight={700} color="text.primary" sx={{ mb: 2 }}>
          {data.totalValue}
        </Typography>

        {/* Line Chart */}
        <Box sx={{ height: 60, width: "100%" }}>
          <svg width="100%" height="100%" viewBox="0 0 200 55" preserveAspectRatio="none">
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#fbbf24" />
                <stop offset="100%" stopColor="#f59e0b" />
              </linearGradient>
              <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
              </linearGradient>
            </defs>
            <polygon
              points={`0,50 ${points} 200,50`}
              fill="url(#areaGradient)"
            />
            <polyline
              points={points}
              fill="none"
              stroke="url(#lineGradient)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle
              cx="200"
              cy={50 - ((data.chartData[data.chartData.length - 1] ?? 0) / maxValue) * 40}
              r="3"
              fill="#f59e0b"
            />
          </svg>
        </Box>
      </CardContent>
    </Card>
  );
}
