"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { EmptyState } from "../EmptyState";

interface Transaction {
  id: string;
  name: string;
  type: string;
  icon: string;
  iconBg: string;
  amount: string;
  isPositive: boolean;
}

interface TransactionsListProps {
  queryKey?: string[];
  queryFn?: () => Promise<Transaction[] | null>;
}

const defaultQueryFn = async (): Promise<Transaction[]> => {
  await new Promise((resolve) => setTimeout(resolve, 750));
  return [
    { id: "1", name: "Paypal", type: "Send money", icon: "💳", iconBg: "#dbeafe", amount: "+$82.6", isPositive: true },
    { id: "2", name: "Wallet", type: "Mac'D", icon: "👛", iconBg: "#fef3c7", amount: "+$270.69", isPositive: true },
    { id: "3", name: "Transfer", type: "Refund", icon: "🔄", iconBg: "#fee2e2", amount: "+$637.91", isPositive: true },
    { id: "4", name: "Credit Card", type: "Ordered Food", icon: "💳", iconBg: "#d1fae5", amount: "-$838.71", isPositive: false },
    { id: "5", name: "Wallet", type: "Starbucks", icon: "☕", iconBg: "#ede9fe", amount: "-$203.33", isPositive: false },
  ];
};

export function TransactionsList({
  queryKey = ["transactions-list"],
  queryFn = defaultQueryFn,
}: TransactionsListProps) {
  const { data } = useSuspenseQuery({
    queryKey,
    queryFn,
    staleTime: 30 * 1000,
  });

  if (!data || data.length === 0) {
    return (
      <EmptyState
        title="No transactions"
        description="No recent transactions found"
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
            alignItems: "center",
            justifyContent: "space-between",
            mb: 1.5,
          }}
        >
          <Typography variant="subtitle1" fontWeight={600} color="text.primary">
            Transactions
          </Typography>
          <IconButton size="small" sx={{ p: 0.5 }}>
            <MoreVertIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Box>

        {/* Transactions List */}
        <List disablePadding>
          {data.map((transaction) => (
            <ListItem
              key={transaction.id}
              disablePadding
              sx={{
                py: 0.75,
                px: 0.5,
                "&:hover": { bgcolor: "action.hover" },
                borderRadius: 1,
                cursor: "pointer",
                mb: 0.25,
              }}
            >
              <ListItemAvatar sx={{ minWidth: 36 }}>
                <Avatar
                  sx={{
                    bgcolor: transaction.iconBg,
                    width: 28,
                    height: 28,
                    fontSize: 12,
                  }}
                >
                  {transaction.icon}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={transaction.name}
                secondary={transaction.type}
                primaryTypographyProps={{ fontWeight: 500, color: "text.primary", fontSize: 12 }}
                secondaryTypographyProps={{ variant: "caption", color: "text.secondary", fontSize: 10 }}
              />
              <Typography
                variant="body2"
                fontWeight={600}
                fontSize={11}
                sx={{ color: transaction.isPositive ? "success.main" : "error.main" }}
              >
                {transaction.amount}
              </Typography>
            </ListItem>
          ))}
        </List>

        {/* View All Button */}
        <Button
          fullWidth
          variant="text"
          size="small"
          sx={{
            mt: 1.5,
            color: "primary.main",
            fontSize: 11,
            py: 0.5,
          }}
        >
          View All Transactions
        </Button>
      </CardContent>
    </Card>
  );
}
