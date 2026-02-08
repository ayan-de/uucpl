"use client";

import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import MonitorIcon from "@mui/icons-material/Monitor";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import { useTheme } from "@/components/providers";

type ThemeMode = "system" | "light" | "dark";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const modes: { mode: ThemeMode; icon: React.ReactNode; label: string }[] = [
    { mode: "system", icon: <MonitorIcon sx={{ fontSize: 16 }} />, label: "System" },
    { mode: "light", icon: <LightModeIcon sx={{ fontSize: 16 }} />, label: "Light" },
    { mode: "dark", icon: <DarkModeIcon sx={{ fontSize: 16 }} />, label: "Dark" },
  ];

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        bgcolor: "#1e293b",
        borderRadius: 2,
        p: 0.5,
        gap: 0.25,
      }}
    >
      {modes.map(({ mode, icon, label }) => {
        const isActive = theme === mode;
        return (
          <Tooltip key={mode} title={label} arrow>
            <IconButton
              onClick={() => setTheme(mode)}
              sx={{
                width: 28,
                height: 28,
                borderRadius: 1.5,
                bgcolor: isActive ? "#334155" : "transparent",
                color: isActive ? "#ffffff" : "#64748b",
                transition: "all 0.2s ease",
                "&:hover": {
                  bgcolor: isActive ? "#334155" : "#2d3a4f",
                  color: "#ffffff",
                },
              }}
            >
              {icon}
            </IconButton>
          </Tooltip>
        );
      })}
    </Box>
  );
}
