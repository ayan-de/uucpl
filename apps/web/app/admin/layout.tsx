"use client";

import { QueryProvider, MuiProvider, ThemeProvider } from "@/components/providers";
import { Sidebar, Header } from "@/components/dashboard";
import Box from "@mui/material/Box";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <QueryProvider>
        <MuiProvider>
          <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <Box
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                bgcolor: "background.default",
              }}
            >
              {/* Header */}
              <Header />

              {/* Page Content */}
              <Box
                component="main"
                sx={{
                  flex: 1,
                  overflow: "auto",
                  p: 3,
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
