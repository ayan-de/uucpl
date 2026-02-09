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
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
// import InventoryIcon from "@mui/icons-material/Inventory";

import { useTheme as useMuiTheme, useMediaQuery } from "@mui/material";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import IconButton from "@mui/material/IconButton";

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
];

interface SidebarProps {
  open?: boolean;
  onClose?: () => void;
}

export function Sidebar({ open = false, onClose }: SidebarProps) {
  const pathname = usePathname();
  const theme = useMuiTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
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

  const drawerContent = (
    <>
      {/* Logo Section */}
      <Box
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid #1e293b",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
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
        {isMobile && (
          <IconButton onClick={onClose} sx={{ color: "#94a3b8" }}>
            <MenuOpenIcon />
          </IconButton>
        )}
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
                    onClick={() => {
                      if (hasChildren) {
                        toggleExpand(item.id);
                      } else if (isMobile && onClose) {
                        onClose();
                      }
                    }}
                    sx={{
                      borderRadius: 0,
                      py: 1,
                      px: 2,
                      minHeight: 40,
                      bgcolor: isActive ? "#1e293b" : "transparent",
                      "&::before": isActive ? {
                        content: '""',
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: 3,
                        bgcolor: '#3b82f6',
                      } : {},
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
                    {hasChildren && (
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
                    )}
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
                              onClick={() => {
                                if (isMobile && onClose) {
                                  onClose();
                                }
                              }}
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
    </>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}
    >
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={open}
        onClose={onClose}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            width: DRAWER_WIDTH,
            boxSizing: "border-box",
            bgcolor: "#0f172a",
            borderRight: "1px solid #1e293b",
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", md: "block" },
          "& .MuiDrawer-paper": {
            width: DRAWER_WIDTH,
            boxSizing: "border-box",
            bgcolor: "#0f172a",
            borderRight: "1px solid #1e293b",
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
}
