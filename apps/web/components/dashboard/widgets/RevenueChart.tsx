"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import { EmptyState } from "../EmptyState";

interface RevenueData {
  month: string;
  current: number;
  previous: number;
}

interface RevenueChartProps {
  queryKey?: string[];
  queryFn?: () => Promise<RevenueData[] | null>;
}

const defaultQueryFn = async (): Promise<RevenueData[]> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return [
    { month: "Jan", current: 18, previous: 12 },
    { month: "Feb", current: -5, previous: -8 },
    { month: "Mar", current: 25, previous: 15 },
    { month: "Apr", current: -12, previous: -5 },
    { month: "May", current: 20, previous: 18 },
    { month: "Jun", current: 30, previous: 22 },
    { month: "Jul", current: 8, previous: 12 },
  ];
};

export function RevenueChart({
  queryKey = ["revenue-chart"],
  queryFn = defaultQueryFn,
}: RevenueChartProps) {
  const [selectedYear, setSelectedYear] = useState("2022");

  const { data } = useSuspenseQuery({
    queryKey: [...queryKey, selectedYear],
    queryFn,
    staleTime: 60 * 1000,
  });

  if (!data || data.length === 0) {
    return (
      <EmptyState
        title="No revenue data"
        description="No revenue data for this period"
        className="h-full min-h-[300px]"
      />
    );
  }

  const maxValue = Math.max(...data.flatMap((d) => [Math.abs(d.current), Math.abs(d.previous)]));
  const scale = 100 / maxValue;

  return (
    <Card sx={{ height: "100%" }}>
      <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 2,
          }}
        >
          <Typography variant="subtitle1" fontWeight={600} color="text.primary">
            Total Revenue
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {/* Legend */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    bgcolor: "primary.main",
                  }}
                />
                <Typography variant="caption" color="text.secondary" fontSize={11}>
                  2021
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    bgcolor: "secondary.main",
                  }}
                />
                <Typography variant="caption" color="text.secondary" fontSize={11}>
                  2020
                </Typography>
              </Box>
            </Box>
            {/* Year Selector */}
            <FormControl size="small">
              <Select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                sx={{
                  minWidth: 80,
                  borderRadius: 1,
                  fontSize: 12,
                  "& .MuiSelect-select": {
                    py: 0.5,
                    px: 1,
                  },
                }}
              >
                <MenuItem value="2022">2022</MenuItem>
                <MenuItem value="2021">2021</MenuItem>
                <MenuItem value="2020">2020</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>

        {/* Chart */}
        <Box sx={{ height: 180, position: "relative" }}>
          {/* Y-axis labels */}
          <Box
            sx={{
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 30,
              width: 24,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            {[30, 20, 10, 0, -10, -20].map((val) => (
              <Typography key={val} variant="caption" color="text.secondary" fontSize={9}>
                {val}
              </Typography>
            ))}
          </Box>

          {/* Chart area */}
          <Box sx={{ ml: 4, height: "100%", display: "flex", alignItems: "center" }}>
            <Box
              sx={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-around",
                gap: 0.5,
                height: "100%",
                position: "relative",
              }}
            >
              {/* Zero line */}
              <Box
                sx={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  top: "50%",
                  borderTop: "1px dashed",
                  borderColor: "divider",
                }}
              />

              {data.map((item, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    height: "100%",
                    justifyContent: "center",
                    position: "relative",
                    flex: 1,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.25,
                      height: 120,
                      position: "relative",
                    }}
                  >
                    {/* Current year bar */}
                    <Box
                      sx={{
                        width: 10,
                        borderRadius: 0.5,
                        bgcolor: "primary.main",
                        transition: "height 0.5s ease-out",
                        height: `${Math.abs(item.current) * scale * 0.8}%`,
                        alignSelf: item.current >= 0 ? "flex-end" : "flex-start",
                        transform: item.current >= 0 ? "translateY(-50%)" : "translateY(50%)",
                      }}
                    />
                    {/* Previous year bar */}
                    <Box
                      sx={{
                        width: 10,
                        borderRadius: 0.5,
                        bgcolor: "secondary.main",
                        transition: "height 0.5s ease-out",
                        height: `${Math.abs(item.previous) * scale * 0.6}%`,
                        alignSelf: item.previous >= 0 ? "flex-end" : "flex-start",
                        transform: item.previous >= 0 ? "translateY(-50%)" : "translateY(50%)",
                      }}
                    />
                  </Box>
                  {/* Month label */}
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ position: "absolute", bottom: 0, fontSize: 10 }}
                  >
                    {item.month}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
