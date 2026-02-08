"use client";

import { Suspense, type ReactNode, type ErrorInfo } from "react";
import Box from "@mui/material/Box";
import { ErrorBoundary } from "./ErrorBoundary";

interface DashboardWidgetProps {
  children: ReactNode;
  fallback: ReactNode;
  errorFallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  onRetry?: () => void;
  className?: string;
}

/**
 * DashboardWidget - A reusable wrapper that composes an Error Boundary with React Suspense.
 * 
 * Use this wrapper for large, data-heavy widgets (charts, tables, lists, cards).
 * DO NOT use for small UI elements like buttons or badges.
 * 
 * The Suspense boundary will show the fallback skeleton while data is loading.
 * The ErrorBoundary will catch any errors and show an error UI with retry option.
 * 
 * @example
 * <DashboardWidget fallback={<ChartSkeleton />}>
 *   <RevenueChart />
 * </DashboardWidget>
 */
export function DashboardWidget({
  children,
  fallback,
  errorFallback,
  onError,
  onRetry,
  className = "",
}: DashboardWidgetProps) {
  return (
    <Box sx={{ height: "100%" }} className={className}>
      <ErrorBoundary fallback={errorFallback} onError={onError} onRetry={onRetry}>
        <Suspense fallback={fallback}>{children}</Suspense>
      </ErrorBoundary>
    </Box>
  );
}
