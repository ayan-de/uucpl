"use client";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";

interface ListSkeletonProps {
  items?: number;
  showAvatar?: boolean;
  showAction?: boolean;
}

export function ListSkeleton({
  items = 4,
  showAvatar = true,
  showAction = true,
}: ListSkeletonProps) {
  return (
    <Card sx={{ height: "100%", bgcolor: "background.paper" }}>
      <CardContent>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 2,
          }}
        >
          <Box>
            <Skeleton
              variant="text"
              width={140}
              height={24}
              animation="wave"
              sx={{ bgcolor: "action.hover" }}
            />
            <Skeleton
              variant="text"
              width={100}
              height={16}
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

        {/* List Items */}
        {Array.from({ length: items }).map((_, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              alignItems: "center",
              py: 1.5,
              borderBottom: index < items - 1 ? 1 : 0,
              borderColor: "divider",
            }}
          >
            {showAvatar && (
              <Skeleton
                variant="circular"
                width={44}
                height={44}
                animation="wave"
                sx={{ mr: 2, bgcolor: "action.hover" }}
              />
            )}
            <Box sx={{ flex: 1 }}>
              <Skeleton
                variant="text"
                width="60%"
                height={20}
                animation="wave"
                sx={{ bgcolor: "action.hover" }}
              />
              <Skeleton
                variant="text"
                width="40%"
                height={14}
                animation="wave"
                sx={{ bgcolor: "action.hover" }}
              />
            </Box>
            {showAction && (
              <Skeleton
                variant="text"
                width={60}
                height={20}
                animation="wave"
                sx={{ bgcolor: "action.hover" }}
              />
            )}
          </Box>
        ))}
      </CardContent>
    </Card>
  );
}
