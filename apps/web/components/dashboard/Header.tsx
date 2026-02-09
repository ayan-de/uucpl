"use client";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import { useTheme as useMuiTheme } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import { ThemeToggle } from "./ThemeToggle";

import MenuIcon from "@mui/icons-material/Menu";

interface HeaderProps {
  userName?: string;
  userRole?: string;
  onMenuClick?: () => void;
}

export function Header({
  userName = "Admin",
  userRole = "Owner",
  onMenuClick,
}: HeaderProps) {
  const muiTheme = useMuiTheme();
  const isDark = muiTheme.palette.mode === "dark";

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
          <Box
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
                {userRole}
              </Typography>
            </Box>
            <Avatar
              sx={{
                width: 28,
                height: 28,
                bgcolor: "primary.main",
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
        </Box>
      </Toolbar>
    </AppBar>
  );
}
