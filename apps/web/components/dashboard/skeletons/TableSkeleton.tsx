"use client";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
  showHeader?: boolean;
}

export function TableSkeleton({
  rows = 5,
  columns = 4,
  showHeader = true,
}: TableSkeletonProps) {
  return (
    <Card sx={{ height: "100%" }}>
      <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
        {/* Table Header */}
        {showHeader && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 2,
            }}
          >
            <Skeleton variant="text" width={140} height={28} animation="wave" />
            <Skeleton variant="rounded" width={100} height={36} animation="wave" />
          </Box>
        )}

        {/* Column Headers */}
        <Box
          sx={{
            display: "flex",
            gap: 2,
            pb: 2,
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          {Array.from({ length: columns }).map((_, i) => (
            <Box key={i} sx={{ flex: 1 }}>
              <Skeleton variant="text" width="80%" height={16} animation="wave" />
            </Box>
          ))}
        </Box>

        {/* Table Rows */}
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <Box
            key={rowIndex}
            sx={{
              display: "flex",
              gap: 2,
              py: 2,
              borderBottom: rowIndex < rows - 1 ? "1px solid" : "none",
              borderColor: "divider",
            }}
          >
            {Array.from({ length: columns }).map((_, colIndex) => (
              <Box key={colIndex} sx={{ flex: 1 }}>
                <Skeleton
                  variant="text"
                  width={colIndex === 0 ? "90%" : "70%"}
                  height={20}
                  animation="wave"
                />
              </Box>
            ))}
          </Box>
        ))}
      </CardContent>
    </Card>
  );
}
