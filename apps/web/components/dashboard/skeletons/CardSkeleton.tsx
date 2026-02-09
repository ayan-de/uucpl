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
            {showIcon && (
              <Skeleton
                variant="rounded"
                width={36}
                height={36}
                animation="wave"
                sx={{ bgcolor: "action.hover", borderRadius: 1.5 }}
              />
            )}
            <Skeleton
              variant="text"
              width={60}
              height={18}
              animation="wave"
              sx={{ bgcolor: "action.hover" }}
            />
          </Box>
          <Skeleton
            variant="circular"
            width={20}
            height={20}
            animation="wave"
            sx={{ bgcolor: "action.hover" }}
          />
        </Box>
        <Skeleton
          variant="text"
          width={100}
          height={32}
          animation="wave"
          sx={{ mb: 0.5, bgcolor: "action.hover" }}
        />
        {showTrend && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <Skeleton
              variant="text"
              width={40}
              height={16}
              animation="wave"
              sx={{ bgcolor: "action.hover" }}
            />
            <Skeleton
              variant="text"
              width={60}
              height={14}
              animation="wave"
              sx={{ bgcolor: "action.hover" }}
            />
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
