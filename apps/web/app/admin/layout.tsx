"use client";

import { QueryProvider, MuiProvider, ThemeProvider } from "@/components/providers";
import { Sidebar, Header } from "@/components/dashboard";
import Box from "@mui/material/Box";
import { useState } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleDrawerClose = () => {
    setMobileOpen(false);
  };

  return (
    <ThemeProvider>
      <QueryProvider>
        <MuiProvider>
          <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
            {/* Sidebar */}
            <Sidebar open={mobileOpen} onClose={handleDrawerClose} />

            {/* Main Content */}
            <Box
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                bgcolor: "background.default",
                width: { md: `calc(100% - 240px)` },
              }}
            >
              {/* Header */}
              <Header onMenuClick={handleDrawerToggle} />

              {/* Page Content */}
              <Box
                component="main"
                sx={{
                  flex: 1,
                  overflow: "auto",
                  p: { xs: 2, sm: 3 },
                }}
              >
                {children}
              </Box>
            </Box>
          </Box>
        </MuiProvider>
      </QueryProvider>
    </ThemeProvider>
  );
}
