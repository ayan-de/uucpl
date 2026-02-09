"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Chip from "@mui/material/Chip";
import Skeleton from "@mui/material/Skeleton";
import { useTheme as useMuiTheme } from "@mui/material/styles";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import SettingsIcon from "@mui/icons-material/Settings";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import { ThemeToggle } from "./ThemeToggle";

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const muiTheme = useMuiTheme();
  const isDark = muiTheme.palette.mode === "dark";
  const { data: session, status } = useSession();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleClose();
    await signOut({ callbackUrl: "/login" });
  };

  // Get user info from session
  const userName = session?.user?.name || "User";
  const userEmail = session?.user?.email || "";
  const userRole = session?.user?.role || "CLIENT";
  const isAdmin = userRole === "ADMIN";

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        bgcolor: "background.paper",
        borderBottom: 1,
        borderColor: "divider",
      }}
    >
      <Toolbar sx={{ px: 2, minHeight: 48, height: 48 }}>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={onMenuClick}
          sx={{ mr: 2, display: { md: "none" }, color: "text.primary" }}
        >
          <MenuIcon sx={{ fontSize: 20 }} />
        </IconButton>

        <Box sx={{ flex: 1 }} />

        {/* Right Section */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Notifications */}
          <IconButton
            size="small"
            sx={{
              bgcolor: isDark ? "background.default" : "#f8fafc",
              border: 1,
              borderColor: "divider",
              borderRadius: 1,
              width: 28,
              height: 28,
              "&:hover": {
                bgcolor: isDark ? "action.hover" : "#f1f5f9",
              },
            }}
          >
            <Badge
              variant="dot"
              color="error"
              overlap="circular"
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
            >
              <NotificationsNoneIcon sx={{ color: "text.secondary", fontSize: 16 }} />
            </Badge>
          </IconButton>

          <Divider orientation="vertical" flexItem sx={{ mx: 0.5, height: 20, alignSelf: "center" }} />

          {/* User Profile */}
          {status === "loading" ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Skeleton variant="text" width={60} height={20} />
              <Skeleton variant="circular" width={28} height={28} />
            </Box>
          ) : (
            <Box
              onClick={handleClick}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                cursor: "pointer",
                py: 0.25,
                px: 0.5,
                borderRadius: 1,
                transition: "background-color 0.2s",
                "&:hover": {
                  bgcolor: "action.hover",
                },
              }}
            >
              <Box sx={{ textAlign: "right" }}>
                <Typography
                  sx={{
                    fontWeight: 600,
                    color: "text.primary",
                    fontSize: 11,
                    lineHeight: 1.2,
                  }}
                >
                  {userName}
                </Typography>
                <Typography
                  sx={{
                    color: "text.secondary",
                    fontSize: 9,
                  }}
                >
                  {isAdmin ? "Administrator" : "Client"}
                </Typography>
              </Box>
              <Avatar
                sx={{
                  width: 28,
                  height: 28,
                  bgcolor: isAdmin ? "error.main" : "primary.main",
                  fontWeight: 600,
                  fontSize: 10,
                }}
              >
                {userName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2)}
              </Avatar>
            </Box>
          )}
        </Box>
      </Toolbar>

      {/* User Menu */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 3,
          sx: {
            minWidth: 220,
            mt: 1,
            borderRadius: 2,
            "& .MuiMenuItem-root": {
              px: 2,
              py: 1,
              borderRadius: 1,
              mx: 1,
              my: 0.5,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {/* User Info Header */}
        <Box sx={{ px: 2, py: 1.5, borderBottom: 1, borderColor: "divider" }}>
          <Typography variant="subtitle2" fontWeight={600}>
            {userName}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {userEmail}
          </Typography>
          <Box sx={{ mt: 1 }}>
            <Chip
              icon={isAdmin ? <AdminPanelSettingsIcon sx={{ fontSize: 14 }} /> : undefined}
              label={isAdmin ? "Admin" : "Client"}
              size="small"
              color={isAdmin ? "error" : "primary"}
              sx={{ height: 20, fontSize: 10 }}
            />
          </Box>
        </Box>

        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>My Profile</ListItemText>
        </MenuItem>

        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Settings</ListItemText>
        </MenuItem>

        <Divider sx={{ my: 1 }} />

        <MenuItem onClick={handleLogout} sx={{ color: "error.main" }}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" sx={{ color: "error.main" }} />
          </ListItemIcon>
          <ListItemText>Sign Out</ListItemText>
        </MenuItem>
      </Menu>
    </AppBar>
  );
}
