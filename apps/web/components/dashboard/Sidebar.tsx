"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import Collapse from "@mui/material/Collapse";
import Avatar from "@mui/material/Avatar";
import HomeIcon from "@mui/icons-material/Home";
// import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
// import LocalShippingIcon from "@mui/icons-material/LocalShipping";
// import AssessmentIcon from "@mui/icons-material/Assessment";
// import ReceiptIcon from "@mui/icons-material/Receipt";
// import PaymentsIcon from "@mui/icons-material/Payments";
// import SmartToyIcon from "@mui/icons-material/SmartToy";
// import SettingsIcon from "@mui/icons-material/Settings";
// import TuneIcon from "@mui/icons-material/Tune";
// import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
// import InventoryIcon from "@mui/icons-material/Inventory";

const DRAWER_WIDTH = 240;

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href?: string;
  children?: { id: string; label: string; href: string }[];
}

const navigationData: NavItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: <HomeIcon sx={{ fontSize: 18 }} />,
    href: "/admin",
  },
  // {
  //   id: "sales",
  //   label: "Sales",
  //   icon: <ShoppingCartIcon sx={{ fontSize: 18 }} />,
  //   children: [
  //     { id: "sales-orders", label: "Orders", href: "/admin/sales/orders" },
  //     { id: "sales-invoices", label: "Invoices", href: "/admin/sales/invoices" },
  //     { id: "sales-customers", label: "Customers", href: "/admin/sales/customers" },
  //   ],
  // },
  // {
  //   id: "purchase",
  //   label: "Purchase",
  //   icon: <LocalShippingIcon sx={{ fontSize: 18 }} />,
  //   children: [
  //     { id: "purchase-orders", label: "Orders", href: "/admin/purchase/orders" },
  //     { id: "purchase-vendors", label: "Vendors", href: "/admin/purchase/vendors" },
  //   ],
  // },
  // {
  //   id: "inventory",
  //   label: "Inventory",
  //   icon: <InventoryIcon sx={{ fontSize: 18 }} />,
  //   children: [
  //     { id: "inventory-items", label: "Items", href: "/admin/inventory/items" },
  //     { id: "inventory-stock", label: "Stock", href: "/admin/inventory/stock" },
  //   ],
  // },
  // {
  //   id: "reports",
  //   label: "Reports",
  //   icon: <AssessmentIcon sx={{ fontSize: 18 }} />,
  //   href: "/admin/reports",
  // },
  // {
  //   id: "gst-module",
  //   label: "GST Module",
  //   icon: <ReceiptIcon sx={{ fontSize: 18 }} />,
  //   href: "/admin/gst",
  // },
  // {
  //   id: "payments",
  //   label: "Payments",
  //   icon: <PaymentsIcon sx={{ fontSize: 18 }} />,
  //   href: "/admin/payments",
  // },
  // {
  //   id: "chatbot",
  //   label: "Chatbot",
  //   icon: <SmartToyIcon sx={{ fontSize: 18 }} />,
  //   href: "/admin/chatbot",
  // },
  // {
  //   id: "configuration",
  //   label: "Configuration",
  //   icon: <TuneIcon sx={{ fontSize: 18 }} />,
  //   children: [
  //     { id: "config-general", label: "General", href: "/admin/config/general" },
  //     { id: "config-tax", label: "Tax Settings", href: "/admin/config/tax" },
  //     { id: "config-email", label: "Email", href: "/admin/config/email" },
  //   ],
  // },
  // {
  //   id: "settings",
  //   label: "Settings",
  //   icon: <SettingsIcon sx={{ fontSize: 18 }} />,
  //   href: "/admin/settings",
  // },
];

export function Sidebar() {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpandedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const isItemActive = (item: NavItem): boolean => {
    if (item.href) {
      return pathname === item.href;
    }
    if (item.children) {
      return item.children.some((child) => pathname === child.href);
    }
    return false;
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: DRAWER_WIDTH,
          boxSizing: "border-box",
          bgcolor: "#0f172a",
          borderRight: "1px solid #1e293b",
          borderRadius: 0,
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      {/* Logo Section */}
      <Box
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          borderBottom: "1px solid #1e293b",
        }}
      >
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: 1,
            bgcolor: "#3b82f6",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <AccountBalanceIcon sx={{ color: "white", fontSize: 18 }} />
        </Box>
        <Typography
          sx={{
            fontWeight: 700,
            color: "white",
            fontSize: 14,
            letterSpacing: "0.5px",
          }}
        >
          UUCPL
        </Typography>
      </Box>

      {/* Navigation List */}
      <Box sx={{ flex: 1, overflowY: "auto", py: 1 }}>
        <List disablePadding>
          {navigationData.map((item) => {
            const isActive = isItemActive(item);
            const isExpanded = expandedItems[item.id];
            const hasChildren = item.children && item.children.length > 0;

            return (
              <Box key={item.id}>
                <ListItem disablePadding>
                  <ListItemButton
                    component={hasChildren ? "div" : Link}
                    href={hasChildren ? undefined : item.href}
                    onClick={hasChildren ? () => toggleExpand(item.id) : undefined}
                    sx={{
                      borderRadius: 0,
                      py: 1,
                      px: 2,
                      minHeight: 40,
                      bgcolor: isActive ? "#1e293b" : "transparent",
                      "&:hover": {
                        bgcolor: isActive ? "#1e293b" : "rgba(255,255,255,0.05)",
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 32,
                        color: isActive ? "#ffffff" : "#94a3b8",
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.label}
                      primaryTypographyProps={{
                        fontSize: 13,
                        fontWeight: isActive ? 600 : 400,
                        color: isActive ? "#ffffff" : "#94a3b8",
                      }}
                    />
                    {/* {hasChildren && (
                      <Box
                        sx={{
                          color: "#64748b",
                          display: "flex",
                          alignItems: "center",
                          transition: "transform 0.2s",
                          transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)",
                        }}
                      >
                        <ChevronRightIcon sx={{ fontSize: 16 }} />
                      </Box>
                    )} */}
                  </ListItemButton>
                </ListItem>

                {/* Submenu */}
                {hasChildren && (
                  <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                    <List disablePadding>
                      {item.children?.map((child) => {
                        const isChildActive = pathname === child.href;
                        return (
                          <ListItem key={child.id} disablePadding>
                            <ListItemButton
                              component={Link}
                              href={child.href}
                              sx={{
                                borderRadius: 0,
                                py: 0.75,
                                pl: 5.5,
                                pr: 2,
                                minHeight: 34,
                                borderLeft: "2px solid",
                                borderColor: isChildActive ? "#3b82f6" : "transparent",
                                bgcolor: isChildActive
                                  ? "rgba(59, 130, 246, 0.08)"
                                  : "transparent",
                                "&:hover": {
                                  bgcolor: isChildActive
                                    ? "rgba(59, 130, 246, 0.08)"
                                    : "rgba(255,255,255,0.03)",
                                },
                              }}
                            >
                              <ListItemText
                                primary={child.label}
                                primaryTypographyProps={{
                                  fontSize: 12,
                                  fontWeight: isChildActive ? 500 : 400,
                                  color: isChildActive ? "#ffffff" : "#64748b",
                                }}
                              />
                            </ListItemButton>
                          </ListItem>
                        );
                      })}
                    </List>
                  </Collapse>
                )}
              </Box>
            );
          })}
        </List>
      </Box>

      {/* Bottom Section - Account Plan */}
      <Box
        sx={{
          p: 1.5,
          borderTop: "1px solid #1e293b",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            p: 1.5,
            bgcolor: "#1e293b",
            borderRadius: 0,
          }}
        >
          <Avatar
            sx={{
              width: 32,
              height: 32,
              bgcolor: "#3b82f6",
              fontSize: 11,
              fontWeight: 600,
            }}
          >
            SP
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography
              sx={{
                color: "#ffffff",
                fontWeight: 600,
                fontSize: 12,
                lineHeight: 1.3,
              }}
            >
              Standard Plan
            </Typography>
            <Typography
              sx={{
                color: "#64748b",
                fontSize: 10,
              }}
            >
              Active Account
            </Typography>
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
}
