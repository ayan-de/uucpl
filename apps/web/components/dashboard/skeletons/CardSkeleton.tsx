"use client";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";

interface CardSkeletonProps {
  showIcon?: boolean;
  showTrend?: boolean;
  className?: string;
}

export function CardSkeleton({
  showIcon = true,
  showTrend = true,
}: CardSkeletonProps) {
  return (
    <Card sx={{ height: "100%", bgcolor: "background.paper" }}>
      <CardContent>
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            mb: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            {showIcon && (
              <Skeleton
                variant="rounded"
                width={44}
                height={44}
                animation="wave"
                sx={{ bgcolor: "action.hover" }}
              />
            )}
            <Skeleton
              variant="text"
              width={60}
              height={20}
              animation="wave"
              sx={{ bgcolor: "action.hover" }}
            />
          </Box>
          <Skeleton
            variant="circular"
            width={24}
            height={24}
            animation="wave"
            sx={{ bgcolor: "action.hover" }}
          />
        </Box>
        <Skeleton
          variant="text"
          width={100}
          height={36}
          animation="wave"
          sx={{ mb: 1, bgcolor: "action.hover" }}
        />
        {showTrend && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Skeleton
              variant="text"
              width={50}
              height={20}
              animation="wave"
              sx={{ bgcolor: "action.hover" }}
            />
            <Skeleton
              variant="text"
              width={80}
              height={16}
              animation="wave"
              sx={{ bgcolor: "action.hover" }}
            />
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
