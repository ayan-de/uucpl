"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { EmptyState } from "../EmptyState";

interface StatsCardProps {
  id: string;
  title: string;
  icon: React.ReactNode;
  iconBgColor: string;
  queryKey: string[];
  queryFn: () => Promise<{
    value: string | number;
    trend?: number;
    trendLabel?: string;
  } | null>;
}

export function StatsCard({
  title,
  icon,
  iconBgColor,
  queryKey,
  queryFn,
}: StatsCardProps) {
  const { data } = useSuspenseQuery({
    queryKey,
    queryFn,
    staleTime: 30 * 1000,
  });

  if (!data) {
    return (
      <EmptyState
        title="No data"
        description="Stats data unavailable"
        className="h-full"
      />
    );
  }

  const isPositive = (data.trend ?? 0) >= 0;

  return (
    <Card
      sx={{
        height: "100%",
        transition: "box-shadow 0.3s ease-in-out",
        "&:hover": {
          boxShadow: 3,
        },
      }}
    >
      <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            mb: 1.5,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: 1.5,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: iconBgColor,
                "& svg": { fontSize: 18 },
              }}
            >
              {icon}
            </Box>
            <Typography variant="body2" color="text.secondary" fontSize={12} fontWeight={500}>
              {title}
            </Typography>
          </Box>
          <IconButton size="small" sx={{ color: "text.secondary", p: 0.5 }}>
            <MoreVertIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Box>

        <Typography variant="h5" fontWeight={700} color="text.primary" sx={{ mb: 0.5 }}>
          {data.value}
        </Typography>

        {data.trend !== undefined && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                color: isPositive ? "success.main" : "error.main",
              }}
            >
              {isPositive ? (
                <TrendingUpIcon sx={{ fontSize: 14 }} />
              ) : (
                <TrendingDownIcon sx={{ fontSize: 14 }} />
              )}
              <Typography
                variant="caption"
                fontWeight={600}
                sx={{ ml: 0.25, color: "inherit", fontSize: 11 }}
              >
                {isPositive ? "+" : ""}
                {data.trend}%
              </Typography>
            </Box>
            {data.trendLabel && (
              <Typography variant="caption" color="text.secondary" fontSize={10}>
                {data.trendLabel}
              </Typography>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
