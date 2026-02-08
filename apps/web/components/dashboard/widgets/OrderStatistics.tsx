"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import CircularProgress from "@mui/material/CircularProgress";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { EmptyState } from "../EmptyState";

interface OrderStat {
  id: string;
  category: string;
  icon: string;
  iconBg: string;
  value: number;
  change: number;
}

interface OrderStatisticsProps {
  queryKey?: string[];
  queryFn?: () => Promise<{ total: number; percentage: number; items: OrderStat[] } | null>;
}

const defaultQueryFn = async () => {
  await new Promise((resolve) => setTimeout(resolve, 900));
  return {
    total: 8258,
    percentage: 38,
    items: [
      { id: "1", category: "Electronic", icon: "💻", iconBg: "#ede9fe", value: 82.5, change: 24 },
      { id: "2", category: "Sports", icon: "⚽", iconBg: "#d1fae5", value: 23.8, change: -12 },
      { id: "3", category: "Decor", icon: "🏠", iconBg: "#cffafe", value: 849, change: 15 },
      { id: "4", category: "Fashion", icon: "👗", iconBg: "#fce7f3", value: 99, change: 45 },
    ],
  };
};

export function OrderStatistics({
  queryKey = ["order-statistics"],
  queryFn = defaultQueryFn,
}: OrderStatisticsProps) {
  const { data } = useSuspenseQuery({
    queryKey,
    queryFn,
    staleTime: 30 * 1000,
  });

  if (!data || data.items.length === 0) {
    return (
      <EmptyState
        title="No order statistics"
        description="Order data unavailable for this period"
        className="h-full"
      />
    );
  }

  return (
    <Card sx={{ height: "100%" }}>
      <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            mb: 1.5,
          }}
        >
          <Box>
            <Typography variant="subtitle1" fontWeight={600} color="text.primary">
              Order Statistics
            </Typography>
            <Typography variant="caption" color="text.secondary" fontSize={11}>
              {data.total.toLocaleString()} Total Sales
            </Typography>
          </Box>
          <IconButton size="small" sx={{ p: 0.5 }}>
            <MoreVertIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Box>

        {/* Total with circular chart */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
          <Box sx={{ position: "relative", display: "inline-flex" }}>
            <CircularProgress
              variant="determinate"
              value={100}
              size={56}
              thickness={5}
              sx={{ color: "divider" }}
            />
            <CircularProgress
              variant="determinate"
              value={data.percentage}
              size={56}
              thickness={5}
              sx={{
                position: "absolute",
                left: 0,
                color: "primary.main",
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
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography variant="caption" fontWeight={700} color="text.primary" fontSize={11}>
                {data.percentage}%
              </Typography>
            </Box>
          </Box>
          <Typography variant="h5" fontWeight={700} color="text.primary">
            {data.total.toLocaleString()}
          </Typography>
        </Box>

        {/* Categories List */}
        <List disablePadding>
          {data.items.map((item) => (
            <ListItem
              key={item.id}
              disablePadding
              sx={{
                py: 1,
                "&:hover": { bgcolor: "action.hover" },
                borderRadius: 1,
                cursor: "pointer",
              }}
            >
              <ListItemAvatar sx={{ minWidth: 40 }}>
                <Avatar
                  sx={{
                    bgcolor: item.iconBg,
                    width: 32,
                    height: 32,
                    fontSize: 14,
                  }}
                >
                  {item.icon}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={item.category}
                primaryTypographyProps={{ fontWeight: 500, color: "text.primary", fontSize: 13 }}
              />
              <Box sx={{ textAlign: "right" }}>
                <Typography variant="body2" fontWeight={600} color="text.primary" fontSize={12}>
                  {item.value < 100 ? `${item.value}k` : item.value.toLocaleString()}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: item.change >= 0 ? "success.main" : "error.main", fontSize: 10 }}
                >
                  {item.change >= 0 ? "+" : ""}
                  {item.change}%
                </Typography>
              </Box>
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}
