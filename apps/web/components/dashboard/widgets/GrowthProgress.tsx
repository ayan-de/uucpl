"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Avatar from "@mui/material/Avatar";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import { EmptyState } from "../EmptyState";

interface GrowthData {
  percentage: number;
  label: string;
  companyGrowth: number;
  comparison: {
    current: { year: string; value: string };
    previous: { year: string; value: string };
  };
}

interface GrowthProgressProps {
  queryKey?: string[];
  queryFn?: () => Promise<GrowthData | null>;
}

const defaultQueryFn = async (): Promise<GrowthData> => {
  await new Promise((resolve) => setTimeout(resolve, 800));
  return {
    percentage: 78,
    label: "Growth",
    companyGrowth: 62,
    comparison: {
      current: { year: "2022", value: "$32.5k" },
      previous: { year: "2021", value: "$41.2k" },
    },
  };
};

export function GrowthProgress({
  queryKey = ["growth-progress"],
  queryFn = defaultQueryFn,
}: GrowthProgressProps) {
  const { data } = useSuspenseQuery({
    queryKey,
    queryFn,
    staleTime: 30 * 1000,
  });

  if (!data) {
    return (
      <EmptyState
        title="No growth data"
        description="Growth data unavailable"
        className="h-full"
      />
    );
  }

  return (
    <Card sx={{ height: "100%" }}>
      <CardContent
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          p: 2,
          "&:last-child": { pb: 2 },
        }}
      >
        {/* Circular Progress */}
        <Box sx={{ position: "relative", display: "inline-flex", mb: 2 }}>
          <CircularProgress
            variant="determinate"
            value={100}
            size={120}
            thickness={4}
            sx={{ color: "divider" }}
          />
          <CircularProgress
            variant="determinate"
            value={data.percentage}
            size={120}
            thickness={4}
            sx={{
              position: "absolute",
              left: 0,
              color: "primary.main",
              animationDuration: "1s",
            }}
          />
          <Box
            sx={{
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              position: "absolute",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography variant="h5" fontWeight={700} color="text.primary">
              {data.percentage}%
            </Typography>
            <Typography variant="caption" color="text.secondary" fontSize={11}>
              {data.label}
            </Typography>
          </Box>
        </Box>

        {/* Company Growth */}
        <Typography variant="caption" color="text.secondary" sx={{ mb: 2 }} fontSize={11}>
          {data.companyGrowth}% Company Growth
        </Typography>

        {/* Year Comparison */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Avatar
              sx={{
                bgcolor: "success.light",
                width: 32,
                height: 32,
              }}
            >
              <TrendingUpIcon sx={{ color: "success.dark", fontSize: 16 }} />
            </Avatar>
            <Box>
              <Typography variant="caption" color="text.secondary" fontSize={10}>
                {data.comparison.current.year}
              </Typography>
              <Typography variant="body2" fontWeight={600} color="text.primary" fontSize={12}>
                {data.comparison.current.value}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Avatar
              sx={{
                bgcolor: "info.light",
                width: 32,
                height: 32,
              }}
            >
              <BookmarkIcon sx={{ color: "info.dark", fontSize: 16 }} />
            </Avatar>
            <Box>
              <Typography variant="caption" color="text.secondary" fontSize={10}>
                {data.comparison.previous.year}
              </Typography>
              <Typography variant="body2" fontWeight={600} color="text.primary" fontSize={12}>
                {data.comparison.previous.value}
              </Typography>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
