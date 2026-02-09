"use client";

import { Component, type ReactNode, type ErrorInfo } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  onRetry?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Dashboard Widget Error:", error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
    this.props.onRetry?.();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center h-full min-h-[200px] p-8 rounded-2xl border border-red-200/50 bg-gradient-to-br from-red-50 via-white to-orange-50 shadow-lg backdrop-blur-sm">
          {/* Animated warning icon */}
          <div className="relative mb-5">
            <div className="absolute inset-0 w-16 h-16 rounded-full bg-red-400/20 animate-ping" />
            <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shadow-lg shadow-red-500/30">
              <svg
                className="w-8 h-8 text-white drop-shadow-md"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
          </div>

          {/* Error heading */}
          <h3 className="text-base font-bold text-gray-800 mb-2 tracking-tight">
            Oops! Something went wrong
          </h3>

          {/* Error message */}
          <p className="text-sm text-gray-500 mb-6 text-center max-w-xs leading-relaxed">
            {this.state.error?.message || "An unexpected error occurred"}
          </p>

          {/* Try Again button with refresh icon */}
          <button
            onClick={this.handleRetry}
            className="group relative inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-red-500 via-red-600 to-orange-500 rounded-xl shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/40 hover:scale-105 active:scale-95 transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            {/* Refresh icon */}
            <svg
              className="w-4 h-4 transition-transform duration-500 group-hover:rotate-180"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Try Again

            {/* Shine effect on hover */}
            <span className="absolute inset-0 rounded-xl overflow-hidden">
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            </span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
