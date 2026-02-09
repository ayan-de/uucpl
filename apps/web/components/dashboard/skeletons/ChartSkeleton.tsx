"use client";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";

interface ChartSkeletonProps {
  height?: string;
  showHeader?: boolean;
  showLegend?: boolean;
}

export function ChartSkeleton({
  showHeader = true,
  showLegend = true,
}: ChartSkeletonProps) {
  return (
    <Card sx={{ height: "100%", bgcolor: "background.paper" }}>
      <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
        {/* Header */}
        {showHeader && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 2,
            }}
          >
            <Skeleton
              variant="text"
              width={120}
              height={28}
              animation="wave"
              sx={{ bgcolor: "action.hover" }}
            />
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              {showLegend && (
                <>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Skeleton
                      variant="circular"
                      width={12}
                      height={12}
                      animation="wave"
                      sx={{ bgcolor: "action.hover" }}
                    />
                    <Skeleton
                      variant="text"
                      width={40}
                      height={16}
                      animation="wave"
                      sx={{ bgcolor: "action.hover" }}
                    />
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Skeleton
                      variant="circular"
                      width={12}
                      height={12}
                      animation="wave"
                      sx={{ bgcolor: "action.hover" }}
                    />
                    <Skeleton
                      variant="text"
                      width={40}
                      height={16}
                      animation="wave"
                      sx={{ bgcolor: "action.hover" }}
                    />
                  </Box>
                </>
              )}
              <Skeleton
                variant="rounded"
                width={100}
                height={36}
                animation="wave"
                sx={{ bgcolor: "action.hover" }}
              />
            </Box>
          </Box>
        )}

        {/* Chart Area */}
        <Box sx={{ height: 220, display: "flex", alignItems: "flex-end", gap: 2 }}>
          {/* Y-axis */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              height: "100%",
              py: 1,
            }}
          >
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton
                key={i}
                variant="text"
                width={24}
                height={14}
                animation="wave"
                sx={{ bgcolor: "action.hover" }}
              />
            ))}
          </Box>

          {/* Bars */}
          <Box
            sx={{
              flex: 1,
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-around",
              gap: 1,
              height: "100%",
            }}
          >
            {[60, 40, 80, 30, 70, 50, 45].map((height, i) => (
              <Box
                key={i}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 1,
                  flex: 1,
                }}
              >
                <Box sx={{ display: "flex", gap: 0.5, alignItems: "flex-end" }}>
                  <Skeleton
                    variant="rounded"
                    width={16}
                    height={height * 2}
                    animation="wave"
                    sx={{ bgcolor: "action.hover" }}
                  />
                  <Skeleton
                    variant="rounded"
                    width={16}
                    height={height * 1.5}
                    animation="wave"
                    sx={{ bgcolor: "action.hover" }}
                  />
                </Box>
              </Box>
            ))}
          </Box>
        </Box>

        {/* X-axis labels */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-around",
            mt: 2,
            ml: 5,
          }}
        >
          {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"].map((_, i) => (
            <Skeleton
              key={i}
              variant="text"
              width={28}
              height={14}
              animation="wave"
              sx={{ bgcolor: "action.hover" }}
            />
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}
